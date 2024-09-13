from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
import os
from prisma import Prisma
import jwt as pyjwt
import datetime
import requests
from functools import wraps

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize Prisma client
prisma = Prisma()
prisma.connect()

# Weather API key
WEATHER_API_KEY = os.getenv('WEATHER_API_KEY')

# Configure JWT
SECRET_KEY = os.getenv('SECRET_KEY')
if not SECRET_KEY:
    raise ValueError("No SECRET_KEY set for JWT")

NEWS_API_KEY = os.getenv('NEWS_API_KEY')
if not NEWS_API_KEY:
    raise ValueError("No NEWS_API_KEY set")

# Helper functions


def fetch_news(url, params):
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        articles = data.get('articles', [])
        print(f"Fetched {len(articles)} articles")
        return articles
    except requests.exceptions.RequestException as e:
        app.logger.error(f"Failed to fetch news data: {str(e)}")
        app.logger.error(f"URL: {url}")
        app.logger.error(f"Params: {params}")
        return None

# Routes


@app.route('/')
def index():
    url = 'https://newsapi.org/v2/top-headlines'
    params = {
        'country': 'us',
        'category': 'business',
        'apiKey': NEWS_API_KEY
    }
    articles = fetch_news(url, params)
    if articles is None:
        return jsonify({'error': 'Failed to fetch news data'}), 500
    return jsonify({'articles': articles[:5]})


@app.route('/news', methods=['GET'])
def get_news():
    endpoint = request.args.get('endpoint', 'top-headlines')
    url = f'https://newsapi.org/v2/{endpoint}'

    params = {'apiKey': NEWS_API_KEY}

    if endpoint == 'everything':
        for key in ['q', 'sources', 'domains']:
            if value := request.args.get(key):
                params[key] = value
        if not any(key in params for key in ['q', 'sources', 'domains']):
            return jsonify({'error': 'Search too broad. Please add a query (q), source, or domain.'}), 400
    else:
        params['category'] = request.args.get('category', 'business')
        for key in ['q', 'sources', 'domains']:
            if value := request.args.get(key):
                params[key] = value

    articles = fetch_news(url, params)
    if articles is None:
        return jsonify({'error': 'Failed to fetch news data'}), 500

    return jsonify({'articles': articles})


@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    existing_user = prisma.user.find_unique(where={'username': username})
    if existing_user:
        return jsonify({'error': 'User already exists'}), 400

    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

    try:
        new_user = prisma.user.create(data={
            'username': username,
            'hashedPassword': hashed_password
        })
        return jsonify({'message': 'User created successfully', 'user_id': new_user.id}), 201
    except Exception as e:
        print(f"Error creating user: {str(e)}")
        return jsonify({'error': 'Failed to create user'}), 500


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    user = prisma.user.find_unique(where={'username': username})
    if user and check_password_hash(user.hashedPassword, password):
        token = pyjwt.encode({  # Use pyjwt instead of jwt
            'username': username,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, SECRET_KEY, algorithm='HS256')
        return jsonify({'access_token': token}), 200
    return jsonify({'error': 'Invalid credentials'}), 401


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        try:
            token = token.split()[1]  # Remove 'Bearer ' prefix
            data = pyjwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        except:
            return jsonify({'error': 'Token is invalid'}), 401
        return f(*args, **kwargs)
    return decorated


WEATHERSTACK_API_KEY = os.getenv('WEATHERSTACK_API_KEY')


@app.route('/weather')
def get_weather():
    lat = request.args.get('lat')
    lon = request.args.get('lon')

    url = f"http://api.weatherstack.com/current"
    params = {
        'access_key': WEATHERSTACK_API_KEY,
        'query': f"{lat},{lon}",
        'units': 'm'
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()

        weather = {
            "city": data['location']['name'],
            "temperature": data['current']['temperature'],
            "description": data['current']['weather_descriptions'][0],
            "forecast": {
                # Weatherstack free plan doesn't provide forecast
                "morning": data['current']['temperature'],
                "afternoon": data['current']['temperature'],
                "evening": data['current']['temperature']
            }
        }
        return jsonify(weather)
    except Exception as e:
        print(f"Error fetching weather data: {str(e)}")
        return jsonify({'error': 'Failed to fetch weather data'}), 500


@app.route('/localnews')
@token_required
def get_local_news():
    city = request.args.get('city')
    if not city:
        return jsonify({'error': 'City parameter is required'}), 400

    # Use NewsAPI to get local news
    url = 'https://newsapi.org/v2/everything'
    params = {
        'apiKey': NEWS_API_KEY,
        'q': f"{city} AND (local OR news)",
        'sortBy': 'publishedAt',
        'language': 'en',
        'pageSize': 10  # Limit to 10 articles
    }

    articles = fetch_news(url, params)
    if articles is None:
        return jsonify({'error': 'Failed to fetch news data'}), 500

    print(f"Fetched {len(articles)} articles for {city}")

    return jsonify({'articles': articles})


if __name__ == '__main__':
    app.run(debug=True)

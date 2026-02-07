from flask import Flask
from flask_cors import CORS
from app.database import db, init_db
from app.routes import api
import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

def create_app():
    """Create and configure the Flask application"""
    app = Flask(__name__)
    
    # Get DATABASE_URL from environment
    database_url = os.getenv('DATABASE_URL')
    
    # PostgreSQL 14+ requires 'postgresql://' not 'postgres://'
    # Fix the URL if needed
    if database_url and database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
    
    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url or 'postgresql://postgres:password@localhost:5433/cove_crm'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    
    # Debug output (remove later)
    print(f"Using database: {app.config['SQLALCHEMY_DATABASE_URI']}")
    
    # Enable CORS for frontend
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})
    
    # Initialize database
    init_db(app)
    
    # Register blueprints
    app.register_blueprint(api)
    
    return app
from app import create_app
import os

# Debug output
print("=" * 50)
print("Environment Variables:")
print("DATABASE_URL:", os.getenv('DATABASE_URL'))
print("SECRET_KEY:", os.getenv('SECRET_KEY'))
print("=" * 50)

app = create_app()

# Debug Flask's actual config
print("=" * 50)
print("Flask Config:")
print("SQLALCHEMY_DATABASE_URI:", app.config.get('SQLALCHEMY_DATABASE_URI'))
print("=" * 50)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
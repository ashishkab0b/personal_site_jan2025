import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class BaseConfig:
    
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-insecure-admin-session-key')
    PERMANENT_SESSION_LIFETIME = timedelta(hours=12)
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Strict'

    ADMIN_PASSWORD_HASH = os.getenv('ADMIN_PASSWORD_HASH')
    ANALYTICS_DB_PATH = os.getenv('ANALYTICS_DB_PATH', 'data/analytics.sqlite3')
    MAXMIND_DB_DIR = os.getenv('MAXMIND_DB_DIR', 'data/geoip')
    NGINX_ACCESS_LOG_PATH = os.getenv('NGINX_ACCESS_LOG_PATH', 'nginx/logs/access.log')
    

    MAIL_SERVER = 'live.smtp.mailtrap.io'
    MAIL_PORT = 587
    MAIL_USERNAME = os.environ['MAIL_USERNAME']
    MAIL_PASSWORD = os.environ['MAIL_PASSWORD']
    MAILTRAP_API_TOKEN = os.environ['MAILTRAP_API_TOKEN']
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    MAIL_SUPPORT_RECIPIENT = os.environ['MAIL_SUPPORT_RECIPIENT']
    
    RECAPTCHA_SECRET_KEY = os.environ['RECAPTCHA_SECRET_KEY']

class DevelopmentConfig(BaseConfig):
    
    DEBUG = True

class ProductionConfig(BaseConfig):
    
    DEBUG = False
    
    PREFERRED_URL_SCHEME = "https"
    SESSION_COOKIE_SECURE = True
    REMEMBER_COOKIE_SECURE = True
    ANALYTICS_DB_PATH = os.getenv('ANALYTICS_DB_PATH', '/app/data/analytics.sqlite3')
    MAXMIND_DB_DIR = os.getenv('MAXMIND_DB_DIR', '/app/data/geoip')
    NGINX_ACCESS_LOG_PATH = os.getenv('NGINX_ACCESS_LOG_PATH', '/app/nginx_logs/access.log')
    
    REDIS_HOST = "redis"
    REDIS_PASSWORD = os.getenv("REDIS_PASSWORD", None)
    REDIS_URL = f"redis://:{REDIS_PASSWORD}@{REDIS_HOST}:6379/0"
    
    

config_map = {
    "development": DevelopmentConfig,
    "production": ProductionConfig
}

current_env = os.getenv("FLASK_ENV", "development")
CurrentConfig = config_map.get(current_env, DevelopmentConfig)
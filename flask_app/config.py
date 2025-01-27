import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class BaseConfig:
    

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
    
    REDIS_HOST = "redis"
    REDIS_PASSWORD = os.getenv("REDIS_PASSWORD", None)
    REDIS_URL = f"redis://:{REDIS_PASSWORD}@{REDIS_HOST}:6379/0"
    
    

config_map = {
    "development": DevelopmentConfig,
    "production": ProductionConfig
}

current_env = os.getenv("FLASK_ENV", "development")
CurrentConfig = config_map.get(current_env, DevelopmentConfig)
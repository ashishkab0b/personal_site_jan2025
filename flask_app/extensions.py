# extensions.py

from flask_cors import CORS
from flask_mail import Mail


# Create the global Flask extensions
cors = CORS()
mail = Mail()

def init_extensions(app):

    mail.init_app(app)
    cors.init_app(app, resources={
        r"/*": {
            "origins": [
                "http://localhost:3000", 
                "http://flask-backend:8000",
                "http://mehta.fyi",
                "http://ashish.mehta.fyi",
                "https://js.stripe.com", 
                "https://m.stripe.network",
                "https://www.google.com",
                "https://www.gstatic.com"
            ],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Authorization", "Content-Type"],
            "expose_headers": ["Content-Type"],
            "supports_credentials": True
        }
    })

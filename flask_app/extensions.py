# extensions.py

from flask_cors import CORS
from flask_mail import Mail


# Create the global Flask extensions
cors = CORS()
mail = Mail()

def init_extensions(app):

    mail.init_app(app)
    cors.init_app(app, resources={
        r"/api/*": {
            "origins": [
                "https://js.stripe.com", 
                "https://m.stripe.network"
                "http://mehta.fyi",
                "http://ashish.mehta.fyi",
                "http://localhost:3000", 
                "https://www.google.com",  # For Google reCAPTCHA
                "https://www.gstatic.com"  # For reCAPTCHA assets
            ],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Authorization", "Content-Type"],
            "supports_credentials": True,  
        }
    })


from dotenv import load_dotenv
from flask import Flask, request, jsonify
from werkzeug.exceptions import HTTPException
from logger_setup import setup_logger
from werkzeug.middleware.proxy_fix import ProxyFix

# Import extensions
from extensions import cors, init_extensions
from config import CurrentConfig

def create_app(config):
    # Load environment variables
    load_dotenv()

    # Create and configure the Flask app
    app = Flask(__name__)
    app.config.from_object(config)
    app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

    # Initialize logger
    logger = setup_logger()
    app.logger = logger

    # Initialize Flask extensions
    init_extensions(app)
    

    # Register Blueprints
    from blueprints.api import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')
    from blueprints.contact import contact_bp
    app.register_blueprint(contact_bp, url_prefix='/api')

    # app.register_blueprint(admin_bp, url_prefix='/admin')
    # Health Check
    @app.route('/health', methods=['GET'])
    def health():
        return {'status': 'healthy'}, 200
    
    # Log all requests
    # @app.before_request
    # def log_request():
    #     logger.info(f"{request.method} {request.url}")
        

    # Error Handlers    
    # @jwt.unauthorized_loader
    # def custom_unauthorized_response(callback):
    #     return jsonify({
    #         'error': 'Unauthorized access'
    #     }), 401

    # @jwt.expired_token_loader
    # def custom_expired_token_response(jwt_header, jwt_payload):
    #     return jsonify({
    #         'error': 'Token expired'
    #     }), 401
        
    @app.errorhandler(404)
    def not_found_error(e):
        logger.warning(f"404 Not Found: {request.method} {request.url}")
        return {'error': 'Resource not found'}, 404

    @app.errorhandler(HTTPException)
    def handle_http_exception(e):
        logger.error(f"HTTPException: {e.description} ({e.code}) at {request.method} {request.url}")
        return {'error': e.description}, e.code

    @app.errorhandler(Exception)
    def handle_exception(e):
        logger.exception(f"Unhandled Exception at {request.method} {request.url}")
        return {'error': 'Internal server error'}, 500

    return app
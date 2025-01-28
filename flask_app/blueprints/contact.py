from flask import Blueprint, request, g, Response, jsonify, current_app
from datetime import timedelta, datetime, timezone
from zoneinfo import ZoneInfo
import mailtrap as mt

from functools import wraps

contact_bp = Blueprint('contact', __name__)

@contact_bp.route('/send_email', methods=['POST'])
def send_email():
    
    # Get data from request
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    message = data.get('message')
    
    current_app.logger.debug(f"Entered send_email route with data: {data}.")
    
    # Validate data
    if not name or not email or not message:
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Construct email 
    subject = f"Message from {name} on mehta.fyi"
    body = f"Name: {name}\n\nEmail:\n{email}\n\nMessage:\n{message}"
    
    # Send email
    try:
        mail = mt.Mail(
            sender=mt.Address(email="email@emapingbot.com", 
                            name="Mehta.fyi"),
            to=mt.Address(email=current_app.config['MAIL_SUPPORT_RECIPIENT'], 
                        name="Ashish Mehta"),
            subject=subject,
            text=body
        )
        client = mt.MailtrapClient(token=current_app.config['MAILTRAP_API_TOKEN'])
        response = client.send(mail)
        current_app.logger.debug(f"Mailtrap response: {response}")
    except Exception as e:
        current_app.logger.error(f"Error sending email")
        current_app.logger.exception(e)
        return jsonify({'error': 'Error sending email'}), 500
    
    
    return jsonify({'message': 'Email sent'}), 200


    
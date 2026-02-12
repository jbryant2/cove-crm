from flask import Blueprint, request, jsonify
from app.database import db
from app.models import Contact, Business, Transaction
from sqlalchemy.exc import IntegrityError

# Create blueprint for API routes
api = Blueprint('api', __name__, url_prefix='/api')

# =============================================================================
# CONTACT ROUTES
# =============================================================================

@api.route('/contacts', methods=['GET'])
def get_contacts():
    """Get all contacts"""
    contacts = Contact.query.all()
    return jsonify([contact.to_dict() for contact in contacts]), 200

@api.route('/contacts/<int:id>', methods=['GET'])
def get_contact(id):
    """Get a single contact by ID"""
    contact = Contact.query.get_or_404(id)
    return jsonify(contact.to_dict()), 200

@api.route('/contacts', methods=['POST'])
def create_contact():
    """Create a new contact"""
    data = request.json
    
    try:
        contact = Contact(
            first_name=data.get('firstName'),
            last_name=data.get('lastName'),
            email=data.get('email'),
            phone=data.get('phone'),
            company=data.get('company'),
            status=data.get('status', 'lead')
        )
        
        db.session.add(contact)
        db.session.commit()
        
        return jsonify(contact.to_dict()), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'Email already exists'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@api.route('/contacts/<int:id>', methods=['PUT'])
def update_contact(id):
    """Update an existing contact"""
    contact = Contact.query.get_or_404(id)
    data = request.json
    
    try:
        contact.first_name = data.get('firstName', contact.first_name)
        contact.last_name = data.get('lastName', contact.last_name)
        contact.email = data.get('email', contact.email)
        contact.phone = data.get('phone', contact.phone)
        contact.company = data.get('company', contact.company)
        contact.status = data.get('status', contact.status)
        
        db.session.commit()
        
        return jsonify(contact.to_dict()), 200
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'Email already exists'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@api.route('/contacts/<int:id>', methods=['DELETE'])
def delete_contact(id):
    """Delete a contact"""
    contact = Contact.query.get_or_404(id)
    
    try:
        db.session.delete(contact)
        db.session.commit()
        
        return jsonify({'message': 'Contact deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

# =============================================================================
# BUSINESS ROUTES
# =============================================================================

@api.route('/businesses', methods=['GET'])
def get_businesses():
    """Get all businesses"""
    businesses = Business.query.all()
    return jsonify([business.to_dict() for business in businesses]), 200

@api.route('/businesses/<int:id>', methods=['GET'])
def get_business(id):
    """Get a single business by ID"""
    business = Business.query.get_or_404(id)
    return jsonify(business.to_dict()), 200

@api.route('/businesses', methods=['POST'])
def create_business():
    """Create a new business"""
    data = request.json
    try:
        business = Business(
            name=data.get('name'),
            industry=data.get('industry'),
            website=data.get('website'),
            phone=data.get('phone'),
            email=data.get('email'),
            address=data.get('address'),
            status=data.get('status', 'active')
        )
        db.session.add(business)
        db.session.commit()
        return jsonify(business.to_dict()), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'Business already exists'}), 400
    except Exception as e: 
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@api.route('/businesses/<int:id>', methods=['PUT'])
def update_business(id):
    """Update an existing business"""
    business = Business.query.get_or_404(id)
    data = request.json

    try:
        business.name = data.get('name', business.name)
        business.industry = data.get('industry',business.industry)
        business.website = data.get('website',business.website)
        business.phone = data.get('phone',business.phone)
        business.email = data.get('email',business.email)
        business.address = data.get('address',business.address)
        business.status = data.get('status',business.status)

        db.session.commit()

        return jsonify(business.to_dict()), 200
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'Business already exists'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    
api.route('/businesses/<int:id>',methods=["DELETE"])
def delete_contact(id):
    """Delete a business"""
    business = Business.query.get_or_404(id)
    
    try:
        db.session.delete(business)
        db.session.commit()
        
        return jsonify({'message': 'Business deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

# =============================================================================
# TRANSACTION ROUTES
# =============================================================================

@api.route('/transactions', methods=['GET'])
def get_transactions():
    transactions = Transaction.query.all()
    return jsonify([t.to_dict() for t in transactions]), 200

@api.route('/transaction/<int:id>', methods=['GET'])
def get_transaction(id):
    """Get a single transaction by ID"""
    transaction = Transaction.query.get_or_404(id)
    return jsonify(transaction.to_dict()), 200

@api.route('/transactions', methods=['POST'])
def create_transaction():
    data = request.json
    from datetime import datetime
    
    transaction = Transaction(
        amount=data.get('amount'),
        date=datetime.fromisoformat(data.get('date')),
        status=data.get('status', 'pending'),
        description=data.get('description'),
        contact_id=data.get('contactId'),
        business_id=data.get('businessId')
    )
    db.session.add(transaction)
    db.session.commit()
    return jsonify(transaction.to_dict()), 201

@api.route('/transactions/<int:id>', methods=['PUT'])
def update_transaction(id):
    """Update an existing transaction"""
    from datetime import datetime
    transaction = transaction.query.get_or_404(id)
    data = request.json

    try:
        transaction.amount = data.get('amount', transaction.amount)
        transaction.date = datetime.fromisoformat(data.get('date',transaction.date))
        transaction.status = data.get('status',transaction.status)
        transaction.description = data.get('description',transaction.description)
        transaction.contact_id = data.get('contactId',transaction.contact_id)
        transaction.business_id = data.get('businessId',transaction.business_id)
        db.session.commit()

        return jsonify(transaction.to_dict()), 200
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'transaction already exists'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    
api.route('/transactions/<int:id>',methods=["DELETE"])
def delete_contact(id):
    """Delete a transaction"""
    transaction = transaction.query.get_or_404(id)
    
    try:
        db.session.delete(transaction)
        db.session.commit()
        
        return jsonify({'message': 'transaction deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
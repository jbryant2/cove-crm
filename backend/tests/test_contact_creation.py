def test_contact_creation():
    """Test creating a Contact with all fields"""
    from app.models import Contact
    
    # Create a contact
    contact = Contact(
        first_name='John',
        last_name='Doe',
        email='john@example.com',
        phone='555-1234',
        company='Acme Corp',
        status='active'
    )
    
    # Verify all fields are stored correctly
    assert contact.first_name == 'John'
    assert contact.last_name == 'Doe'
    assert contact.email == 'john@example.com'
    assert contact.phone == '555-1234'
    assert contact.company == 'Acme Corp'
    assert contact.status == 'active'
    print("✅ Contact created successfully!")


def test_contact_to_dict():
    """Test that to_dict() converts camelCase correctly"""
    from app.models import Contact
    
    contact = Contact(
        first_name='Jane',
        last_name='Smith',
        email='jane@example.com',
        phone='555-5678',
        company='Tech Inc',
        status='lead'
    )
    
    # Convert to dictionary
    data = contact.to_dict()
    
    # Check that keys are in camelCase (for JavaScript)
    assert data['firstName'] == 'Jane'  # NOT 'first_name'
    assert data['lastName'] == 'Smith'   # NOT 'last_name'
    assert data['email'] == 'jane@example.com'
    print("✅ to_dict() works correctly!")


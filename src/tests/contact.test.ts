import { describe, it, expect } from 'vitest';

describe('Contact Type', () => {
  
  it('creates a valid contact object', () => {
    // Arrange
    const contact = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '555-1234',
      company: 'Acme Corp',
      status: 'active' as const,
    };
    
    // Assert
    expect(contact.firstName).toBe('John');
    expect(contact.lastName).toBe('Doe');
    expect(contact.email).toBe('john@example.com');
    expect(contact.status).toBe('active');
  });

  it('formats phone numbers correctly', () => {
    // Arrange
    const rawPhone = '5551234567';
    
    // Act - format phone number
    const formatted = `(${rawPhone.slice(0,3)}) ${rawPhone.slice(3,6)}-${rawPhone.slice(6)}`;
    
    // Assert
    expect(formatted).toBe('(555) 123-4567');
  });

  it('filters contacts by search query', () => {
    // Arrange
    const contacts = [
      { firstName: 'John', lastName: 'Doe', email: 'john@example.com', company: 'Acme' },
      { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', company: 'TechCorp' },
      { firstName: 'Bob', lastName: 'Johnson', email: 'bob@acme.com', company: 'Acme' },
    ];
    const searchQuery = 'acme';
    
    // Act - filter by search (like your Contacts page does)
    const filtered = contacts.filter(contact => {
      const query = searchQuery.toLowerCase();
      return (
        contact.firstName.toLowerCase().includes(query) ||
        contact.lastName.toLowerCase().includes(query) ||
        contact.email.toLowerCase().includes(query) ||
        contact.company.toLowerCase().includes(query)
      );
    });
    
    // Assert
    expect(filtered).toHaveLength(2);
    expect(filtered[0].firstName).toBe('John');
    expect(filtered[1].firstName).toBe('Bob');
  });

  it('validates email format', () => {
    // Arrange
    const validEmail = 'test@example.com';
    const invalidEmail = 'not-an-email';
    
    // Act - simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Assert
    expect(emailRegex.test(validEmail)).toBe(true);
    expect(emailRegex.test(invalidEmail)).toBe(false);
  });

});
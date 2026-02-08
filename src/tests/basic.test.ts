import { describe, it, expect } from 'vitest';

describe('Basic Frontend Tests', () => {
  
  // Test 1: Simple math (understand the syntax)
  it('adds numbers correctly', () => {
    const result = 1 + 1;
    expect(result).toBe(2);
  });

  // Test 2: String operations
  it('creates full name from first and last', () => {
    const firstName = 'John';
    const lastName = 'Doe';
    const fullName = `${firstName} ${lastName}`;
    
    expect(fullName).toBe('John Doe');
  });

  // Test 3: Array filtering (like your contacts)
  it('filters contacts by status', () => {
    const contacts = [
      { name: 'John', status: 'active' },
      { name: 'Jane', status: 'inactive' },
      { name: 'Bob', status: 'active' },
    ];
    
    const activeContacts = contacts.filter(c => c.status === 'active');
    
    expect(activeContacts).toHaveLength(2);
    expect(activeContacts[0].name).toBe('John');
    expect(activeContacts[1].name).toBe('Bob');
  });

  // Test 4: Object properties
  it('creates a contact object', () => {
    const contact = {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah@example.com',
      status: 'lead'
    };
    
    expect(contact.firstName).toBe('Sarah');
    expect(contact.email).toBe('sarah@example.com');
  });

});
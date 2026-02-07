const API_BASE_URL = 'http://localhost:5000/api';

export interface Contact {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  status: 'active' | 'inactive' | 'lead';
}

export const contactsApi = {
  getAll: async (): Promise<Contact[]> => {
    const response = await fetch(`${API_BASE_URL}/contacts`);
    if (!response.ok) throw new Error('Failed to fetch contacts');
    return response.json();
  },

  create: async (contact: Omit<Contact, 'id'>): Promise<Contact> => {
    const response = await fetch(`${API_BASE_URL}/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact),
    });
    if (!response.ok) throw new Error('Failed to create contact');
    return response.json();
  },

  update: async (id: number, contact: Omit<Contact, 'id'>): Promise<Contact> => {
    const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact),
    });
    if (!response.ok) throw new Error('Failed to update contact');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete contact');
  },
};
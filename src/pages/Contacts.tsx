import { useState } from 'react';
import { useEffect } from 'react';
import { contactsApi } from '../services/api';
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Chip,
  Container,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

// Contact interface defines the shape of a contact object
// Each contact has a unique id and various personal/business information
interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  status: 'active' | 'inactive' | 'lead';
}

// =============================================================================
// INITIAL DATA
// =============================================================================

// Sample contacts to populate the table on initial load
// In a real application, this would come from an API or database
const initialContacts: Contact[] = [
  { id: 1, firstName: 'John', lastName: 'Smith', email: 'john.smith@example.com', phone: '(555) 123-4567', company: 'Acme Corp', status: 'active' },
  { id: 2, firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.j@example.com', phone: '(555) 234-5678', company: 'Tech Solutions', status: 'active' },
  { id: 3, firstName: 'Michael', lastName: 'Brown', email: 'mbrown@example.com', phone: '(555) 345-6789', company: 'Global Industries', status: 'lead' },
  { id: 4, firstName: 'Emily', lastName: 'Davis', email: 'emily.davis@example.com', phone: '(555) 456-7890', company: 'StartUp Inc', status: 'inactive' },
  { id: 5, firstName: 'David', lastName: 'Wilson', email: 'dwilson@example.com', phone: '(555) 567-8901', company: 'Enterprise Ltd', status: 'active' },
];

// Default empty contact object used when creating a new contact
// Omit<Contact, 'id'> means all Contact fields except 'id' (id is auto-generated)
const emptyContact: Omit<Contact, 'id'> = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  status: 'lead',
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function Contacts() {
  // ===========================================================================
  // STATE MANAGEMENT
  // ===========================================================================

  // Main contacts list - stores all contacts in the application
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  // Search query for filtering contacts in the table
  const [searchQuery, setSearchQuery] = useState('');

  // Controls visibility of the add/edit contact dialog
  const [dialogOpen, setDialogOpen] = useState(false);

  // Tracks which contact is being edited (null when adding a new contact)
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  // Form data for the add/edit dialog - holds input values
  const [formData, setFormData] = useState<Omit<Contact, 'id'>>(emptyContact);

  // Controls visibility of the delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Tracks which contact is pending deletion
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  // ===========================================================================
  // FILTERED DATA
  // ===========================================================================

  // Filter contacts based on search query
  // Searches across multiple fields: first name, last name, email, company, and phone
  const filteredContacts = contacts.filter((contact) => {
    const query = searchQuery.toLowerCase();
    return (
      contact.firstName.toLowerCase().includes(query) ||
      contact.lastName.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query) ||
      contact.company.toLowerCase().includes(query) ||
      contact.phone.includes(query)
    );
  });

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================

  // Opens the add/edit dialog
  // If a contact is passed, it populates the form for editing
  // If no contact is passed, it opens an empty form for adding a new contact

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const data = await contactsApi.getAll();
      setContacts(data);
    } catch (error) {
      console.error('Failed to load contacts:', error);
    } finally {
      setLoading(false);
    }
  };  
  
  const handleOpenDialog = (contact?: Contact) => {
    if (contact) {
      // Edit mode: populate form with existing contact data
      setEditingContact(contact);
      setFormData({
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone,
        company: contact.company,
        status: contact.status,
      });
    } else {
      // Add mode: reset form to empty state
      setEditingContact(null);
      setFormData(emptyContact);
    }
    setDialogOpen(true);
  };

  // Closes the dialog and resets all form-related state
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingContact(null);
    setFormData(emptyContact);
  };

  // Saves the contact (either creates new or updates existing)
  const handleSave = async () => {
    try {
      if (editingContact) {
        await contactsApi.update(editingContact.id!, formData);
      } else {
        await contactsApi.create(formData);
      }
      await loadContacts();
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to save contact:', error);
      alert('Failed to save contact');
    }
  };

  // Opens the delete confirmation dialog for a specific contact
  const handleDeleteClick = (contact: Contact) => {
    setContactToDelete(contact);
    setDeleteDialogOpen(true);
  };

  // Confirms deletion and removes the contact from the list
  const handleConfirmDelete = async () => {
    if (contactToDelete) {
      try {
        await contactsApi.delete(contactToDelete.id!);
        await loadContacts();
        setDeleteDialogOpen(false);
        setContactToDelete(null);
      } catch (error) {
        console.error('Failed to delete contact:', error);
        alert('Failed to delete contact');
      }
    }
  };

  // ===========================================================================
  // UTILITY FUNCTIONS
  // ===========================================================================

  // Returns the MUI color prop based on contact status
  // Used for the status Chip component to display appropriate colors
  const getStatusColor = (status: Contact['status']) => {
    switch (status) {
      case 'active': return 'success';    // Green
      case 'inactive': return 'default';  // Gray
      case 'lead': return 'info';         // Blue
    }
  };

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <Container maxWidth="xl" disableGutters>
      {/* ===================================================================
          PAGE HEADER
          Contains the page title and "Add Contact" button
          =================================================================== */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>Contacts</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ textTransform: 'none', px: 3 }}
        >
          Add Contact
        </Button>
      </Box>

      {/* ===================================================================
          SEARCH BAR
          Allows users to filter contacts by typing a search query
          =================================================================== */}
      <Paper sx={{ p: 2, mb: 3 }} elevation={1}>
        <TextField
          fullWidth
          placeholder="Search contacts by name, email, company, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          size="small"
          sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#fff' } }}
        />
      </Paper>

      {/* ===================================================================
          CONTACTS TABLE
          Displays all contacts in a sortable, searchable table format
          =================================================================== */}
      <TableContainer component={Paper} elevation={1}>
        <Table sx={{ minWidth: 900, tableLayout: 'fixed' }}>
          {/* Table Header - Column titles */}
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
              <TableCell sx={{ fontWeight: 600, width: '18%' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '22%' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '15%' }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '18%' }}>Company</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '12%' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '15%' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          {/* Table Body - Contact rows */}
          <TableBody>
            {/* Empty State: Show message when no contacts match the search */}
            {filteredContacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">
                    {searchQuery ? 'No contacts found matching your search' : 'No contacts yet. Add your first contact!'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              // Map through filtered contacts and render each row
              filteredContacts.map((contact) => (
                <TableRow
                  key={contact.id}
                  hover
                  sx={{ '&:last-child td': { borderBottom: 0 } }}
                >
                  {/* Name Column */}
                  <TableCell>
                    <Typography fontWeight={500} noWrap>
                      {contact.firstName} {contact.lastName}
                    </Typography>
                  </TableCell>

                  {/* Email Column - with icon */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon fontSize="small" color="action" />
                      <Typography noWrap sx={{ fontSize: '0.875rem' }}>{contact.email}</Typography>
                    </Box>
                  </TableCell>

                  {/* Phone Column - with icon */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon fontSize="small" color="action" />
                      <Typography noWrap sx={{ fontSize: '0.875rem' }}>{contact.phone}</Typography>
                    </Box>
                  </TableCell>

                  {/* Company Column */}
                  <TableCell>
                    <Typography noWrap sx={{ fontSize: '0.875rem' }}>{contact.company}</Typography>
                  </TableCell>

                  {/* Status Column - colored chip */}
                  <TableCell>
                    <Chip
                      label={contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                      color={getStatusColor(contact.status)}
                      size="small"
                      sx={{ minWidth: 70 }}
                    />
                  </TableCell>

                  {/* Actions Column - Edit and Delete buttons */}
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(contact)}
                      color="primary"
                      sx={{ mr: 0.5 }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(contact)}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ===================================================================
          RECORD COUNT
          Shows the total number of contacts (filtered) at the bottom
          =================================================================== */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Typography variant="body2" color="text.secondary">
          {filteredContacts.length} {filteredContacts.length === 1 ? 'contact' : 'contacts'}
        </Typography>
      </Box>

      {/* ===================================================================
          ADD/EDIT CONTACT DIALOG
          Modal form for creating new contacts or editing existing ones
          =================================================================== */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          {editingContact ? 'Edit Contact' : 'Add New Contact'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
            {/* First Name and Last Name - side by side */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                fullWidth
                required
                size="small"
              />
              <TextField
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                fullWidth
                required
                size="small"
              />
            </Box>

            {/* Email Field */}
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
              required
              size="small"
            />

            {/* Phone Field */}
            <TextField
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              fullWidth
              size="small"
            />

            {/* Company Field */}
            <TextField
              label="Company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              fullWidth
              size="small"
            />

            {/* Status Dropdown */}
            <TextField
              label="Status"
              select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Contact['status'] })}
              fullWidth
              size="small"
              SelectProps={{ native: true }}
            >
              <option value="lead">Lead</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </TextField>
          </Box>
        </DialogContent>

        {/* Dialog Action Buttons */}
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!formData.firstName || !formData.lastName || !formData.email}
            sx={{ textTransform: 'none', px: 3 }}
          >
            {editingContact ? 'Save Changes' : 'Add Contact'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===================================================================
          DELETE CONFIRMATION DIALOG
          Prompts user to confirm before deleting a contact
          =================================================================== */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Contact</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{contactToDelete?.firstName} {contactToDelete?.lastName}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" sx={{ textTransform: 'none' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

import { useState } from 'react';
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
  Business as BusinessIcon,
  Language as WebsiteIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

// Business interface defines the shape of a business object
// Each business has a unique id and various company information
interface Business {
  id: number;
  name: string;
  industry: string;
  website: string;
  phone: string;
  address: string;
  employees: string;
  status: 'active' | 'inactive' | 'prospect';
}

// =============================================================================
// INITIAL DATA
// =============================================================================

// Sample businesses to populate the table on initial load
// In a real application, this would come from an API or database
const initialBusinesses: Business[] = [
  { id: 1, name: 'Acme Corporation', industry: 'Manufacturing', website: 'www.acme.com', phone: '(555) 100-1000', address: '123 Main St, New York, NY', employees: '500-1000', status: 'active' },
  { id: 2, name: 'Tech Solutions Inc', industry: 'Technology', website: 'www.techsolutions.com', phone: '(555) 200-2000', address: '456 Tech Blvd, San Francisco, CA', employees: '100-500', status: 'active' },
  { id: 3, name: 'Global Industries', industry: 'Logistics', website: 'www.globalind.com', phone: '(555) 300-3000', address: '789 Commerce Dr, Chicago, IL', employees: '1000+', status: 'prospect' },
  { id: 4, name: 'StartUp Ventures', industry: 'Finance', website: 'www.startupventures.io', phone: '(555) 400-4000', address: '321 Innovation Way, Austin, TX', employees: '10-50', status: 'active' },
  { id: 5, name: 'Enterprise Ltd', industry: 'Consulting', website: 'www.enterprise.co', phone: '(555) 500-5000', address: '555 Business Park, Boston, MA', employees: '50-100', status: 'inactive' },
];

// Default empty business object used when creating a new business
// Omit<Business, 'id'> means all Business fields except 'id' (id is auto-generated)
const emptyBusiness: Omit<Business, 'id'> = {
  name: '',
  industry: '',
  website: '',
  phone: '',
  address: '',
  employees: '',
  status: 'prospect',
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function Businesses() {
  // ===========================================================================
  // STATE MANAGEMENT
  // ===========================================================================

  // Main businesses list - stores all businesses in the application
  const [businesses, setBusinesses] = useState<Business[]>(initialBusinesses);

  // Search query for filtering businesses in the table
  const [searchQuery, setSearchQuery] = useState('');

  // Controls visibility of the add/edit business dialog
  const [dialogOpen, setDialogOpen] = useState(false);

  // Tracks which business is being edited (null when adding a new business)
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);

  // Form data for the add/edit dialog - holds input values
  const [formData, setFormData] = useState<Omit<Business, 'id'>>(emptyBusiness);

  // Controls visibility of the delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Tracks which business is pending deletion
  const [businessToDelete, setBusinessToDelete] = useState<Business | null>(null);

  // ===========================================================================
  // FILTERED DATA
  // ===========================================================================

  // Filter businesses based on search query
  // Searches across multiple fields: name, industry, website, address, and phone
  const filteredBusinesses = businesses.filter((business) => {
    const query = searchQuery.toLowerCase();
    return (
      business.name.toLowerCase().includes(query) ||
      business.industry.toLowerCase().includes(query) ||
      business.website.toLowerCase().includes(query) ||
      business.address.toLowerCase().includes(query) ||
      business.phone.includes(query)
    );
  });

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================

  // Opens the add/edit dialog
  // If a business is passed, it populates the form for editing
  // If no business is passed, it opens an empty form for adding a new business
  const handleOpenDialog = (business?: Business) => {
    if (business) {
      // Edit mode: populate form with existing business data
      setEditingBusiness(business);
      setFormData({
        name: business.name,
        industry: business.industry,
        website: business.website,
        phone: business.phone,
        address: business.address,
        employees: business.employees,
        status: business.status,
      });
    } else {
      // Add mode: reset form to empty state
      setEditingBusiness(null);
      setFormData(emptyBusiness);
    }
    setDialogOpen(true);
  };

  // Closes the dialog and resets all form-related state
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingBusiness(null);
    setFormData(emptyBusiness);
  };

  // Saves the business (either creates new or updates existing)
  const handleSave = () => {
    if (editingBusiness) {
      // Update existing business: map through businesses and replace the matching one
      setBusinesses(businesses.map((b) =>
        b.id === editingBusiness.id ? { ...formData, id: editingBusiness.id } : b
      ));
    } else {
      // Create new business: generate new ID and add to businesses array
      const newId = Math.max(...businesses.map((b) => b.id), 0) + 1;
      setBusinesses([...businesses, { ...formData, id: newId }]);
    }
    handleCloseDialog();
  };

  // Opens the delete confirmation dialog for a specific business
  const handleDeleteClick = (business: Business) => {
    setBusinessToDelete(business);
    setDeleteDialogOpen(true);
  };

  // Confirms deletion and removes the business from the list
  const handleConfirmDelete = () => {
    if (businessToDelete) {
      // Filter out the business to delete
      setBusinesses(businesses.filter((b) => b.id !== businessToDelete.id));
    }
    setDeleteDialogOpen(false);
    setBusinessToDelete(null);
  };

  // ===========================================================================
  // UTILITY FUNCTIONS
  // ===========================================================================

  // Returns the MUI color prop based on business status
  // Used for the status Chip component to display appropriate colors
  const getStatusColor = (status: Business['status']) => {
    switch (status) {
      case 'active': return 'success';     // Green
      case 'inactive': return 'default';   // Gray
      case 'prospect': return 'info';      // Blue
    }
  };

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <Container maxWidth="xl" disableGutters>
      {/* ===================================================================
          PAGE HEADER
          Contains the page title and "Add Business" button
          =================================================================== */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>Businesses</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ textTransform: 'none', px: 3 }}
        >
          Add Business
        </Button>
      </Box>

      {/* ===================================================================
          SEARCH BAR
          Allows users to filter businesses by typing a search query
          =================================================================== */}
      <Paper sx={{ p: 2, mb: 3 }} elevation={1}>
        <TextField
          fullWidth
          placeholder="Search businesses by name, industry, website, or phone..."
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
          BUSINESSES TABLE
          Displays all businesses in a sortable, searchable table format
          =================================================================== */}
      <TableContainer component={Paper} elevation={1}>
        <Table sx={{ minWidth: 900, tableLayout: 'fixed' }}>
          {/* Table Header - Column titles */}
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
              <TableCell sx={{ fontWeight: 600, width: '20%' }}>Business Name</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '12%' }}>Industry</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '18%' }}>Website</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '14%' }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '10%' }}>Employees</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '12%' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '14%' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          {/* Table Body - Business rows */}
          <TableBody>
            {/* Empty State: Show message when no businesses match the search */}
            {filteredBusinesses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">
                    {searchQuery ? 'No businesses found matching your search' : 'No businesses yet. Add your first business!'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              // Map through filtered businesses and render each row
              filteredBusinesses.map((business) => (
                <TableRow
                  key={business.id}
                  hover
                  sx={{ '&:last-child td': { borderBottom: 0 } }}
                >
                  {/* Business Name Column - with icon */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BusinessIcon fontSize="small" color="action" />
                      <Typography fontWeight={500} noWrap>{business.name}</Typography>
                    </Box>
                  </TableCell>

                  {/* Industry Column */}
                  <TableCell>
                    <Typography noWrap sx={{ fontSize: '0.875rem' }}>{business.industry}</Typography>
                  </TableCell>

                  {/* Website Column - with icon */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WebsiteIcon fontSize="small" color="action" />
                      <Typography noWrap sx={{ fontSize: '0.875rem' }}>{business.website}</Typography>
                    </Box>
                  </TableCell>

                  {/* Phone Column - with icon */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon fontSize="small" color="action" />
                      <Typography noWrap sx={{ fontSize: '0.875rem' }}>{business.phone}</Typography>
                    </Box>
                  </TableCell>

                  {/* Employees Column */}
                  <TableCell>
                    <Typography noWrap sx={{ fontSize: '0.875rem' }}>{business.employees}</Typography>
                  </TableCell>

                  {/* Status Column - colored chip */}
                  <TableCell>
                    <Chip
                      label={business.status.charAt(0).toUpperCase() + business.status.slice(1)}
                      color={getStatusColor(business.status)}
                      size="small"
                      sx={{ minWidth: 75 }}
                    />
                  </TableCell>

                  {/* Actions Column - Edit and Delete buttons */}
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(business)}
                      color="primary"
                      sx={{ mr: 0.5 }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(business)}
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
          Shows the total number of businesses (filtered) at the bottom
          =================================================================== */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Typography variant="body2" color="text.secondary">
          {filteredBusinesses.length} {filteredBusinesses.length === 1 ? 'business' : 'businesses'}
        </Typography>
      </Box>

      {/* ===================================================================
          ADD/EDIT BUSINESS DIALOG
          Modal form for creating new businesses or editing existing ones
          =================================================================== */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          {editingBusiness ? 'Edit Business' : 'Add New Business'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
            {/* Business Name Field */}
            <TextField
              label="Business Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
              size="small"
            />

            {/* Industry and Employees - side by side */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Industry"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                fullWidth
                size="small"
              />
              <TextField
                label="Employees"
                select
                value={formData.employees}
                onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                fullWidth
                size="small"
                SelectProps={{ native: true }}
              >
                <option value="">Select...</option>
                <option value="1-10">1-10</option>
                <option value="10-50">10-50</option>
                <option value="50-100">50-100</option>
                <option value="100-500">100-500</option>
                <option value="500-1000">500-1000</option>
                <option value="1000+">1000+</option>
              </TextField>
            </Box>

            {/* Website Field */}
            <TextField
              label="Website"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              fullWidth
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

            {/* Address Field - multiline for longer addresses */}
            <TextField
              label="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              fullWidth
              size="small"
              multiline
              rows={2}
            />

            {/* Status Dropdown */}
            <TextField
              label="Status"
              select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Business['status'] })}
              fullWidth
              size="small"
              SelectProps={{ native: true }}
            >
              <option value="prospect">Prospect</option>
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
            disabled={!formData.name}
            sx={{ textTransform: 'none', px: 3 }}
          >
            {editingBusiness ? 'Save Changes' : 'Add Business'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===================================================================
          DELETE CONFIRMATION DIALOG
          Prompts user to confirm before deleting a business
          =================================================================== */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Business</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{businessToDelete?.name}</strong>? This action cannot be undone.
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

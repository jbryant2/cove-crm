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
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

// Transaction interface defines the shape of a transaction object
// Each transaction has a unique id and various financial information
interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  contact: string;
  status: 'completed' | 'pending' | 'cancelled';
}

// =============================================================================
// INITIAL DATA
// =============================================================================

// Sample transactions to populate the table on initial load
// In a real application, this would come from an API or database
const initialTransactions: Transaction[] = [
  { id: 1, description: 'Software License Sale', amount: 5000, type: 'income', category: 'Sales', date: '2024-01-15', contact: 'Acme Corp', status: 'completed' },
  { id: 2, description: 'Consulting Services', amount: 2500, type: 'income', category: 'Services', date: '2024-01-14', contact: 'Tech Solutions', status: 'completed' },
  { id: 3, description: 'Office Supplies', amount: 350, type: 'expense', category: 'Operations', date: '2024-01-13', contact: 'Office Depot', status: 'completed' },
  { id: 4, description: 'Annual Subscription', amount: 12000, type: 'income', category: 'Subscriptions', date: '2024-01-12', contact: 'Global Industries', status: 'pending' },
  { id: 5, description: 'Marketing Campaign', amount: 1500, type: 'expense', category: 'Marketing', date: '2024-01-11', contact: 'Ad Agency Inc', status: 'completed' },
  { id: 6, description: 'Product Development', amount: 8000, type: 'income', category: 'Sales', date: '2024-01-10', contact: 'StartUp Ventures', status: 'pending' },
  { id: 7, description: 'Cloud Hosting', amount: 450, type: 'expense', category: 'Technology', date: '2024-01-09', contact: 'AWS', status: 'completed' },
  { id: 8, description: 'Training Workshop', amount: 3000, type: 'income', category: 'Services', date: '2024-01-08', contact: 'Enterprise Ltd', status: 'cancelled' },
];

// Default empty transaction object used when creating a new transaction
// Omit<Transaction, 'id'> means all Transaction fields except 'id' (id is auto-generated)
const emptyTransaction: Omit<Transaction, 'id'> = {
  description: '',
  amount: 0,
  type: 'income',
  category: '',
  date: new Date().toISOString().split('T')[0],
  contact: '',
  status: 'pending',
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function Transactions() {
  // ===========================================================================
  // STATE MANAGEMENT
  // ===========================================================================

  // Main transactions list - stores all transactions in the application
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  // Search query for filtering transactions in the table
  const [searchQuery, setSearchQuery] = useState('');

  // Controls visibility of the add/edit transaction dialog
  const [dialogOpen, setDialogOpen] = useState(false);

  // Tracks which transaction is being edited (null when adding a new transaction)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Form data for the add/edit dialog - holds input values
  const [formData, setFormData] = useState<Omit<Transaction, 'id'>>(emptyTransaction);

  // Controls visibility of the delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Tracks which transaction is pending deletion
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

  // ===========================================================================
  // FILTERED DATA
  // ===========================================================================

  // Filter transactions based on search query
  // Searches across multiple fields: description, category, contact, and amount
  const filteredTransactions = transactions.filter((transaction) => {
    const query = searchQuery.toLowerCase();
    return (
      transaction.description.toLowerCase().includes(query) ||
      transaction.category.toLowerCase().includes(query) ||
      transaction.contact.toLowerCase().includes(query) ||
      transaction.amount.toString().includes(query)
    );
  });

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================

  // Opens the add/edit dialog
  // If a transaction is passed, it populates the form for editing
  // If no transaction is passed, it opens an empty form for adding a new transaction
  const handleOpenDialog = (transaction?: Transaction) => {
    if (transaction) {
      // Edit mode: populate form with existing transaction data
      setEditingTransaction(transaction);
      setFormData({
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        date: transaction.date,
        contact: transaction.contact,
        status: transaction.status,
      });
    } else {
      // Add mode: reset form to empty state
      setEditingTransaction(null);
      setFormData(emptyTransaction);
    }
    setDialogOpen(true);
  };

  // Closes the dialog and resets all form-related state
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTransaction(null);
    setFormData(emptyTransaction);
  };

  // Saves the transaction (either creates new or updates existing)
  const handleSave = () => {
    if (editingTransaction) {
      // Update existing transaction: map through transactions and replace the matching one
      setTransactions(transactions.map((t) =>
        t.id === editingTransaction.id ? { ...formData, id: editingTransaction.id } : t
      ));
    } else {
      // Create new transaction: generate new ID and add to transactions array
      const newId = Math.max(...transactions.map((t) => t.id), 0) + 1;
      setTransactions([...transactions, { ...formData, id: newId }]);
    }
    handleCloseDialog();
  };

  // Opens the delete confirmation dialog for a specific transaction
  const handleDeleteClick = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setDeleteDialogOpen(true);
  };

  // Confirms deletion and removes the transaction from the list
  const handleConfirmDelete = () => {
    if (transactionToDelete) {
      // Filter out the transaction to delete
      setTransactions(transactions.filter((t) => t.id !== transactionToDelete.id));
    }
    setDeleteDialogOpen(false);
    setTransactionToDelete(null);
  };

  // ===========================================================================
  // UTILITY FUNCTIONS
  // ===========================================================================

  // Returns the MUI color prop based on transaction status
  // Used for the status Chip component to display appropriate colors
  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return 'success';   // Green
      case 'pending': return 'warning';     // Orange
      case 'cancelled': return 'error';     // Red
    }
  };

  // Returns the MUI color prop based on transaction type
  // Used for displaying income (green) vs expense (red)
  const getTypeColor = (type: Transaction['type']) => {
    return type === 'income' ? 'success' : 'error';
  };

  // Formats a number as currency (USD)
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Formats a date string to a more readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // ===========================================================================
  // CALCULATED VALUES
  // ===========================================================================

  // Calculate total income from completed transactions
  const totalIncome = transactions
    .filter(t => t.type === 'income' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate total expenses from completed transactions
  const totalExpenses = transactions
    .filter(t => t.type === 'expense' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <Container maxWidth="xl" disableGutters>
      {/* ===================================================================
          PAGE HEADER
          Contains the page title and "Add Transaction" button
          =================================================================== */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>Transactions</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ textTransform: 'none', px: 3 }}
        >
          Add Transaction
        </Button>
      </Box>

      {/* ===================================================================
          SUMMARY CARDS
          Shows total income, expenses, and net balance
          =================================================================== */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        {/* Total Income Card */}
        <Paper sx={{ p: 2, flex: 1 }} elevation={1}>
          <Typography variant="body2" color="text.secondary">Total Income</Typography>
          <Typography variant="h5" fontWeight={600} color="success.main">
            {formatCurrency(totalIncome)}
          </Typography>
        </Paper>

        {/* Total Expenses Card */}
        <Paper sx={{ p: 2, flex: 1 }} elevation={1}>
          <Typography variant="body2" color="text.secondary">Total Expenses</Typography>
          <Typography variant="h5" fontWeight={600} color="error.main">
            {formatCurrency(totalExpenses)}
          </Typography>
        </Paper>

        {/* Net Balance Card */}
        <Paper sx={{ p: 2, flex: 1 }} elevation={1}>
          <Typography variant="body2" color="text.secondary">Net Balance</Typography>
          <Typography
            variant="h5"
            fontWeight={600}
            color={totalIncome - totalExpenses >= 0 ? 'success.main' : 'error.main'}
          >
            {formatCurrency(totalIncome - totalExpenses)}
          </Typography>
        </Paper>
      </Box>

      {/* ===================================================================
          SEARCH BAR
          Allows users to filter transactions by typing a search query
          =================================================================== */}
      <Paper sx={{ p: 2, mb: 3 }} elevation={1}>
        <TextField
          fullWidth
          placeholder="Search transactions by description, category, or contact..."
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
          TRANSACTIONS TABLE
          Displays all transactions in a sortable, searchable table format
          =================================================================== */}
      <TableContainer component={Paper} elevation={1}>
        <Table sx={{ minWidth: 900, tableLayout: 'fixed' }}>
          {/* Table Header - Column titles */}
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
              <TableCell sx={{ fontWeight: 600, width: '20%' }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '12%' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '12%' }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '14%' }}>Contact</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '10%' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '12%' }} align="right">Amount</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '10%' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '10%' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          {/* Table Body - Transaction rows */}
          <TableBody>
            {/* Empty State: Show message when no transactions match the search */}
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">
                    {searchQuery ? 'No transactions found matching your search' : 'No transactions yet. Add your first transaction!'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              // Map through filtered transactions and render each row
              filteredTransactions.map((transaction) => (
                <TableRow
                  key={transaction.id}
                  hover
                  sx={{ '&:last-child td': { borderBottom: 0 } }}
                >
                  {/* Description Column - with icon */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MoneyIcon fontSize="small" color="action" />
                      <Typography fontWeight={500} noWrap>{transaction.description}</Typography>
                    </Box>
                  </TableCell>

                  {/* Date Column */}
                  <TableCell>
                    <Typography noWrap sx={{ fontSize: '0.875rem' }}>
                      {formatDate(transaction.date)}
                    </Typography>
                  </TableCell>

                  {/* Category Column */}
                  <TableCell>
                    <Typography noWrap sx={{ fontSize: '0.875rem' }}>{transaction.category}</Typography>
                  </TableCell>

                  {/* Contact Column */}
                  <TableCell>
                    <Typography noWrap sx={{ fontSize: '0.875rem' }}>{transaction.contact}</Typography>
                  </TableCell>

                  {/* Type Column - colored chip */}
                  <TableCell>
                    <Chip
                      label={transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      color={getTypeColor(transaction.type)}
                      size="small"
                      variant="outlined"
                      sx={{ minWidth: 70 }}
                    />
                  </TableCell>

                  {/* Amount Column - colored based on type */}
                  <TableCell align="right">
                    <Typography
                      fontWeight={500}
                      color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                    >
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </Typography>
                  </TableCell>

                  {/* Status Column - colored chip */}
                  <TableCell>
                    <Chip
                      label={transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      color={getStatusColor(transaction.status)}
                      size="small"
                      sx={{ minWidth: 75 }}
                    />
                  </TableCell>

                  {/* Actions Column - Edit and Delete buttons */}
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(transaction)}
                      color="primary"
                      sx={{ mr: 0.5 }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(transaction)}
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
          Shows the total number of transactions (filtered) at the bottom
          =================================================================== */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Typography variant="body2" color="text.secondary">
          {filteredTransactions.length} {filteredTransactions.length === 1 ? 'transaction' : 'transactions'}
        </Typography>
      </Box>

      {/* ===================================================================
          ADD/EDIT TRANSACTION DIALOG
          Modal form for creating new transactions or editing existing ones
          =================================================================== */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
            {/* Description Field */}
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              required
              size="small"
            />

            {/* Amount and Type - side by side */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                fullWidth
                required
                size="small"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
              <TextField
                label="Type"
                select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Transaction['type'] })}
                fullWidth
                size="small"
                SelectProps={{ native: true }}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </TextField>
            </Box>

            {/* Category and Date - side by side */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                fullWidth
                size="small"
              />
              <TextField
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            {/* Contact Field */}
            <TextField
              label="Contact / Company"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              fullWidth
              size="small"
            />

            {/* Status Dropdown */}
            <TextField
              label="Status"
              select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Transaction['status'] })}
              fullWidth
              size="small"
              SelectProps={{ native: true }}
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </TextField>
          </Box>
        </DialogContent>

        {/* Dialog Action Buttons */}
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!formData.description || formData.amount <= 0}
            sx={{ textTransform: 'none', px: 3 }}
          >
            {editingTransaction ? 'Save Changes' : 'Add Transaction'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===================================================================
          DELETE CONFIRMATION DIALOG
          Prompts user to confirm before deleting a transaction
          =================================================================== */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Transaction</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{transactionToDelete?.description}</strong>? This action cannot be undone.
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

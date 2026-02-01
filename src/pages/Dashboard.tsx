import {
  Typography,
  Paper,
  Box,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  Receipt as ReceiptIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

// StatCard props for the summary statistics cards
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: string;
}

// Activity item for recent activity list
interface ActivityItem {
  id: number;
  type: 'contact' | 'business' | 'transaction';
  action: string;
  name: string;
  time: string;
}

// =============================================================================
// SAMPLE DATA
// =============================================================================

// Sample statistics for the dashboard
// In a real application, this would be calculated from actual data
const stats = {
  totalContacts: 156,
  totalBusinesses: 42,
  totalRevenue: 127500,
  pendingDeals: 23,
  contactGrowth: 12,
  businessGrowth: 8,
  revenueGrowth: 15,
  dealsGrowth: -3,
};

// Sample recent activity items
const recentActivity: ActivityItem[] = [
  { id: 1, type: 'contact', action: 'New contact added', name: 'John Smith', time: '5 minutes ago' },
  { id: 2, type: 'transaction', action: 'Payment received', name: '$5,000 from Acme Corp', time: '1 hour ago' },
  { id: 3, type: 'business', action: 'Business updated', name: 'Tech Solutions Inc', time: '2 hours ago' },
  { id: 4, type: 'contact', action: 'Contact status changed', name: 'Sarah Johnson → Active', time: '3 hours ago' },
  { id: 5, type: 'transaction', action: 'Invoice sent', name: '$12,000 to Global Industries', time: '5 hours ago' },
  { id: 6, type: 'business', action: 'New prospect added', name: 'StartUp Ventures', time: '1 day ago' },
];

// Top contacts by recent activity
const topContacts = [
  { name: 'Acme Corporation', deals: 8, value: 45000 },
  { name: 'Tech Solutions Inc', deals: 5, value: 32000 },
  { name: 'Global Industries', deals: 4, value: 28000 },
  { name: 'StartUp Ventures', deals: 3, value: 15000 },
  { name: 'Enterprise Ltd', deals: 2, value: 7500 },
];

// Sales pipeline stages
const pipelineStages = [
  { name: 'Leads', count: 45, percentage: 100, color: '#2196f3' },
  { name: 'Qualified', count: 28, percentage: 62, color: '#ff9800' },
  { name: 'Proposal', count: 15, percentage: 33, color: '#9c27b0' },
  { name: 'Negotiation', count: 8, percentage: 18, color: '#f44336' },
  { name: 'Closed Won', count: 5, percentage: 11, color: '#4caf50' },
];

// =============================================================================
// COMPONENTS
// =============================================================================

// StatCard component displays a single statistic with icon and trend
function StatCard({ title, value, icon, trend, color }: StatCardProps) {
  return (
    <Paper sx={{ p: 3, height: '100%' }} elevation={1}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={600}>
            {value}
          </Typography>
          {/* Trend indicator showing growth/decline */}
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {trend.isPositive ? (
                <TrendingUpIcon fontSize="small" color="success" />
              ) : (
                <TrendingDownIcon fontSize="small" color="error" />
              )}
              <Typography
                variant="body2"
                color={trend.isPositive ? 'success.main' : 'error.main'}
                sx={{ ml: 0.5 }}
              >
                {trend.isPositive ? '+' : ''}{trend.value}% from last month
              </Typography>
            </Box>
          )}
        </Box>
        {/* Icon with colored background */}
        <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
          {icon}
        </Avatar>
      </Box>
    </Paper>
  );
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

// Formats a number as currency (USD)
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Returns the appropriate icon for an activity type
const getActivityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'contact': return <PersonIcon />;
    case 'business': return <BusinessIcon />;
    case 'transaction': return <MoneyIcon />;
  }
};

// Returns the appropriate color for an activity type
const getActivityColor = (type: ActivityItem['type']) => {
  switch (type) {
    case 'contact': return '#2196f3';
    case 'business': return '#9c27b0';
    case 'transaction': return '#4caf50';
  }
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function Dashboard() {
  return (
    <Container maxWidth="xl" disableGutters>
      {/* ===================================================================
          PAGE HEADER
          Welcome message and page title
          =================================================================== */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's what's happening with your business today.
        </Typography>
      </Box>

      {/* ===================================================================
          STATISTICS CARDS
          Four cards showing key metrics: contacts, businesses, revenue, deals
          =================================================================== */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Total Contacts Card */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Contacts"
            value={stats.totalContacts}
            icon={<PeopleIcon />}
            trend={{ value: stats.contactGrowth, isPositive: true }}
            color="#2196f3"
          />
        </Grid>

        {/* Total Businesses Card */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Businesses"
            value={stats.totalBusinesses}
            icon={<BusinessIcon />}
            trend={{ value: stats.businessGrowth, isPositive: true }}
            color="#9c27b0"
          />
        </Grid>

        {/* Total Revenue Card */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            icon={<MoneyIcon />}
            trend={{ value: stats.revenueGrowth, isPositive: true }}
            color="#4caf50"
          />
        </Grid>

        {/* Pending Deals Card */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Pending Deals"
            value={stats.pendingDeals}
            icon={<ReceiptIcon />}
            trend={{ value: stats.dealsGrowth, isPositive: false }}
            color="#ff9800"
          />
        </Grid>
      </Grid>

      {/* ===================================================================
          MAIN CONTENT AREA
          Two-column layout: Recent Activity (left) and Sales Pipeline (right)
          =================================================================== */}
      <Grid container spacing={3}>
        {/* Left Column - Recent Activity */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: '100%' }} elevation={1}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Recent Activity
            </Typography>
            <List sx={{ pt: 0 }}>
              {recentActivity.map((activity, index) => (
                <Box key={activity.id}>
                  <ListItem sx={{ px: 0 }}>
                    {/* Activity Icon */}
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: getActivityColor(activity.type), width: 40, height: 40 }}>
                        {getActivityIcon(activity.type)}
                      </Avatar>
                    </ListItemAvatar>
                    {/* Activity Details */}
                    <ListItemText
                      primary={activity.action}
                      secondary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" component="span">
                            {activity.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {activity.time}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {/* Divider between items (except last) */}
                  {index < recentActivity.length - 1 && <Divider variant="inset" component="li" />}
                </Box>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Right Column - Sales Pipeline & Top Accounts */}
        <Grid size={{ xs: 12, md: 6 }}>
          {/* Sales Pipeline Section */}
          <Paper sx={{ p: 3, mb: 3 }} elevation={1}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Sales Pipeline
            </Typography>
            <Box sx={{ mt: 2 }}>
              {pipelineStages.map((stage) => (
                <Box key={stage.name} sx={{ mb: 2 }}>
                  {/* Stage Name and Count */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">{stage.name}</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {stage.count} deals
                    </Typography>
                  </Box>
                  {/* Progress Bar */}
                  <LinearProgress
                    variant="determinate"
                    value={stage.percentage}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: stage.color,
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Top Accounts Section */}
          <Paper sx={{ p: 3 }} elevation={1}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Top Accounts
            </Typography>
            <List sx={{ pt: 0 }}>
              {topContacts.map((contact, index) => (
                <Box key={contact.name}>
                  <ListItem sx={{ px: 0 }}>
                    {/* Rank Number */}
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#f5f5f5', color: 'text.primary', width: 36, height: 36 }}>
                        {index + 1}
                      </Avatar>
                    </ListItemAvatar>
                    {/* Account Details */}
                    <ListItemText
                      primary={contact.name}
                      secondary={`${contact.deals} deals`}
                    />
                    {/* Revenue Chip */}
                    <Chip
                      label={formatCurrency(contact.value)}
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  </ListItem>
                  {/* Divider between items (except last) */}
                  {index < topContacts.length - 1 && <Divider variant="inset" component="li" />}
                </Box>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

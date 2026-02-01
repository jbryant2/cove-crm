import { Box, Drawer, AppBar, Toolbar, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Avatar } from '@mui/material';
import { Outlet, Link, useLocation } from 'react-router-dom';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import ReceiptIcon from '@mui/icons-material/Receipt';

const drawerWidth = 240;

const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Contacts', icon: <PeopleIcon />, path: '/contacts' },
    { text: 'Companies', icon: <BusinessIcon />, path: '/companies' },
    { text: 'Transactions', icon: <ReceiptIcon />, path: '/transactions' },
];

export default function Layout() {
const location = useLocation(); // Highlight active page

return (
    <Box sx={{ display: 'flex' }}>
        {/* App Bar (Top Navigation) */}
        <AppBar 
            position="fixed" 
            sx={{ 
                zIndex: (theme) => theme.zIndex.drawer + 1,
                backgroundColor: "#2c3e50",
                boxShadow: 2,
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Typography variant="h6" noWrap component="div">
                    Cove CRM
                </Typography>
                <Avatar>JB</Avatar>
            </Toolbar>
        </AppBar>

        {/* Drawer (Sidebar) */}
        <Drawer
            variant="permanent"
            sx={{
            width: drawerWidth,
            '& .MuiDrawer-paper': {
                width: drawerWidth,
                backgroundColor:'#f5f5f5',
                boxSizing: 'border-box',
                borderRight: '1px solid #e0e0e0',
            },
            }}
        >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
            <List>
                {navItems.map((item) => (
                <ListItem key={item.text} disablePadding>
                    <ListItemButton
                        component={Link}
                        to={item.path}
                        selected={location.pathname === item.path} // Style selected item 
                        sx={{
                            '&.Mui-selected': {
                            backgroundColor: 'primary.light',
                            '&:hover': {
                                backgroundColor: 'primary.main',
                            },
                            },
                        }}
                        >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItemButton>
                </ListItem>
                ))}
            </List>
            </Box>
        </Drawer>

        {/* Main Content Area */}
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                p: 3,
                minHeight: '100vh',
                width: { sm: `calc(100% - ${drawerWidth}px)` },
            }}
        >
            <Toolbar /> {/* Spacer for top App bar*/}
            <Outlet /> {/* Page components */}
        </Box>
    </Box>
);
} 
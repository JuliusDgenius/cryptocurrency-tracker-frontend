import { useAuth } from "../hooks/useAuth";
import { AppBar, Toolbar, IconButton, Typography, Button, Box, Menu, MenuItem, Avatar } from "@mui/material";
import { NotificationsNone, Login, Dashboard, WatchLater } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar 
      position="fixed"
      sx={{ 
        backgroundColor: '#1f2937',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Toolbar>
        {/* Left side - Logo */}
        <Typography 
          variant="h6" 
          component={Link} 
          to="/"
          sx={{ 
            textDecoration: 'none', 
            color: 'white',
            mr: 3,
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Box component="span" sx={{ color: '#22d3ee' }}>Crypto</Box>Folio
        </Typography>

        {/* Dashboard link for authenticated users */}
        {user && (
          <>
            <Button 
              component={Link}
              to="/dashboard"
              color="inherit"
              startIcon={<Dashboard />}
              sx={{ mr: 2 }}
            >
              Dashboard
            </Button>
            <Button
              component={Link}
              to="/accounts"
              color="inherit"
              sx={{ mr: 2 }}
            >
              Accounts
            </Button>
            <Button
              component={Link}
              to="/watchlists"
              color="inherit"
              startIcon={<WatchLater />}
              sx={{ mr: 2 }}
            >
              Watchlists
            </Button>
          </>
        )}

        {/* Center - App title */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Right side - Auth/Profile section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton color="inherit">
            <NotificationsNone sx={{ color: '#22d3ee' }} />
          </IconButton>
          
          {user ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  onClick={handleMenu}
                  size="small"
                  sx={{ ml: 2 }}
                >
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32,
                      bgcolor: '#0891b2',
                      fontSize: '1rem'
                    }}
                  >
                    {user.name?.charAt(0) || 'U'}
                  </Avatar>
                </IconButton>
                <Typography variant="body1" sx={{ color: 'white' }}>
                  {user.name || 'User'}
                </Typography>
              </Box>
              
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
              >
                <MenuItem onClick={() => navigate('/settings')}>Account Settings</MenuItem>
                <MenuItem onClick={() => navigate('/dashboard')}>My Portfolios</MenuItem>
                <MenuItem onClick={logout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              component={Link}
              to="/login"
              variant="contained"
              color="secondary"
              startIcon={<Login />}
              sx={{
                backgroundColor: '#0891b2',
                '&:hover': { backgroundColor: '#06b6d4' }
              }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
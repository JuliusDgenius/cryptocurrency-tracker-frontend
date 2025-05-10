import { useAuth } from "../hooks/useAuth";
import { AppBar, Toolbar, IconButton, Typography, Button, Box } from "@mui/material";
import { NotificationsNone, AccountCircle, Login } from "@mui/icons-material";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <AppBar 
      position="fixed"
      sx={{ 
        backgroundColor: '#1f2937',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Toolbar>
        {/* Left side - Notification icon */}
        <IconButton color="inherit">
          <NotificationsNone sx={{ color: '#22d3ee' }} />
        </IconButton>

        {/* Center - App title */}
        <Typography 
          variant="h6" 
          component={Link} 
          to="/"
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none', 
            color: 'white',
            ml: 2 
          }}
        >
          CryptoFolio
        </Typography>

        {/* Right side - Auth/Profile section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user ? (
            <>
              <Typography variant="body1" sx={{ color: 'white' }}>
                Hello, {user.name}
              </Typography>
              <IconButton color="inherit">
                <AccountCircle sx={{ color: '#22d3ee' }} />
              </IconButton>
              <Button 
                variant="contained"
                color="secondary"
                onClick={logout}
                sx={{
                  backgroundColor: '#0891b2',
                  '&:hover': { backgroundColor: '#06b6d4' }
                }}
              >
                Logout
              </Button>
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
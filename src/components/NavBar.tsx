import { useAuth } from "../hooks/useAuth";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import {
  NotificationsNone,
  Login,
  Dashboard,
  WatchLater,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#1f2937",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            textDecoration: "none",
            color: "white",
            mr: 3,
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box component="span" sx={{ color: "#22d3ee" }}>
            Crypto
          </Box>
          Folio
        </Typography>

        {!isMobile && user && (
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
            <Button component={Link} to="/accounts" color="inherit" sx={{ mr: 2 }}>
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

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton color="inherit">
            <NotificationsNone sx={{ color: "#22d3ee" }} />
          </IconButton>

          {isMobile && user && (
            <>
              <IconButton
                edge="end"
                color="inherit"
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>

              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
              >
                <Box
                  sx={{
                    width: 240,
                    backgroundColor: "#1f2937",
                    height: "100%",
                    color: "white",
                  }}
                >
                  <List>
                    <ListItem disablePadding>
                      <Link
                        to="/dashboard"
                        onClick={() => setDrawerOpen(false)}
                        style={{
                          display: "block",
                          width: "100%",
                          textDecoration: "none",
                          color: "inherit",
                          padding: "10px 16px",
                        }}
                      >
                        <ListItemText primary="Dashboard" />
                      </Link>
                    </ListItem>

                    <ListItem disablePadding>
                      <Link
                        to="/accounts"
                        onClick={() => setDrawerOpen(false)}
                        style={{
                          display: "block",
                          width: "100%",
                          textDecoration: "none",
                          color: "inherit",
                          padding: "10px 16px",
                        }}
                      >
                        <ListItemText primary="Accounts" />
                      </Link>
                    </ListItem>

                    <ListItem disablePadding>
                      <Link
                        to="/watchlists"
                        onClick={() => setDrawerOpen(false)}
                        style={{
                          display: "block",
                          width: "100%",
                          textDecoration: "none",
                          color: "inherit",
                          padding: "10px 16px",
                        }}
                      >
                        <ListItemText primary="Watchlists" />
                      </Link>
                    </ListItem>

                    <ListItem disablePadding>
                      <div
                        role="button"
                        onClick={() => {
                          setDrawerOpen(false);
                          logout();
                        }}
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "10px 16px",
                          cursor: "pointer",
                          color: "inherit",
                          textAlign: "left",
                        }}
                      >
                        <ListItemText primary="Logout" />
                      </div>
                    </ListItem>
                  </List>
                </Box>
              </Drawer>
            </>
          )}

          {user ? (
            <>
              {!isMobile && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconButton onClick={handleMenu} size="small" sx={{ ml: 2 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: "#0891b2",
                        fontSize: "1rem",
                      }}
                    >
                      {user.name?.charAt(0) || "U"}
                    </Avatar>
                  </IconButton>
                  <Typography variant="body1" sx={{ color: "white" }}>
                    {user.name || "User"}
                  </Typography>
                </Box>
              )}

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                onClick={handleClose}
              >
                <MenuItem onClick={() => navigate("/settings")}>
                  Account Settings
                </MenuItem>
                <MenuItem onClick={() => navigate("/dashboard")}>
                  My Portfolios
                </MenuItem>
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
                backgroundColor: "#0891b2",
                "&:hover": { backgroundColor: "#06b6d4" },
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

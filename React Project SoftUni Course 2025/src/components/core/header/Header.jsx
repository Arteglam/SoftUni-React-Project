import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import ViewListIcon from '@mui/icons-material/ViewList';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LoginIcon from '@mui/icons-material/Login';
import styles from './Header.module.scss';
import authApi from '../../../api/authApi';

export default function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let unsubscribe;
    const setupAuth = () => {
        unsubscribe = authApi.onAuthStateChange((currentUser) => {
            setUser(currentUser);
        });
    };

    setupAuth();

    return () => {
        unsubscribe?.();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await authApi.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AppBar position="static" className={styles.headerContainer}>
      <Container maxWidth="xl">
        <Toolbar>
          <Box className={styles.logo}>
            <Link to="/">
              <img src="/logo.webp" alt="Logo" />
            </Link>
          </Box>

          <Typography variant="h6" className={styles.headerTitle}>
            Board Game Hub
          </Typography>

          <Box className={styles.headerNav}>
            <Button component={Link} to="/" color="inherit" startIcon={<HomeIcon />}>
              Home
            </Button>
            <Button component={Link} to="/catalog" color="inherit" startIcon={<ViewListIcon />}>
              Catalog
            </Button>
            <Button component={Link} to="/gallery" color="inherit" startIcon={<PhotoLibraryIcon />}>
              Gallery
            </Button>

            {user ? (
              <>
                <Button component={Link} to="/create" color="inherit" startIcon={<AddCircleIcon />}>
                  Create Game
                </Button>
                <Button component={Link} to="/profile" color="inherit" startIcon={<AccountCircleIcon />}>
                  {user.displayName} Profile
                </Button>
                <Button color="inherit" onClick={handleSignOut} startIcon={<LogoutIcon />}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button component={Link} to="/register" color="inherit" startIcon={<PersonAddIcon />}>
                  Register
                </Button>
                <Button component={Link} to="/login" color="inherit" startIcon={<LoginIcon />}>
                  Login
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
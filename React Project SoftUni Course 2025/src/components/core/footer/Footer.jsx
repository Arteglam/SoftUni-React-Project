import { Container, Toolbar, Typography, Box, Link as MuiLink, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import LinkIcon from '@mui/icons-material/Link';
import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footerContainer}>
      <Container maxWidth="xl">
        <Toolbar className={styles.footerContent}>
          <Typography variant="body2">
            © {new Date().getFullYear()} ArmorDude. All rights reserved.
          </Typography>
          
          <Box className={styles.footerNav}>
            <MuiLink
              href="https://boardgamegeek.com/browse/boardgame"
              target="_blank"
              rel="noopener noreferrer"
              component={Button}
              color="inherit"
              startIcon={<LinkIcon />}
            >
              BGG
            </MuiLink>
            
            <Button
              component={Link}
              to="/about"
              color="inherit"
              startIcon={<InfoIcon />}
            >
              About
            </Button>
            
            <Button
              component={Link}
              to="/contact"
              color="inherit"
              startIcon={<ContactMailIcon />}
            >
              Contact
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </footer>
  );
}
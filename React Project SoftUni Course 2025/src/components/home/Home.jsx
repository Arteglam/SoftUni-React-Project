import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardActions, 
  Typography, 
  Button, 
  AppBar, 
  Toolbar 
} from '@mui/material';
import { Link } from 'react-router-dom';
import BrowseGalleryIcon from '@mui/icons-material/BrowseGallery';
import styles from './Home.module.scss';

export default function Home() {
  return (
    <div className={styles.homeContainer}>
      <AppBar position="static" className={styles.welcomeBar}>
        <Toolbar>
          <Typography variant="h4" component="h1" align="center">
            Welcome to Board Game Hub
          </Typography>
        </Toolbar>
      </AppBar>

      <div className={styles.homeContent}>
        <Card className={styles.homeCard}>
          <CardHeader
            title={
              <Typography variant="h5" className={styles.cardTitleText}>
                Join Us! Explore, create, add and comment boardgames.
              </Typography>
            }
          />
          <img src="/logo.webp" alt="AppLogo" />
          <CardContent>
            <Typography variant="body1">
              Discover the most exciting board games and join our community of
              enthusiasts!
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button
              component={Link}
              to="/catalog"
              variant="contained"
              color="primary"
              startIcon={<BrowseGalleryIcon />}
            >
              Browse the games!
            </Button>
          </CardActions>
        </Card>
      </div>
    </div>
  );
}
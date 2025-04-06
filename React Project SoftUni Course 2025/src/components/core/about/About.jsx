import { Card, CardContent, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import styles from './About.module.scss';

export default function About() {
  return (
    <div className={styles.aboutContainer}>
      <Card className={styles.aboutCard}>
        <Typography variant="h4" component="h1" gutterBottom>
          About
        </Typography>
        <CardContent>
          <Typography paragraph>
            Welcome to ArmorDude! We are passionate about board games and aim to
            bring together a community of enthusiasts. Our platform allows you to
            discover, share, and enjoy the best board games out there.
          </Typography>
          <Typography paragraph>
            Join us and be part of an exciting journey into the world of board
            games!
          </Typography>
          <Typography>
            Don't have an account?{' '}
            <Link component={RouterLink} to="/register" color="primary">
              Register
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
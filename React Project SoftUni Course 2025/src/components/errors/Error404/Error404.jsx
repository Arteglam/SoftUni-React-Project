import { Link } from 'react-router-dom';
import { Home } from '@mui/icons-material';
import styles from './Error404.module.scss';

export default function Error404() {
    return (
        <div className={styles['error-container']}>
            <div className={styles['error-card']}>
                <h1 className={styles.title}>Error 404</h1>
                <div className={styles.content}>
                    <p>The page you are looking for does not exist.</p>
                    <img 
                        src="https://http.cat/404" 
                        alt="404 cat image" 
                        className={styles['error-image']} 
                    />
                </div>
                <div className={styles.actions}>
                    <Link to="/" className={styles.button}>
                        <Home className={styles.icon} /> Go to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
    TextField, 
    Button, 
} from '@mui/material';
import styles from './Login.module.scss';
import { useAuth } from '../../../contexts/AuthContext';
import { useUI } from '../../../contexts/UIContext';

const validationSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters long')
        .required('Password is required'),
});

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/profile';
    const { login } = useAuth();
    const { showLoading, hideLoading, showNotification } = useUI();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            showLoading();
            try {
                await login(values.email, values.password);
                showNotification('Login successful!');
                navigate(from, { replace: true });
            } catch (error) {
                console.error('Error during login:', error);
                showNotification('Login failed. Please check your credentials and try again.', 'error');
            } finally {
                hideLoading();
            }
        },
    });

    return (
        <div className={styles['login-container']}>
            <div className={styles['login-card']}>
                <h2>Login</h2>
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        id="email"
                        name="email"
                        label="Email"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                        className={styles['full-width']}
                    />

                    <TextField
                        fullWidth
                        id="password"
                        name="password"
                        label="Password"
                        type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                        className={styles['full-width']}
                    />

                    <Button 
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={styles['login-button']}
                        disabled={formik.isSubmitting}
                    >
                        Login
                    </Button>
                </form>

                <div className={styles['register-link']}>
                    <p>Don't have an account? <Link to="/register">Register</Link></p>
                </div>
            </div>
        </div>
    );
}
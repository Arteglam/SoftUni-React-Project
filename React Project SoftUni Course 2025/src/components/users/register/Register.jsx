import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
    TextField, 
    Button, 
    Snackbar, 
    Alert 
} from '@mui/material';
import styles from './Register.module.scss';
import authApi from '../../../api/authApi';

const validationSchema = Yup.object({
    displayName: Yup.string()
        .min(3, 'Username must be at least 3 characters long')
        .required('Username is required'),
    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters long')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
});

export default function Register() {
    const navigate = useNavigate();
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const formik = useFormik({
        initialValues: {
            displayName: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                // Replace with your auth service call
                await authApi.signUpWithEmailAndPassword(
                    values.email, 
                    values.password, 
                    values.displayName
                );
                
                setSnackbar({
                    open: true,
                    message: 'Registration successful!',
                    severity: 'success'
                });
                
                navigate('/profile');
            } catch (error) {
                console.error('Error during registration:', error);
                setSnackbar({
                    open: true,
                    message: 'Registration failed. Please try again.',
                    severity: 'error'
                });
            }
        },
    });

    const handleSnackbarClose = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <div className={styles['register-container']}>
            <div className={styles['register-card']}>
                <h2>Register</h2>
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        id="displayName"
                        name="displayName"
                        label="Username"
                        value={formik.values.displayName}
                        onChange={formik.handleChange}
                        error={formik.touched.displayName && Boolean(formik.errors.displayName)}
                        helperText={formik.touched.displayName && formik.errors.displayName}
                        className={styles['full-width']}
                    />

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

                    <TextField
                        fullWidth
                        id="confirmPassword"
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                        helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                        className={styles['full-width']}
                    />

                    <Button 
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={styles['register-button']}
                    >
                        Register
                    </Button>
                </form>

                <div className={styles['login-link']}>
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                </div>

                <Snackbar 
                    open={snackbar.open} 
                    autoHideDuration={3000} 
                    onClose={handleSnackbarClose}
                >
                    <Alert 
                        onClose={handleSnackbarClose} 
                        severity={snackbar.severity}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </div>
        </div>
    );
}
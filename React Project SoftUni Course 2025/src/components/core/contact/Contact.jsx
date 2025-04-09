import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
    Card, 
    CardContent, 
    TextField, 
    Button, 
    Typography, 
    Box
} from '@mui/material';
import styles from './Contact.module.scss';
import authApi from '../../../api/authApi';
import { useUI } from '../../../contexts/UIContext';

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    message: Yup.string().required('Message is required')
});

export default function Contact() {
    const navigate = useNavigate();
    const { showLoading, hideLoading, showNotification } = useUI();

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            message: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            showLoading();
            try {
                await authApi.saveContactForm({
                    ...values,
                    createdAt: new Date()
                });
                showNotification('Thank you for contacting us. We will reach out to you soon!', 'success');
                resetForm();
                setTimeout(() => {
                    navigate('/');
                }, 3000);
            } catch (error) {
                console.error('Error submitting form:', error);
                showNotification('Error submitting form. Please try again.', 'error');
            } finally {
                hideLoading();
                setSubmitting(false);
            }
        }
    });

    return (
        <Box className={styles.contactContainer}>
            <Card className={styles.contactCard}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Contact Us
                </Typography>
                <CardContent>
                    <form onSubmit={formik.handleSubmit}>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Message"
                            name="message"
                            multiline
                            rows={4}
                            value={formik.values.message}
                            onChange={formik.handleChange}
                            error={formik.touched.message && Boolean(formik.errors.message)}
                            helperText={formik.touched.message && formik.errors.message}
                            margin="normal"
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            size="large"
                            sx={{ mt: 2 }}
                            disabled={formik.isSubmitting}
                        >
                            Submit
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
}
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Snackbar,
    Alert
} from '@mui/material';
import styles from './GameCreate.module.scss';
import authApi from '../../../api/authApi';
import gameApi from '../../../api/gameApi';

const validationSchema = Yup.object({
    title: Yup.string()
        .required('Title is required')
        .max(70, 'Title too long'),
    year: Yup.number()
        .required('Year is required')
        .min(1975, 'Year must be at least 1975'),
    designer: Yup.string()
        .required('Designer is required')
        .max(70, 'Designer name too long'),
    artist: Yup.string()
        .required('Artist is required')
        .max(70, 'Artist name too long'),
    publisher: Yup.string()
        .required('Publisher is required')
        .max(70, 'Publisher name too long'),
    rating: Yup.number()
        .required('Rating is required')
        .min(1, 'Rating must be at least 1')
        .max(10, 'Rating cannot be more than 10'),
    category: Yup.string()
        .required('Category is required')
        .max(70, 'Category too long'),
    description: Yup.string()
        .required('Description is required')
        .max(100, 'Description too long'),
    image: Yup.string()
        .required('Image URL is required')
        .matches(
            /^https?:\/\/.+/,
            'URL must start with "http://" or "https://"'
        )
});

export default function GameCreate() {
    const [user, setUser] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = authApi.onAuthStateChange((currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    const formik = useFormik({
        initialValues: {
            title: '',
            year: '',
            designer: '',
            artist: '',
            publisher: '',
            rating: '',
            category: '',
            description: '',
            image: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            if (user) {
                try {
                    await gameApi.createGame(values, user.uid, user.displayName);
                    setSnackbar({
                        open: true,
                        message: 'Game created successfully!',
                        severity: 'success'
                    });
                    setTimeout(() => {
                        navigate('/catalog');
                    }, 2000);
                } catch (error) {
                    console.error('Error creating game:', error);
                    setSnackbar({
                        open: true,
                        message: 'Error creating game. Please try again.',
                        severity: 'error'
                    });
                }
            }
        }
    });

    const handleSnackbarClose = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <div className={styles['create-game-container']}>
            <Card className={styles['create-game-card']}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Create New Game
                </Typography>
                <CardContent>
                    <form onSubmit={formik.handleSubmit}>
                        <TextField
                            fullWidth
                            id="title"
                            name="title"
                            label="Title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={formik.touched.title && formik.errors.title}
                            className={styles['full-width']}
                            margin="normal"
                        />

                        <TextField
                            fullWidth
                            id="year"
                            name="year"
                            label="Year"
                            type="number"
                            value={formik.values.year}
                            onChange={formik.handleChange}
                            error={formik.touched.year && Boolean(formik.errors.year)}
                            helperText={formik.touched.year && formik.errors.year}
                            className={styles['full-width']}
                            margin="normal"
                        />

                        <TextField
                            fullWidth
                            id="designer"
                            name="designer"
                            label="Designer"
                            value={formik.values.designer}
                            onChange={formik.handleChange}
                            error={formik.touched.designer && Boolean(formik.errors.designer)}
                            helperText={formik.touched.designer && formik.errors.designer}
                            className={styles['full-width']}
                            margin="normal"
                        />

                        <TextField
                            fullWidth
                            id="artist"
                            name="artist"
                            label="Artist"
                            value={formik.values.artist}
                            onChange={formik.handleChange}
                            error={formik.touched.artist && Boolean(formik.errors.artist)}
                            helperText={formik.touched.artist && formik.errors.artist}
                            className={styles['full-width']}
                            margin="normal"
                        />

                        <TextField
                            fullWidth
                            id="publisher"
                            name="publisher"
                            label="Publisher"
                            value={formik.values.publisher}
                            onChange={formik.handleChange}
                            error={formik.touched.publisher && Boolean(formik.errors.publisher)}
                            helperText={formik.touched.publisher && formik.errors.publisher}
                            className={styles['full-width']}
                            margin="normal"
                        />

                        <TextField
                            fullWidth
                            id="rating"
                            name="rating"
                            label="Rating"
                            type="number"
                            value={formik.values.rating}
                            onChange={formik.handleChange}
                            error={formik.touched.rating && Boolean(formik.errors.rating)}
                            helperText={formik.touched.rating && formik.errors.rating}
                            className={styles['full-width']}
                            margin="normal"
                            inputProps={{ min: 1, max: 10 }}
                        />

                        <TextField
                            fullWidth
                            id="category"
                            name="category"
                            label="Category"
                            value={formik.values.category}
                            onChange={formik.handleChange}
                            error={formik.touched.category && Boolean(formik.errors.category)}
                            helperText={formik.touched.category && formik.errors.category}
                            className={styles['full-width']}
                            margin="normal"
                        />

                        <TextField
                            fullWidth
                            id="description"
                            name="description"
                            label="Description"
                            multiline
                            rows={4}
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                            className={styles['full-width']}
                            margin="normal"
                        />

                        <TextField
                            fullWidth
                            id="image"
                            name="image"
                            label="Image URL"
                            value={formik.values.image}
                            onChange={formik.handleChange}
                            error={formik.touched.image && Boolean(formik.errors.image)}
                            helperText={formik.touched.image && formik.errors.image}
                            className={styles['full-width']}
                            margin="normal"
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={styles['save-button']}
                            disabled={!formik.isValid || formik.isSubmitting}
                        >
                            Create Game
                        </Button>
                    </form>
                </CardContent>
            </Card>

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
    );
}
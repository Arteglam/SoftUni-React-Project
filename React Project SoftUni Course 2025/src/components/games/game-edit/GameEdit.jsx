import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Box,
    Snackbar,
    Alert
} from '@mui/material';
import styles from './GameEdit.module.scss';
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

export default function GameEdit() {
    const { id: gameId } = useParams();
    const navigate = useNavigate();
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

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
            try {
                await gameApi.updateGame(gameId, values);
                setSnackbar({
                    open: true,
                    message: 'Game updated successfully!',
                    severity: 'success'
                });
                setTimeout(() => {
                    navigate(`/details/${gameId}`);
                }, 2000);
            } catch (error) {
                console.error('Error updating game:', error);
                setSnackbar({
                    open: true,
                    message: 'Error updating game. Please try again.',
                    severity: 'error'
                });
            }
        }
    });

    useEffect(() => {
        loadGameDetails();
    }, [gameId]);

    const loadGameDetails = async () => {
        try {
            const game = await gameApi.getGameById(gameId);
            if (game) {
                formik.setValues({
                    title: game.title || '',
                    year: game.year || '',
                    designer: game.designer || '',
                    artist: game.artist || '',
                    publisher: game.publisher || '',
                    rating: game.rating || '',
                    category: game.category || '',
                    description: game.description || '',
                    image: game.image || ''
                });
            }
        } catch (error) {
            console.error('Error loading game details:', error);
            setSnackbar({
                open: true,
                message: 'Error loading game details',
                severity: 'error'
            });
        }
    };

    const handleDelete = async () => {
        try {
            await gameApi.deleteGame(gameId);
            setSnackbar({
                open: true,
                message: 'Game deleted successfully!',
                severity: 'success'
            });
            setTimeout(() => {
                navigate('/catalog');
            }, 2000);
        } catch (error) {
            console.error('Error deleting game:', error);
            setSnackbar({
                open: true,
                message: 'Error deleting game',
                severity: 'error'
            });
        }
    };

    const handleSnackbarClose = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <div className={styles['edit-container']}>
            <Card className={styles['edit-card']}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Edit Game
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
                        />

                        <Box className={styles['button-group']}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                            >
                                Save
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleDelete}
                            >
                                Delete
                            </Button>
                        </Box>
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
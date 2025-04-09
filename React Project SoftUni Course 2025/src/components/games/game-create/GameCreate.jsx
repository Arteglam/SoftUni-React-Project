import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
} from '@mui/material';
import styles from './GameCreate.module.scss';
import { useAuth } from '../../../contexts/AuthContext';
import { useGames } from '../../../contexts/GamesContext';
import { useUI } from '../../../contexts/UIContext';

const validationSchema = Yup.object({
    title: Yup.string()
        .required('Title is required')
        .max(70, 'Title too long'),
    year: Yup.number()
        .required('Year is required')
        .min(1975, 'Year must be at least 1975')
        .max(2050, 'Year cannot be more than 2050'),
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
    const navigate = useNavigate();
    const { user } = useAuth();
    const { createGame } = useGames();
    const { showLoading, hideLoading, showNotification } = useUI();

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
        validateOnChange: true, // Enable validation as user types
        validateOnBlur: true,   // Also validate when field loses focus
        onSubmit: async (values) => {
            if (user) {
                showLoading();
                try {
                    await createGame(values, user.uid, user.displayName);
                    showNotification('Game created successfully!');
                    setTimeout(() => {
                        navigate('/catalog');
                    }, 2000);
                } catch (error) {
                    console.error('Error creating game:', error);
                    showNotification('Error creating game. Please try again.', 'error');
                } finally {
                    hideLoading();
                }
            }
        }
    });

    // This function helps check if we should show an error for a field
    const shouldShowError = (fieldName) => {
        // Show error if field was touched OR if user has started typing in it
        return (formik.touched[fieldName] || formik.values[fieldName] !== '') && Boolean(formik.errors[fieldName]);
    };

    // Get helper text for a field
    const getHelperText = (fieldName) => {
        // Show error message if we should show error, otherwise show empty string
        return shouldShowError(fieldName) ? formik.errors[fieldName] : '';
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
                            onBlur={formik.handleBlur}
                            error={shouldShowError('title')}
                            helperText={getHelperText('title')}
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
                            onBlur={formik.handleBlur}
                            error={shouldShowError('year')}
                            helperText={getHelperText('year')}
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
                            onBlur={formik.handleBlur}
                            error={shouldShowError('designer')}
                            helperText={getHelperText('designer')}
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
                            onBlur={formik.handleBlur}
                            error={shouldShowError('artist')}
                            helperText={getHelperText('artist')}
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
                            onBlur={formik.handleBlur}
                            error={shouldShowError('publisher')}
                            helperText={getHelperText('publisher')}
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
                            onBlur={formik.handleBlur}
                            error={shouldShowError('rating')}
                            helperText={getHelperText('rating')}
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
                            onBlur={formik.handleBlur}
                            error={shouldShowError('category')}
                            helperText={getHelperText('category')}
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
                            onBlur={formik.handleBlur}
                            error={shouldShowError('description')}
                            helperText={getHelperText('description')}
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
                            onBlur={formik.handleBlur}
                            error={shouldShowError('image')}
                            helperText={getHelperText('image')}
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
        </div>
    );
}
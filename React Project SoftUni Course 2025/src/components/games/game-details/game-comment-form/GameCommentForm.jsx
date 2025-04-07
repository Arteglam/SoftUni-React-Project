import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    TextField,
    Button,
    Box,
    Typography
} from '@mui/material';
import styles from './GameCommentForm.module.scss';
import authApi from '../../../../api/authApi';
import commentsApi from '../../../../api/commentsApi';
import gameApi from '../../../../api/gameApi';
import { Timestamp } from 'firebase/firestore';

const validationSchema = Yup.object({
    text: Yup.string()
        .max(200, 'Comment cannot be more than 200 characters')
        .required('Comment is required')
});

export default function GameCommentForm({ gameId, loadComments }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        let unsubscribe;
        const setupAuth = () => {
            unsubscribe = authApi.onAuthStateChange((currentUser) => {
                setUser(currentUser);
            });
        };

        setupAuth();

        return () => {
            unsubscribe?.();
        };
    }, []);

    const formik = useFormik({
        initialValues: {
            text: ''
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            if (user) {
                try {
                    const commentData = {
                        text: values.text,
                        userId: user.uid,
                        userName: user.displayName || 'Anonymous',
                        gameId,
                        createdAt: Timestamp.now()
                    };
                    await commentsApi.addComment(gameId, commentData);
                    resetForm();
                    const updatedComments = await loadComments(); // Get fresh comments
                    if (typeof loadComments === 'function') {
                        loadComments(updatedComments); // Pass updated comments back
                    }
                } catch (error) {
                    console.error('Error submitting comment:', error);
                }
            }
        }
    });

    if (!user) {
        return (
            <div className={styles['login-prompt']}>
                <Typography>Log in to comment</Typography>
                <Link to="/login">Log in</Link>
            </div>
        );
    }

    return (
        <div className={styles['comment-form-container']}>
            <form onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    name="text"
                    label="Add a comment"
                    value={formik.values.text}
                    onChange={formik.handleChange}
                    error={formik.touched.text && Boolean(formik.errors.text)}
                    helperText={formik.touched.text && formik.errors.text}
                    className={styles['full-width']}
                />
                <Box mt={2} display="flex" gap={1}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                    >
                        Post Comment
                    </Button>
                </Box>
            </form>
        </div>
    );
}
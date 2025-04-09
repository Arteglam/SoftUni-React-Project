import { useState } from 'react';
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
import commentsApi from '../../../../api/commentsApi';
import { Timestamp } from 'firebase/firestore';
import { useAuth } from '../../../../contexts/AuthContext';
import { useUI } from '../../../../contexts/UIContext';

const validationSchema = Yup.object({
    text: Yup.string()
        .max(200, 'Comment cannot be more than 200 characters')
        .required('Comment is required')
});

export default function GameCommentForm({ gameId, refreshComments }) {
    const { user, isAuthenticated } = useAuth();
    const { showError } = useUI();

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
                    
                    if (refreshComments) {
                        await refreshComments();
                    }
                } catch (error) {
                    console.error('Error submitting comment:', error);
                    showError('Failed to submit comment. Please try again.');
                }
            }
        }
    });

    if (!isAuthenticated) {
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
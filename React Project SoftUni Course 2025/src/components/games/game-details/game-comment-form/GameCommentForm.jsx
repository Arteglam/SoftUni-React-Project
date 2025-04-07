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

const validationSchema = Yup.object({
    text: Yup.string()
        .max(200, 'Comment cannot be more than 200 characters')
        .required('Comment is required')
});

export default function GameCommentForm({ gameId, editingComment = null, onCommentUpdated, onEditingCleared }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = authApi.onAuthStateChange((currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (editingComment) {
            formik.setFieldValue('text', editingComment.text);
        }
    }, [editingComment]);

    const formik = useFormik({
        initialValues: {
            text: ''
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            if (user) {
                try {
                    if (editingComment) {
                        await commentsApi.updateComment(gameId, editingComment.id, values.text);
                        onCommentUpdated?.(values.text);
                        onEditingCleared?.();
                    } else {
                        const commentData = {
                            id: gameApi.generateId(),
                            text: values.text,
                            userId: user.uid,
                            userName: user.displayName || 'Anonymous',
                            gameId,
                            createdAt: new Date()
                        };
                        await commentsApi.addComment(gameId, commentData);
                    }
                    resetForm();
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
                        {editingComment ? 'Update Comment' : 'Post Comment'}
                    </Button>
                    {editingComment && (
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => {
                                formik.resetForm();
                                onEditingCleared?.();
                            }}
                        >
                            Cancel
                        </Button>
                    )}
                </Box>
            </form>
        </div>
    );
}
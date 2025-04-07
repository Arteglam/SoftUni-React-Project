import { useState, useEffect } from 'react';
import { 
    Typography,
    TextField,
    Button,
    Pagination,
    Box,
    Alert
} from '@mui/material';
import authApi from '../../../../api/authApi';
import commentsApi from '../../../../api/commentsApi';
import { formatElapsedTime } from '../../../../utils/timeUtils';
import styles from './GameComments.module.scss';

export default function GameComments({ gameId, loadComments }) {
    const [comments, setComments] = useState([]);
    const [user, setUser] = useState(null);
    const [editingComment, setEditingComment] = useState(null);
    const [editText, setEditText] = useState('');
    const [page, setPage] = useState(1);
    const [error, setError] = useState(null);
    const [paginatedComments, setPaginatedComments] = useState([]);
    const pageSize = 5;

    const refreshComments = async () => {
        const newComments = await loadComments();
        setComments(newComments);
        paginateComments(newComments, 1);
    };

    useEffect(() => {
        refreshComments();
        
        const unsubscribe = authApi.onAuthStateChange((currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, [gameId]);

    const paginateComments = (commentsArray, currentPage) => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        setPaginatedComments(commentsArray.slice(startIndex, endIndex));
    };

    const handlePageChange = (event, value) => {
        setPage(value);
        paginateComments(comments, value);
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await commentsApi.deleteComment(gameId, commentId);
            await refreshComments(); // Refresh comments after deletion
            setError(null);
        } catch (err) {
            setError('Failed to delete comment');
            console.error('Error deleting comment:', err);
        }
    };

    const handleUpdateComment = async () => {
        if (!editingComment) return;
        
        try {
            await commentsApi.updateComment(gameId, editingComment.id, editText);
            await refreshComments(); // Refresh immediately after update
            setEditingComment(null);
            setEditText('');
        } catch (err) {
            setError('Failed to update comment');
            console.error('Error updating comment:', err);
        }
    };

    return (
        <div className={styles['comments-container']}>
            <Typography variant="h5" component="h2" gutterBottom>
                Comments
            </Typography>

            {error && (
                <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <div className={styles['comments-list']}>
                {paginatedComments.map((comment) => (
                    <div key={comment.id} className={styles['comment-item']}>
                        <Typography>
                            <strong>{comment.userName}</strong> ({formatElapsedTime(comment.createdAt)})
                        </Typography>
                        
                        {editingComment?.id === comment.id ? (
                            <Box>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    className={styles['edit-textarea']}
                                />
                                <Box className={styles['comment-actions']}>
                                    <Button onClick={handleUpdateComment}>Save</Button>
                                    <Button onClick={() => {
                                        setEditingComment(null);
                                        setEditText('');
                                    }}>Cancel</Button>
                                </Box>
                            </Box>
                        ) : (
                            <Box>
                                <Typography className={styles['comment-text']}>
                                    {comment.text}
                                </Typography>
                                {user?.uid === comment.userId && (
                                    <Box className={styles['comment-actions']}>
                                        <Button onClick={() => handleDeleteComment(comment.id)}>
                                            Delete
                                        </Button>
                                        <Button onClick={() => {
                                            setEditingComment(comment);
                                            setEditText(comment.text);
                                        }}>
                                            Edit
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        )}
                    </div>
                ))}
            </div>

            {comments.length > pageSize && (
                <Box mt={2} display="flex" justifyContent="center">
                    <Pagination
                        count={Math.ceil(comments.length / pageSize)}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            )}
        </div>
    );
}
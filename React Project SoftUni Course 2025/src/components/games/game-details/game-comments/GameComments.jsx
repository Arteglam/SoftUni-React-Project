import { useState, useEffect } from 'react';
import { 
    Typography,
    TextField,
    Button,
    Pagination,
    Box,
} from '@mui/material';
import commentsApi from '../../../../api/commentsApi';
import { formatElapsedTime } from '../../../../utils/timeUtils';
import styles from './GameComments.module.scss';
import { useAuth } from '../../../../contexts/AuthContext';
import { useUI } from '../../../../contexts/UIContext';

export default function GameComments({ gameId, loadComments, comments }) {
    const [editingComment, setEditingComment] = useState(null);
    const [editText, setEditText] = useState('');
    const [page, setPage] = useState(1);
    const [paginatedComments, setPaginatedComments] = useState([]);
    const pageSize = 5;

    const { user } = useAuth();
    const { showError } = useUI();

    const paginateComments = (commentsArray, currentPage) => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        setPaginatedComments(commentsArray.slice(startIndex, endIndex));
    };

    useEffect(() => {
        paginateComments(comments, page);
    }, [comments, page]);

    const handlePageChange = (event, value) => {
        setPage(value);
        paginateComments(comments, value);
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await commentsApi.deleteComment(gameId, commentId);
            // Refresh comments after deletion
            await loadComments();
        } catch (err) {
            showError('Failed to delete comment');
            console.error('Error deleting comment:', err);
        }
    };

    const handleUpdateComment = async () => {
        if (!editingComment) return;
        
        try {
            await commentsApi.updateComment(gameId, editingComment.id, editText);
            // Refresh comments after update
            await loadComments();
            setEditingComment(null);
            setEditText('');
        } catch (err) {
            showError('Failed to update comment');
            console.error('Error updating comment:', err);
        }
    };

    return (
        <div className={styles['comments-container']}>
            <Typography variant="h5" component="h2" gutterBottom>
                Comments
            </Typography>

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
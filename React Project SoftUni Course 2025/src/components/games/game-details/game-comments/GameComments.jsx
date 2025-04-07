import { useState, useEffect } from 'react';
import { 
    Typography,
    TextField,
    Button,
    Pagination,
    Box
} from '@mui/material';
import authApi from '../../../../api/authApi';
import commentsApi from '../../../../api/commentsApi';
import { formatElapsedTime } from '../../../../utils/timeUtils';
import styles from './GameComments.module.scss';

export default function GameComments({ gameId }) {
    const [comments, setComments] = useState([]);
    const [paginatedComments, setPaginatedComments] = useState([]);
    const [user, setUser] = useState(null);
    const [editingComment, setEditingComment] = useState(null);
    const [editText, setEditText] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        const unsubscribe = authApi.onAuthStateChange((currentUser) => {
            setUser(currentUser);
        });

        loadComments();

        return () => unsubscribe();
    }, [gameId]);

    const loadComments = async () => {
        try {
            const fetchedComments = await commentsApi.getComments(gameId);
            setComments(fetchedComments);
            paginateComments(fetchedComments, page);
        } catch (error) {
            console.error('Error loading comments:', error);
        }
    };

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
        if (user) {
            try {
                await commentsApi.deleteComment(gameId, commentId);
                const updatedComments = comments.filter(comment => comment.id !== commentId);
                setComments(updatedComments);
                paginateComments(updatedComments, page);
            } catch (error) {
                console.error('Error deleting comment:', error);
            }
        }
    };

    const handleEditComment = (comment) => {
        setEditingComment(comment);
        setEditText(comment.text);
    };

    const handleUpdateComment = async () => {
        if (user && editingComment) {
            try {
                await commentsApi.updateComment(gameId, editingComment.id, editText);
                const updatedComments = comments.map(comment => 
                    comment.id === editingComment.id 
                        ? { ...comment, text: editText }
                        : comment
                );
                setComments(updatedComments);
                paginateComments(updatedComments, page);
                setEditingComment(null);
                setEditText('');
            } catch (error) {
                console.error('Error updating comment:', error);
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingComment(null);
        setEditText('');
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
                                <Button onClick={handleUpdateComment}>Save</Button>
                                <Button onClick={handleCancelEdit}>Cancel</Button>
                            </Box>
                        ) : (
                            <Box>
                                <Typography className={styles['comment-text']}>
                                    {comment.text}
                                </Typography>
                                {comment.userId === user?.uid && (
                                    <Box>
                                        <Button onClick={() => handleDeleteComment(comment.id)}>
                                            Delete
                                        </Button>
                                        <Button onClick={() => handleEditComment(comment)}>
                                            Edit
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        )}
                    </div>
                ))}
            </div>

            <Box mt={2}>
                <Pagination
                    count={Math.ceil(comments.length / pageSize)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>
        </div>
    );
}
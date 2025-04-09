import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    CircularProgress,
    Box,
} from '@mui/material';
import {
    CalendarToday,
    Person,
    Brush,
    Business,
    Star,
    Category,
    Description,
    Edit,
    Delete
} from '@mui/icons-material';
import gameApi from '../../../api/gameApi';
import authApi from '../../../api/authApi';
import commentsApi from '../../../api/commentsApi';
import GameComments from './game-comments/GameComments';
import GameCommentForm from './game-comment-form/GameCommentForm';
import ConfirmDeleteDialog from '../../shared/ConfirmDeleteDialog/ConfirmDeleteDialog';
import styles from './GameDetails.module.scss';

export default function GameDetails() {
    const [game, setGame] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingComment, setEditingComment] = useState(null);
    const [comments, setComments] = useState([]); // Add this line
    const { id: gameId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        let unsubscribe;
        const setupAuth = async () => {
            unsubscribe = authApi.onAuthStateChange((currentUser) => {
                setUser(currentUser);
            });
            await loadGameDetails();
            await loadComments(); // Add this line
        };
        
        setupAuth();
        
        return () => {
            unsubscribe?.();
        };
    }, [gameId]);

    const loadGameDetails = async () => {
        try {
            const gameData = await gameApi.getGameById(gameId);
            setGame(gameData);
        } catch (error) {
            console.error('Error loading game details:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadComments = async () => {
        try {
            const commentsData = await commentsApi.getComments(gameId);
            setComments(commentsData); // Update comments state
            return commentsData;
        } catch (error) {
            console.error('Error loading comments:', error);
            setComments([]); // Set empty array on error
            return [];
        }
    };

    const refreshComments = async () => {
        await loadComments();
    };

    const handleDeleteClick = () => {
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await gameApi.deleteGame(gameId);
            navigate('/catalog');
        } catch (error) {
            console.error('Error deleting game:', error);
        }
        setDeleteDialogOpen(false);
    };

    const handleEditClick = () => {
        navigate(`/edit/${gameId}`);
    };

    const isCreator = () => {
        return user && game && user.uid === game.userId;
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (!game) {
        return (
            <Typography variant="h6" align="center">
                Game not found
            </Typography>
        );
    }

    return (
        <div className={styles['details-container']}>
            <div className={styles['comments-section']}>
                <GameComments 
                    gameId={gameId} 
                    loadComments={loadComments}
                    comments={comments} // Pass comments state
                />
            </div>

            <div className={styles['details-section']}>
                <Card className={styles['details-card']}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        {game.title}
                    </Typography>
                    <CardContent>
                        <Typography>
                            <CalendarToday fontSize="small" /> <strong>Year:</strong> {game.year}
                        </Typography>
                        <Typography>
                            <Person fontSize="small" /> <strong>Designer:</strong> {game.designer}
                        </Typography>
                        <Typography>
                            <Brush fontSize="small" /> <strong>Artist:</strong> {game.artist}
                        </Typography>
                        <Typography>
                            <Business fontSize="small" /> <strong>Publisher:</strong> {game.publisher}
                        </Typography>
                        <Typography>
                            <Star fontSize="small" /> <strong>Rating:</strong> {game.rating}
                        </Typography>
                        <Typography>
                            <Category fontSize="small" /> <strong>Category:</strong> {game.category}
                        </Typography>
                        <Typography>
                            <Description fontSize="small" /> {game.description}
                        </Typography>
                        <img src={game.image} alt={game.title} className={styles['game-image']} />
                    </CardContent>
                    {isCreator() && (
                        <CardActions>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleEditClick}
                                startIcon={<Edit />}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleDeleteClick}
                                startIcon={<Delete />}
                            >
                                Delete
                            </Button>
                        </CardActions>
                    )}
                </Card>
            </div>

            <div className={styles['comment-form-section']}>
                <GameCommentForm 
                    gameId={gameId}
                    loadComments={loadComments}
                    onEditingCleared={() => setEditingComment(null)}
                    refreshComments={refreshComments} // Pass refresh function
                />
            </div>

            <ConfirmDeleteDialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
}
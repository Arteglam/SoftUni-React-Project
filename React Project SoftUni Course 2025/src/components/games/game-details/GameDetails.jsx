import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Box,
    CircularProgress
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
import commentsApi from '../../../api/commentsApi';
import GameComments from './game-comments/GameComments';
import GameCommentForm from './game-comment-form/GameCommentForm';
import ConfirmDeleteDialog from '../../shared/ConfirmDeleteDialog/ConfirmDeleteDialog';
import styles from './GameDetails.module.scss';
import { useAuth } from '../../../contexts/AuthContext';
import { useGames } from '../../../contexts/GamesContext';
import { useUI } from '../../../contexts/UIContext';

export default function GameDetails() {
    const [comments, setComments] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingComment, setEditingComment] = useState(null);
    const [game, setGame] = useState(null);
    const [localLoading, setLocalLoading] = useState(true); // Add local loading state
    
    const { id: gameId } = useParams();
    const navigate = useNavigate();
    
    const { user, isAuthenticated } = useAuth();
    const { getGameById, deleteGame } = useGames();
    const { showError, showNotification } = useUI();

    useEffect(() => {
        let isMounted = true; // Add mounted flag to prevent state updates after unmount
        
        const loadData = async () => {
            setLocalLoading(true);
            try {
                const gameData = await getGameById(gameId);
                
                // Check if component is still mounted and if gameData exists
                if (!isMounted) return;
                
                // Check if gameData is actually returned
                if (!gameData) {
                    throw new Error('Game not found');
                }
                
                setGame(gameData);
                await loadComments();
            } catch (error) {
                console.error('Error loading data:', error);
                showError('Error loading game details');
                // Navigate back to catalog if game cannot be loaded
                navigate('/catalog');
            } finally {
                if (isMounted) {
                    setLocalLoading(false);
                }
            }
        };
        
        loadData();
        
        // Cleanup function to prevent state updates after unmount
        return () => {
            isMounted = false;
        };
    }, [gameId]); // Remove unnecessary dependencies

    const loadComments = async () => {
        try {
            const commentsData = await commentsApi.getComments(gameId);
            setComments(commentsData);
            return commentsData;
        } catch (error) {
            console.error('Error loading comments:', error);
            showError('Error loading comments');
            setComments([]);
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
        setLocalLoading(true);
        try {
            await deleteGame(gameId);
            showNotification('Game deleted successfully');
            navigate('/catalog');
        } catch (error) {
            console.error('Error deleting game:', error);
            showError('Error deleting game');
        } finally {
            setLocalLoading(false);
            setDeleteDialogOpen(false);
        }
    };

    const handleEditClick = () => {
        navigate(`/edit/${gameId}`);
    };

    const isCreator = () => {
        return isAuthenticated && game && user.uid === game.userId;
    };

    // Change the loading indicator to use local state
    if (localLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (!game) {
        return null;
    }

    return (
        <div className={styles['details-container']}>
            <div className={styles['comments-section']}>
                <GameComments 
                    gameId={gameId} 
                    loadComments={loadComments}
                    comments={comments}
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
                    refreshComments={refreshComments}
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
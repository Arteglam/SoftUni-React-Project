import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardContent,
    Typography,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress
} from '@mui/material';
import {
    Games as GamesIcon,
    AccountCircle,
    Person,
    Email,
    AttachFile,
    CloudUpload,
    Close
} from '@mui/icons-material';
import styles from './Profile.module.scss';
import authApi from '../../../api/authApi';
import { useAuth } from '../../../contexts/AuthContext';
import { useUI } from '../../../contexts/UIContext';

// Remove Game Dialog Component
function RemoveGameDialog({ open, onClose, onConfirm }) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirm Removal</DialogTitle>
            <DialogContent>
                Are you sure you want to remove this game from your profile?
            </DialogContent>
            <DialogActions className={styles['dialog-actions']}>
                <Button onClick={onConfirm}>Remove</Button>
                <Button onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}

export default function Profile() {
    const [userGames, setUserGames] = useState([]);
    const [gameToRemove, setGameToRemove] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    
    const navigate = useNavigate();
    const { user, userProfile, loading } = useAuth();
    const { showLoading, hideLoading, showNotification } = useUI();

    useEffect(() => {
        if (user) {
            loadUserGames(user.uid);
        }
    }, [user]);

    const loadUserGames = async (userId) => {
        showLoading();
        try {
            const games = await authApi.getUserGames(userId);
            setUserGames(games);
        } catch (error) {
            console.error('Error loading user games:', error);
            showNotification('Error loading games', 'error');
        } finally {
            hideLoading();
        }
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
            const maxSize = 5 * 1024 * 1024; // 5 MB

            if (!validTypes.includes(file.type)) {
                setErrorMessage('Invalid file type. Please select an image file (jpeg, png, gif).');
                setSelectedFile(null);
            } else if (file.size > maxSize) {
                setErrorMessage('File size exceeds the limit of 5 MB.');
                setSelectedFile(null);
            } else {
                setErrorMessage(null);
                setSelectedFile(file);
            }
        }
    };

    const uploadProfileImage = async () => {
        if (user && selectedFile) {
            setImageLoading(true);
            showLoading();
            try {
                // Generate a unique filename
                const downloadURL = await authApi.uploadProfileImage(user.uid, selectedFile);
                
                // Update user profile with new image URL
                await authApi.updateUserProfile(user.uid, { 
                    profileImageUrl: downloadURL,
                    updatedAt: new Date()
                });
                
                setSelectedFile(null);
                showNotification('Profile image uploaded successfully!', 'success');
            } catch (error) {
                console.error('Error uploading profile image:', error);
                showNotification(
                    error.message || 'Error uploading profile image. Please try again.', 
                    'error'
                );
            } finally {
                setImageLoading(false);
                hideLoading();
            }
        }
    };

    const confirmRemoveGame = (game) => {
        setGameToRemove(game);
        setDialogOpen(true);
    };

    const handleRemoveGame = async () => {
        if (user && gameToRemove) {
            showLoading();
            try {
                await authApi.removeGameFromUserProfile(user.uid, gameToRemove._id);
                await loadUserGames(user.uid);
                showNotification('Game removed successfully', 'success');
            } catch (error) {
                console.error('Error removing game:', error);
                showNotification('Error removing game', 'error');
            } finally {
                setGameToRemove(null);
                setDialogOpen(false);
                hideLoading();
            }
        }
    };

    const goToDetails = (gameId) => {
        navigate(`/details/${gameId}`);
    };

    if (loading) {
        return null; // UI Context handles the loading indicator
    }

    return (
        <div className={styles['profile-page-container']}>
            <div className={styles['content-container']}>
                <Card className={styles['user-games-card']}>
                    <Typography variant="h5">
                        <GamesIcon /> Your Favorite Games
                    </Typography>
                    <CardContent>
                        <div className={styles['games-list']}>
                            {userGames.map((game) => (
                                <div key={game._id} className={styles['game-item']}>
                                    <div className={styles['game-image-container']}>
                                        <img
                                            src={game.image}
                                            alt={game.title}
                                            className={styles['game-image']}
                                            onError={(e) => {
                                                e.target.src = '/fallback-image.png';
                                            }}
                                            onClick={() => goToDetails(game._id)}
                                        />
                                        <div
                                            className={styles.overlay}
                                            onClick={() => goToDetails(game._id)}
                                        >
                                            <span className={styles['overlay-text']}>Details</span>
                                        </div>
                                        <IconButton
                                            className={styles['remove-button']}
                                            onClick={() => confirmRemoveGame(game)}
                                        >
                                            <Close />
                                        </IconButton>
                                    </div>
                                    <Typography>{game.title}</Typography>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className={styles['profile-card']}>
                    <Typography variant="h5">
                        <AccountCircle /> User Profile
                    </Typography>
                    <CardContent>
                        <div className={styles['profile-image-container']}>
                            {userProfile?.profileImageUrl && !imageLoading && (
                                <img
                                    src={userProfile.profileImageUrl}
                                    alt="Profile"
                                    className={styles['profile-image']}
                                />
                            )}
                            {imageLoading && (
                                <div className={styles['image-loader']}>
                                    <CircularProgress />
                                </div>
                            )}
                            <div className={styles['file-input-container']}>
                                <input
                                    type="file"
                                    id="fileInput"
                                    onChange={handleFileSelect}
                                    hidden
                                />
                                <label htmlFor="fileInput" className={styles['file-input-label']}>
                                    <AttachFile /> Choose File
                                </label>
                                <span className={styles['file-name']}>
                                    {selectedFile?.name}
                                </span>
                            </div>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={uploadProfileImage}
                                disabled={!selectedFile || imageLoading}
                                startIcon={<CloudUpload />}
                            >
                                Upload Image
                            </Button>
                            {errorMessage && (
                                <Typography className={styles['error-message']}>
                                    {errorMessage}
                                </Typography>
                            )}
                        </div>
                        <Typography>
                            <Person /> <strong>Name:</strong> {userProfile?.displayName}
                        </Typography>
                        <Typography>
                            <Email /> <strong>Email:</strong> {userProfile?.email}
                        </Typography>
                    </CardContent>
                </Card>
            </div>

            <RemoveGameDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onConfirm={handleRemoveGame}
            />
        </div>
    );
}
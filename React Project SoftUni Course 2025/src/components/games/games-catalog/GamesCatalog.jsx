import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    Card,
    CardContent,
    CardActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Pagination,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography
} from '@mui/material';
import {
    CalendarToday,
    Person,
    Brush,
    Business,
    Star,
    Category,
    Description,
    Schedule,
    Info,
    Add,
    ExpandMore
} from '@mui/icons-material';
import authApi from '../../../api/authApi';
import { formatElapsedTime } from '../../../utils/timeUtils';
import styles from './GamesCatalog.module.scss';
import { useAuth } from '../../../contexts/AuthContext';
import { useGames } from '../../../contexts/GamesContext';
import { useUI } from '../../../contexts/UIContext';

export default function GamesCatalog() {
    const [userGameIds, setUserGameIds] = useState(new Set());
    const [paginatedGames, setPaginatedGames] = useState([]);
    const [page, setPage] = useState(1);
    const pageSize = 12;

    const { user, isAuthenticated } = useAuth();
    const { games, filteredGames, sortCriteria, handleSort, loading } = useGames();
    const { showLoading, hideLoading, showNotification } = useUI();

    useEffect(() => {
        if (user) {
            loadUserGames(user.uid);
        }
        
        paginateGames(filteredGames, page);
    }, [user, filteredGames, page]);

    const loadUserGames = async (userId) => {
        try {
            const userGames = await authApi.getUserGames(userId);
            setUserGameIds(new Set(userGames.map(game => game._id)));
        } catch (error) {
            console.error('Error loading user games:', error);
            showNotification('Error loading user games', 'error');
        }
    };

    const addGameToProfile = async (game) => {
        if (user) {
            showLoading();
            try {
                await authApi.addGameToUserProfile(user.uid, game);
                setUserGameIds(prev => new Set([...prev, game._id]));
                showNotification('Game added to your profile', 'success');
            } catch (error) {
                console.error('Error adding game to profile:', error);
                showNotification('Error adding game to profile', 'error');
            } finally {
                hideLoading();
            }
        }
    };

    const isGameInUserProfile = (gameId) => {
        return userGameIds.has(gameId);
    };

    const handleSortChange = (event) => {
        const criteria = event.target.value;
        handleSort(criteria);
    };

    const paginateGames = (gamesArray, currentPage) => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        setPaginatedGames(gamesArray.slice(startIndex, endIndex));
    };

    const handlePageChange = (event, value) => {
        setPage(value);
        paginateGames(filteredGames, value);
    };

    if (loading) {
        return null; // UI Context handles the loading indicator
    }

    return (
        <div className={styles['catalog-container']}>
            <div className={styles['games-list']}>
                {paginatedGames.map((game) => (
                    <Card 
                        key={game._id} 
                        className={styles['game-card']}
                        sx={{ 
                            backgroundColor: 'transparent',
                            boxShadow: 'none'
                        }}
                    >
                        <img
                            src={game.image}
                            alt={game.title}
                            className={styles['game-image']}
                            loading='lazy'
                        />
                        <Accordion 
                            sx={{ 
                                backgroundColor: 'transparent',
                                '&.Mui-expanded': {
                                    backgroundColor: 'white',
                                    margin: 0
                                }
                            }}
                        >
                            <AccordionSummary 
                                expandIcon={<ExpandMore />}
                            >
                                <Typography
                                    sx={{ 
                                        color: '#1e88e5',
                                        fontWeight: 500,
                                        fontSize: '16px',
                                        textDecoration: 'none',
                                        transition: 'color 0.2s ease',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            color: '#0d47a1',
                                            textDecoration: 'none'
                                        }
                                    }}
                                >
                                    {game.title}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <CardContent>
                                    <Typography><CalendarToday /> <strong>Year:</strong> {game.year}</Typography>
                                    <Typography><Person /> <strong>Designer:</strong> {game.designer}</Typography>
                                    <Typography><Brush /> <strong>Artist:</strong> {game.artist}</Typography>
                                    <Typography><Business /> <strong>Publisher:</strong> {game.publisher}</Typography>
                                    <Typography><Star /> <strong>Rating:</strong> {game.rating}</Typography>
                                    <Typography><Category /> <strong>Category:</strong> {game.category}</Typography>
                                    <Typography><Description /> {game.description}</Typography>
                                    <Typography>
                                        <Schedule /> created {formatElapsedTime(game.createdAt)} by <Person /> {game.userDisplayName}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'space-between' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        component={Link}
                                        to={`/details/${game._id}`}
                                        startIcon={<Info />}
                                        sx={{ 
                                            flex: 1, 
                                            margin: '0 4px', 
                                            minWidth: '120px',
                                            height: '36px',
                                            fontSize: '0.875rem',
                                            textTransform: 'none',
                                            fontWeight: 500,
                                            marginLeft: 0
                                        }}
                                    >
                                        Details
                                    </Button>
                                    {isAuthenticated && (
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => addGameToProfile(game)}
                                            disabled={isGameInUserProfile(game._id)}
                                            startIcon={<Add />}
                                            sx={{ 
                                                flex: 1, 
                                                margin: '0 4px', 
                                                minWidth: '120px',
                                                height: '36px',
                                                fontSize: '0.875rem',
                                                textTransform: 'none',
                                                fontWeight: 500,
                                                marginRight: 0
                                            }}
                                        >
                                            Add Game
                                        </Button>
                                    )}
                                </CardActions>
                            </AccordionDetails>
                        </Accordion>
                    </Card>
                ))}
            </div>

            <FormControl className={styles['sort-dropdown']}>
                <InputLabel>Sort by</InputLabel>
                <Select
                    value={sortCriteria}
                    onChange={handleSortChange}
                    label="Sort by"
                >
                    <MenuItem value="createdAt">Newest</MenuItem>
                    <MenuItem value="rating">Rating</MenuItem>
                    <MenuItem value="year">Year</MenuItem>
                </Select>
            </FormControl>

            <Pagination
                count={Math.ceil(filteredGames.length / pageSize)}
                page={page}
                onChange={handlePageChange}
                className={styles.pagination}
            />
        </div>
    );
}
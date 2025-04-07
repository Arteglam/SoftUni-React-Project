import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    CircularProgress,
    Card,
    CardContent,
    CardActions,
    Button,
    IconButton,
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
import gameApi from '../../../api/gameApi';
import authApi from '../../../api/authApi';
import { formatElapsedTime } from '../../../utils/timeUtils';
import styles from './GamesCatalog.module.scss';

export default function GamesCatalog() {
    const [games, setGames] = useState([]);
    const [filteredGames, setFilteredGames] = useState([]);
    const [paginatedGames, setPaginatedGames] = useState([]);
    const [user, setUser] = useState(null);
    const [userGameIds, setUserGameIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [sortCriteria, setSortCriteria] = useState('createdAt');
    const [page, setPage] = useState(1);
    const pageSize = 12;

    useEffect(() => {
        loadGames();
        const unsubscribe = authApi.onAuthStateChange((user) => {
            setUser(user);
            if (user) {
                loadUserGames(user.uid);
            }
        });

        return () => unsubscribe();
    }, []);

    const loadGames = async () => {
        try {
            const fetchedGames = await gameApi.getGames();
            setGames(fetchedGames);
            setFilteredGames(fetchedGames);
            sortGames(fetchedGames, sortCriteria);
            setLoading(false);
        } catch (error) {
            console.error('Error loading games:', error);
            setLoading(false);
        }
    };

    const loadUserGames = async (userId) => {
        try {
            const userGames = await authApi.getUserGames(userId);
            setUserGameIds(new Set(userGames.map(game => game._id)));
        } catch (error) {
            console.error('Error loading user games:', error);
        }
    };

    const addGameToProfile = async (game) => {
        if (user) {
            try {
                await authApi.addGameToUserProfile(user.uid, game);
                setUserGameIds(prev => new Set([...prev, game._id]));
            } catch (error) {
                console.error('Error adding game to profile:', error);
            }
        }
    };

    const isGameInUserProfile = (gameId) => {
        return userGameIds.has(gameId);
    };

    const handleSortChange = (event) => {
        const criteria = event.target.value;
        setSortCriteria(criteria);
        sortGames(filteredGames, criteria);
    };

    const sortGames = (gamesArray, criteria) => {
        const sortedGames = [...gamesArray];
        if (criteria === 'rating') {
            sortedGames.sort((a, b) => b.rating - a.rating);
        } else if (criteria === 'year') {
            sortedGames.sort((a, b) => b.year - a.year);
        } else {
            sortedGames.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
        }
        setFilteredGames(sortedGames);
        paginateGames(sortedGames, page);
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
        return (
            <div className={styles['loader-container']}>
                <CircularProgress className={styles.loader} />
            </div>
        );
    }

    return (
        <div className={styles['catalog-container']}>
            <div className={styles['games-list']}>
                {paginatedGames.map((game) => (
                    <Card key={game._id} className={styles['game-card']}>
                        <img
                            src={game.image}
                            alt={game.title}
                            className={styles['game-image']}
                        />
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography>{game.title}</Typography>
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
                                <CardActions>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        component={Link}
                                        to={`/details/${game._id}`}
                                        startIcon={<Info />}
                                    >
                                        Details
                                    </Button>
                                    {user && (
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => addGameToProfile(game)}
                                            disabled={isGameInUserProfile(game._id)}
                                            startIcon={<Add />}
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
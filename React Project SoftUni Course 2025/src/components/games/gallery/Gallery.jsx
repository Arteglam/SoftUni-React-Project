import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    Card, 
    CardContent, 
    CardMedia, 
    Typography, 
    TextField,
    Pagination,
    Box,
    CircularProgress,
    Alert
} from '@mui/material';
import gameApi from '../../../api/gameApi';
import styles from './Gallery.module.scss';

export default function Gallery() {
    const [games, setGames] = useState([]);
    const [filteredGames, setFilteredGames] = useState([]);
    const [paginatedGames, setPaginatedGames] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [hoverStates, setHoverStates] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const pageSize = 12;

    useEffect(() => {
        loadGames();
    }, []);

    useEffect(() => {
        filterGames(searchTerm);
    }, [searchTerm, games]);

    const loadGames = async () => {
        setLoading(true);
        try {
            const fetchedGames = await gameApi.getGames();
            setGames(fetchedGames);
            setFilteredGames(fetchedGames);
            paginateGames(fetchedGames, 1);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const filterGames = (value) => {
        if (!value) {
            setFilteredGames(games);
        } else {
            const filtered = games.filter(game =>
                game.title.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredGames(filtered);
        }
        paginateGames(value ? filtered : games, 1);
        setPage(1);
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

    const handleMouseEnter = (gameId) => {
        setHoverStates(prev => ({ ...prev, [gameId]: 'hover' }));
    };

    const handleMouseLeave = (gameId) => {
        setHoverStates(prev => ({ ...prev, [gameId]: 'rest' }));
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <div className={styles.galleryContainer}>
            <Card className={styles.searchCard}>
                <Typography variant="h5" component="h2" className={styles.cardTitle}>
                    Search Games
                </Typography>
                <CardContent>
                    <TextField
                        fullWidth
                        label="Search"
                        placeholder="Search for a game"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className={styles.fullWidth}
                    />
                </CardContent>
            </Card>

            <div className={styles.gamesList}>
                {paginatedGames.map((game) => (
                    <div key={game._id} className={styles.gameCard}>
                        <Card>
                            <Link to={`/details/${game._id}`}>
                                <CardMedia
                                    component="img"
                                    image={game.image}
                                    alt={game.title}
                                    className={styles.gameImage}
                                    style={{
                                        transform: hoverStates[game._id] === 'hover' ? 'scale(1.05)' : 'scale(1)',
                                        transition: 'transform 0.3s ease-in-out'
                                    }}
                                    onMouseEnter={() => handleMouseEnter(game._id)}
                                    onMouseLeave={() => handleMouseLeave(game._id)}
                                />
                            </Link>
                            <Typography variant="h6" component="h3" className={styles.cardTitle}>
                                {game.title}
                            </Typography>
                        </Card>
                    </div>
                ))}
            </div>

            <Box mt={3} mb={3}>
                <Pagination
                    count={Math.ceil(filteredGames.length / pageSize)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>
        </div>
    );
}
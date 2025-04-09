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
    CircularProgress
} from '@mui/material';
import styles from './Gallery.module.scss';
import { useGames } from '../../../contexts/GamesContext';
import { useUI } from '../../../contexts/UIContext';

export default function Gallery() {
    const [paginatedGames, setPaginatedGames] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [hoverStates, setHoverStates] = useState({});
    const pageSize = 12;

    const { games, filteredGames, loading, handleSearch } = useGames();

    useEffect(() => {
        paginateGames(filteredGames, page);
    }, [filteredGames, page]);

    const paginateGames = (gamesArray, currentPage) => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        setPaginatedGames(gamesArray.slice(startIndex, endIndex));
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleMouseEnter = (gameId) => {
        setHoverStates(prev => ({ ...prev, [gameId]: 'hover' }));
    };

    const handleMouseLeave = (gameId) => {
        setHoverStates(prev => ({ ...prev, [gameId]: 'rest' }));
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        handleSearch(event.target.value);
    };

    if (loading) return <CircularProgress />;
    
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
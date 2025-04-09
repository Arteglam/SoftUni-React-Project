import { createContext, useContext, useState, useEffect } from 'react';
import gameApi from '../api/gameApi';
import { useUI } from './UIContext';

const GamesContext = createContext();

export function GamesProvider({ children }) {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortCriteria, setSortCriteria] = useState('createdAt');
  const [searchTerm, setSearchTerm] = useState('');
  const { showError } = useUI();

  const loadGames = async () => {
    let allGames = [];
    let currentPage = 1;
    let hasMoreGames = true;

    while (hasMoreGames) {
      const gamesData = await gameApi.getGames(currentPage, 100);
      allGames = [...allGames, ...gamesData];

      if (gamesData.length < 100) {
        hasMoreGames = false;
      } else {
        currentPage++;
      }
    }

    return allGames;
  };

  const applyFilters = (gamesArray, search, sort) => {
    let result = [...gamesArray];
    
    if (search) {
      result = result.filter(game => 
        game.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    switch (sort) {
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'year':
        result.sort((a, b) => (b.year || 0) - (a.year || 0));
        break;
      case 'createdAt':
      default:
        result.sort((a, b) => {
          const bTime = b.createdAt?.seconds || 0;
          const aTime = a.createdAt?.seconds || 0;
          return bTime - aTime;
        });
    }
    
    setFilteredGames(result);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    applyFilters(games, term, sortCriteria);
  };

  const handleSort = (criteria) => {
    setSortCriteria(criteria);
    applyFilters(games, searchTerm, criteria);
  };

  useEffect(() => {
    let isMounted = true;
    
    const loadAllGames = async () => {
        setLoading(true);
        try {
            const allGames = await loadGames();
            
            if (isMounted) {
                setGames(allGames);
                applyFilters(allGames, searchTerm, sortCriteria);
            }
        } catch (error) {
            console.error('Error loading games:', error);
            if (isMounted) {
                showError('Failed to load games');
            }
        } finally {
            if (isMounted) {
                setLoading(false);
            }
        }
    };
    
    loadAllGames();
    
    return () => {
        isMounted = false;
    };
  }, []);

  const getGameById = async (id) => {
    const gameInState = games.find(g => g._id === id);
    if (gameInState) return gameInState;
    
    try {
      return await gameApi.getGameById(id);
    } catch (error) {
      console.error('Error loading game details:', error);
      showError('Failed to load game details');
      return null;
    }
  };

  const createGame = async (gameData, userId, userDisplayName) => {
    try {
      const gameId = await gameApi.createGame(gameData, userId, userDisplayName);
      await loadGames(); 
      return gameId;
    } catch (error) {
      console.error('Error creating game:', error);
      showError('Failed to create game');
      throw error;
    }
  };

  const updateGame = async (id, gameData) => {
    try {
      await gameApi.updateGame(id, gameData);
      await loadGames(); 
    } catch (error) {
      console.error('Error updating game:', error);
      showError('Failed to update game');
      throw error;
    }
  };

  const deleteGame = async (id) => {
    try {
      await gameApi.deleteGame(id);
      setGames(games.filter(game => game._id !== id));
      setFilteredGames(filteredGames.filter(game => game._id !== id));
    } catch (error) {
      console.error('Error deleting game:', error);
      showError('Failed to delete game');
      throw error;
    }
  };

  const value = {
    games,
    filteredGames,
    loading,
    searchTerm,
    sortCriteria,
    loadGames,
    getGameById,
    createGame,
    updateGame,
    deleteGame,
    handleSearch,
    handleSort
  };

  return (
    <GamesContext.Provider value={value}>
      {children}
    </GamesContext.Provider>
  );
}

export const useGames = () => {
  const context = useContext(GamesContext);
  if (context === undefined) {
    throw new Error('useGames must be used within a GamesProvider');
  }
  return context;
};
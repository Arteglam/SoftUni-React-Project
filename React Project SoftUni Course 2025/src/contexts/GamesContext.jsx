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
    setLoading(true);
    try {
      // Load all games instead of just the first page
      let allGames = [];
      let currentPage = 1;
      let hasMoreGames = true;

      // Loop until we get all games
      while (hasMoreGames) {
        const gamesData = await gameApi.getGames(currentPage, 100);
        allGames = [...allGames, ...gamesData];
        
        // If we received fewer than requested, we've reached the end
        if (gamesData.length < 100) {
          hasMoreGames = false;
        } else {
          currentPage++;
        }
      }

      setGames(allGames);
      applyFilters(allGames, searchTerm, sortCriteria);
    } catch (error) {
      console.error('Error loading games:', error);
      showError('Failed to load games');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (gamesArray, search, sort) => {
    let result = [...gamesArray];
    
    // Apply search filter
    if (search) {
      result = result.filter(game => 
        game.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply sorting
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
    loadGames();
  }, []);

  const getGameById = async (id) => {
    // Check if we already have the game in state to avoid extra API calls
    const gameInState = games.find(g => g._id === id);
    if (gameInState) return gameInState;
    
    // If not found in state, get from API
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
      await loadGames(); // Refresh games after creation
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
      await loadGames(); // Refresh games after update
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
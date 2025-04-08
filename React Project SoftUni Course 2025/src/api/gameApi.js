import { 
    collection, 
    doc, 
    addDoc, 
    getDoc, 
    deleteDoc, 
    updateDoc, 
    query, 
    orderBy, 
    getDocs,
    limit,
    startAfter,
    Timestamp 
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../config/firebase-config';

class GameApi {
    constructor() {
        this.lastVisible = null;
    }

    async getGames(page = 1, pageSize = 12, sortBy = 'createdAt') {
        // Store last document for pagination
        if (page === 1) {
            this.lastVisible = null;
        }
        
        try {
            const gamesCollection = collection(db, 'Games');
            let gamesQuery;
            
            if (page === 1 || !this.lastVisible) {
                // First page query
                gamesQuery = query(
                    gamesCollection,
                    orderBy(sortBy, 'desc'),
                    limit(pageSize)
                );
            } else {
                // Subsequent pages
                gamesQuery = query(
                    gamesCollection,
                    orderBy(sortBy, 'desc'),
                    startAfter(this.lastVisible),
                    limit(pageSize)
                );
            }
            
            const querySnapshot = await getDocs(gamesQuery);
            
            // Update the last visible document for next pagination
            const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
            if (lastDoc) {
                this.lastVisible = lastDoc;
            }
            
            return querySnapshot.docs.map(doc => ({
                _id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error fetching games:", error);
            throw error;
        }
    }

    async getGameById(gameId) {
        const gameDocRef = doc(db, `Games/${gameId}`);
        const gameDocSnap = await getDoc(gameDocRef);
        if (gameDocSnap.exists()) {
            return { _id: gameDocSnap.id, ...gameDocSnap.data() };
        }
        return null;
    }

    async createGame(game, userId, userDisplayName) {
        const gamesCollection = collection(db, 'Games');
        const docRef = await addDoc(gamesCollection, {
            ...game,
            userId,
            userDisplayName,
            createdAt: Timestamp.now()
        });
        return docRef.id;
    }

    async updateGame(gameId, game) {
        const gameDocRef = doc(db, `Games/${gameId}`);
        await updateDoc(gameDocRef, game);
    }

    async deleteGame(gameId) {
        const gameDocRef = doc(db, `Games/${gameId}`);
        await deleteDoc(gameDocRef);
    }

    async uploadGameImage(file) {
        const storageRef = ref(storage, `gameImages/${file.name}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
    }

    generateId() {
        return doc(collection(db, 'id')).id;
    }
}

export default new GameApi();
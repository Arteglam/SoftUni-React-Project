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
    Timestamp 
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../config/firebase-config';

class GameApi {
    async getGames() {
        const gamesCollection = collection(db, 'Games');
        const gamesQuery = query(gamesCollection, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(gamesQuery);
        return querySnapshot.docs.map(doc => ({
            _id: doc.id,
            ...doc.data()
        }));
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
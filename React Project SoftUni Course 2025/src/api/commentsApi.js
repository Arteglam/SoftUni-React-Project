import { 
    collection, 
    doc, 
    addDoc, 
    deleteDoc, 
    updateDoc, 
    query, 
    orderBy, 
    getDocs 
} from 'firebase/firestore';
import { db } from '../config/firebase-config';

class CommentsApi {
    async getComments(gameId) {
        const commentsCollection = collection(db, `Games/${gameId}/Comments`);
        const commentsQuery = query(commentsCollection, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(commentsQuery);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }

    async addComment(gameId, comment) {
        const commentsCollection = collection(db, `Games/${gameId}/Comments`);
        const docRef = await addDoc(commentsCollection, comment);
        return docRef.id;
    }

    async deleteComment(gameId, commentId) {
        const commentDocRef = doc(db, `Games/${gameId}/Comments/${commentId}`);
        await deleteDoc(commentDocRef);
    }

    async updateComment(gameId, commentId, newText) {
        const commentDocRef = doc(db, `Games/${gameId}/Comments/${commentId}`);
        await updateDoc(commentDocRef, { text: newText });
    }
}

export default new CommentsApi();
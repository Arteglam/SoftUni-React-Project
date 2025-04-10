import { 
    collection, 
    doc, 
    addDoc, 
    deleteDoc, 
    updateDoc, 
    query, 
    orderBy, 
    getDocs, 
    Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase-config';

class CommentsApi {
    async getComments(gameId) {
        try {
            const commentsCollection = collection(db, 'Games', gameId, 'Comments');
            const commentsQuery = query(commentsCollection, orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(commentsQuery);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting comments:', error);
            throw error;
        }
    }

    async addComment(gameId, commentData) {
        try {
            const commentsCollection = collection(db, 'Games', gameId, 'Comments');
            const docRef = await addDoc(commentsCollection, {
                ...commentData,
                createdAt: Timestamp.now()
            });
            return {
                id: docRef.id,
                ...commentData
            };
        } catch (error) {
            console.error('Error adding comment:', error);
            throw error;
        }
    }

    async deleteComment(gameId, commentId) {
        try {
            const commentRef = doc(db, 'Games', gameId, 'Comments', commentId);
            await deleteDoc(commentRef);
        } catch (error) {
            console.error('Error deleting comment:', error);
            throw error;
        }
    }

    async updateComment(gameId, commentId, newText) {
        try {
            const commentRef = doc(db, 'Games', gameId, 'Comments', commentId);
            await updateDoc(commentRef, { 
                text: newText,
                updatedAt: Timestamp.now()
            });
        } catch (error) {
            console.error('Error updating comment:', error);
            throw error;
        }
    }
}

export default new CommentsApi();
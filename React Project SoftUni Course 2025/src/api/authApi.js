import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged,
    updateProfile,
    signOut 
} from 'firebase/auth';
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc,
    collection,
    updateDoc,
    getDocs,
    addDoc,
    deleteDoc
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { app, storage } from '../config/firebase-config';

class AuthApi {
    constructor() {
        this.auth = getAuth(app);
        this.firestore = getFirestore(app);
        this.user = null;
        this.listenToAuthStateChanges();
    }

    listenToAuthStateChanges() {
        return onAuthStateChanged(this.auth, (user) => {
            this.user = user;
            if (user) {
                console.log('User signed in:', user);
            } else {
                console.log('User signed out');
            }
        });
    }

    async signUpWithEmailAndPassword(email, password, displayName) {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                this.auth,
                email,
                password
            );

            if (userCredential.user) {
                this.user = userCredential.user;
                
                // Update user profile with display name
                await updateProfile(userCredential.user, { displayName });

                // Create user document in Firestore
                const userDocRef = doc(this.firestore, `Users/${userCredential.user.uid}`);
                await setDoc(userDocRef, { email, displayName });

                return userCredential;
            }
        } catch (error) {
            console.error('Error in signUpWithEmailAndPassword:', error);
            throw error;
        }
    }

    async signInWithEmailAndPassword(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(
                this.auth,
                email,
                password
            );

            if (userCredential.user) {
                // Check if user exists in Firestore
                const userDocRef = doc(this.firestore, `Users/${userCredential.user.uid}`);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    this.user = userCredential.user;
                    return userCredential;
                } else {
                    await this.signOut();
                    throw new Error('User does not exist in the database');
                }
            }

            return userCredential;
        } catch (error) {
            console.error('Error in signInWithEmailAndPassword:', error);
            throw error;
        }
    }

    async signOut() {
        try {
            await signOut(this.auth);
            this.user = null;
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    }

    getCurrentUser() {
        return this.auth.currentUser;
    }

    onAuthStateChange(callback) {
        return onAuthStateChanged(this.auth, callback);
    }

    async getUserProfile(userId) {
        const userDocRef = doc(this.firestore, `Users/${userId}`);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
            return userDocSnap.data();
        }
        return null;
    }

    async updateUserProfile(userId, profileData) {
        const userDocRef = doc(this.firestore, `Users/${userId}`);
        await updateDoc(userDocRef, profileData);
    }

    async uploadProfileImage(userId, file) {
        const storageRef = ref(storage, `profileImages/${userId}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
    }

    async addGameToUserProfile(userId, game) {
        const userGamesCollection = collection(this.firestore, `Users/${userId}/Games`);
        await setDoc(doc(userGamesCollection, game._id), game);
    }

    async getUserGames(userId) {
        const userGamesCollection = collection(this.firestore, `Users/${userId}/Games`);
        const querySnapshot = await getDocs(userGamesCollection);
        return querySnapshot.docs.map(doc => ({
            _id: doc.id,
            ...doc.data()
        }));
    }

    async removeGameFromUserProfile(userId, gameId) {
        const gameDocRef = doc(this.firestore, `Users/${userId}/Games/${gameId}`);
        await deleteDoc(gameDocRef);
    }

    async isGameInUserProfile(userId, gameId) {
        const gameDocRef = doc(this.firestore, `Users/${userId}/Games/${gameId}`);
        const gameDocSnap = await getDoc(gameDocRef);
        return gameDocSnap.exists();
    }

    async saveContactForm(contactData) {
        const contactCollection = collection(this.firestore, 'ContactForms');
        await addDoc(contactCollection, contactData);
    }
}

// Create and export a single instance
const authApi = new AuthApi();
export default authApi;
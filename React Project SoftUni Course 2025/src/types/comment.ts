export interface Comment {
    id: string;
    text: string;
    userId: string;
    userName: string;
    createdAt: any; // Firebase Timestamp
    gameId: string;
}
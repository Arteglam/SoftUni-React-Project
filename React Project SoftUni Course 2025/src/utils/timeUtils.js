export function formatElapsedTime(timestamp) {
    if (!timestamp) return '';

    let date;
    if (timestamp.toDate && typeof timestamp.toDate === 'function') {
        // Handle Firestore Timestamp
        date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
        // Handle regular Date object
        date = timestamp;
    } else {
        // Handle string or number timestamp
        date = new Date(timestamp);
    }

    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} months ago`;
    const years = Math.floor(months / 12);
    return `${years} years ago`;
}
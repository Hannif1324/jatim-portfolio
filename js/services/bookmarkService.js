import { dataService } from './dataService.js';

export class BookmarkService {
    constructor() {
        this.bookmarks = [];
        this.loadBookmarks();
    }

    async loadBookmarks() {
        this.bookmarks = await dataService.getBookmarks();
    }

    isBookmarked(id) {
        return this.bookmarks.some(bookmark => bookmark.id === id);
    }

    async toggleBookmark(item) {
        if (this.isBookmarked(item.id)) {
            await dataService.removeBookmark(item.id);
            this.bookmarks = this.bookmarks.filter(b => b.id !== item.id);
        } else {
            const newBookmark = {
                ...item,
                createdAt: Date.now()
            };
            await dataService.addBookmark(newBookmark);
            this.bookmarks.push(newBookmark);
        }
        
        // Dispatch custom event for UI updates
        window.dispatchEvent(new CustomEvent('bookmarksUpdated'));
    }

    
    getBookmarks() {
        return this.bookmarks;
    }

    getBookmarksByType(type) {
        return this.bookmarks.filter(bookmark => bookmark.type === type);
    }
}

// Global bookmark service instance
export const bookmarkService = new BookmarkService();
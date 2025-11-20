import { dataService } from './dataService.js';

export class BookmarkService {
    constructor() {
        this.bookmarks = [];
        this.loadBookmarks();
        
        // Listen for storage changes from other tabs
        window.addEventListener('storage', this.handleStorageChange.bind(this));
    }

    async loadBookmarks() {
        try {
            const allBookmarks = await dataService.getBookmarks();
            
            // REMOVE DUPLICATES - Hanya ambil bookmark unik berdasarkan ID
            const uniqueBookmarks = this.removeDuplicates(allBookmarks);
            
            this.bookmarks = uniqueBookmarks;
            console.log('Bookmarks loaded:', this.bookmarks.length, 'unique items');
            
            // Jika ada duplikasi, sync ke database
            if (allBookmarks.length !== uniqueBookmarks.length) {
                console.log('Duplicates found, cleaning database...');
                await this.cleanDuplicateBookmarks();
            }
            
        } catch (error) {
            console.error('Error loading bookmarks:', error);
            this.bookmarks = [];
        }
    }

    // METHOD BARU: Hapus duplikasi dari array
    removeDuplicates(bookmarks) {
        const seen = new Set();
        return bookmarks.filter(bookmark => {
            // Cek berdasarkan ID
            if (seen.has(bookmark.id)) {
                console.log('Duplicate found and removed:', bookmark.id, bookmark.nama);
                return false;
            }
            seen.add(bookmark.id);
            return true;
        });
    }

    // METHOD BARU: Bersihkan duplikasi dari database
    async cleanDuplicateBookmarks() {
        try {
            const allBookmarks = await dataService.getBookmarks();
            const uniqueBookmarks = this.removeDuplicates(allBookmarks);
            
            // Hapus semua bookmark lama
            const existingBookmarks = await dataService.getBookmarks();
            for (const bookmark of existingBookmarks) {
                await dataService.removeBookmark(bookmark.id);
            }
            
            // Simpan yang unik saja
            for (const bookmark of uniqueBookmarks) {
                await dataService.addBookmark(bookmark, bookmark.id);
            }
            
            this.bookmarks = uniqueBookmarks;
            console.log('Database cleaned, duplicates removed');
            
        } catch (error) {
            console.error('Error cleaning duplicate bookmarks:', error);
        }
    }

    // METHOD BARU: Cek duplikasi strict
    isBookmarkedStrict(id) {
        return this.bookmarks.some(bookmark => bookmark.id === id);
    }

    // METHOD BARU: Get bookmark by ID
    getBookmarkById(id) {
        return this.bookmarks.find(bookmark => bookmark.id === id);
    }

    async reloadBookmarks() {
        await this.loadBookmarks();
    }

    isBookmarked(id) {
        return this.isBookmarkedStrict(id);
    }

    async toggleBookmark(item) {
        try {
            if (this.isBookmarkedStrict(item.id)) {
                await this.removeBookmark(item.id);
                return { success: true, bookmarked: false, message: 'Bookmark dihapus' };
            } else {
                await this.addBookmark(item);
                return { success: true, bookmarked: true, message: 'Bookmark ditambahkan' };
            }
        } catch (error) {
            console.error('Error toggling bookmark:', error);
            return { success: false, message: 'Gagal mengupdate bookmark' };
        }
    }

    async addBookmark(item) {
        try {
            // STRICT DUPLICATION CHECK
            if (this.isBookmarkedStrict(item.id)) {
                console.warn('Bookmark already exists, skipping:', item.id, item.nama || item.name);
                return { success: false, message: 'Sudah ada di bookmark' };
            }

            // Create bookmark dengan data lengkap
            const newBookmark = {
                id: item.id,
                type: item.type || this.detectItemType(item),
                nama: item.nama || item.name,
                kota: item.kota || item.city,
                gambar: item.gambar || item.image,
                deskripsi: item.deskripsi || item.description,
                harga: item.harga, // For kuliner
                hargaTiket: item.hargaTiket, // For wisata
                mapsUrl: item.mapsUrl,
                mapsImage: item.mapsImage,
                rating: item.rating,
                kategori: item.kategori,
                coords: item.coords,
                populasi: item.populasi,
                createdAt: Date.now()
            };

            // Simpan ke database
            await dataService.addBookmark(newBookmark, newBookmark.id);
            
            // Tambahkan ke array lokal
            this.bookmarks.push(newBookmark);
            
            console.log('Bookmark added:', newBookmark.nama);
            
            // Dispatch update event
            this.dispatchBookmarkUpdate();
            
            // Navigate to bookmark page
            this.navigateToBookmarkPage();
            
            return { success: true, bookmark: newBookmark };
            
        } catch (error) {
            console.error('Error adding bookmark:', error);
            throw error;
        }
    }

    async removeBookmark(id) {
        try {
            // Cek apakah bookmark exists
            if (!this.isBookmarkedStrict(id)) {
                console.warn('Bookmark not found for removal:', id);
                return { success: false, message: 'Bookmark tidak ditemukan' };
            }

            // Hapus dari database
            await dataService.removeBookmark(id);
            
            // Hapus dari array lokal
            this.bookmarks = this.bookmarks.filter(b => b.id !== id);
            
            console.log('Bookmark removed:', id);
            
            // Dispatch update event
            this.dispatchBookmarkUpdate();
            
            return { success: true, message: 'Bookmark dihapus' };
            
        } catch (error) {
            console.error('Error removing bookmark:', error);
            throw error;
        }
    }

    // Navigation to bookmark page
    navigateToBookmarkPage() {
        if (window.location.hash !== '#bookmark') {
            setTimeout(() => {
                window.location.hash = '#bookmark';
            }, 800); // Delay lebih lama untuk feedback
        }
    }

    async clearAllBookmarks() {
        try {
            const bookmarks = await dataService.getBookmarks();
            for (const bookmark of bookmarks) {
                await dataService.removeBookmark(bookmark.id);
            }
            this.bookmarks = [];
            
            this.dispatchBookmarkUpdate();
            console.log('All bookmarks cleared');
            return true;
        } catch (error) {
            console.error('Error clearing bookmarks:', error);
            throw error;
        }
    }

    getBookmarks() {
        return [...this.bookmarks].sort((a, b) => b.createdAt - a.createdAt);
    }

    getBookmarksByType(type) {
        return this.bookmarks
            .filter(bookmark => bookmark.type === type)
            .sort((a, b) => b.createdAt - a.createdAt);
    }

    async getAllBookmarksWithDetails() {
        try {
            const detailedBookmarks = [];
            const processedIds = new Set(); // Untuk cek duplikasi
            
            for (const bookmark of this.bookmarks) {
                // CEGAH DUPLIKASI di level ini juga
                if (processedIds.has(bookmark.id)) {
                    console.warn('Duplicate bookmark skipped in details:', bookmark.id);
                    continue;
                }
                processedIds.add(bookmark.id);
                
                try {
                    const detailedBookmark = await this.getBookmarkWithDetails(bookmark.id);
                    if (detailedBookmark) {
                        detailedBookmarks.push({
                            ...detailedBookmark,
                            isBookmarked: true
                        });
                    }
                } catch (error) {
                    console.error(`Error loading details for ${bookmark.id}:`, error);
                    // Fallback to basic bookmark data
                    detailedBookmarks.push({
                        ...bookmark,
                        isBookmarked: true
                    });
                }
            }

            return detailedBookmarks.sort((a, b) => b.createdAt - a.createdAt);
            
        } catch (error) {
            console.error('Error getting all bookmarks with details:', error);
            return this.bookmarks.map(bookmark => ({
                ...bookmark,
                isBookmarked: true
            }));
        }
    }

    async getBookmarkWithDetails(id) {
        try {
            const bookmark = this.getBookmarkById(id);
            if (!bookmark) return null;

            // Get fresh data from database based on type
            let freshData = null;
            const collections = {
                'wisata': 'getWisata',
                'kuliner': 'getKuliner', 
                'kota': 'getKota'
            };

            const collectionMethod = collections[bookmark.type];
            if (collectionMethod && dataService[collectionMethod]) {
                const allItems = await dataService[collectionMethod]();
                freshData = allItems.find(item => item.id === id);
            }

            return { ...bookmark, ...freshData };
        } catch (error) {
            console.error('Error getting bookmark details:', error);
            return bookmark;
        }
    }

    detectItemType(item) {
        if (item.hargaTiket !== undefined) return 'wisata';
        if (item.harga !== undefined) return 'kuliner';
        if (item.populasi !== undefined) return 'kota';
        return 'unknown';
    }

    dispatchBookmarkUpdate() {
        window.dispatchEvent(new CustomEvent('bookmarksUpdated', {
            detail: { 
                count: this.bookmarks.length,
                bookmarks: this.bookmarks 
            }
        }));

        localStorage.setItem('bookmarksLastUpdate', Date.now().toString());
    }

    handleStorageChange(event) {
        if (event.key === 'bookmarksLastUpdate') {
            this.loadBookmarks();
            this.dispatchBookmarkUpdate();
        }
    }

    // METHOD BARU: Force clean duplicates
    async forceCleanDuplicates() {
        console.log('Force cleaning duplicates...');
        await this.cleanDuplicateBookmarks();
        this.dispatchBookmarkUpdate();
    }

    // METHOD BARU: Get duplicate count
    getDuplicateCount() {
        const ids = this.bookmarks.map(b => b.id);
        const uniqueIds = new Set(ids);
        return ids.length - uniqueIds.size;
    }
}

// Global bookmark service instance
export const bookmarkService = new BookmarkService();

// Convenience functions for direct usage
export const bookmarkManager = {
    toggle: (item) => bookmarkService.toggleBookmark(item),
    isBookmarked: (id) => bookmarkService.isBookmarked(id),
    getAll: () => bookmarkService.getBookmarks(),
    getByType: (type) => bookmarkService.getBookmarksByType(type),
    getCount: () => bookmarkService.getBookmarkCount(),
    clearAll: () => bookmarkService.clearAllBookmarks(),
    forceClean: () => bookmarkService.forceCleanDuplicates(),
    onUpdate: (callback) => bookmarkService.onBookmarksUpdate(callback)
};
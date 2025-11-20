import { bookmarkService } from '../services/bookmarkService.js';
import { modal_locasi } from '../components/ui/modal_locasi.js';
import { theme } from '../components/theme/theme.js';

export class BookmarkPage {
    constructor() {
        this.bookmarks = [];
        this.loading = true;
        this.themeCleanup = null;
        this.bookmarkUpdateHandler = this.handleBookmarkUpdate.bind(this);
        this.handleContainerClick = this.handleContainerClick.bind(this);
    }

    async init(container) {
        this.container = container;
        
        // FORCE CLEAN DUPLICATES SETIAP KALI PAGE DIAKSES
        await bookmarkService.forceCleanDuplicates();
        
        await this.loadData();
        this.render();
        this.setupEventListeners();
        this.setupThemeListener();
    }

    async loadData() {
        this.loading = true;
        this.render();

        try {
            // Gunakan method yang sudah ada safety check duplikasi
            this.bookmarks = await bookmarkService.getAllBookmarksWithDetails();
            console.log('Bookmarks loaded:', this.bookmarks.length, 'unique items');
            
            // LOG TAMBAHAN: Tampilkan semua bookmark untuk debugging
            console.log('All bookmarks:', this.bookmarks.map(b => ({ id: b.id, nama: b.nama, type: b.type })));
            
        } catch (error) {
            console.error('Error loading bookmarks:', error);
            this.bookmarks = [];
        }

        this.loading = false;
        this.render();
    }

    // Di method groupBookmarksByType(), tambahkan safety check
    groupBookmarksByType() {
        const wisataBookmarks = [];
        const kulinerBookmarks = [];
        const kotaBookmarks = [];
        
        const processedIds = new Set(); // Cegah duplikasi di level rendering

        this.bookmarks.forEach(bookmark => {
            // CEK DUPLIKASI di level rendering juga
            if (processedIds.has(bookmark.id)) {
                console.warn('Duplicate in rendering:', bookmark.id);
                return; // Skip duplicate
            }
            processedIds.add(bookmark.id);

            const type = bookmark.type || this.detectBookmarkType(bookmark);
            
            switch (type) {
                case 'wisata':
                    wisataBookmarks.push(bookmark);
                    break;
                case 'kuliner':
                    kulinerBookmarks.push(bookmark);
                    break;
                case 'kota':
                    kotaBookmarks.push(bookmark);
                    break;
                default:
                    if (bookmark.hargaTiket !== undefined) {
                        wisataBookmarks.push(bookmark);
                    } else if (bookmark.harga !== undefined) {
                        kulinerBookmarks.push(bookmark);
                    } else if (bookmark.populasi !== undefined) {
                        kotaBookmarks.push(bookmark);
                    }
            }
        });

        return { wisataBookmarks, kulinerBookmarks, kotaBookmarks };
    }

    render() {
        if (this.loading) {
            this.container.innerHTML = `
                <div class="text-center py-12">
                    <div class="loading-spinner mx-auto mb-4"></div>
                    <p class="text-gray-600 dark:text-gray-400">Memuat bookmark...</p>
                </div>
            `;
            return;
        }

        if (this.bookmarks.length === 0) {
            this.container.innerHTML = `
                <div class="text-center py-12">
                    <div class="text-6xl mb-4">🔖</div>
                    <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">Tidak Ada Bookmark</h2>
                    <p class="text-gray-600 dark:text-gray-400 mb-6">Anda belum menyimpan tempat favorit apapun.</p>
                    <a href="#home" class="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md transition-colors">
                        Jelajahi Jawa Timur
                    </a>
                </div>
            `;
            return;
        }

        // Group bookmarks by type dengan logic yang lebih akurat
        const { wisataBookmarks, kulinerBookmarks, kotaBookmarks } = this.groupBookmarksByType();

        this.container.innerHTML = `
            <div class="fade-in space-y-12">
                <div class="text-center">
                    <h1 class="text-3xl font-bold text-gray-800 dark:text-white">Bookmark Saya</h1>
                    <p class="text-gray-600 dark:text-gray-400 mt-2">${this.bookmarks.length} tempat favorit yang telah Anda simpan</p>
                </div>

                ${this.renderBookmarkSection('🏙️', 'Kota Favorit', kotaBookmarks)}
                ${this.renderBookmarkSection('🏞️', 'Wisata Favorit', wisataBookmarks)}
                ${this.renderBookmarkSection('🍜', 'Kuliner Favorit', kulinerBookmarks)}
            </div>
        `;
    }

    groupBookmarksByType() {
        const wisataBookmarks = [];
        const kulinerBookmarks = [];
        const kotaBookmarks = [];

        this.bookmarks.forEach(bookmark => {
            // Prioritize explicit type, then fallback to detection
            const type = bookmark.type || this.detectBookmarkType(bookmark);
            
            switch (type) {
                case 'wisata':
                case 'destinasi':
                case 'tempat':
                    wisataBookmarks.push(bookmark);
                    break;
                case 'kuliner':
                case 'makanan':
                case 'restoran':
                    kulinerBookmarks.push(bookmark);
                    break;
                case 'kota':
                case 'kabupaten':
                case 'daerah':
                    kotaBookmarks.push(bookmark);
                    break;
                default:
                    // Fallback detection based on properties
                    if (bookmark.hargaTiket !== undefined) {
                        wisataBookmarks.push(bookmark);
                    } else if (bookmark.harga !== undefined) {
                        kulinerBookmarks.push(bookmark);
                    } else if (bookmark.populasi !== undefined) {
                        kotaBookmarks.push(bookmark);
                    } else {
                        console.warn('Unknown bookmark type:', bookmark);
                    }
            }
        });

        return { wisataBookmarks, kulinerBookmarks, kotaBookmarks };
    }

    detectBookmarkType(bookmark) {
        if (bookmark.hargaTiket !== undefined) return 'wisata';
        if (bookmark.harga !== undefined) return 'kuliner';
        if (bookmark.populasi !== undefined) return 'kota';
        
        // Check kategori
        if (bookmark.kategori) {
            const lowerKategori = bookmark.kategori.toLowerCase();
            if (lowerKategori.includes('wisata') || lowerKategori.includes('destinasi')) return 'wisata';
            if (lowerKategori.includes('kuliner') || lowerKategori.includes('makanan')) return 'kuliner';
            if (lowerKategori.includes('kota') || lowerKategori.includes('kabupaten')) return 'kota';
        }
        
        return 'unknown';
    }

    renderBookmarkSection(icon, title, items) {
        if (items.length === 0) return '';

        return `
            <section>
                <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
                    <span class="mr-2">${icon}</span> ${title}
                    <span class="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">(${items.length})</span>
                </h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${items.map(item => this.renderBookmarkCard(item)).join('')}
                </div>
            </section>
        `;
    }

    renderBookmarkCard(item) {
        const type = item.type || this.detectBookmarkType(item);
        const priceInfo = this.getPriceInfo(item, type);

        return `
            <div class="card bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300" data-item-id="${item.id}">
                <div class="relative">
                    <img class="card-img block h-48 w-full object-cover rounded-t-lg" src="${item.gambar}" alt="${item.nama}" loading="lazy" />
                    <button class="remove-bookmark-btn absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 rounded-full backdrop-blur-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-500" 
                            data-item-id="${item.id}"
                            title="Hapus dari bookmark">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="p-4">
                    ${item.kategori ? `<p class="text-xs text-primary-500 dark:text-primary-400 font-semibold uppercase">${item.kategori}</p>` : ''}
                    <h3 class="text-lg font-semibold mt-1 text-gray-800 dark:text-white">${item.nama}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">${item.kota || ''}</p>
                    ${priceInfo ? `<p class="text-sm text-green-600 dark:text-green-400 font-medium mt-1">${priceInfo}</p>` : ''}
                    ${item.populasi ? `<p class="text-sm text-gray-600 dark:text-gray-400">Populasi: ${item.populasi.toLocaleString('id-ID')}</p>` : ''}
                    <div class="mt-4">
                        <button class="view-detail-btn w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors" 
                                data-item='${JSON.stringify(item).replace(/'/g, "&apos;")}'>
                            Lihat Detail
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    getPriceInfo(item, type) {
        switch (type) {
            case 'wisata':
                return item.hargaTiket ? `Tiket: ${item.hargaTiket}` : '';
            case 'kuliner':
                return item.harga ? `Harga: ${item.harga}` : '';
            default:
                return '';
        }
    }

    setupEventListeners() {
        // Use event delegation for better performance
        this.container.addEventListener('click', this.handleContainerClick);
        
        // Listen to bookmark updates
        window.addEventListener('bookmarksUpdated', this.bookmarkUpdateHandler);
    }

    handleContainerClick(event) {
        const target = event.target;
        
        // Remove bookmark button
        if (target.closest('.remove-bookmark-btn')) {
            const button = target.closest('.remove-bookmark-btn');
            const itemId = button.dataset.itemId;
            if (itemId) {
                this.removeBookmark(itemId);
            }
            event.stopPropagation();
            return;
        }

        // View detail button
        if (target.closest('.view-detail-btn')) {
            const button = target.closest('.view-detail-btn');
            try {
                const item = JSON.parse(button.dataset.item);
                this.showItemDetail(item);
            } catch (error) {
                console.error('Error parsing item data:', error);
            }
            return;
        }
    }

    async handleBookmarkUpdate() {
        console.log('Bookmarks updated, reloading...');
        await this.loadData();
    }

    async removeBookmark(itemId) {
        try {
            console.log('Removing bookmark:', itemId);
            
            // Cari bookmark yang akan dihapus
            const bookmarkToRemove = this.bookmarks.find(b => b.id === itemId);
            if (!bookmarkToRemove) {
                console.error('Bookmark not found:', itemId);
                return;
            }

            // Hapus bookmark menggunakan removeBookmark (bukan toggle)
            const result = await bookmarkService.removeBookmark(itemId);
            
            if (result) {
                console.log('Bookmark removed successfully');
                // Show feedback
                this.showFeedback('Bookmark berhasil dihapus', 'success');
                
                // Reload data setelah penghapusan
                await this.loadData();
            } else {
                this.showFeedback('Gagal menghapus bookmark', 'error');
            }
            
        } catch (error) {
            console.error('Error removing bookmark:', error);
            this.showFeedback('Terjadi kesalahan saat menghapus', 'error');
        }
    }

    showItemDetail(item) {
        modal_locasi.open(item.nama, item);
    }

    showFeedback(message, type = 'info') {
        // Create feedback element
        const feedback = document.createElement('div');
        feedback.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500 text-white' : 
            type === 'error' ? 'bg-red-500 text-white' : 
            'bg-blue-500 text-white'
        }`;
        feedback.textContent = message;
        
        document.body.appendChild(feedback);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 3000);
    }

    setupThemeListener() {
        this.removeThemeListener();
        this.themeCleanup = theme.registerListener(() => {
            this.render();
            // Event listeners akan otomatis ter-setup via event delegation
        });
    }

    removeThemeListener() {
        if (this.themeCleanup) {
            this.themeCleanup();
            this.themeCleanup = null;
        }
    }

    destroy() {
        this.removeThemeListener();
        window.removeEventListener('bookmarksUpdated', this.bookmarkUpdateHandler);
        this.container.removeEventListener('click', this.handleContainerClick);
    }
}
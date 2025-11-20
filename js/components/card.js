import { bookmarkService } from '../services/bookmarkService.js';

export class Card {
    constructor(item, onDetailClick) {
        this.item = item;
        this.onDetailClick = onDetailClick;
    }

    render() {
        const isBookmarked = bookmarkService.isBookmarked(this.item.id);

        return `
            <div class="card bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
                <div class="relative">
                    <!-- tambahkan block, rounded-top agar tidak ada 'gap' putih di light mode -->
                    <img class="card-img block h-48 w-full object-cover rounded-t-lg" src="${this.item.gambar}" alt="${this.item.nama}" loading="lazy" />

                    <button
                        class="bookmark-btn absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        aria-label="Bookmark"
                        data-item='${JSON.stringify(this.item)}'
                    >
                        <svg class="w-5 h-5 ${isBookmarked ? 'text-primary-500 fill-current' : 'text-gray-500 dark:text-gray-300'}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" ${isBookmarked ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.5"'} />
                        </svg>
                    </button>
                </div>
                <div class="p-4">
                    ${this.item.kategori ? `<p class="text-xs text-primary-500 dark:text-primary-400 font-semibold uppercase">${this.item.kategori}</p>` : ''}
                    <h3 class="text-lg font-semibold mt-1 text-gray-800 dark:text-white">${this.item.nama}</h3>
                    ${this.item.kota ? `<p class="text-sm text-gray-600 dark:text-gray-400">${this.item.kota}</p>` : ''}
                    <div class="mt-4">
                        <button
                            class="detail-btn w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            data-item='${JSON.stringify(this.item)}'
                        >
                            Lihat Detail
                        </button>
                    </div>
                </div>
            </div>
        `;
    }


    // Method untuk setup event listeners pada card element yang sudah di-render
    static setupEventListeners(cardElement, onDetailClick) {
        // Bookmark button
        const bookmarkBtn = cardElement.querySelector('.bookmark-btn');
        if (bookmarkBtn) {
            bookmarkBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent event bubbling
                const itemData = JSON.parse(bookmarkBtn.dataset.item);
                bookmarkService.toggleBookmark(itemData);

                // Show notification after bookmarking
                showBookmarkNotification(itemData, bookmarkService.isBookmarked(itemData.id));
            });
        }

        // Detail button
        const detailBtn = cardElement.querySelector('.detail-btn');
        if (detailBtn && onDetailClick) {
            detailBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent event bubbling
                const itemData = JSON.parse(detailBtn.dataset.item);
                onDetailClick(itemData);
            });
        }
    }
}

// Function to show notification after bookmarking
function showBookmarkNotification(item, isBookmarked) {
    // Remove existing notification if any
    const existingNotification = document.getElementById('bookmark-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.id = 'bookmark-notification';
    notification.className = 'fixed bottom-4 right-4 px-6 py-4 rounded-md shadow-lg z-50 transition-transform transform';

    if (isBookmarked) {
        // Added to bookmarks
        notification.className += ' bg-green-500 text-white';
        notification.innerHTML = `
            <div class="flex items-center justify-between">
                <span>Disimpan ke bookmark!</span>
                <button id="view-bookmarks-btn" class="ml-4 text-white underline text-sm">Lihat</button>
                <button id="close-notification" class="ml-4 text-white">×</button>
            </div>
        `;
    } else {
        // Removed from bookmarks
        notification.className += ' bg-red-500 text-white';
        notification.innerHTML = `
            <div class="flex items-center justify-between">
                <span>Dihapus dari bookmark!</span>
                <button id="close-notification" class="ml-4 text-white">×</button>
            </div>
        `;
    }

    document.body.appendChild(notification);

    // Auto hide after 5 seconds
    const hideNotification = setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);

    // Close button event
    const closeBtn = notification.querySelector('#close-notification');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            clearTimeout(hideNotification);
            notification.remove();
        });
    }

    // View bookmarks button event
    const viewBtn = notification.querySelector('#view-bookmarks-btn');
    if (viewBtn) {
        viewBtn.addEventListener('click', () => {
            window.location.hash = 'bookmark';
            notification.remove();
        });
    }
}
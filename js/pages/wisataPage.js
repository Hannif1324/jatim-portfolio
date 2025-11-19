import { dataService } from '../services/dataService.js';
import { modal } from '../components/ui/modal.js';
import { bookmarkService } from '../services/bookmarkService.js';
import { theme } from '../components/theme/theme.js';

export class WisataPage {
    constructor() {
        this.wisataList = [];
        this.kotaList = [];
        this.filterKota = 'all';
        this.loading = true;
        this.themeCleanup = null;
    }

    async init(container) {
        this.container = container;
        await this.loadData();
        this.render();
        this.setupEventListeners();
        this.setupThemeListener();
    }

    async loadData() {
        this.loading = true;
        this.render(); // Show loading

        const [wisataData, kotaData] = await Promise.all([
            dataService.getWisata(),
            dataService.getKota()
        ]);
        
        this.wisataList = wisataData;
        this.kotaList = kotaData;
        this.loading = false;
        
        this.render(); // Re-render with data
    }

    getFilteredWisata() {
        if (this.filterKota === 'all') {
            return this.wisataList;
        }
        return this.wisataList.filter(w => w.kota === this.filterKota);
    }

    handleDetailClick(wisata) {
        const content = `
            <img src="${wisata.gambar}" alt="${wisata.nama}" class="w-full h-64 object-cover rounded-md mb-4"/>
            <p class="text-gray-700 dark:text-gray-300">${wisata.deskripsi}</p>
            <div class="mt-4 text-sm">
                <p><strong>Lokasi:</strong> ${wisata.kota}</p>
                <p><strong>Kategori:</strong> ${wisata.kategori}</p>
            </div>
        `;
        modal.open(wisata.nama, content);
    }

    render() {
        if (this.loading) {
            this.container.innerHTML = '<div class="text-center p-8">Memuat data wisata...</div>';
            return;
        }

        const filteredWisata = this.getFilteredWisata();

        this.container.innerHTML = `
            <div class="space-y-8 fade-in">
                <div class="text-center">
                    <h1 class="text-3xl font-bold text-gray-800 dark:text-white">Destinasi Wisata di Jawa Timur</h1>
                    <p class="mt-2 text-gray-600 dark:text-gray-400">Jelajahi keindahan alam dan buatan yang memukau.</p>
                </div>

                <div class="flex justify-center">
                    <select
                        id="kota-filter"
                        class="p-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 text-gray-800 dark:text-white"
                    >
                        <option value="all">Semua Kota</option>
                        ${this.kotaList.map(kota => `
                            <option value="${kota.nama}">${kota.nama}</option>
                        `).join('')}
                    </select>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    ${filteredWisata.map(wisata => this.renderWisataCard(wisata)).join('')}
                </div>

                ${filteredWisata.length === 0 ? `
                    <div class="text-center py-12">
                        <p class="text-gray-500 dark:text-gray-400">Tidak ada wisata ditemukan.</p>
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderWisataCard(wisata) {
        const isBookmarked = bookmarkService.isBookmarked(wisata.id);
        
        return `
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
                <div class="relative">
                    <img class="h-48 w-full object-cover" src="${wisata.gambar}" alt="${wisata.nama}" />
                    <button
                        class="bookmark-btn absolute top-2 right-2 p-2 bg-white/70 dark:bg-gray-900/70 rounded-full backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        data-item='${JSON.stringify({
                            id: wisata.id,
                            type: 'wisata',
                            nama: wisata.nama,
                            kota: wisata.kota
                        })}'
                    >
                        <svg class="w-5 h-5 ${isBookmarked ? 'text-primary-500 fill-current' : 'text-gray-500 dark:text-gray-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" ${isBookmarked ? 'fill="currentColor"' : ''}/>
                        </svg>
                    </button>
                </div>
                <div class="p-4">
                    <span class="text-xs text-primary-500 font-semibold uppercase">${wisata.kategori}</span>
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-white mt-1">${wisata.nama}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">${wisata.kota}</p>
                    <div class="mt-4">
                        <button 
                            class="view-detail w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            data-id="${wisata.id}"
                        >
                            Lihat Detail
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Kota filter
        const filterSelect = this.container.querySelector('#kota-filter');
        if (filterSelect) {
            filterSelect.value = this.filterKota;
            filterSelect.addEventListener('change', (e) => {
                this.filterKota = e.target.value;
                this.render();
                this.setupEventListeners(); // Re-attach event listeners
            });
        }

        // Detail buttons
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('view-detail')) {
                const id = e.target.dataset.id;
                const wisata = this.wisataList.find(w => w.id === id);
                if (wisata) {
                    this.handleDetailClick(wisata);
                }
            }
        });

        // Bookmark buttons
        this.container.addEventListener('click', (e) => {
            const bookmarkBtn = e.target.closest('.bookmark-btn');
            if (bookmarkBtn) {
                const itemData = JSON.parse(bookmarkBtn.dataset.item);
                bookmarkService.toggleBookmark(itemData);
                this.render(); // Re-render to update bookmark states
                this.setupEventListeners(); // Re-attach event listeners
            }
        });
    }

    setupThemeListener() {
        // Remove any existing theme listener
        this.removeThemeListener();

        // Register theme listener to handle theme changes
        this.themeCleanup = theme.registerListener(() => {
            // Re-render to ensure correct theme is applied to dynamically generated content
            this.render();
            this.setupEventListeners();
        });
    }

    removeThemeListener() {
        if (this.themeCleanup) {
            this.themeCleanup();
            this.themeCleanup = null;
        }
    }

    destroy() {
        this.removeThemeListener(); // Remove theme listener
    }
}
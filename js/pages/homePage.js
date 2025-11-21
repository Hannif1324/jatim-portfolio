import { dataService } from '../services/dataService.js';
import { Carousel } from '../components/ui/carousel.js';
import { modal_locasi } from '../components/ui/modal_locasi.js';
import { theme } from '../components/theme/theme.js';

export class HomePage {
    constructor() {
        this.carousel = null;
        this.stats = { kota: 0, wisata: 0, kuliner: 0 };
        this.themeCleanup = null;

        // tempat menyimpan reference handler agar bisa di-remove
        this._clickHandler = null;
    }

    async init(container) {
        this.container = container;
        await this.loadData();
        this.render();
        this.setupCarousel();
        this.setupEventListeners();
        this.setupThemeListener();
    }

    async loadData() {
        const [kota, wisata, kuliner, carouselImages] = await Promise.all([
            dataService.getKota(),
            dataService.getWisata(),
            dataService.getKuliner(),
            dataService.getCarouselImages()
        ]);

        this.stats = {
            kota: kota.length,
            wisata: wisata.length,
            kuliner: kuliner.length
        };

        this.carouselImages = carouselImages;

        // Optionally cache for faster re-render
        this._cache = { kota, wisata, kuliner };
    }

    render() {
        this.container.innerHTML = `
            <div class="fade-in space-y-8">
                <div id="carousel-container" class="rounded-lg overflow-hidden"></div>
                <div class="text-center py-8">
                    <h1 class="text-4xl font-bold text-gray-800 dark:text-white mb-4">Selamat Datang di Jawa Timur</h1>
                    <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Jelajahi keindahan alam, kekayaan budaya, dan kuliner khas Jawa Timur
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
                        <div class="text-3xl font-bold text-primary-600 mb-2">${this.stats.kota}</div>
                        <div class="text-gray-600 dark:text-gray-400">Kota</div>
                    </div>
                    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
                        <div class="text-3xl font-bold text-primary-600 mb-2">${this.stats.wisata}</div>
                        <div class="text-gray-600 dark:text-gray-400">Wisata</div>
                    </div>
                    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
                        <div class="text-3xl font-bold text-primary-600 mb-2">${this.stats.kuliner}</div>
                        <div class="text-gray-600 dark:text-gray-400">Kuliner</div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <a href="#kota" class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow block">
                        <div class="text-2xl mb-2">🏙️</div>
                        <h3 class="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Kota</h3>
                        <p class="text-gray-600 dark:text-gray-400 text-sm">Jelajahi kota-kota di Jawa Timur</p>
                    </a>
                    <a href="#wisata" class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow block">
                        <div class="text-2xl mb-2">🏞️</div>
                        <h3 class="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Wisata</h3>
                        <p class="text-gray-600 dark:text-gray-400 text-sm">Temukan destinasi wisata menarik</p>
                    </a>
                    <a href="#kuliner" class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow block">
                        <div class="text-2xl mb-2">🍜</div>
                        <h3 class="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Kuliner</h3>
                        <p class="text-gray-600 dark:text-gray-400 text-sm">Cicipi kuliner khas daerah</p>
                    </a>
                </div>

                <div class="mt-12">
                    <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">Rekomendasi</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="featured-items"></div>
                </div>
            </div>
        `;

        this.loadFeaturedItems();
    }

    setupCarousel() {
        if (this.carousel) {
            this.carousel.destroy();
            this.carousel = null;
        }
        if (this.carouselImages && this.carouselImages.length > 0) {
            this.carousel = new Carousel('carousel-container', this.carouselImages);
            this.carousel.init();
        }
    }

    async loadFeaturedItems() {
        const featuredContainer = document.getElementById('featured-items');
        if (!featuredContainer) return;

        // prefer cached data if ada
        const wisata = (this._cache && this._cache.wisata) ? this._cache.wisata : await dataService.getWisata();
        const kuliner = (this._cache && this._cache.kuliner) ? this._cache.kuliner : await dataService.getKuliner();

        // Random pick (2 wisata + 1 kuliner)
        const featuredWisata = [...wisata].sort(() => 0.5 - Math.random()).slice(0, 2);
        const featuredKuliner = [...kuliner].sort(() => 0.5 - Math.random()).slice(0, 1);
        const featuredItems = [...featuredWisata, ...featuredKuliner];

        featuredContainer.innerHTML = featuredItems.map(item => this.renderFeaturedCard(item)).join('');
    }

    renderFeaturedCard(item) {
        // Prefer explicit item.type from data source. Fallback heuristic kept but not relied upon.
        const resolvedType = item.type || (item.kategori && item.kategori.toLowerCase().includes('kuliner') ? 'kuliner' : 'wisata');

        // Ensure id as string and try to avoid collisions (prefer numeric/string id from dataService).
        // If id missing, create a slug but this is last resort.
        const rawId = item.id ?? item._id ?? (item.nama ? item.nama.trim() : '');
        const safeId = String(rawId).trim();

        // Add aria attributes for accessibility
        return `
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
                <div class="relative">
                    <img class="h-48 w-full object-cover" src="${item.gambar ?? ''}" alt="${item.nama ?? 'image'}" />
                </div>
                <div class="p-4">
                    <span class="text-xs text-primary-500 font-semibold uppercase">${item.kategori ?? ''}</span>
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-white mt-1">${item.nama ?? ''}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">${item.kota ?? ''}</p>
                    <div class="mt-4">
                        <button
                            type="button"
                            class="view-detail w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            data-id="${safeId}"
                            data-type="${resolvedType}"
                            aria-label="Lihat detail ${item.nama ?? ''}"
                        >
                            Lihat Detail
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // single robust event listener, stored so we can remove later
    setupEventListeners() {
        // remove before add supaya tidak menumpuk
        this.removeEventListeners();

        this._clickHandler = (e) => {
            // gunakan closest untuk menangkap klik pada anak tombol
            const btn = e.target && e.target.closest && e.target.closest('button.view-detail');
            if (!btn) return;

            const id = btn.dataset.id;
            const type = btn.dataset.type;

            if (!id) {
                console.warn('Detail button clicked but no data-id found', btn);
                return;
            }

            this.showItemDetail(id, type);
        };

        this.container.addEventListener('click', this._clickHandler);
    }

    removeEventListeners() {
        if (this._clickHandler && this.container) {
            this.container.removeEventListener('click', this._clickHandler);
            this._clickHandler = null;
        }
    }

    setupThemeListener() {
        // Remove any existing theme listener
        this.removeThemeListener();

        // Register theme listener to handle theme changes
        this.themeCleanup = theme.registerListener(() => {
            // Remove DOM listeners dulu supaya tidak menumpuk
            this.removeEventListeners();

            // Re-render and re-init things safely
            this.render();
            this.setupCarousel();
            this.setupEventListeners();
        });
    }

    removeThemeListener() {
        if (this.themeCleanup) {
            this.themeCleanup();
            this.themeCleanup = null;
        }
    }

    async showItemDetail(id, type) {
        try {
            // normalize id for comparison
            const targetId = String(id);

            // Try to resolve item using provided type
            let item = null;
            if (type === 'wisata') {
                const wisata = (this._cache && this._cache.wisata) ? this._cache.wisata : await dataService.getWisata();
                item = wisata.find(w => String(w.id ?? w._id ?? w.nama) === targetId);
            } else if (type === 'kuliner') {
                const kuliner = (this._cache && this._cache.kuliner) ? this._cache.kuliner : await dataService.getKuliner();
                item = kuliner.find(k => String(k.id ?? k._id ?? k.nama) === targetId);
            }

            // If not found and type was missing/wrong, try both collections as fallback
            if (!item) {
                const [wisata, kuliner] = await Promise.all([
                    (this._cache && this._cache.wisata) ? this._cache.wisata : dataService.getWisata(),
                    (this._cache && this._cache.kuliner) ? this._cache.kuliner : dataService.getKuliner()
                ]);
                item = wisata.find(w => String(w.id ?? w._id ?? w.nama) === targetId)
                    || kuliner.find(k => String(k.id ?? k._id ?? k.nama) === targetId);
            }

            if (item) {
                modal_locasi.open(item.nama, item);
            } else {
                console.warn('Item not found for id:', id, 'type:', type);
            }
        } catch (error) {
            console.error('Error showing item detail:', error);
        }
    }

    destroy() {
        if (this.carousel) {
            this.carousel.destroy();
            this.carousel = null;
        }
        this.removeThemeListener();
        this.removeEventListeners();
    }
}
// js/pages/kulinerPage.js
import { dataService } from '../services/dataService.js';
import { modal_locasi } from '../components/ui/modal_locasi.js';
import { bookmarkService } from '../services/bookmarkService.js';
import { theme } from '../components/theme/theme.js';

export class KulinerPage {
    constructor() {
        this.kulinerList = [];
        this.kotaList = [];
        this.filterKota = 'all';
        this.loading = true;
        this.themeCleanup = null;
        this._containerClickHandler = null;
        this._containerDelegationAttached = false;
    }

    async init(container) {
        this.container = container;
        
        // CHECK AUTO FILTER DARI SEARCH - TAMBAHAN BARU
        this.checkAutoFilter();
        
        await this.loadData();
        this.render();
        this.setupEventListeners();
        this.setupThemeListener();

        try { window.appKulinerPage = this; } catch (e) {}
    }

    // METHOD BARU: Cek dan apply filter otomatis dari search
    checkAutoFilter() {
        const autoFilterData = sessionStorage.getItem('autoFilterData');
        if (autoFilterData) {
            try {
                const data = JSON.parse(autoFilterData);
                
                // Jika ini page kuliner dan data search adalah kuliner
                if (data.type === 'kuliner' && data.kota) {
                    console.log('🔄 Auto-filter kuliner by kota:', data.kota);
                    this.filterKota = data.kota;
                }
                
                // Hapus data setelah dipakai
                sessionStorage.removeItem('autoFilterData');
                
            } catch (error) {
                console.error('Error parsing autoFilterData:', error);
                sessionStorage.removeItem('autoFilterData');
            }
        }
    }

    // ... REST OF THE CODE REMAINS THE SAME ...

    async loadData() {
        this.loading = true;
        this.render();
        try {
            const [kulinerData, kotaData] = await Promise.all([
                dataService.getKuliner(),
                dataService.getKota()
            ]);
            this.kulinerList = Array.isArray(kulinerData) ? kulinerData : [];
            this.kotaList = Array.isArray(kotaData) ? kotaData : [];
        } catch (err) {
            console.error('Error loading kuliner/kota:', err);
            this.kulinerList = [];
            this.kotaList = [];
        } finally {
            this.loading = false;
            this.render();
        }
    }

    getFilteredKuliner() {
        if (!this.filterKota || this.filterKota === 'all') return this.kulinerList;
        const target = String(this.filterKota).toLowerCase().trim();
        return this.kulinerList.filter(k => String(k.kota || '').toLowerCase().trim() === target);
    }

    handleDetailClick(kuliner) {
        if (!kuliner) return;
        modal_locasi.open(kuliner.nama, kuliner);
    }

    render() {
        if (!this.container) return;
        if (this.loading) {
            this.container.innerHTML = '<div class="text-center p-8">Memuat data kuliner...</div>';
            return;
        }

        const filtered = this.getFilteredKuliner();

        this.container.innerHTML = `
            <div class="space-y-8 fade-in">
                <div class="text-center">
                    <h1 class="text-3xl font-bold text-gray-800 dark:text-white">Daftar Kuliner Khas Jawa Timur</h1>
                    <p class="mt-2 text-gray-600 dark:text-gray-400">Cicipi kelezatan otentik dari berbagai daerah.</p>
                </div>

                <div class="flex justify-center">
                    <select
                        id="kota-filter-kuliner"
                        class="p-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 text-gray-800 dark:text-white"
                    >
                        <option value="all">Semua Kota</option>
                        ${this.kotaList.map(k => `<option value="${String(k.nama).trim()}">${k.nama}</option>`).join('')}
                    </select>
                </div>

                <div id="kuliner-cards-container" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    ${filtered.map(k => this.renderKulinerCard(k)).join('')}
                </div>

                ${filtered.length === 0 ? `
                    <div class="text-center py-12">
                        <p class="text-gray-500 dark:text-gray-400">Tidak ada kuliner ditemukan.</p>
                    </div>
                ` : ''}
            </div>
        `;
        // jangan panggil setupEventListeners di sini — dipanggil di luar agar tidak dobel attach
    }

    renderKulinerCard(kuliner) {
        const isBookmarked = bookmarkService.isBookmarked(kuliner.id);
        return `
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300" data-id="${kuliner.id}">
                <div class="relative">
                    <img class="h-48 w-full object-cover block rounded-t-lg" src="${kuliner.gambar}" alt="${kuliner.nama}" />
                    <button
                        class="bookmark-btn absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        data-item='${JSON.stringify({
                            id: kuliner.id,
                            type: 'kuliner',
                            nama: kuliner.nama,
                            kota: kuliner.kota
                        })}'
                        aria-label="Bookmark"
                    >
                        <svg class="w-5 h-5 ${isBookmarked ? 'text-primary-500 fill-current' : 'text-gray-500 dark:text-gray-400'}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" ${isBookmarked ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.5"'} />
                        </svg>
                    </button>
                </div>
                <div class="p-4">
                    ${kuliner.kategori ? `<p class="text-xs text-primary-500 font-semibold uppercase">${kuliner.kategori}</p>` : ''}
                    <h3 class="text-lg font-semibold mt-1 text-gray-800 dark:text-white">${kuliner.nama}</h3>
                    ${kuliner.kota ? `<p class="text-sm text-gray-600 dark:text-gray-400">${kuliner.kota}</p>` : ''}
                    <div class="mt-4">
                        <button
                            class="view-detail w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            data-id="${kuliner.id}"
                        >Lihat Detail</button>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
    if (!this.container) return;

    // --- SELECT handler (FIXED) ---
    // Gunakan event delegation untuk select juga, atau attach langsung
    const filterSelect = this.container.querySelector('#kota-filter-kuliner');
    if (filterSelect) {
        // Hapus event listener lama dulu (jika ada)
        const newFilterSelect = filterSelect.cloneNode(true);
        filterSelect.parentNode.replaceChild(newFilterSelect, filterSelect);
        
        // Set nilai select berdasarkan state current
        newFilterSelect.value = this.filterKota;
        
        // Attach event listener baru
        newFilterSelect.addEventListener('change', (e) => {
            const raw = String(e.target.value || 'all').trim();
            this.filterKota = raw;
            console.log('[KulinerPage] filter changed ->', this.filterKota);
            this.render();
            // Setelah render, setup event listeners lagi
            this.setupEventListeners();
        });
    }

    // --- Delegated click handler (tetap sama) ---
    if (!this._containerDelegationAttached) {
        this._containerClickHandler = (e) => {
            // detail
            const detailBtn = e.target.closest('.view-detail');
            if (detailBtn && this.container.contains(detailBtn)) {
                const id = detailBtn.dataset.id;
                const kul = this.kulinerList.find(item => item.id === id);
                if (kul) this.handleDetailClick(kul);
                return;
            }

            // bookmark
            const bookmarkBtn = e.target.closest('.bookmark-btn');
            if (bookmarkBtn && this.container.contains(bookmarkBtn)) {
                try {
                    const itemData = JSON.parse(bookmarkBtn.dataset.item || '{}');
                    if (itemData && itemData.id) {
                        bookmarkService.toggleBookmark(itemData);
                        this.render();
                        this.setupEventListeners(); // ← penting setelah render
                    }
                } catch (err) {
                    console.error('Invalid bookmark data:', err);
                }
            }
        };

        this.container.addEventListener('click', this._containerClickHandler);
        this._containerDelegationAttached = true;
    }
    }

    setupThemeListener() {
        this.removeThemeListener();
        this.themeCleanup = theme.registerListener(() => {
            // re-render and ensure event listeners still valid
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
        // remove delegation if attached
        if (this._containerDelegationAttached && this._containerClickHandler && this.container) {
            this.container.removeEventListener('click', this._containerClickHandler);
            this._containerDelegationAttached = false;
            this._containerClickHandler = null;
        }
        this.removeThemeListener();
    }
}

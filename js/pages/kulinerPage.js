// js/pages/kulinerPage.js - FIXED VERSION
import { dataService } from '../services/dataService.js';
import { modal } from '../components/ui/modal.js';
import { Card } from '../components/card.js';
import { theme } from '../components/theme/theme.js';

export class KulinerPage {
    constructor() {
        this.kulinerList = [];
        this.kotaList = [];
        this.selectedKuliner = null;
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
        this.render();

        try {
            const [kulinerData, kotaData] = await Promise.all([
                dataService.getKuliner(),
                dataService.getKota()
            ]);
            
            this.kulinerList = kulinerData;
            this.kotaList = kotaData;
            this.loading = false;
            this.render();
        } catch (error) {
            console.error('Error loading data:', error);
            this.loading = false;
            this.render();
        }
    }

    getFilteredKuliner() {
        if (this.filterKota === 'all') {
            return this.kulinerList;
        }
        return this.kulinerList.filter(k => k.kota === this.filterKota);
    }

    handleDetailClick(kuliner) {
        this.selectedKuliner = kuliner;
        this.showModal();
    }

    closeModal() {
        this.selectedKuliner = null;
        this.render();
    }

    showModal() {
        if (!this.selectedKuliner) return;

        const content = `
            <img src="${this.selectedKuliner.gambar}" alt="${this.selectedKuliner.nama}" class="w-full h-64 object-cover rounded-md mb-4"/>
            <p class="text-gray-700 dark:text-gray-300">${this.selectedKuliner.deskripsi}</p>
            <div class="mt-4 text-sm">
                <p><strong>Kota Asal:</strong> ${this.selectedKuliner.kota}</p>
                <p><strong>Kategori:</strong> ${this.selectedKuliner.kategori}</p>
            </div>
        `;

        modal.open(this.selectedKuliner.nama, content, () => {
            this.closeModal();
        });
    }

    render() {
        if (this.loading) {
            this.container.innerHTML = '<div class="text-center p-8">Memuat data kuliner...</div>';
            return;
        }

        const filteredKuliner = this.getFilteredKuliner();

        this.container.innerHTML = `
            <div class="space-y-8">
                <div class="text-center">
                    <h1 class="text-3xl font-bold text-gray-800 dark:text-white">Daftar Kuliner Khas Jawa Timur</h1>
                    <p class="mt-2 text-gray-600 dark:text-gray-400">Cicipi kelezatan otentik dari berbagai daerah.</p>
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

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="kuliner-cards-container">
                    ${this.renderCards()}
                </div>

                ${filteredKuliner.length === 0 ? `
                    <div class="text-center py-12">
                        <p class="text-gray-500 dark:text-gray-400">Tidak ada kuliner ditemukan.</p>
                    </div>
                ` : ''}
            </div>
        `;

        this.setupCardEventListeners();
    }

    renderCards() {
        const filteredKuliner = this.getFilteredKuliner();
        
        return filteredKuliner.map(kuliner => {
            // Create Card instance dan render HTML
            const card = new Card(
                { 
                    ...kuliner, 
                    type: 'kuliner'
                },
                (item) => this.handleDetailClick(item)
            );
            
            return card.render();
        }).join('');
    }

    setupCardEventListeners() {
        const cardsContainer = document.getElementById('kuliner-cards-container');
        if (!cardsContainer) return;

        const cardElements = cardsContainer.querySelectorAll('.bg-white, .dark\\:bg-gray-800');
        
        cardElements.forEach((cardElement, index) => {
            const filteredKuliner = this.getFilteredKuliner();
            const kuliner = filteredKuliner[index];
            
            if (kuliner) {
                // Setup event listeners menggunakan static method Card
                Card.setupEventListeners(cardElement, (item) => {
                    this.handleDetailClick(item);
                });
            }
        });
    }

    setupEventListeners() {
        const filterSelect = this.container.querySelector('#kota-filter');
        if (filterSelect) {
            filterSelect.value = this.filterKota;
            filterSelect.addEventListener('change', (e) => {
                this.filterKota = e.target.value;
                this.render();
            });
        }
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
        this.selectedKuliner = null;
        this.removeThemeListener(); // Remove theme listener
    }
}
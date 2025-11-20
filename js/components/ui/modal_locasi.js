// js/components/ui/modal_locasi.js
import { bookmarkService } from '../../services/bookmarkService.js';

class ModalLocasi {
    constructor() {
        this.isOpen = false;
        this.currentItem = null;
    }

    open(title, item) {
        this.currentItem = item;
        this.isOpen = true;
        
        // Remove existing modal if present
        const existingModal = document.getElementById('modal-locasi');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create modal element
        const modal = document.createElement('div');
        modal.id = 'modal-locasi';
        modal.className = 'fixed inset-0 z-50 overflow-y-auto';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modal.style.backdropFilter = 'blur(4px)';
        
        // Generate modal content based on item type
        const modalContent = this.generateModalContent(item);
        
        modal.innerHTML = `
            <div class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 w-full max-w-3xl mx-4">
                <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                        <div class="mt-3 w-full sm:mt-0">
                            <div class="flex justify-between items-start mb-4">
                                <h3 class="text-2xl font-bold leading-6 text-gray-900 dark:text-white">${title}</h3>
                                <div class="flex space-x-2">
                                    <button 
                                        class="bookmark-btn-modal text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 focus:outline-none"
                                        data-item='${JSON.stringify(item)}'
                                    >
                                        <svg class="w-6 h-6 ${bookmarkService.isBookmarked(item.id) ? 'text-primary-500 fill-current' : ''}" fill="${bookmarkService.isBookmarked(item.id) ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                                            <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" stroke-width="1.5" ${bookmarkService.isBookmarked(item.id) ? 'fill="currentColor"' : ''}/>
                                        </svg>
                                    </button>
                                    <button 
                                        class="close-modal text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                                        aria-label="Close"
                                    >
                                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div class="mt-2">
                                ${modalContent}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Append modal to body
        document.body.appendChild(modal);
        
        // Setup event listeners
        this.setupEventListeners(modal);
    }
    
    generateModalContent(item) {
        let content = '';
        
        // Image
        if (item.gambar) {
            content += `<img src="${item.gambar}" alt="${item.nama}" class="w-full h-64 object-cover rounded-md mb-4">`;
        }
        
        // Description
        if (item.deskripsi) {
            content += `<p class="text-gray-700 dark:text-gray-300">${item.deskripsi}</p>`;
        }
        
        // Kota
        if (item.kota) {
            content += `<p class="mt-2"><strong>Kota:</strong> ${item.kota}</p>`;
        }
        
        // Category
        if (item.kategori) {
            content += `<p><strong>Kategori:</strong> ${item.kategori}</p>`;
        }
        
        // Location details based on type
        if (item.type === 'wisata' || item.kategori && (item.kategori.toLowerCase().includes('wisata') || item.kategori.toLowerCase().includes('destinasi') || item.kategori.toLowerCase().includes('alam') || item.kategori.toLowerCase().includes('gunung') || item.kategori.toLowerCase().includes('pantai') || item.kategori.toLowerCase().includes('taman') || item.kategori.toLowerCase().includes('air terjun'))) {
            // Maps embed
            content += `<div class="mt-4">
                            <h4 class="font-semibold text-gray-800 dark:text-white">Lokasi:</h4>
                            <div class="mt-2">
                                <iframe 
                                    width="100%" 
                                    height="300" 
                                    style="border:0" 
                                    loading="lazy" 
                                    allowfullscreen 
                                    referrerpolicy="no-referrer-when-downgrade"
                                    src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUYU9r_QVwA6VZwLRA&q=${encodeURIComponent(item.nama + ', ' + item.kota)}">
                                </iframe>
                            </div>
                        </div>`;
            
            // Ticket price if available
            if (item.hargaTiket) {
                content += `<p class="mt-2"><strong>Harga Tiket Masuk:</strong> ${item.hargaTiket}</p>`;
            }
        } else if (item.type === 'kuliner' || item.kategori && (item.kategori.toLowerCase().includes('kuliner') || item.kategori.toLowerCase().includes('makanan') || item.kategori.toLowerCase().includes('restoran') || item.kategori.toLowerCase().includes('warung'))) {
            // Maps embed
            content += `<div class="mt-4">
                            <h4 class="font-semibold text-gray-800 dark:text-white">Lokasi:</h4>
                            <div class="mt-2">
                                <iframe 
                                    width="100%" 
                                    height="300" 
                                    style="border:0" 
                                    loading="lazy" 
                                    allowfullscreen 
                                    referrerpolicy="no-referrer-when-downgrade"
                                    src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUYU9r_QVwA6VZwLRA&q=${encodeURIComponent(item.nama + ', ' + item.kota)}">
                                </iframe>
                            </div>
                        </div>`;
            
            // Price if available
            if (item.harga) {
                content += `<p class="mt-2"><strong>Harga 1 Porsi:</strong> ${item.harga}</p>`;
            }
        } else if (item.type === 'kota' || item.kategori && (item.kategori.toLowerCase().includes('kota') || item.kategori.toLowerCase().includes('kabupaten'))) {
            // Maps embed for cities
            content += `<div class="mt-4">
                            <h4 class="font-semibold text-gray-800 dark:text-white">Lokasi:</h4>
                            <div class="mt-2">
                                <iframe 
                                    width="100%" 
                                    height="300" 
                                    style="border:0" 
                                    loading="lazy" 
                                    allowfullscreen 
                                    referrerpolicy="no-referrer-when-downgrade"
                                    src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUYU9r_QVwA6VZwLRA&q=${encodeURIComponent(item.nama)}">
                                </iframe>
                            </div>
                        </div>`;
            
            // Population if available
            if (item.populasi) {
                content += `<p class="mt-2"><strong>Populasi:</strong> ${item.populasi.toLocaleString('id-ID')}</p>`;
            }
        } else {
            // Generic location if type is not specified
            content += `<div class="mt-4">
                            <h4 class="font-semibold text-gray-800 dark:text-white">Lokasi:</h4>
                            <div class="mt-2">
                                <iframe 
                                    width="100%" 
                                    height="300" 
                                    style="border:0" 
                                    loading="lazy" 
                                    allowfullscreen 
                                    referrerpolicy="no-referrer-when-downgrade"
                                    src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUYU9r_QVwA6VZwLRA&q=${encodeURIComponent(item.nama + ', ' + (item.kota || ''))}">
                                </iframe>
                            </div>
                        </div>`;
        }
        
        return content;
    }
    
    setupEventListeners(modal) {
        // Close button
        const closeButton = modal.querySelector('.close-modal');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.close();
            });
        }
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.close();
            }
        });
        
        // Bookmark button
        const bookmarkBtn = modal.querySelector('.bookmark-btn-modal');
        if (bookmarkBtn) {
            bookmarkBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const item = JSON.parse(bookmarkBtn.dataset.item);
                bookmarkService.toggleBookmark(item);
                
                // Update icon
                const svg = bookmarkBtn.querySelector('svg');
                const isBookmarked = bookmarkService.isBookmarked(item.id);
                svg.classList.toggle('text-primary-500', isBookmarked);
                svg.classList.toggle('fill-current', isBookmarked);
                svg.setAttribute('fill', isBookmarked ? 'currentColor' : 'none');
                
                const path = svg.querySelector('path');
                path.setAttribute('fill', isBookmarked ? 'currentColor' : '');
            });
        }
        
        // Close on Escape key
        document.addEventListener('keydown', this.handleEscapeKey.bind(this));
    }
    
    handleEscapeKey(e) {
        if (e.key === 'Escape' && this.isOpen) {
            this.close();
        }
    }
    
    close() {
        const modal = document.getElementById('modal-locasi');
        if (modal) {
            modal.remove();
        }
        this.isOpen = false;
        this.currentItem = null;
        
        // Remove escape event listener
        document.removeEventListener('keydown', this.handleEscapeKey);
    }
}

// Export the modal instance
export const modal_locasi = new ModalLocasi();
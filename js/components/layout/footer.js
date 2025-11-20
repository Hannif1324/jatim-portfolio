export class Footer {
    init(container) {
        this.container = container;
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <footer class="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <!-- Main Footer Content -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                        
                        <!-- Logo dan Deskripsi -->
                        <div class="space-y-4">
                            <div class="flex items-center space-x-3">
                                <img src="https://res.cloudinary.com/dz0hpyxbi/image/upload/v1763563036/post_auto/l01mlsj3kmbfvjgctj3f.png" 
                                     alt="Logo Jawa Timur" 
                                     class="h-12 w-auto object-contain">
                                <img src="https://res.cloudinary.com/dz0hpyxbi/image/upload/v1763562916/post_auto/oliavoro0kmjqlwou5oe.png" 
                                     alt="Logo SMK PGRI 1 Kota Kediri" 
                                     class="h-10 w-auto object-contain">
                            </div>
                            <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                Portal informasi lengkap tentang keindahan Jawa Timur. Menampilkan wisata, kuliner, 
                                dan budaya dari berbagai kota di provinsi Jawa Timur.
                            </p>
                            <div class="flex space-x-4">
                                <a href="#" class="text-gray-400 hover:text-primary-500 transition-colors">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                                    </svg>
                                </a>
                                <a href="#" class="text-gray-400 hover:text-primary-500 transition-colors">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                                    </svg>
                                </a>
                                <a href="#" class="text-gray-400 hover:text-primary-500 transition-colors">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <!-- Quick Links -->
                        <div class="space-y-4">
                            <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Navigasi Cepat</h3>
                            <div class="grid grid-cols-2 gap-2">
                                <a href="#home" class="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors text-sm">Beranda</a>
                                <a href="#wisata" class="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors text-sm">Wisata</a>
                                <a href="#kuliner" class="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors text-sm">Kuliner</a>
                                <a href="#kota" class="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors text-sm">Kota</a>
                                <a href="#statistik" class="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors text-sm">Statistik</a>
                                <a href="#bookmark" class="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors text-sm">Bookmark</a>
                                <a href="#tentang" class="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors text-sm">Tentang</a>
                            </div>
                        </div>

                        <!-- Peta Jawa Timur -->
                        <div class="space-y-4">
                            <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Peta Jawa Timur</h3>
                            <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                <div class="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                                    <div class="text-center text-gray-500 dark:text-gray-400">
                                        <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                                        </svg>
                                        <p class="text-sm">Peta Interaktif Jawa Timur</p>
                                        <p class="text-xs mt-1">Fitur akan segera hadir</p>
                                    </div>
                                </div>
                                <button class="w-full mt-3 bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors">
                                    Jelajahi Peta
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Bottom Section -->
                    <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                            <p class="text-gray-500 dark:text-gray-400 text-sm">
                                &copy; ${new Date().getFullYear()} Jawa Timur Explorer. Dibuat dengan ❤️ oleh SMK PGRI 1 Kota Kediri
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        `;
    }
}
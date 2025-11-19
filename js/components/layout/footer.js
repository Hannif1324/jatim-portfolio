export class Footer {
    init(container) {
        this.container = container;
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
                <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <p class="text-center text-gray-500 dark:text-gray-400">
                        &copy; ${new Date().getFullYear()} Jawa Timur Portfolio. All rights reserved.
                    </p>
                </div>
            </footer>
        `;
    }
}
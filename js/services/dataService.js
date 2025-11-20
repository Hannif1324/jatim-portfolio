// LocalBase instance
const db = new Localbase('Base');

// Data templates (sama dengan yang di React)
export const Kota = {
    id: '',
    nama: '',
    populasi: 0,
    coords: { lat: 0, lng: 0 },
    deskripsi: '',
    gambar: '',
    mapsUrl: '', // Tambahan: URL Google Maps
    mapsImage: '' // Tambahan: Gambar peta statis
};

export const Kuliner = {
    id: '',
    nama: '',
    kota: '',
    kategori: '',
    gambar: '',
    deskripsi: '',
    harga: '', // Harga 1 porsi kuliner
    mapsUrl: '', // Tambahan: URL Google Maps lokasi kuliner
    mapsImage: '', // Tambahan: Gambar peta statis
    rating: 0 // Tambahan: Rating kuliner
};

export const Wisata = {
    id: '',
    nama: '',
    kota: '',
    kategori: '',
    gambar: '',
    deskripsi: '',
    hargaTiket: '', // Harga tiket masuk wisata
    mapsUrl: '', // Tambahan: URL Google Maps lokasi wisata
    mapsImage: '', // Tambahan: Gambar peta statis
    rating: 0 // Tambahan: Rating wisata
};

export const CarouselImage = {
    id: '',
    src: '',
    alt: '',
};

export const Bookmark = {
    id: '',
    type: '', // 'kuliner' | 'wisata' | 'kota'
    nama: '',
    kota: '',
    createdAt: 0,
};

// Seed data dengan tambahan maps, URL, dan harga
const seedKota = [
    { 
        id: 'surabaya', 
        nama: 'Surabaya', 
        populasi: 3000000, 
        coords: { lat: -7.250445, lng: 112.768845 }, 
        deskripsi: 'Surabaya adalah ibu kota Provinsi Jawa Timur dan merupakan kota metropolitan terbesar kedua di Indonesia. Dikenal sebagai Kota Pahlawan karena perannya dalam pertempuran kemerdekaan Indonesia.', 
        gambar: 'https://picsum.photos/seed/surabaya/800/600',
        mapsUrl: 'https://maps.google.com/?q=Surabaya,Jawa+Timur',
        mapsImage: 'https://maps.googleapis.com/maps/api/staticmap?center=Surabaya,East+Java&zoom=12&size=400x300&markers=color:red%7CSurabaya,East+Java'
    },
    
    { 
        id: 'probolinggo', 
        nama: 'Probolinggo', 
        populasi: 200000, 
        coords: { lat: -7.766667, lng: 113.208333 }, 
        deskripsi: 'Probolinggo adalah kota pelabuhan yang sibuk dan menjadi gerbang utama menuju Taman Nasional Bromo Tengger Semeru yang terkenal di dunia.', 
        gambar: 'https://picsum.photos/seed/probolinggo/800/600',
        mapsUrl: 'https://maps.google.com/?q=Probolinggo,Jawa+Timur',
        mapsImage: 'https://maps.googleapis.com/maps/api/staticmap?center=Probolinggo,East+Java&zoom=12&size=400x300&markers=color:red%7CProbolinggo,East+Java'
    },
    
    { 
        id: 'malang', 
        nama: 'Malang', 
        populasi: 800000, 
        coords: { lat: -7.9797, lng: 112.6304 }, 
        deskripsi: 'Terletak di dataran tinggi, Malang dikenal dengan udaranya yang sejuk, arsitektur kolonial, dan sebagai pusat pendidikan. Kota ini dikelilingi oleh pegunungan dan perkebunan apel.', 
        gambar: 'https://picsum.photos/seed/malang/800/600',
        mapsUrl: 'https://maps.google.com/?q=Malang,Jawa+Timur',
        mapsImage: 'https://maps.googleapis.com/maps/api/staticmap?center=Malang,East+Java&zoom=12&size=400x300&markers=color:red%7CMalang,East+Java'
    },
    
    { 
        id: 'kediri', 
        nama: 'Kediri', 
        populasi: 290000, 
        coords: { lat: -7.848016, lng: 112.017829 }, 
        deskripsi: 'Kediri adalah salah satu kota tertua di Indonesia, dikenal sebagai pusat industri rokok dan memiliki sejarah panjang sejak era Kerajaan Kediri.', 
        gambar: 'https://picsum.photos/seed/kediri/800/600',
        mapsUrl: 'https://maps.google.com/?q=Kediri,Jawa+Timur',
        mapsImage: 'https://maps.googleapis.com/maps/api/staticmap?center=Kediri,East+Java&zoom=12&size=400x300&markers=color:red%7CKediri,East+Java'
    },
    
    { 
        id: 'madiun', 
        nama: 'Madiun', 
        populasi: 210000, 
        coords: { lat: -7.629714, lng: 111.523274 }, 
        deskripsi: 'Madiun dikenal sebagai Kota Gadis dan memiliki sejarah sebagai pusat kereta api serta industri persenjataan di Jawa Timur.', 
        gambar: 'https://picsum.photos/seed/madiun/800/600',
        mapsUrl: 'https://maps.google.com/?q=Madiun,Jawa+Timur',
        mapsImage: 'https://maps.googleapis.com/maps/api/staticmap?center=Madiun,East+Java&zoom=12&size=400x300&markers=color:red%7CMadiun,East+Java'
    },
    
    { 
        id: 'blitar', 
        nama: 'Blitar', 
        populasi: 150000, 
        coords: { lat: -8.098172, lng: 112.168243 }, 
        deskripsi: 'Blitar terkenal sebagai tempat dimakamkannya Presiden pertama Republik Indonesia, Ir. Soekarno, dan memiliki budaya serta sejarah yang kuat.', 
        gambar: 'https://picsum.photos/seed/blitar/800/600',
        mapsUrl: 'https://maps.google.com/?q=Blitar,Jawa+Timur',
        mapsImage: 'https://maps.googleapis.com/maps/api/staticmap?center=Blitar,East+Java&zoom=12&size=400x300&markers=color:red%7CBlitar,East+Java'
    }
];

const seedKuliner = [
    { 
        id: 'rawon-surabaya', 
        nama: 'Rawon Setan', 
        kota: 'Surabaya', 
        kategori: 'Makanan Berat', 
        gambar: 'https://picsum.photos/seed/rawon/400/300', 
        deskripsi: 'Sup daging sapi berkuah hitam pekat yang kaya rempah, menggunakan kluwek sebagai bumbu utama yang memberikan wrna dan rasa khas.', 
        harga: 'Rp 25,000',
        mapsUrl: 'https://maps.google.com/?q=Rawon+Setan,Surabaya',
        mapsImage: 'https://maps.googleapis.com/maps/api/staticmap?center=Surabaya,East+Java&zoom=13&size=400x300&markers=color:blue%7CSurabaya,East+Java',
        rating: 4.7
    },

    { 
        id: 'soto-lamongan', 
        nama: 'Soto Lamongan', 
        kota: 'Surabaya', 
        kategori: 'Makanan Berat', 
        gambar: 'https://picsum.photos/seed/soto/400/300', 
        deskripsi: 'Soto ayam bening dengan bubuk koya yang gurih, disajikan dengan irisan ayam, telur, dan seledri.', 
        harga: 'Rp 15,000',
        mapsUrl: 'https://maps.google.com/?q=Soto+Lamongan,Surabaya',
        mapsImage: 'https://maps.googleapis.com/maps/api/staticmap?center=Surabaya,East+Java&zoom=13&size=400x300&markers=color:blue%7CSurabaya,East+Java',
        rating: 4.5
    },

    { 
        id: 'tahu-lontong-probolinggo', 
        nama: 'Tahu Lontong', 
        kota: 'Probolinggo', 
        kategori: 'Makanan Ringan', 
        gambar: 'https://picsum.photos/seed/tahulontong/400/300', 
        deskripsi: 'Hidangan sederhana yang terdiri dari tahu goreng, lontong, tauge, dan disiram bumbu kacang petis yang lezat.', 
        harga: 'Rp 10,000',
        mapsUrl: 'https://maps.google.com/?q=Tahu+Lontong,Probolinggo',
        mapsImage: 'https://maps.googleapis.com/maps/api/staticmap?center=Probolinggo,East+Java&zoom=13&size=400x300&markers=color:blue%7CProbolinggo,East+Java',
        rating: 4.3
    },

    { 
        id: 'bakso-malang', 
        nama: 'Bakso Bakar Malang', 
        kota: 'Malang', 
        kategori: 'Makanan Berat', 
        gambar: 'https://picsum.photos/seed/bakso/400/300', 
        deskripsi: 'Bakso khas Malang yang tidak hanya direbus, tetapi juga dibakar dan dilumuri bumbu kecap pedas manis, disajikan dengan pangsit dan tahu.', 
        harga: 'Rp 18,000',
        mapsUrl: 'https://maps.google.com/?q=Bakso+Bakar,Malang',
        mapsImage: 'https://maps.googleapis.com/maps/api/staticmap?center=Malang,East+Java&zoom=13&size=400x300&markers=color:blue%7CMalang,East+Java',
        rating: 4.6
    },

    { 
        id: 'cwie-mie-malang', 
        nama: 'Cwie Mie Malang', 
        kota: 'Malang', 
        kategori: 'Makanan Berat', 
        gambar: 'https://picsum.photos/seed/cwiemie/400/300', 
        deskripsi: 'Mi khas Malang dengan topping ayam giling yang lembut dan taburan bawang goreng, disajikan dengan kuah terpisah.', 
        harga: 'Rp 17,000',
        mapsUrl: 'https://maps.google.com/?q=Cwie+Mie,Malang',
        mapsImage: 'https://maps.googleapis.com/maps/api/staticmap?center=Malang,East+Java&zoom=13&size=400x300&markers=color:blue%7CMalang,East+Java',
        rating: 4.4
    },

    { 
        id: 'pecel-madiun', 
        nama: 'Pecel Madiun', 
        kota: 'Madiun', 
        kategori: 'Makanan Berat', 
        gambar: 'https://picsum.photos/seed/pecelmadiun/400/300', 
        deskripsi: 'Hidangan sayuran dengan sambal kacang khas Madiun yang pedas, wangi daun jeruk, dan biasanya disajikan dengan rempeyek.', 
        harga: 'Rp 12,000',
        mapsUrl: 'https://maps.google.com/?q=Pecel+Madiun',
        mapsImage: 'https://maps.googleapis.com/maps/api/staticmap?center=Madiun,East+Java&zoom=13&size=400x300&markers=color:blue%7CMadiun,East+Java',
        rating: 4.5
    },

    { 
        id: 'tahu-tek-surabaya', 
        nama: 'Tahu Tek', 
        kota: 'Surabaya', 
        kategori: 'Makanan Ringan', 
        gambar: 'https://picsum.photos/seed/tahutek/400/300', 
        deskripsi: 'Tahu goreng dan lontong yang dipotong dengan gunting, disiram bumbu petis kacang yang gurih dan nikmat.', 
        harga: 'Rp 15,000',
        mapsUrl: 'https://maps.google.com/?q=Tahu+Tek,Surabaya',
        mapsImage: 'https://maps.googleapis.com/maps/api/staticmap?center=Surabaya,East+Java&zoom=13&size=400x300&markers=color:blue%7CSurabaya,East+Java',
        rating: 4.4
    },

    { 
        id: 'tahu-kuning-kediri', 
        nama: 'Tahu Kuning Kediri', 
        kota: 'Kediri', 
        kategori: 'Makanan Ringan', 
        gambar: 'https://picsum.photos/seed/tahukuning/400/300', 
        deskripsi: 'Tahu khas Kediri yang berwarna kuning alami dari kunyit, memiliki tekstur lembut dan rasa gurih, menjadi ikon kuliner dari Kota Tahu.', 
        harga: 'Rp 8,000',
        mapsUrl: 'https://maps.google.com/?q=Tahu+Kuning,Kediri',
        mapsImage: 'https://maps.googleapis.com/maps/api/staticmap?center=Kediri,East+Java&zoom=13&size=400x300&markers=color:blue%7CKediri,East+Java',
        rating: 4.3
    },

    { 
        id: 'es-pleret-blitar', 
        nama: 'Es Pleret', 
        kota: 'Blitar', 
        kategori: 'Minuman', 
        gambar: 'https://picsum.photos/seed/espleret/400/300', 
        deskripsi: 'Minuman tradisional Blitar berisi bola-bola tepung beras kenyal dengan kuah santan dan gula merah yang menyegarkan.', 
        harga: 'Rp 7,000',
        mapsUrl: 'https://maps.google.com/?q=Es+Pleret,Blitar',
        mapsImage: 'https://maps.googleapis.com/maps/api/staticmap?center=Blitar,East+Java&zoom=13&size=400x300&markers=color:blue%7CBlitar,East+Java',
        rating: 4.2
    }
];

const seedWisata = [
    {
        id: 'coban-rondo', 
        nama: 'Coban Rondo', 
        kota: 'Malang', 
        kategori: 'Air Terjun', 
        gambar: 'https://picsum.photos/seed/cobanrondo/400/300', 
        deskripsi: 'Air terjun yang indah dengan ketinggian sekitar 84 meter, dikelilingi oleh hutan pinus yang asri dan sejuk.', 
        hargaTiket: 'Rp 15,000',
        mapsUrl: 'https://maps.google.com/?q=Coban+Rondo,Malang',
        mapsImage: 'https://maps.googleapis.com/maps/api/staticmap?center=Coban+Rondo,Malang&zoom=12&size=400x300&markers=color:green%7CCoban+Rondo,Malang',
        rating: 4.5
    },

    {
        id: 'bromo', 
        nama: 'Gunung Bromo', 
        kota: 'Probolinggo', 
        kategori: 'Gunung', 
        gambar: 'https://picsum.photos/seed/bromo/400/300', 
        deskripsi: 'Gunung berapi aktif yang terkenal dengan pemandangan matahari terbitnya yang spektakuler di atas lautan pasir dan kawah yang masih mengepul.', 
        hargaTiket: 'Rp 290,000 (termasuk kendaraan)',
        mapsUrl: 'https://maps.google.com/?q=Gunung+Bromo,Probolinggo',
        mapsImage: 'https://maps.googleapis.com/maps/api/staticmap?center=Bromo,East+Java&zoom=12&size=400x300&markers=color:green%7CBromo,East+Java',
        rating: 4.8
    },

    {
        id: 'jembatan-suramadu', 
        nama: 'Jembatan Suramadu', 
        kota: 'Surabaya', 
        kategori: 'Arsitektur', 
        gambar: 'https://picsum.photos/seed/suramadu/400/300', 
        deskripsi: 'Jembatan kabel terpanjang di Indonesia yang menghubungkan Surabaya dengan Pulau Madura, menawarkan pemandangan indah terutama saat malam hari.', 
        hargaTiket: 'Gratis',
        mapsUrl: 'https://maps.google.com/?q=Jembatan+Suramadu,Surabaya',
        mapsImage: 'https://maps.googleapis.com/maps/api/staticmap?center=Suramadu+Bridge,Surabaya&zoom=12&size=400x300&markers=color:green%7CSuramadu+Bridge,Surabaya',
        rating: 4.4
    },

    {
        id: 'jatim-park-2', 
        nama: 'Jatim Park 2', 
        kota: 'Malang', 
        kategori: 'Taman Hiburan', 
        gambar: 'https://picsum.photos/seed/jatimpark/400/300', 
        deskripsi: 'Taman rekreasi edukatif yang terdiri dari Museum Satwa dan Batu Secret Zoo, cocok untuk liburan keluarga.', 
        hargaTiket: 'Rp 130,000 (Museum Satwa), Rp 150,000 (Batu Secret Zoo)',
        mapsUrl: 'https://maps.google.com/?q=Jatim+Park+2,Malang',
        mapsImage: 'https://maps.googleapis.com/maps/api/staticmap?center=Jatim+Park+2,Malang&zoom=12&size=400x300&markers=color:green%7CJatim+Park+2,Malang',
        rating: 4.6
    },

    {
        id: 'kawah-ijen', 
        nama: 'Kawah Ijen', 
        kota: 'Banyuwangi', 
        kategori: 'Gunung', 
        gambar: 'https://picsum.photos/seed/ijen/400/300', 
        deskripsi: 'Gunung berapi dengan fenomena api biru yang langka dan danau kawah berwarna toska, menjadi salah satu destinasi paling terkenal di Indonesia.', 
        hargaTiket: 'Rp 75,000 (tiket masuk kawasan)',
        mapsUrl: 'https://maps.google.com/?q=Kawah+Ijen,Banyuwangi',
        mapsImage: 'https://maps.googleapis.com/maps/api/staticmap?center=Ijen+Crater,Banyuwangi&zoom=12&size=400x300&markers=color:green%7CIjen+Crater,Banyuwangi',
        rating: 4.7
    },

    {
        id: 'pantai-papuma', 
        nama: 'Pantai Papuma', 
        kota: 'Jember', 
        kategori: 'Pantai', 
        gambar: 'https://picsum.photos/seed/papuma/400/300', 
        deskripsi: 'Pantai berpasir putih dengan batu karang besar dan air jernih, favorit wisatawan karena suasana tenang dan pemandangannya yang memukau.', 
        hargaTiket: 'Rp 10,000',
        mapsUrl: 'https://maps.google.com/?q=Pantai+Papuma,Jember',
        mapsImage: 'https://maps.googleapis.com/maps/api/staticmap?center=Papuma+Beach,Jember&zoom=12&size=400x300&markers=color:green%7CPapuma+Beach,Jember',
        rating: 4.3
    },

    {
        id: 'taman-nasional-baluran', 
        nama: 'Taman Nasional Baluran', 
        kota: 'Situbondo', 
        kategori: 'Taman Nasional', 
        gambar: 'https://picsum.photos/seed/baluran/400/300', 
        deskripsi: 'Dijuluki "Africa van Java", taman nasional ini memiliki padang savana luas dan berbagai satwa liar seperti rusa, banteng, dan merak.', 
        hargaTiket: 'Rp 25,000 (wisatawan lokal)',
        mapsUrl: 'https://maps.google.com/?q=Taman+Nasional+Baluran,Situbondo',
        mapsImage: 'https://maps.googleapis.com/maps/api/staticmap?center=Baluran+National+Park,Situbondo&zoom=12&size=400x300&markers=color:green%7CBaluran+National+Park,Situbondo',
        rating: 4.5
    },

    {
        id: 'goa-gong', 
        nama: 'Goa Gong', 
        kota: 'Pacitan', 
        kategori: 'Goa', 
        gambar: 'https://picsum.photos/seed/goagong/400/300', 
        deskripsi: 'Goa tercantik di Asia Tenggara dengan stalaktit dan stalagmit yang megah serta pencahayaan warna-warni yang memperindah interiornya.', 
        hargaTiket: 'Rp 12,000',
        mapsUrl: 'https://maps.google.com/?q=Goa+Gong,Pacitan',
        mapsImage: 'https://maps.googleapis.com/maps/api/staticmap?center=Gong+Cave,Pacitan&zoom=12&size=400x300&markers=color:green%7CGong+Cave,Pacitan',
        rating: 4.4
    },

    {
        id: 'alun-alun-kediri', 
        nama: 'Alun-Alun Kediri', 
        kota: 'Kediri', 
        kategori: 'Landmark Kota', 
        gambar: 'https://picsum.photos/seed/alunkediri/400/300', 
        deskripsi: 'Landmark kebanggaan warga Kediri yang ramai dengan kuliner, taman, dan dekat dengan ikon Simpang Lima Gumul.', 
        hargaTiket: 'Gratis',
        mapsUrl: 'https://maps.google.com/?q=Alun+Alun+Kediri',
        mapsImage: 'https://maps.googleapis.com/maps/api/staticmap?center=Alun+Alun+Kediri&zoom=12&size=400x300&markers=color:green%7CAlun+Alun+Kediri',
        rating: 4.2
    }
];

const seedCarousel = [
    {id:'img1', src:'https://picsum.photos/seed/carousel1/1200/600', alt:'Gunung Bromo saat matahari terbit'},
    {id:'img2', src:'https://picsum.photos/seed/carousel2/1200/600', alt:'Jembatan Suramadu di malam hari'},
    {id:'img3', src:'https://picsum.photos/seed/carousel3/1200/600', alt:'Keindahan kota Malang dari atas'},
    {id:'img4', src:'https://picsum.photos/seed/carousel4/1200/600', alt:'Suasana ramai di pusat kota Surabaya'}
];

// Data Service Functions (TIDAK BERUBAH)
export const dataService = {
    // Seed data ke database
    async seedData() {
        try {
            // Check if data already exists
            const existingKota = await db.collection('kota').get();
            if (existingKota.length === 0) {
                for (const kota of seedKota) {
                    await db.collection('kota').add(kota, kota.id);
                }
            }

            const existingKuliner = await db.collection('kuliner').get();
            if (existingKuliner.length === 0) {
                for (const kuliner of seedKuliner) {
                    await db.collection('kuliner').add(kuliner, kuliner.id);
                }
            }

            const existingWisata = await db.collection('wisata').get();
            if (existingWisata.length === 0) {
                for (const wisata of seedWisata) {
                    await db.collection('wisata').add(wisata, wisata.id);
                }
            }

            const existingCarousel = await db.collection('carousel').get();
            if (existingCarousel.length === 0) {
                for (const carousel of seedCarousel) {
                    await db.collection('carousel').add(carousel, carousel.id);
                }
            }
        } catch (error) {
            console.error('Error seeding data:', error);
        }
    },

    // Get all items dari collection
    async getKota() {
        try {
            return await db.collection('kota').get();
        } catch (error) {
            console.error('Error getting kota:', error);
            return [];
        }
    },

    async getKuliner() {
        try {
            return await db.collection('kuliner').get();
        } catch (error) {
            console.error('Error getting kuliner:', error);
            return [];
        }
    },

    async getWisata() {
        try {
            return await db.collection('wisata').get();
        } catch (error) {
            console.error('Error getting wisata:', error);
            return [];
        }
    },

    async getCarouselImages() {
        try {
            return await db.collection('carousel').get();
        } catch (error) {
            console.error('Error getting carousel:', error);
            return [];
        }
    },

    // Bookmark functions
    async getBookmarks() {
        try {
            return await db.collection('bookmarks').get();
        } catch (error) {
            console.error('Error getting bookmarks:', error);
            return [];
        }
    },

    async getBookmark(id) {
        try {
            return await db.collection('bookmarks').doc({ id }).get();
        } catch (error) {
            console.error('Error getting bookmark:', error);
            return null;
        }
    },

    async addBookmark(bookmark) {
        try {
            return await db.collection('bookmarks').add(bookmark, bookmark.id);
        } catch (error) {
            console.error('Error adding bookmark:', error);
        }
    },

    async removeBookmark(id) {
        try {
            return await db.collection('bookmarks').doc({ id }).delete();
        } catch (error) {
            console.error('Error removing bookmark:', error);
        }
    },

    // Search functionality
    async search(query) {
        try {
            const results = [];

            // Search in kota
            const kotaResults = await db.collection('kota')
                .where('nama', '==', query)
                .get();
            results.push(...kotaResults.map(item => ({ ...item, type: 'kota' })));

            // Search in kuliner
            const kulinerResults = await db.collection('kuliner')
                .where('nama', '==', query)
                .get();
            results.push(...kulinerResults.map(item => ({ ...item, type: 'kuliner' })));

            // Search in wisata
            const wisataResults = await db.collection('wisata')
                .where('nama', '==', query)
                .get();
            results.push(...wisataResults.map(item => ({ ...item, type: 'wisata' })));

            return results;
        } catch (error) {
            console.error('Error searching:', error);
            return [];
        }
    }
};
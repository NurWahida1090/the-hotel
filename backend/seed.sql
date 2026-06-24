USE hotel_db;

-- Clean existing transactional and catalog data (do NOT delete users table entirely to keep admin)
DELETE FROM review;
DELETE FROM checkin;
DELETE FROM checkout;
DELETE FROM reservasi;
DELETE FROM kamar;
DELETE FROM fasilitas;

-- Delete only test users (IDs 2, 3, 4) to clean user reviews
DELETE FROM users WHERE id_user IN (2, 3, 4);

-- Insert Kamar (Rooms) matching images in static/kamar
INSERT INTO kamar (id_kamar, nomor_kamar, tipe_kamar, harga, status, gambar, deskripsi) VALUES
(1, '101', 'Deluxe Room', 500000.00, 'Tersedia', '/static/kamar/deluxe1.jpg', 'Kamar modern dan nyaman dengan kualitas lengkap serta pemandangan kolam renang.'),
(2, '102', 'Family Room', 750000.00, 'Tersedia', '/static/kamar/family1.jpg', 'Kamar luas dan nyaman yang cocok digunakan bersama keluarga tercinta.'),
(3, '103', 'Suite Room', 1250000.00, 'Tersedia', '/static/kamar/suite1.jpg', 'Kamar fasilitas premium dengan desain mewah dan pelayanan prima.');

-- Insert Fasilitas (Facilities) matching images in static/fasilitas
INSERT INTO fasilitas (id_fasilitas, nama_fasilitas, deskripsi, gambar) VALUES
(1, 'wifi gratis', 'Akses internet cepat diseluruh area hotel secara gratis.', '/static/fasilitas/wifi.jpg'),
(2, 'kolam renang', 'Kolam renang luas dan bersih untuk dewasa dan anak-anak.', '/static/fasilitas/kolam.jpg'),
(3, 'restoran', 'Restoran bintang lima dengan hidangan khas lezat.', '/static/fasilitas/restoran.jpg'),
(4, 'gym center', 'Fasilitas gym modern untuk menjaga kebugaran Anda.', '/static/fasilitas/gym.jpg');

-- Insert Test Users for Reviews (using bcrypt hash of 'admin123' as password)
INSERT INTO users (id_user, username, email, password, role) VALUES
(2, 'Indah Saputri', 'indah@gmail.com', '$2b$12$/QcOF8XQbJzh3g18L8jj7.S890NIiC/h5s5PImMK3dvebUaqrCQbK', 'user'),
(3, 'Nurul Hidayah', 'nurul@gmail.com', '$2b$12$/QcOF8XQbJzh3g18L8jj7.S890NIiC/h5s5PImMK3dvebUaqrCQbK', 'user'),
(4, 'Rizky Pratama', 'rizky@gmail.com', '$2b$12$/QcOF8XQbJzh3g18L8jj7.S890NIiC/h5s5PImMK3dvebUaqrCQbK', 'user');

-- Insert Reviews
INSERT INTO review (id_review, id_user, id_kamar, rating, komentar) VALUES
(1, 2, 1, 5, 'Pelayanannya sangat memuaskan, kamarnya bersih dan fasilitasnya lengkap sekali.'),
(2, 3, 1, 5, 'Suasana hotel sangat nyaman dan cocok untuk liburan keluarga.'),
(3, 4, 1, 5, 'Makanan di restoran sangat enak, ditambah pelayanan yang ramah.');

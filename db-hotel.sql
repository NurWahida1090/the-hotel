CREATE DATABASE hotel_db;

USE hotel_db;

CREATE TABLE users (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100),
    email VARCHAR(100),
    password VARCHAR(255),
    role ENUM('admin','user')
);

INSERT INTO users
(username,email,password,role)
VALUES
(
'admin',
'admin@gmail.com',
'$2b$12$/QcOF8XQbJzh3g18L8jj7.S890NIiC/h5s5PImMK3dvebUaqrCQbK',
'admin'
);

CREATE TABLE kamar (
    id_kamar INT AUTO_INCREMENT PRIMARY KEY,
    nomor_kamar VARCHAR(20) NOT NULL,
    tipe_kamar ENUM(
        'Deluxe Room',
        'Family Room',
        'Suite Room'
    ) NOT NULL,
    harga DECIMAL(10,2) NOT NULL,
    status ENUM(
        'Tersedia',
        'Terisi',
        'Maintenance'
    ) DEFAULT 'Tersedia',
    gambar VARCHAR(255),
    deskripsi TEXT
);

CREATE TABLE fasilitas (
    id_fasilitas INT AUTO_INCREMENT PRIMARY KEY,
    nama_fasilitas VARCHAR(100) NOT NULL,
    deskripsi TEXT,
    gambar VARCHAR(255)
);

CREATE TABLE reservasi (
    id_reservasi INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    tanggal_checkin DATE NOT NULL,
    tanggal_checkout DATE NOT NULL,
    status_reservasi VARCHAR(30) NOT NULL,
    id_kamar INT NOT NULL,

    CONSTRAINT fk_reservasi_user
        FOREIGN KEY (id_user)
        REFERENCES users(id_user)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_reservasi_kamar
        FOREIGN KEY (id_kamar)
        REFERENCES kamar(id_kamar)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE review (
    id_review INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    id_kamar INT NOT NULL,
    rating INT NOT NULL,
    komentar TEXT,

    CONSTRAINT fk_review_user
        FOREIGN KEY (id_user)
        REFERENCES users(id_user)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_review_kamar
        FOREIGN KEY (id_kamar)
        REFERENCES kamar(id_kamar)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE checkin (
    id_checkin INT AUTO_INCREMENT PRIMARY KEY,
    waktu_checkin DATETIME NOT NULL,
    id_reservasi INT UNIQUE NOT NULL,

    CONSTRAINT fk_checkin_reservasi
        FOREIGN KEY (id_reservasi)
        REFERENCES reservasi(id_reservasi)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE checkout (
    id_checkout INT AUTO_INCREMENT PRIMARY KEY,
    waktu_checkout DATETIME NOT NULL,
    id_reservasi INT UNIQUE NOT NULL,

    CONSTRAINT fk_checkout_reservasi
        FOREIGN KEY (id_reservasi)
        REFERENCES reservasi(id_reservasi)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);






SHOW TABLES;
SELECT * FROM users;
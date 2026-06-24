# 🏨 The Hotel

Aplikasi manajemen hotel berbasis web yang memungkinkan tamu melihat informasi kamar, melakukan reservasi, check-in/check-out, dan memberikan ulasan. Admin dapat mengelola seluruh data hotel melalui dashboard khusus.

---

## 📋 Daftar Isi

- [Fitur Aplikasi](#-fitur-aplikasi)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Struktur Proyek](#-struktur-proyek)
- [Database & ERD](#-database--erd)
- [Instalasi & Menjalankan](#-instalasi--menjalankan)
- [Konfigurasi Environment](#-konfigurasi-environment)
- [API Endpoints](#-api-endpoints)
- [Halaman Frontend](#-halaman-frontend)
- [Role & Akses](#-role--akses)

---

## ✨ Fitur Aplikasi

### 👤 Tamu (User)
- Melihat informasi kamar dan fasilitas hotel
- Registrasi & login akun (mendukung login via username atau email)
- Melakukan reservasi kamar
- Melihat & mengelola reservasi pribadi
- Memberikan ulasan dan rating untuk kamar
- Proses check-in & check-out
- **Keamanan Halaman & Route (Proteksi halaman tamu dengan auto-redirect ke login)**

### 🛠️ Admin
- Dashboard statistik (kamar tersedia riil dari database, total reservasi, tamu, ulasan)
- Manajemen data kamar (tambah, edit, hapus, upload gambar)
- Manajemen data fasilitas
- Manajemen semua reservasi (ubah status, hapus)
- Moderasi ulasan tamu
- **Keamanan Akses Panel Admin (Hanya dapat diakses oleh user ber-role admin)**

---

## 🧰 Teknologi yang Digunakan

### Frontend
| Teknologi | Versi | Keterangan |
|-----------|-------|------------|
| React | ^19.2.6 | UI Framework |
| Vite | ^8.0.12 | Build tool & dev server |
| React Router DOM | ^7.18.0 | Client-side routing |
| Axios | ^1.18.1 | HTTP client |
| Bootstrap | ^5.3.8 | CSS Framework |
| React Icons | ^5.6.0 | Icon library |
| SweetAlert2 | ^11.26.25 | Alert & dialog UI |

### Backend
| Teknologi | Versi | Keterangan |
|-----------|-------|------------|
| Python | 3.12 | Bahasa pemrograman |
| FastAPI | — | Web framework |
| SQLAlchemy | — | ORM |
| PyMySQL | — | MySQL driver |
| python-jose | — | JWT authentication |
| Uvicorn | — | ASGI server |
| Passlib | — | Password hashing |

### Database
- **MySQL** — Sistem manajemen basis data relasional

---

## 📁 Struktur Proyek

```
the-hotel/
├── backend/                    # Server-side (FastAPI)
│   ├── main.py                 # Entry point & semua API endpoint
│   ├── models.py               # Model database (SQLAlchemy)
│   ├── schemas.py              # Skema request/response (Pydantic)
│   ├── database.py             # Koneksi database
│   ├── auth.py                 # Utilitas autentikasi (hash, JWT)
│   ├── .env                    # Konfigurasi environment
│   └── static/                 # Penyimpanan gambar upload
│
├── frontend-react/             # Client-side (React + Vite)
│   ├── public/                 # Aset statis & gambar latar belakang
│   └── src/
│       ├── assets/css/         # File CSS per halaman
│       ├── components/         # Komponen reusable
│       │   ├── admin/          # Komponen khusus admin
│       │   └── guest/          # Komponen khusus tamu
│       ├── context/            # React Context (state global)
│       ├── layouts/            # Layout wrapper halaman
│       ├── pages/              # Halaman utama aplikasi
│       ├── routes/             # Konfigurasi routing
│       └── services/           # Fungsi pemanggilan API
│
└── db-hotel.sql                # SQL schema database
```

---

## 🗄️ Database & ERD

Tabel-tabel yang digunakan dalam database `hotel_db`:

| Tabel | Deskripsi |
|-------|-----------|
| `users` | Data akun tamu dan admin |
| `kamar` | Data kamar hotel (tipe, harga, status, gambar) |
| `fasilitas` | Data fasilitas hotel |
| `reservasi` | Data pemesanan kamar oleh tamu |
| `review` | Ulasan dan rating tamu untuk kamar |
| `checkin` | Rekaman proses check-in |
| `checkout` | Rekaman proses check-out |

**Tipe Kamar:** `Deluxe Room` | `Family Room` | `Suite Room`

**Status Kamar:** `Tersedia` | `Terisi` | `Maintenance`

**Status Reservasi:** `Pending` | `Dikonfirmasi` | `Dibatalkan` | `Selesai`

---

## 🚀 Instalasi & Menjalankan

### Prasyarat
- Python 3.12+
- Node.js 18+
- MySQL Server

### 1. Clone Repository
```bash
git clone https://github.com/NurWahida1090/the-hotel.git
cd the-hotel
```

### 2. Setup Database
```bash
# Buat database di MySQL
mysql -u root -p
CREATE DATABASE hotel_db;
USE hotel_db;
SOURCE db-hotel.sql;
```

### 3. Setup Backend
```bash
cd backend

# Buat virtual environment
python -m venv .venv
source .venv/bin/activate        # Linux/Mac
# .venv\Scripts\activate         # Windows

# Install dependensi
pip install fastapi uvicorn sqlalchemy pymysql python-jose passlib python-multipart python-dotenv

# Salin dan sesuaikan file environment
cp .env.example .env             # Lihat bagian konfigurasi di bawah

# Jalankan server
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

### 4. Setup Frontend
```bash
cd frontend-react

# Install dependensi
npm install

# Jalankan development server
npm run dev
```

### 5. Akses Aplikasi
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Docs (Swagger):** http://localhost:8000/docs

---

## ⚙️ Konfigurasi Environment

Buat file `.env` di dalam folder `backend/` dengan isi berikut:

```env
DATABASE_URL=mysql+pymysql://USERNAME:PASSWORD@localhost/hotel_db
SECRET_KEY=ganti_dengan_secret_key_yang_aman
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

> **Catatan:** Ganti `USERNAME` dan `PASSWORD` dengan kredensial MySQL Anda. `SECRET_KEY` sebaiknya berupa string acak yang panjang dan tidak mudah ditebak.

---

## 📡 API Endpoints

Base URL: `http://localhost:8000`

### 🔐 Autentikasi
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| POST | `/register` | Registrasi akun baru | — |
| POST | `/login` | Login (username atau email) | — |
| GET | `/me` | Profil user yang sedang login | ✅ |
| PUT | `/me` | Update profil sendiri | ✅ |
| DELETE | `/me` | Hapus akun sendiri | ✅ |

### 👥 Users (Admin Only)
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/users` | Daftar semua user | ✅ Admin |
| GET | `/users/{id}` | Detail user by ID | ✅ Admin |
| POST | `/users` | Tambah user baru | ✅ Admin |
| PUT | `/users/{id}` | Edit user | ✅ Admin |
| DELETE | `/users/{id}` | Hapus user | ✅ Admin |

### 🛏️ Kamar
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/kamar` | Daftar semua kamar | — |
| GET | `/kamar/home` | Kamar untuk tampilan beranda | — |
| GET | `/kamar/{id}` | Detail kamar by ID | — |
| POST | `/kamar` | Tambah kamar baru | ✅ Admin |
| PUT | `/kamar/{id}` | Edit kamar | ✅ Admin |
| DELETE | `/kamar/{id}` | Hapus kamar | ✅ Admin |

### 🌴 Fasilitas
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/fasilitas` | Daftar semua fasilitas | — |
| POST | `/fasilitas` | Tambah fasilitas | ✅ Admin |
| PUT | `/fasilitas/{id}` | Edit fasilitas | ✅ Admin |
| DELETE | `/fasilitas/{id}` | Hapus fasilitas | ✅ Admin |

### 📅 Reservasi
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/reservasi-saya` | Reservasi milik user login | ✅ User |
| GET | `/reservasi` | Semua reservasi | ✅ Admin |
| POST | `/reservasi` | Buat reservasi baru | ✅ User |
| PUT | `/reservasi/{id}` | Edit reservasi | ✅ User |
| PUT | `/reservasi/status/{id}` | Ubah status reservasi | ✅ Admin |
| DELETE | `/reservasi/{id}` | Hapus reservasi | ✅ |

### ⭐ Review
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/review` | Semua review | — |
| GET | `/review-saya` | Review milik user login | ✅ User |
| POST | `/review` | Tulis review baru | ✅ User |
| PUT | `/review/{id}` | Edit review | ✅ User |
| DELETE | `/review/{id}` | Hapus review | ✅ |

### 🏁 Check-in & Check-out
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/checkin` | Daftar semua check-in | ✅ Admin |
| GET | `/checkin/{id}` | Detail check-in | ✅ Admin |
| POST | `/checkin` | Proses check-in | ✅ Admin |
| DELETE | `/checkin/{id}` | Hapus data check-in | ✅ Admin |
| GET | `/checkout` | Daftar semua check-out | ✅ Admin |
| GET | `/checkout/{id}` | Detail check-out | ✅ Admin |
| POST | `/checkout` | Proses check-out | ✅ Admin |
| DELETE | `/checkout/{id}` | Hapus data check-out | ✅ Admin |

### 📊 Dashboard
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/dashboard-admin` | Statistik untuk admin | ✅ Admin |

---

## 🗺️ Halaman Frontend

### Halaman Publik
| Route | Halaman | Deskripsi |
|-------|---------|-----------|
| `/` | Home | Beranda hotel |
| `/login` | Login | Halaman masuk akun |
| `/register` | Register | Halaman daftar akun baru |

### Halaman User (Login Required)
| Route | Halaman | Deskripsi |
|-------|---------|-----------|
| `/dashboard` | Dashboard | Dashboard tamu |
| `/kamar` | Kamar | Daftar & detail kamar |
| `/fasilitas` | Fasilitas | Daftar fasilitas |
| `/reservasi` | Reservasi | Buat & kelola reservasi |
| `/review` | Review | Tulis & lihat ulasan |

### Halaman Admin
| Route | Halaman | Deskripsi |
|-------|---------|-----------|
| `/admin/dashboard` | Admin Dashboard | Statistik & ringkasan |
| `/admin/kamar` | Data Kamar | Manajemen kamar |
| `/admin/kamar/edit/:id` | Edit Kamar | Edit detail kamar |
| `/admin/fasilitas` | Data Fasilitas | Manajemen fasilitas |
| `/admin/reservasi` | Data Reservasi | Semua reservasi tamu |
| `/admin/review` | Data Review | Moderasi ulasan |

---

## 🔑 Role & Akses

| Fitur | Tamu (Belum Login) | User | Admin |
|-------|--------------------|------|-------|
| Lihat beranda & kamar | ✅ | ✅ | ✅ |
| Login & Register | ✅ | — (Redirect ke Dashboard) | — (Redirect ke Dashboard) |
| Buat reservasi | ❌ (Redirect ke Login) | ✅ | ✅ |
| Tulis review | ❌ (Redirect ke Login) | ✅ | ✅ |
| Kelola data kamar | ❌ (Redirect ke Login) | ❌ (Redirect ke Dashboard) | ✅ |
| Kelola fasilitas | ❌ (Redirect ke Login) | ❌ (Redirect ke Dashboard) | ✅ |
| Proses check-in/out | ❌ (Redirect ke Login) | ❌ (Redirect ke Dashboard) | ✅ |
| Lihat semua reservasi | ❌ (Redirect ke Login) | ❌ (Redirect ke Dashboard) | ✅ |
| Dashboard admin | ❌ (Redirect ke Login) | ❌ (Redirect ke Dashboard) | ✅ |

---

## 👩‍💻 Developer

**NurWahida** — [GitHub](https://github.com/NurWahida1090)

---

*Proyek ini dibuat sebagai aplikasi manajemen hotel berbasis web menggunakan FastAPI dan React.*

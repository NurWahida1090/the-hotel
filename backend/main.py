from fastapi import FastAPI, Depends, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from database import engine, get_db
from models import *
from schemas import *
from jose import jwt, JWTError
from datetime import datetime, timedelta
from auth import hash_password, verify_password, create_access_token, SECRET_KEY, ALGORITHM

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount(
    "/static",
    StaticFiles(directory="static"),
    name="static"
)
Base.metadata.create_all(bind=engine)

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="login"
)

# ================= USER =================
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):

    credentials_exception = HTTPException(
        status_code=401,
        detail="Token tidak valid"
    )

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        username = payload.get("sub")

        if username is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(
        User.username == username
    ).first()

    if user is None:
        raise credentials_exception

    return user

# ================= ADMIN =================
def admin_required(
    current_user: User = Depends(
        get_current_user
    )
):

    if current_user.role != "admin":

        raise HTTPException(
            status_code=403,
            detail="Hanya admin"
        )

    return current_user

# ================= REGISTER =================
@app.post("/register")
def register(
    data: UserCreate,
    db: Session = Depends(get_db)
):

    cek = db.query(User).filter(
        User.username == data.username
    ).first()

    if cek:
        raise HTTPException(
            status_code=400,
            detail="Username sudah ada"
        )

    cek_email = db.query(User).filter(
        User.email == data.email
    ).first()

    if cek_email:
        raise HTTPException(
            status_code=400,
            detail="Email sudah terdaftar"
        )

    user = User(
        username=data.username,
        email=data.email,
        password=hash_password(
            data.password
        ),
        role="user"
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "message": "Register berhasil"
    }

# ================= LOGIN =================
@app.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.username == form_data.username
    ).first()

    if not user:
        user = db.query(User).filter(
            User.email == form_data.username
        ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User tidak ditemukan"
        )

    if not verify_password(
        form_data.password,
        user.password
    ):

        raise HTTPException(
            status_code=401,
            detail="Password salah"
        )

    token = create_access_token(
        {
            "sub": user.username,
            "role": user.role
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "id_user": user.id_user,
        "username": user.username,
        "email": user.email,
        "role": user.role
    }

# ================= USER PROFILE =================
@app.get("/me")
def get_me(
    current_user: User = Depends(get_current_user)
):
    return {
        "id_user": current_user.id_user,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role
    }

# ================= CRUD USER =================
@app.get("/users")
def get_users(
    db: Session = Depends(get_db),
    admin: User = Depends(admin_required)
):
    return db.query(User).all()

@app.get("/users/{id}")
def get_user(
    id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(admin_required)
):

    user = db.query(User).filter(
        User.id_user == id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User tidak ditemukan"
        )

    return user

@app.post("/users")
def create_user(
    data: UserCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(admin_required)
):

    user = User(
        username=data.username,
        email=data.email,
        password=hash_password(data.password),
        role="user"
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

@app.put("/users/{id}")
def update_user(
    id: int,
    data: UserCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(admin_required)
):

    user = db.query(User).filter(
        User.id_user == id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User tidak ditemukan"
        )

    user.username = data.username
    user.email = data.email
    user.password = hash_password(data.password)

    db.commit()

    return user

@app.delete("/users/{id}")
def delete_user(
    id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(admin_required)
):

    user = db.query(User).filter(
        User.id_user == id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User tidak ditemukan"
        )

    db.delete(user)
    db.commit()

    return {
        "message": "User berhasil dihapus"
    }

# ================= CRUD KAMAR =================
@app.get("/kamar")
def get_kamar(
    db: Session = Depends(get_db)
):
    return db.query(Kamar).all()

@app.get("/kamar/home")
def kamar_home(db: Session = Depends(get_db)):

    tipe = [
        "Deluxe Room",
        "Family Room",
        "Suite Room"
    ]

    hasil = []

    for t in tipe:
        kamar = (
            db.query(Kamar)
            .filter(Kamar.tipe_kamar == t)
            .first()
        )

        if kamar:
            hasil.append(kamar)

    return hasil

@app.get("/kamar/{id}")
def detail_kamar(
    id: int,
    db: Session = Depends(get_db)
):
    kamar = db.query(Kamar).filter(
        Kamar.id_kamar == id
    ).first()

    if not kamar:
        raise HTTPException(
            status_code=404,
            detail="Kamar tidak ditemukan"
        )

    return kamar

@app.post("/kamar")
def tambah_kamar(
    data: KamarCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(
        admin_required
    )
):

    kamar = Kamar(
        nomor_kamar=data.nomor_kamar,
        tipe_kamar=data.tipe_kamar,
        harga=data.harga,
        status=data.status,
        gambar=data.gambar,
        deskripsi=data.deskripsi
    )

    db.add(kamar)
    db.commit()
    db.refresh(kamar)

    return kamar

@app.put("/kamar/{id}")
def update_kamar(
    id: int,
    data: KamarCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(
        admin_required
    )
):

    kamar = db.query(Kamar).filter(
        Kamar.id_kamar == id
    ).first()

    if not kamar:
        raise HTTPException(
            status_code=404,
            detail="Kamar tidak ditemukan"
        )

    kamar.nomor_kamar = data.nomor_kamar
    kamar.tipe_kamar = data.tipe_kamar
    kamar.harga = data.harga
    kamar.status = data.status
    kamar.gambar = data.gambar
    kamar.deskripsi = data.deskripsi

    db.commit()
    db.refresh(kamar)
    
    return kamar

@app.delete("/kamar/{id}")
def delete_kamar(
    id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(
        admin_required
    )
):

    kamar = db.query(Kamar).filter(
        Kamar.id_kamar == id
    ).first()

    if not kamar:
        raise HTTPException(
            status_code=404,
            detail="Kamar tidak ditemukan"
        )

    db.delete(kamar)

    db.commit()

    return {
        "message": "Berhasil dihapus"
    }

# ================= CRUD FASILITAS =================
@app.get("/fasilitas")
def get_fasilitas(
    db: Session = Depends(get_db)
):
    return db.query(Fasilitas).all()

@app.post("/fasilitas")
def tambah_fasilitas(
    data: FasilitasCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(admin_required)
):

    fasilitas = Fasilitas(
        nama_fasilitas=data.nama_fasilitas,
        deskripsi=data.deskripsi,
        gambar=data.gambar
    )

    db.add(fasilitas)
    db.commit()
    db.refresh(fasilitas)

    return fasilitas

@app.put("/fasilitas/{id}")
def update_fasilitas(
    id: int,
    data: FasilitasCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(admin_required)
):

    fasilitas = db.query(Fasilitas).filter(
        Fasilitas.id_fasilitas == id
    ).first()

    if not fasilitas:
        raise HTTPException(
            status_code=404,
            detail="Fasilitas tidak ditemukan"
        )

    fasilitas.nama_fasilitas = data.nama_fasilitas
    fasilitas.deskripsi = data.deskripsi
    fasilitas.gambar = data.gambar

    db.commit()

    return fasilitas

@app.delete("/fasilitas/{id}")
def delete_fasilitas(
    id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(admin_required)
):

    fasilitas = db.query(Fasilitas).filter(
        Fasilitas.id_fasilitas == id
    ).first()

    if not fasilitas:
        raise HTTPException(
            status_code=404,
            detail="Fasilitas tidak ditemukan"
        )

    db.delete(fasilitas)
    db.commit()

    return {
        "message": "Fasilitas berhasil dihapus"
    }

# ================= CRUD RESERVASI =================
@app.get("/reservasi-saya")     #USER MELIHAT RESERVASI YANG DIA BUAT
def reservasi_saya(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    return db.query(Reservasi).filter(
        Reservasi.id_user == current_user.id_user
    ).all()

@app.get("/reservasi")      #ADMIN MELIHAT SEMUA RESERVASI
def get_reservasi(
    db: Session = Depends(get_db),
    admin: User = Depends(admin_required)
):
    data_reservasi = db.query(Reservasi).all()
    reservasi = []
    for item in data_reservasi:
        user = db.query(User).filter(User.id_user == item.id_user).first()
        kamar = db.query(Kamar).filter(Kamar.id_kamar == item.id_kamar).first()
        
        username = user.username if user else "Deleted User"
        email = user.email if user else ""
        nomor_kamar = kamar.nomor_kamar if kamar else "N/A"
        tipe_kamar = kamar.tipe_kamar if kamar else "N/A"
        harga = float(kamar.harga) if kamar else 0.0
        
        reservasi.append({
            "id_reservasi": item.id_reservasi,
            "id_user": item.id_user,
            "id_kamar": item.id_kamar,
            "username": username,
            "email": email,
            "nomor_kamar": nomor_kamar,
            "tipe_kamar": tipe_kamar,
            "harga": harga,
            "tanggal_checkin": item.tanggal_checkin,
            "tanggal_checkout": item.tanggal_checkout,
            "status_reservasi": item.status_reservasi
        })
    return reservasi

@app.post("/reservasi")
def tambah_reservasi(
    data: ReservasiCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    if data.tanggal_checkout <= data.tanggal_checkin:
        raise HTTPException(
            status_code=400,
            detail="Tanggal checkout harus setelah checkin"
        )

    kamar = db.query(Kamar).filter(
        Kamar.id_kamar == data.id_kamar
    ).first()

    if not kamar:
        raise HTTPException(
            status_code=404,
            detail="Kamar tidak ditemukan"
        )

    if kamar.status == "Maintenance":
        raise HTTPException(
            status_code=400,
            detail="Kamar sedang dalam masa pemeliharaan (maintenance)"
        )

    bentrok = db.query(Reservasi).filter(
        Reservasi.id_kamar == data.id_kamar,
        Reservasi.tanggal_checkin <= data.tanggal_checkout,
        Reservasi.tanggal_checkout >= data.tanggal_checkin,
        ~Reservasi.status_reservasi.in_(["Batal", "Ditolak", "Selesai"])
    ).first()

    if bentrok:
        raise HTTPException(
            status_code=400,
            detail="Kamar sudah dibooking"
        )

    reservasi = Reservasi(
        id_user=current_user.id_user,
        id_kamar=data.id_kamar,
        tanggal_checkin=data.tanggal_checkin,
        tanggal_checkout=data.tanggal_checkout,
        status_reservasi="Pending"
    )

    db.add(reservasi)

    db.commit()
    db.refresh(reservasi)

    return reservasi

@app.put("/reservasi/{id}")
def update_reservasi(
    id: int,
    data: ReservasiCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    reservasi = db.query(Reservasi).filter(
        Reservasi.id_reservasi == id
    ).first()

    if not reservasi:
        raise HTTPException(
            status_code=404,
            detail="Reservasi tidak ditemukan"
        )

    if reservasi.id_user != current_user.id_user:
        raise HTTPException(
            status_code=403,
            detail="Bukan reservasi anda"
        )

    if reservasi.status_reservasi != "Pending":
        raise HTTPException(
            status_code=400,
            detail="Reservasi tidak dapat diubah"
        )

    reservasi.id_kamar = data.id_kamar
    reservasi.tanggal_checkin = data.tanggal_checkin
    reservasi.tanggal_checkout = data.tanggal_checkout

    db.commit()
    db.refresh(reservasi)

    return reservasi

@app.put("/reservasi/status/{id}")
def update_status_reservasi(
    id: int,
    data: UpdateStatusReservasi,
    db: Session = Depends(get_db),
    admin: User = Depends(admin_required)
):

    reservasi = db.query(Reservasi).filter(
        Reservasi.id_reservasi == id
    ).first()

    if not reservasi:
        raise HTTPException(
            status_code=404,
            detail="Reservasi tidak ditemukan"
        )

    reservasi.status_reservasi = data.status_reservasi

    db.commit()

    return {
        "message": "Status reservasi berhasil diubah"
    }

@app.delete("/reservasi/{id}")
def delete_reservasi(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    reservasi = db.query(Reservasi).filter(
        Reservasi.id_reservasi == id
    ).first()

    if not reservasi:
        raise HTTPException(
            status_code=404,
            detail="Reservasi tidak ditemukan"
        )

    if (
        current_user.role != "admin"
        and reservasi.id_user != current_user.id_user
    ):
        raise HTTPException(
            status_code=403,
            detail="Bukan reservasi anda"
        )

    kamar = db.query(Kamar).filter(
        Kamar.id_kamar == reservasi.id_kamar
    ).first()

    if kamar:
        kamar.status = "Tersedia"

    db.delete(reservasi)

    db.commit()

    return {
        "message": "Reservasi berhasil dihapus"
    }

# ================= CRUD REVIEW =================
@app.get("/review")
def get_review(
    db: Session = Depends(get_db)
):

    reviews = db.query(Review).all()

    hasil = []

    for review in reviews:

        user = db.query(User).filter(
            User.id_user == review.id_user
        ).first()

        hasil.append({
            "id_review": review.id_review,
            "username": user.username,
            "tipe_kamar":review.kamar.tipe_kamar,
            "rating": review.rating,
            "komentar": review.komentar
        })

    return hasil

@app.get("/review-saya")
def review_saya(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    return db.query(Review).filter(
        Review.id_user == current_user.id_user
    ).all()

@app.post("/review")
def tambah_review(
    data: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    reservasi = db.query(Reservasi).filter(
        Reservasi.id_user == current_user.id_user,
        Reservasi.id_kamar == data.id_kamar,
        Reservasi.status_reservasi == "Selesai"
    ).first()

    if not reservasi:
        raise HTTPException(
            status_code=400,
            detail="Anda belum pernah menyelesaikan proses menginap di kamar ini"
        )

    review_lama = db.query(Review).filter(
        Review.id_user == current_user.id_user,
        Review.id_kamar == data.id_kamar
    ).first()

    if review_lama:
        raise HTTPException(
            status_code=400,
            detail="Review sudah ada"
        )

    review = Review(
        id_user=current_user.id_user,
        id_kamar=data.id_kamar,
        rating=data.rating,
        komentar=data.komentar
    )

    db.add(review)
    db.commit()
    db.refresh(review)

    return review

@app.put("/review/{id}")
def update_review(
    id: int,
    data: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    review = db.query(Review).filter(
        Review.id_review == id
    ).first()

    if not review:
        raise HTTPException(
            status_code=404,
            detail="Review tidak ditemukan"
        )

    if review.id_user != current_user.id_user:
        raise HTTPException(
            status_code=403,
            detail="Bukan review anda"
        )

    review.rating = data.rating
    review.komentar = data.komentar

    db.commit()

    return review

@app.delete("/review/{id}")
def delete_review(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    review = db.query(Review).filter(
        Review.id_review == id
    ).first()

    if not review:
        raise HTTPException(
            status_code=404,
            detail="Review tidak ditemukan"
        )

    if review.id_user != current_user.id_user and current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Bukan review anda"
        )

    db.delete(review)
    db.commit()

    return {
        "message": "Review dihapus"
    }

# ================= CHECKIN (ADMIN) =================
@app.get("/checkin")
def get_checkin(
    db: Session = Depends(get_db),
    admin: User = Depends(admin_required)
):
    return db.query(Checkin).all()

@app.get("/checkin/{id}")
def get_checkin_by_id(
    id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(admin_required)
):

    item = db.query(Checkin).filter(
        Checkin.id_checkin == id
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Checkin tidak ditemukan"
        )

    return item

@app.post("/checkin")
def checkin(
    data: CheckinCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(admin_required)
):

    reservasi = db.query(Reservasi).filter(
        Reservasi.id_reservasi == data.id_reservasi
    ).first()

    if not reservasi:
        raise HTTPException(
            status_code=404,
            detail="Reservasi tidak ditemukan"
        )

    cek = db.query(Checkin).filter(
        Checkin.id_reservasi == data.id_reservasi
    ).first()

    if cek:
        raise HTTPException(
            status_code=400,
            detail="Sudah checkin"
        )

    item = Checkin(
        id_reservasi=data.id_reservasi
    )

    db.add(item)

    reservasi.status_reservasi = "Check In"

    # Set room status to occupied during check-in
    kamar = db.query(Kamar).filter(Kamar.id_kamar == reservasi.id_kamar).first()
    if kamar:
        kamar.status = "Terisi"

    db.commit()
    db.refresh(item)

    return item

@app.delete("/checkin/{id}")
def delete_checkin(
    id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(admin_required)
):

    item = db.query(Checkin).filter(
        Checkin.id_checkin == id
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Checkin tidak ditemukan"
        )

    # Rollback reservation and room status when check-in record is deleted
    reservasi = db.query(Reservasi).filter(Reservasi.id_reservasi == item.id_reservasi).first()
    if reservasi:
        reservasi.status_reservasi = "Pending"
        kamar = db.query(Kamar).filter(Kamar.id_kamar == reservasi.id_kamar).first()
        if kamar:
            kamar.status = "Tersedia"

    db.delete(item)
    db.commit()

    return {
        "message": "Checkin dihapus"
    }

# ================= CHECKOUT (ADMIN) =================
@app.get("/checkout")
def get_checkout(
    db: Session = Depends(get_db),
    admin: User = Depends(admin_required)
):
    return db.query(Checkout).all()

@app.get("/checkout/{id}")
def get_checkout_by_id(
    id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(admin_required)
):

    item = db.query(Checkout).filter(
        Checkout.id_checkout == id
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Checkout tidak ditemukan"
        )

    return item

@app.post("/checkout")
def checkout(
    data: CheckoutCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(admin_required)
):

    reservasi = db.query(Reservasi).filter(
        Reservasi.id_reservasi == data.id_reservasi
    ).first()

    if not reservasi:
        raise HTTPException(
            status_code=404,
            detail="Reservasi tidak ditemukan"
        )

    cek_checkout = db.query(Checkout).filter(
        Checkout.id_reservasi == data.id_reservasi
    ).first()

    if cek_checkout:
        raise HTTPException(
            status_code=400,
            detail="Sudah checkout"
        )

    item = Checkout(
        id_reservasi=data.id_reservasi
    )

    db.add(item)

    reservasi.status_reservasi = "Selesai"

    kamar = db.query(Kamar).filter(
        Kamar.id_kamar == reservasi.id_kamar
    ).first()

    if kamar:
        kamar.status = "Tersedia"

    db.commit()
    db.refresh(item)

    return item

@app.delete("/checkout/{id}")
def delete_checkout(
    id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(admin_required)
):

    item = db.query(Checkout).filter(
        Checkout.id_checkout == id
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Checkout tidak ditemukan"
        )

    reservasi = db.query(Reservasi).filter(
        Reservasi.id_reservasi == item.id_reservasi
    ).first()

    if reservasi:

        kamar = db.query(Kamar).filter(
            Kamar.id_kamar == reservasi.id_kamar
        ).first()

        if kamar:
            kamar.status = "Tersedia"

    db.delete(item)
    db.commit()

    return {
        "message": "Checkout berhasil"
    }

# ================= CRUD AKUN SENDIRI =================
@app.put("/me")
def update_profile(
    data: UserCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    current_user.username = data.username
    current_user.email = data.email
    current_user.password = hash_password(
        data.password
    )

    db.commit()

    return {
        "message": "Profil berhasil diupdate"
    }

@app.delete("/me")
def delete_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    db.delete(current_user)
    db.commit()

    return {
        "message": "Akun berhasil dihapus"
    }

# ================= DASHBOARD ADMIN =================

@app.get("/dashboard-admin")
def dashboard_admin(
    db: Session = Depends(get_db),
    admin: User = Depends(admin_required)
):

    # ================= RESERVASI =================

    reservasi = []

    data_reservasi = db.query(Reservasi).all()

    for item in data_reservasi:

        user = db.query(User).filter(
            User.id_user == item.id_user
        ).first()

        kamar = db.query(Kamar).filter(
            Kamar.id_kamar == item.id_kamar
        ).first()

        reservasi.append({

            "id_reservasi": item.id_reservasi,

            "username": user.username,

            "email": user.email,

            "nomor_kamar": kamar.nomor_kamar,

            "tipe_kamar": kamar.tipe_kamar,

            "harga": float(kamar.harga),

            "status_kamar": kamar.status,

            "tanggal_checkin": item.tanggal_checkin,

            "tanggal_checkout": item.tanggal_checkout,

            "status_reservasi": item.status_reservasi

        })

    # ================= REVIEW =================

    review = []

    data_review = db.query(Review).all()

    for item in data_review:

        user = db.query(User).filter(
            User.id_user == item.id_user
        ).first()

        kamar = db.query(Kamar).filter(
            Kamar.id_kamar == item.id_kamar
        ).first()

        review.append({

            "id_review": item.id_review,

            "username": user.username,

            "tipe_kamar": kamar.tipe_kamar,

            "rating": item.rating,

            "komentar": item.komentar

        })

    # ================= RETURN =================

    return {

        "statistik":{

            "total_user":
                db.query(User).count(),

            "total_kamar":
                db.query(Kamar).filter(Kamar.status == "Tersedia").count(),

            "total_fasilitas":
                db.query(Fasilitas).count(),

            "total_reservasi":
                db.query(Reservasi).count(),

            "total_review":
                db.query(Review).count(),

            "total_checkin":
                db.query(Checkin).count(),

            "total_checkout":
                db.query(Checkout).count()

        },

        "reservasi": reservasi,

        "kamar": db.query(Kamar).all(),

        "fasilitas": db.query(Fasilitas).all(),

        "review": review

    }
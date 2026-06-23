from pydantic import BaseModel, ConfigDict
from datetime import datetime

# ================= USER =================
class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class UserOut(BaseModel):
    id_user: int
    username: str
    email: str
    role: str

    model_config = ConfigDict(from_attributes=True)


# ================= KAMAR =================
class KamarCreate(BaseModel):
    nomor_kamar: str
    tipe_kamar: str
    harga: float
    status: str
    gambar: str
    deskripsi: str

class KamarOut(KamarCreate):
    id_kamar: int

    model_config = ConfigDict(from_attributes=True)


# ================= FASILITAS =================
class FasilitasCreate(BaseModel):
    nama_fasilitas: str
    deskripsi: str
    gambar: str

class FasilitasOut(FasilitasCreate):
    id_fasilitas: int

    model_config = ConfigDict(from_attributes=True)


# ================= RESERVASI =================
class ReservasiCreate(BaseModel):
    id_kamar: int
    tanggal_checkin: datetime
    tanggal_checkout: datetime

class UpdateStatusReservasi(BaseModel):
    status_reservasi: str

class ReservasiOut(ReservasiCreate):
    id_reservasi: int
    id_user: int
    status_reservasi: str

    model_config = ConfigDict(from_attributes=True)


# ================= REVIEW =================
class ReviewCreate(BaseModel):
    id_kamar: int
    rating: int
    komentar: str


class ReviewOut(ReviewCreate):
    id_review: int
    id_user: int

    model_config = ConfigDict(from_attributes=True)


# ================= CHECKIN =================
class CheckinCreate(BaseModel):
    id_reservasi: int


class CheckinOut(CheckinCreate):
    id_checkin: int
    waktu_checkin: datetime

    model_config = ConfigDict(from_attributes=True)


# ================= CHECKOUT =================
class CheckoutCreate(BaseModel):
    id_reservasi: int


class CheckoutOut(CheckoutCreate):
    id_checkout: int
    waktu_checkout: datetime

    model_config = ConfigDict(from_attributes=True)
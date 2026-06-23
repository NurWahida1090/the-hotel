from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy import DateTime, Text, Enum, DECIMAL
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

# ================= USER =================
class User(Base):
    __tablename__ = "users"

    id_user = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True)
    email = Column(String(100), unique=True)
    password = Column(String(255))
    role = Column(String(20), default="user")

    reservasi = relationship("Reservasi", back_populates="user")
    review = relationship("Review", back_populates="user")


# ================= KAMAR =================
class Kamar(Base):
    __tablename__ = "kamar"

    id_kamar = Column(Integer, primary_key=True, index=True)
    nomor_kamar = Column(String(20))
    tipe_kamar = Column(
        Enum(
            "Deluxe Room",
            "Family Room",
            "Suite Room"
        )
    )
    harga = Column(DECIMAL(10,2))
    status = Column(
        Enum(
            "Tersedia",
            "Terisi",
            "Maintenance"
        )
    )
    gambar = Column(String(255))
    deskripsi = Column(Text)

    reservasi = relationship("Reservasi", back_populates="kamar")
    review = relationship("Review", back_populates="kamar")


# ================= FASILITAS =================
class Fasilitas(Base):
    __tablename__ = "fasilitas"

    id_fasilitas = Column(Integer, primary_key=True, index=True)

    nama_fasilitas = Column(String(100))
    deskripsi = Column(Text)
    gambar = Column(String(255))


# ================= RESERVASI =================
class Reservasi(Base):
    __tablename__ = "reservasi"

    id_reservasi = Column(Integer, primary_key=True, index=True)

    id_user = Column(
        Integer,
        ForeignKey("users.id_user")
    )

    id_kamar = Column(
        Integer,
        ForeignKey("kamar.id_kamar")
    )

    tanggal_checkin = Column(DateTime)
    tanggal_checkout = Column(DateTime)

    status_reservasi = Column(
        String(50),
        default="Pending"
    )

    user = relationship(
        "User",
        back_populates="reservasi"
    )

    kamar = relationship(
        "Kamar",
        back_populates="reservasi"
    )


# ================= REVIEW =================
class Review(Base):
    __tablename__ = "review"

    id_review = Column(Integer, primary_key=True, index=True)

    id_user = Column(
        Integer,
        ForeignKey("users.id_user")
    )

    id_kamar = Column(
        Integer,
        ForeignKey("kamar.id_kamar")
    )

    rating = Column(Integer)
    komentar = Column(Text)

    user = relationship(
        "User",
        back_populates="review"
    )

    kamar = relationship(
        "Kamar",
        back_populates="review"
    )


# ================= CHECKIN =================
class Checkin(Base):
    __tablename__ = "checkin"

    id_checkin = Column(Integer, primary_key=True)

    id_reservasi = Column(
        Integer,
        ForeignKey("reservasi.id_reservasi")
    )

    waktu_checkin = Column(
        DateTime,
        default=datetime.utcnow
    )


# ================= CHECKOUT =================
class Checkout(Base):
    __tablename__ = "checkout"

    id_checkout = Column(Integer, primary_key=True)

    id_reservasi = Column(
        Integer,
        ForeignKey("reservasi.id_reservasi")
    )

    waktu_checkout = Column(
        DateTime,
        default=datetime.utcnow
    )
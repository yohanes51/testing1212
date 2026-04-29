import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Kategori = "wisata" | "travel-mobil";
export type BookingStatus = "menunggu" | "dijadwalkan" | "menuju-lokasi" | "dalam-perjalanan" | "selesai";
// Mode booking:
// - wisata-paket  : ikut paket wisata (harga * jumlah orang)
// - wisata-sewa   : sewa mobil saja untuk destinasi bebas (tarifSewaPerHari * jumlahHari)
// - travel-sekali : travel sekali jalan (harga * jumlah orang)
// - travel-sewa   : sewa unit mobil penuh (tarifSewaPerHari * jumlahHari)
export type BookingMode = "wisata-paket" | "wisata-sewa" | "travel-sekali" | "travel-sewa";

export interface Destinasi {
  id: number;
  nama: string;
  lokasi: string;
  harga: number;
  deskripsi: string;
  gambar: string;
  kategori: Kategori;
  tujuanList: string[];
  tarifSewaPerHari?: number;
  kapasitasMobil?: number;
}

export interface Booking {
  id: number;
  userId: number;
  destinasiId: number;
  tanggal: string;
  jumlah: number;
  mode: BookingMode;
  tujuan?: string;
  jumlahHari?: number;
  hargaTotal: number;
  driverId?: number;
  status: BookingStatus;
}

export interface TravelTripGroup {
  key: string;
  representativeBookingId: number;
  destinasiId: number;
  tanggal: string;
  bookingIds: number[];
  totalPenumpang: number;
  driverId?: number;
  status: BookingStatus;
}

interface DataContextType {
  destinasi: Destinasi[];
  bookings: Booking[];
  groupedTravelBookings: TravelTripGroup[];
  addDestinasi: (d: Omit<Destinasi, "id">) => void;
  deleteDestinasi: (id: number) => void;
  addBooking: (b: Omit<Booking, "id" | "status">) => void;
  assignDriver: (bookingId: number, driverId: number) => void;
  updateBookingStatus: (bookingId: number, status: BookingStatus) => void;
}

const DataContext = createContext<DataContextType | null>(null);

const initialDestinasi: Destinasi[] = [
  { id: 1, nama: "Bali Paradise", lokasi: "Bali", harga: 2500000, deskripsi: "Nikmati keindahan pantai Bali dengan pasir putih dan sunset yang memukau.", gambar: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800", kategori: "wisata", tujuanList: ["Pantai Kuta", "Ubud", "Tanah Lot", "Seminyak", "Nusa Dua"], tarifSewaPerHari: 600000 },
  { id: 2, nama: "Raja Ampat Explorer", lokasi: "Papua", harga: 5000000, deskripsi: "Jelajahi keindahan bawah laut Raja Ampat.", gambar: "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=800", kategori: "wisata", tujuanList: ["Pianemo", "Wayag", "Misool", "Arborek"], tarifSewaPerHari: 900000 },
  { id: 3, nama: "Bromo Sunrise", lokasi: "Jawa Timur", harga: 1500000, deskripsi: "Saksikan sunrise spektakuler dari puncak Gunung Bromo.", gambar: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=800", kategori: "wisata", tujuanList: ["Penanjakan", "Kawah Bromo", "Bukit Teletubbies", "Pasir Berbisik"], tarifSewaPerHari: 500000 },
  { id: 4, nama: "Labuan Bajo Adventure", lokasi: "NTT", harga: 4000000, deskripsi: "Bertemu komodo, snorkeling, dan menikmati Bukit Padar.", gambar: "https://images.unsplash.com/photo-1571366343168-631c5bcca7a4?w=800", kategori: "wisata", tujuanList: ["Pulau Komodo", "Pink Beach", "Padar", "Manta Point"], tarifSewaPerHari: 800000 },
  { id: 5, nama: "Danau Toba Heritage", lokasi: "Sumatera Utara", harga: 2000000, deskripsi: "Kunjungi danau vulkanik terbesar di dunia dan budaya Batak.", gambar: "https://images.unsplash.com/photo-1609946860441-a51ffcf22208?w=800", kategori: "wisata", tujuanList: ["Pulau Samosir", "Tomok", "Bukit Holbung", "Air Terjun Sipiso-piso"], tarifSewaPerHari: 550000 },
  { id: 6, nama: "Yogyakarta Culture Trip", lokasi: "Yogyakarta", harga: 1800000, deskripsi: "Borobudur, Prambanan, dan kuliner khas Jogja.", gambar: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800", kategori: "wisata", tujuanList: ["Borobudur", "Prambanan", "Malioboro", "Pantai Parangtritis"], tarifSewaPerHari: 500000 },
  { id: 7, nama: "Travel Jakarta - Bandung", lokasi: "Jakarta - Bandung", harga: 150000, deskripsi: "Travel mobil nyaman antar kota Jakarta - Bandung. AC, sopir berpengalaman.", gambar: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800", kategori: "travel-mobil", tujuanList: ["Dago", "Lembang", "Kota Bandung", "Cihampelas"], tarifSewaPerHari: 700000, kapasitasMobil: 7 },
  { id: 8, nama: "Travel Jakarta - Bogor", lokasi: "Jakarta - Bogor", harga: 100000, deskripsi: "Layanan travel mobil cepat dan nyaman ke Bogor.", gambar: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800", kategori: "travel-mobil", tujuanList: ["Puncak", "Kebun Raya", "Sentul", "Kota Bogor"], tarifSewaPerHari: 600000, kapasitasMobil: 7 },
  { id: 9, nama: "Travel Bali Antar Kota", lokasi: "Bali", harga: 120000, deskripsi: "Antar jemput antar kota di Bali.", gambar: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800", kategori: "travel-mobil", tujuanList: ["Denpasar", "Ubud", "Kuta", "Sanur"], tarifSewaPerHari: 650000, kapasitasMobil: 6 },
];

const statusPriority: Record<BookingStatus, number> = {
  menunggu: 0,
  dijadwalkan: 1,
  "menuju-lokasi": 2,
  "dalam-perjalanan": 3,
  selesai: 4,
};

const createTravelGroups = (bookings: Booking[], destinasi: Destinasi[]): TravelTripGroup[] => {
  const groups = new Map<string, TravelTripGroup>();

  bookings.forEach((booking) => {
    const trip = destinasi.find((item) => item.id === booking.destinasiId);
    if (trip?.kategori !== "travel-mobil") return;
    // Sewa unit dipisah per booking (bukan grup), hanya travel-sekali yang digrup harian
    if (booking.mode !== "travel-sekali") return;

    const key = `${booking.destinasiId}-${booking.tanggal}`;
    const existing = groups.get(key);

    if (existing) {
      existing.bookingIds.push(booking.id);
      existing.totalPenumpang += booking.jumlah;
      if (!existing.driverId && booking.driverId) existing.driverId = booking.driverId;
      if (statusPriority[booking.status] > statusPriority[existing.status]) {
        existing.status = booking.status;
      }
      return;
    }

    groups.set(key, {
      key,
      representativeBookingId: booking.id,
      destinasiId: booking.destinasiId,
      tanggal: booking.tanggal,
      bookingIds: [booking.id],
      totalPenumpang: booking.jumlah,
      driverId: booking.driverId,
      status: booking.status,
    });
  });

  return Array.from(groups.values()).sort((a, b) => a.tanggal.localeCompare(b.tanggal));
};

// Migrasi data lama dari localStorage agar punya tujuanList
const migrateDestinasi = (raw: any[]): Destinasi[] => raw.map((d) => ({
  ...d,
  tujuanList: Array.isArray(d.tujuanList) ? d.tujuanList : [],
  tarifSewaPerHari: d.tarifSewaPerHari ?? (d.kategori === "travel-mobil" ? 600000 : 500000),
  kapasitasMobil: d.kapasitasMobil ?? (d.kategori === "travel-mobil" ? 7 : undefined),
}));

const migrateBookings = (raw: any[]): Booking[] => raw.map((b) => ({
  ...b,
  mode: b.mode ?? "wisata-paket",
  hargaTotal: b.hargaTotal ?? 0,
}));

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [destinasi, setDestinasi] = useState<Destinasi[]>(() => {
    const saved = localStorage.getItem("destinasi");
    if (!saved) return initialDestinasi;
    try { return migrateDestinasi(JSON.parse(saved)); } catch { return initialDestinasi; }
  });
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem("bookings");
    if (!saved) return [];
    try { return migrateBookings(JSON.parse(saved)); } catch { return []; }
  });

  useEffect(() => { localStorage.setItem("destinasi", JSON.stringify(destinasi)); }, [destinasi]);
  useEffect(() => { localStorage.setItem("bookings", JSON.stringify(bookings)); }, [bookings]);

  const addDestinasi = (d: Omit<Destinasi, "id">) => {
    setDestinasi((prev) => [...prev, { ...d, id: Math.max(...prev.map((x) => x.id), 0) + 1 }]);
  };

  const deleteDestinasi = (id: number) => {
    setDestinasi((prev) => prev.filter((d) => d.id !== id));
  };

  const addBooking = (b: Omit<Booking, "id" | "status">) => {
    setBookings((prev) => [...prev, { ...b, id: prev.length + 1, status: "menunggu" }]);
  };

  const assignDriver = (bookingId: number, driverId: number) => {
    setBookings((prev) => {
      const targetBooking = prev.find((booking) => booking.id === bookingId);
      if (!targetBooking) return prev;

      const targetDestinasi = destinasi.find((item) => item.id === targetBooking.destinasiId);
      // Hanya travel sekali jalan yang digrup harian
      const shouldGroup = targetDestinasi?.kategori === "travel-mobil" && targetBooking.mode === "travel-sekali";

      return prev.map((booking) => {
        const isTargetBooking = shouldGroup
          ? booking.destinasiId === targetBooking.destinasiId && booking.tanggal === targetBooking.tanggal && booking.mode === "travel-sekali"
          : booking.id === bookingId;

        if (!isTargetBooking) return booking;

        return {
          ...booking,
          driverId,
          status: booking.status === "menunggu" ? "dijadwalkan" : booking.status,
        };
      });
    });
  };

  const updateBookingStatus = (bookingId: number, status: BookingStatus) => {
    setBookings((prev) => {
      const targetBooking = prev.find((booking) => booking.id === bookingId);
      if (!targetBooking) return prev;

      const targetDestinasi = destinasi.find((item) => item.id === targetBooking.destinasiId);
      const shouldGroup = targetDestinasi?.kategori === "travel-mobil" && targetBooking.mode === "travel-sekali";

      return prev.map((booking) => {
        const isTargetBooking = shouldGroup
          ? booking.destinasiId === targetBooking.destinasiId && booking.tanggal === targetBooking.tanggal && booking.mode === "travel-sekali"
          : booking.id === bookingId;

        return isTargetBooking ? { ...booking, status } : booking;
      });
    });
  };

  const groupedTravelBookings = createTravelGroups(bookings, destinasi);

  return (
    <DataContext.Provider value={{ destinasi, bookings, groupedTravelBookings, addDestinasi, deleteDestinasi, addBooking, assignDriver, updateBookingStatus }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
};

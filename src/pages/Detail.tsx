import { useParams, useNavigate } from "react-router-dom";
import { useData, BookingMode } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { destinasi, addBooking } = useData();
  const { user } = useAuth();

  const d = destinasi.find((x) => x.id === Number(id));
  if (!d) return <div className="container py-12 text-center">Destinasi tidak ditemukan.</div>;

  const isWisata = d.kategori === "wisata";
  const defaultMode: BookingMode = isWisata ? "wisata-paket" : "travel-sekali";
  const sewaMode: BookingMode = isWisata ? "wisata-sewa" : "travel-sewa";

  const [mode, setMode] = useState<BookingMode>(defaultMode);
  const [tanggal, setTanggal] = useState("");
  const [jumlah, setJumlah] = useState(1);
  const [tujuan, setTujuan] = useState<string>("");
  const [jumlahHari, setJumlahHari] = useState(1);

  const isSewa = mode === "wisata-sewa" || mode === "travel-sewa";
  const tarifSewa = d.tarifSewaPerHari ?? 0;

  const total = isSewa ? tarifSewa * jumlahHari : d.harga * jumlah;

  const handleBooking = () => {
    if (!user) { navigate("/login"); return; }
    if (!tanggal) { toast.error("Pilih tanggal terlebih dahulu"); return; }
    if (!isSewa && d.tujuanList.length > 0 && !tujuan) { toast.error("Pilih tujuan terlebih dahulu"); return; }
    if (mode === "travel-sewa" && d.kapasitasMobil && jumlah > d.kapasitasMobil) {
      toast.error(`Kapasitas mobil maksimal ${d.kapasitasMobil} orang`); return;
    }
    addBooking({
      userId: user.id,
      destinasiId: d.id,
      tanggal,
      jumlah: isSewa && mode === "wisata-sewa" ? 1 : jumlah,
      mode,
      tujuan: tujuan || undefined,
      jumlahHari: isSewa ? jumlahHari : undefined,
      hargaTotal: total,
    });
    toast.success("Booking berhasil!");
    navigate("/booking");
  };

  return (
    <div className="container py-8 max-w-4xl">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" /> Kembali
      </Button>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="rounded-lg overflow-hidden">
          <img src={d.gambar} alt={d.nama} className="w-full h-full object-cover" />
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{d.nama}</h1>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4" /> {d.lokasi}
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-primary">Rp {d.harga.toLocaleString("id-ID")}<span className="text-sm font-normal text-muted-foreground">{isWisata ? " /paket per orang" : " /orang sekali jalan"}</span></p>
            {tarifSewa > 0 && (
              <p className="text-sm text-muted-foreground">Sewa mobil: <span className="font-semibold text-foreground">Rp {tarifSewa.toLocaleString("id-ID")}</span> / hari{d.kapasitasMobil ? ` (kap. ${d.kapasitasMobil} orang)` : ""}</p>
            )}
          </div>
          <p className="text-muted-foreground">{d.deskripsi}</p>

          <Card>
            <CardHeader><CardTitle className="text-lg">Booking Sekarang</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-2 block">Pilih Layanan</Label>
                <RadioGroup value={mode} onValueChange={(v) => setMode(v as BookingMode)} className="gap-2">
                  <Label className="flex items-start gap-2 border rounded-md p-3 cursor-pointer hover:bg-accent">
                    <RadioGroupItem value={defaultMode} className="mt-1" />
                    <div>
                      <div className="font-medium">{isWisata ? "Ikut Paket Wisata" : "Sekali Jalan"}</div>
                      <div className="text-xs text-muted-foreground">{isWisata ? "Harga tetap per orang sesuai paket" : "Bayar per kursi penumpang"}</div>
                    </div>
                  </Label>
                  <Label className="flex items-start gap-2 border rounded-md p-3 cursor-pointer hover:bg-accent">
                    <RadioGroupItem value={sewaMode} className="mt-1" />
                    <div>
                      <div className="font-medium">{isWisata ? "Sewa Mobil Saja (tujuan bebas)" : "Sewa Unit Mobil (1 mobil penuh)"}</div>
                      <div className="text-xs text-muted-foreground">Tarif Rp {tarifSewa.toLocaleString("id-ID")} / hari</div>
                    </div>
                  </Label>
                </RadioGroup>
              </div>

              <div>
                <Label>Tanggal {isSewa ? "Mulai" : ""}</Label>
                <Input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
              </div>

              {!isSewa && d.tujuanList.length > 0 && (
                <div>
                  <Label>Tujuan</Label>
                  <Select value={tujuan} onValueChange={setTujuan}>
                    <SelectTrigger><SelectValue placeholder="Pilih tujuan" /></SelectTrigger>
                    <SelectContent>
                      {d.tujuanList.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {isSewa && (
                <div>
                  <Label>Jumlah Hari Sewa</Label>
                  <Input type="number" min={1} value={jumlahHari} onChange={(e) => setJumlahHari(Math.max(1, Number(e.target.value)))} />
                </div>
              )}

              {mode !== "wisata-sewa" && (
                <div>
                  <Label>Jumlah {mode === "travel-sewa" ? "Penumpang (1 mobil)" : "Orang"}</Label>
                  <Input type="number" min={1} max={mode === "travel-sewa" ? d.kapasitasMobil : undefined} value={jumlah} onChange={(e) => setJumlah(Math.max(1, Number(e.target.value)))} />
                </div>
              )}

              <div className="text-lg font-bold">
                Total: Rp {total.toLocaleString("id-ID")}
              </div>
              <Button className="w-full" onClick={handleBooking}>
                {user ? "Booking Sekarang" : "Login untuk Booking"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Detail;

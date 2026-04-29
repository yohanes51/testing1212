import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useData, Kategori } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

const Admin = () => {
  const { user, users } = useAuth();
  const { destinasi, bookings, groupedTravelBookings, addDestinasi, deleteDestinasi, assignDriver } = useData();
  const [nama, setNama] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [harga, setHarga] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [gambar, setGambar] = useState("");
  const [kategori, setKategori] = useState<Kategori>("wisata");
  const [tujuanListStr, setTujuanListStr] = useState("");
  const [tarifSewa, setTarifSewa] = useState("");
  const [kapasitas, setKapasitas] = useState("");

  if (!user || user.role !== "admin") return <Navigate to="/" />;

  const drivers = users.filter((u) => u.role === "driver");
  // Booking individual = bukan travel-sekali (yang sudah digrup)
  const regularBookings = bookings.filter((b) => b.mode !== "travel-sekali");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const tujuanList = tujuanListStr.split(",").map((t) => t.trim()).filter(Boolean);
    addDestinasi({
      nama, lokasi, harga: Number(harga), deskripsi, gambar, kategori, tujuanList,
      tarifSewaPerHari: tarifSewa ? Number(tarifSewa) : undefined,
      kapasitasMobil: kategori === "travel-mobil" && kapasitas ? Number(kapasitas) : undefined,
    });
    toast.success("Destinasi berhasil ditambahkan!");
    setNama(""); setLokasi(""); setHarga(""); setDeskripsi(""); setGambar(""); setKategori("wisata");
    setTujuanListStr(""); setTarifSewa(""); setKapasitas("");
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Destinasi</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{destinasi.length}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Booking</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{bookings.length}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Pendapatan</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">Rp {bookings.reduce((sum, b) => sum + (b.hargaTotal ?? 0), 0).toLocaleString("id-ID")}</p></CardContent></Card>
      </div>

      <Tabs defaultValue="destinasi">
        <TabsList>
          <TabsTrigger value="destinasi">Kelola Destinasi</TabsTrigger>
          <TabsTrigger value="booking">Daftar Booking</TabsTrigger>
        </TabsList>

        <TabsContent value="destinasi" className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5" /> Tambah Destinasi</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleAdd} className="grid sm:grid-cols-2 gap-4">
                <div><Label>Nama</Label><Input value={nama} onChange={(e) => setNama(e.target.value)} required /></div>
                <div><Label>Lokasi</Label><Input value={lokasi} onChange={(e) => setLokasi(e.target.value)} required /></div>
                <div><Label>Harga (Rp)</Label><Input type="number" value={harga} onChange={(e) => setHarga(e.target.value)} required /></div>
                <div>
                  <Label>Kategori</Label>
                  <Select value={kategori} onValueChange={(v) => setKategori(v as Kategori)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wisata">Wisata</SelectItem>
                      <SelectItem value="travel-mobil">Travel Mobil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Tarif Sewa Mobil / Hari (Rp)</Label><Input type="number" value={tarifSewa} onChange={(e) => setTarifSewa(e.target.value)} placeholder="Opsional" /></div>
                {kategori === "travel-mobil" && (
                  <div><Label>Kapasitas Mobil (orang)</Label><Input type="number" value={kapasitas} onChange={(e) => setKapasitas(e.target.value)} placeholder="mis. 7" /></div>
                )}
                <div className="sm:col-span-2"><Label>Daftar Tujuan (pisahkan dengan koma)</Label><Input value={tujuanListStr} onChange={(e) => setTujuanListStr(e.target.value)} placeholder="Ubud, Kuta, Tanah Lot" /></div>
                <div className="sm:col-span-2"><Label>URL Gambar</Label><Input value={gambar} onChange={(e) => setGambar(e.target.value)} placeholder="https://..." required /></div>
                <div className="sm:col-span-2"><Label>Deskripsi</Label><Textarea value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} required /></div>
                <Button type="submit" className="sm:col-span-2">Tambah Destinasi</Button>
              </form>
            </CardContent>
          </Card>

          <Table>
            <TableHeader><TableRow><TableHead>Nama</TableHead><TableHead>Kategori</TableHead><TableHead>Lokasi</TableHead><TableHead>Harga</TableHead><TableHead></TableHead></TableRow></TableHeader>
            <TableBody>
              {destinasi.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.nama}</TableCell>
                  <TableCell><Badge variant={d.kategori === "travel-mobil" ? "default" : "secondary"}>{d.kategori}</Badge></TableCell>
                  <TableCell>{d.lokasi}</TableCell>
                  <TableCell>Rp {d.harga.toLocaleString("id-ID")}</TableCell>
                  <TableCell><Button variant="destructive" size="sm" onClick={() => { deleteDestinasi(d.id); toast.success("Destinasi dihapus"); }}><Trash2 className="h-4 w-4" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="booking">
          <Table>
            <TableHeader><TableRow><TableHead>ID / Grup</TableHead><TableHead>Destinasi</TableHead><TableHead>Mode</TableHead><TableHead>Tanggal</TableHead><TableHead>Detail</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead><TableHead>Driver</TableHead></TableRow></TableHeader>
            <TableBody>
              {groupedTravelBookings.map((trip) => {
                const d = destinasi.find((x) => x.id === trip.destinasiId);
                const totalGrup = bookings.filter((b) => trip.bookingIds.includes(b.id)).reduce((s, b) => s + (b.hargaTotal ?? 0), 0);
                return (
                  <TableRow key={trip.key}>
                    <TableCell className="font-medium">TRIP-{trip.tanggal}-{trip.destinasiId}</TableCell>
                    <TableCell>{d?.nama ?? "-"}</TableCell>
                    <TableCell><Badge>sekali jalan</Badge></TableCell>
                    <TableCell>{trip.tanggal}</TableCell>
                    <TableCell>{trip.bookingIds.length} booking · {trip.totalPenumpang} orang</TableCell>
                    <TableCell>Rp {totalGrup.toLocaleString("id-ID")}</TableCell>
                    <TableCell><Badge variant="outline">{trip.status}</Badge></TableCell>
                    <TableCell>
                      <Select value={trip.driverId ? trip.driverId.toString() : undefined} onValueChange={(v) => { assignDriver(trip.representativeBookingId, Number(v)); toast.success("Driver ditugaskan ke trip harian"); }}>
                        <SelectTrigger className="w-[160px]"><SelectValue placeholder="Pilih driver" /></SelectTrigger>
                        <SelectContent>
                          {drivers.map((dr) => <SelectItem key={dr.id} value={dr.id.toString()}>{dr.nama}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })}
              {regularBookings.map((b) => {
                const d = destinasi.find((x) => x.id === b.destinasiId);
                const modeLabel = b.mode === "wisata-paket" ? "paket wisata" : b.mode === "wisata-sewa" ? "sewa mobil" : b.mode === "travel-sewa" ? "sewa unit" : "sekali jalan";
                const detail = b.mode === "wisata-paket"
                  ? `${b.jumlah} orang${b.tujuan ? ` · ${b.tujuan}` : ""}`
                  : b.mode === "wisata-sewa"
                    ? `${b.jumlahHari ?? 1} hari`
                    : `${b.jumlahHari ?? 1} hari · ${b.jumlah} pnp`;
                return (
                  <TableRow key={b.id}>
                    <TableCell>{b.id}</TableCell>
                    <TableCell>{d?.nama ?? "-"}</TableCell>
                    <TableCell><Badge variant="secondary">{modeLabel}</Badge></TableCell>
                    <TableCell>{b.tanggal}</TableCell>
                    <TableCell>{detail}</TableCell>
                    <TableCell>Rp {(b.hargaTotal ?? 0).toLocaleString("id-ID")}</TableCell>
                    <TableCell><Badge variant="outline">{b.status}</Badge></TableCell>
                    <TableCell>
                      <Select value={b.driverId ? b.driverId.toString() : undefined} onValueChange={(v) => { assignDriver(b.id, Number(v)); toast.success("Driver ditugaskan"); }}>
                        <SelectTrigger className="w-[160px]"><SelectValue placeholder="Pilih driver" /></SelectTrigger>
                        <SelectContent>
                          {drivers.map((dr) => <SelectItem key={dr.id} value={dr.id.toString()}>{dr.nama}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })}
              {bookings.length === 0 && <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground">Belum ada booking</TableCell></TableRow>}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;

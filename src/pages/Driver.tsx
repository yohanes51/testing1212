import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useData, BookingStatus } from "@/contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car, MapPin, Calendar, Users } from "lucide-react";
import { toast } from "sonner";

const statusOptions: BookingStatus[] = ["dijadwalkan", "menuju-lokasi", "dalam-perjalanan", "selesai"];

const statusVariant = (s: BookingStatus): "default" | "secondary" | "outline" => {
  if (s === "selesai") return "secondary";
  if (s === "dalam-perjalanan" || s === "menuju-lokasi") return "default";
  return "outline";
};

const Driver = () => {
  const { user, users } = useAuth();
  const { bookings, destinasi, groupedTravelBookings, updateBookingStatus } = useData();

  if (!user) return <Navigate to="/login" />;
  if (user.role !== "driver") return <Navigate to="/" />;

  const myGroupedTrips = groupedTravelBookings.filter((trip) => trip.driverId === user.id);
  // Tugas individual: semua kecuali travel-sekali yg digrup
  const myTugas = bookings.filter((b) => b.driverId === user.id && b.mode !== "travel-sekali");

  return (
    <div className="container py-8 max-w-4xl">
      <div className="flex items-center gap-2 mb-6">
        <Car className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-bold">Dashboard Driver</h1>
      </div>
      <p className="text-muted-foreground mb-6">Halo, {user.nama}. Berikut daftar tugas perjalanan kamu.</p>

      {myGroupedTrips.length === 0 && myTugas.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Belum ada tugas yang ditugaskan. Tunggu admin menugaskan perjalanan ke kamu.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {myGroupedTrips.map((trip) => {
            const d = destinasi.find((x) => x.id === trip.destinasiId);
            return (
              <Card key={trip.key}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-2 flex-wrap">
                    <CardTitle className="text-lg">{d?.nama ?? "-"}</CardTitle>
                    <Badge variant={statusVariant(trip.status)}>{trip.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" />{d?.lokasi}</div>
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" />{trip.tanggal}</div>
                    <div className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" />{trip.totalPenumpang} penumpang</div>
                    <div className="text-muted-foreground">Total booking: <span className="text-foreground font-medium">{trip.bookingIds.length}</span></div>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Update status:</span>
                    <Select value={trip.status} onValueChange={(v) => { updateBookingStatus(trip.representativeBookingId, v as BookingStatus); toast.success("Status trip diperbarui"); }}>
                      <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {myTugas.map((b) => {
            const d = destinasi.find((x) => x.id === b.destinasiId);
            const penumpang = users.find((u) => u.id === b.userId);
            const modeLabel = b.mode === "wisata-paket" ? "Paket Wisata" : b.mode === "wisata-sewa" ? "Sewa Mobil" : "Sewa Unit";
            return (
              <Card key={b.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-2 flex-wrap">
                    <div>
                      <CardTitle className="text-lg">{d?.nama ?? "-"}</CardTitle>
                      <Badge variant="secondary" className="mt-1">{modeLabel}</Badge>
                    </div>
                    <Badge variant={statusVariant(b.status)}>{b.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" />{b.tujuan ?? d?.lokasi}</div>
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" />{b.tanggal}{b.jumlahHari ? ` · ${b.jumlahHari} hari` : ""}</div>
                    <div className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" />{b.jumlah} {b.mode === "wisata-sewa" ? "pemesan" : "penumpang"}</div>
                    <div className="text-muted-foreground">Pemesan: <span className="text-foreground font-medium">{penumpang?.nama ?? "-"}</span></div>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Update status:</span>
                    <Select value={b.status} onValueChange={(v) => { updateBookingStatus(b.id, v as BookingStatus); toast.success("Status diperbarui"); }}>
                      <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Driver;

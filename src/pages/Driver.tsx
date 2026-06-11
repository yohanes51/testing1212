import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useData, BookingStatus } from "@/contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car, MapPin, Calendar, Users, Navigation, Coffee } from "lucide-react";
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
        <div className="space-y-6">
          {myGroupedTrips.map((trip) => {
            const d = destinasi.find((x) => x.id === trip.destinasiId);
            const destinationQuery = d?.lokasi ?? "Indonesia";
            const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(destinationQuery)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

            return (
              <Card key={trip.key} className="overflow-hidden">
                <CardHeader className="pb-3 bg-muted/30">
                  <div className="flex justify-between items-start gap-2 flex-wrap">
                    <CardTitle className="text-lg">{d?.nama ?? "-"}</CardTitle>
                    <Badge variant={statusVariant(trip.status)}>{trip.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" />{d?.lokasi}</div>
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" />{trip.tanggal}</div>
                    <div className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" />{trip.totalPenumpang} penumpang</div>
                    <div className="text-muted-foreground">Total booking: <span className="text-foreground font-medium">{trip.bookingIds.length}</span></div>
                  </div>

                  {/* Route Flow */}
                  <div className="mt-4 p-4 border rounded-lg bg-card">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                      <div>
                        <span className="text-xs text-muted-foreground block mb-1">Titik Keberangkat / Jemput</span>
                        <div className="flex items-center gap-1.5 font-medium text-sm">
                          <Navigation className="h-3.5 w-3.5 text-blue-500" />
                          Pool Shuttle, Bandung
                        </div>
                      </div>
                      <div className="flex flex-col items-start sm:items-center justify-center text-muted-foreground">
                        <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
                          <Coffee className="h-3 w-3" /> Checkpoint Transit
                        </span>
                        <span className="text-xs font-mono text-foreground">Rest Area Tol KM 57</span>
                      </div>
                      <div className="sm:text-right">
                        <span className="text-xs text-muted-foreground block mb-1">Tujuan Akhir</span>
                        <div className="flex items-center sm:justify-end gap-1.5 font-medium text-sm">
                          <MapPin className="h-3.5 w-3.5 text-red-500" />
                          {destinationQuery}
                        </div>
                      </div>
                    </div>
                    <div className="rounded-md overflow-hidden border bg-muted">
                      <iframe
                        title={`Map to ${destinationQuery}`}
                        width="100%"
                        height="250"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        src={mapUrl}
                      ></iframe>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
                    <span className="text-sm font-medium">Update status:</span>
                    <Select value={trip.status} onValueChange={(v) => { updateBookingStatus(trip.representativeBookingId, v as BookingStatus); toast.success("Status trip diperbarui"); }}>
                      <SelectTrigger className="w-full sm:w-[250px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((s) => <SelectItem key={s} value={s}>{s.replace("-", " ").toUpperCase()}</SelectItem>)}
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
            
            const destinationQuery = b.tujuan ?? d?.lokasi ?? "Indonesia";
            const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(destinationQuery)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

            // Dynamic logic checking for the pickup strategies discussed
            const isSouthBandungPickup = b.mode === "wisata-paket";
            const startingPointLabel = isSouthBandungPickup 
              ? "Cibaduyut (Neutral Center Point)" 
              : "Bandung, Jawa Barat";
            const transitLabel = b.mode === "travel-sewa" 
              ? "Rest Area Tol KM 147 (Bensin/Toilets)" 
              : "Rest Area KM 57 / Sentra Kuliner";

            return (
              <Card key={b.id} className="overflow-hidden">
                <CardHeader className="pb-3 bg-muted/30">
                  <div className="flex justify-between items-start gap-2 flex-wrap">
                    <div>
                      <CardTitle className="text-lg">{d?.nama ?? "-"}</CardTitle>
                      <Badge variant="secondary" className="mt-1.5">{modeLabel}</Badge>
                    </div>
                    <Badge variant={statusVariant(b.status)}>{b.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" />{destinationQuery}</div>
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" />{b.tanggal}{b.jumlahHari ? ` · ${b.jumlahHari} hari` : ""}</div>
                    <div className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" />{b.jumlah} {b.mode === "wisata-sewa" ? "pemesan" : "penumpang"}</div>
                    <div className="text-muted-foreground">Pemesan: <span className="text-foreground font-medium">{penumpang?.nama ?? "-"}</span></div>
                  </div>

                  {/* Route Flow */}
                  <div className="mt-4 p-4 border rounded-lg bg-card">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                      <div>
                        <span className="text-xs text-muted-foreground block mb-1">Titik Keberangkatan</span>
                        <div className="flex items-center gap-1.5 font-medium text-sm">
                          <Navigation className="h-3.5 w-3.5 text-blue-500" />
                          {startingPointLabel}
                        </div>
                      </div>
                      <div className="flex flex-col items-start sm:items-center justify-center text-muted-foreground">
                        <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
                          <Coffee className="h-3 w-3" /> Checkpoint Transit
                        </span>
                        <span className="text-xs font-mono text-foreground text-center">{transitLabel}</span>
                      </div>
                      <div className="sm:text-right">
                        <span className="text-xs text-muted-foreground block mb-1">Tujuan</span>
                        <div className="flex items-center sm:justify-end gap-1.5 font-medium text-sm">
                          <MapPin className="h-3.5 w-3.5 text-red-500" />
                          {destinationQuery}
                        </div>
                      </div>
                    </div>
                    <div className="rounded-md overflow-hidden border bg-muted">
                      <iframe
                        title={`Map to ${destinationQuery}`}
                        width="100%"
                        height="250"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        src={mapUrl}
                      ></iframe>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
                    <span className="text-sm font-medium">Update status:</span>
                    <Select value={b.status} onValueChange={(v) => { updateBookingStatus(b.id, v as BookingStatus); toast.success("Status diperbarui"); }}>
                      <SelectTrigger className="w-full sm:w-[250px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((s) => <SelectItem key={s} value={s}>{s.replace("-", " ").toUpperCase()}</SelectItem>)}
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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { Navigate } from "react-router-dom";

const BookingPage = () => {
  const { user } = useAuth();
  const { bookings, destinasi } = useData();

  if (!user) return <Navigate to="/login" />;

  const myBookings = bookings.filter((b) => b.userId === user.id);

  return (
    <div className="container py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Booking Saya</CardTitle>
        </CardHeader>
        <CardContent>
          {myBookings.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Belum ada booking. Yuk mulai jelajahi destinasi!</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Destinasi</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Detail</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myBookings.map((b) => {
                  const d = destinasi.find((x) => x.id === b.destinasiId);
                  const modeLabel = b.mode === "wisata-paket" ? "Paket Wisata" : b.mode === "wisata-sewa" ? "Sewa Mobil" : b.mode === "travel-sewa" ? "Sewa Unit" : "Sekali Jalan";
                  const detail = b.mode === "wisata-paket"
                    ? `${b.jumlah} orang${b.tujuan ? ` · ${b.tujuan}` : ""}`
                    : b.mode === "wisata-sewa"
                      ? `${b.jumlahHari ?? 1} hari sewa`
                      : b.mode === "travel-sewa"
                        ? `${b.jumlahHari ?? 1} hari · ${b.jumlah} penumpang`
                        : `${b.jumlah} orang${b.tujuan ? ` · ${b.tujuan}` : ""}`;
                  return (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium">{d?.nama ?? "-"}</TableCell>
                      <TableCell>{modeLabel}</TableCell>
                      <TableCell>{b.tanggal}</TableCell>
                      <TableCell>{detail}</TableCell>
                      <TableCell className="text-right font-bold">Rp {(b.hargaTotal ?? 0).toLocaleString("id-ID")}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingPage;

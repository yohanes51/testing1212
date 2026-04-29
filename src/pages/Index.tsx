import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Kategori, useData } from "@/contexts/DataContext";
import { Car, MapPin, Mountain } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Index = () => {
  const { destinasi } = useData();
  const [filter, setFilter] = useState<"semua" | Kategori>("semua");

  const filtered = filter === "semua" ? destinasi : destinasi.filter((d) => d.kategori === filter);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-primary py-20 text-primary-foreground">
        <div className="container text-center">
          <h1 className="text-4xl font-bold mb-4">Jelajahi Indonesia Bersama TravelKu</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Temukan destinasi wisata terbaik & layanan travel mobil terpercaya di seluruh Nusantara
          </p>
        </div>
      </section>

      {/* Destinasi */}
      <section className="container py-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Pilihan Untuk Kamu</h2>

        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="semua">Semua</TabsTrigger>
            <TabsTrigger value="wisata"><Mountain className="h-4 w-4 mr-1" />Wisata</TabsTrigger>
            <TabsTrigger value="travel-mobil"><Car className="h-4 w-4 mr-1" />Travel Mobil</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((d) => (
            <Card key={d.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden relative">
                <img src={d.gambar} alt={d.nama} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                <Badge className="absolute top-2 right-2" variant={d.kategori === "travel-mobil" ? "default" : "secondary"}>
                  {d.kategori === "travel-mobil" ? <><Car className="h-3 w-3 mr-1" />Travel Mobil</> : <><Mountain className="h-3 w-3 mr-1" />Wisata</>}
                </Badge>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{d.nama}</CardTitle>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {d.lokasi}
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground line-clamp-2">{d.deskripsi}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <span className="font-bold text-primary">Rp {d.harga.toLocaleString("id-ID")}</span>
                <Button size="sm" asChild>
                  <Link to={`/detail/${d.id}`}>Lihat Detail</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">Tidak ada destinasi pada kategori ini.</p>
        )}
      </section>
    </div>
  );
};

export default Index;

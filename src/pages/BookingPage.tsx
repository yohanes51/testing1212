import React, { useState } from 'react';
import { SeatSelection } from '../components/SeatSelection';

type ServiceType = 'shuttle' | 'sewa' | 'travel_biasa';

export default function BookingPage() {
  const [serviceType, setServiceType] = useState<ServiceType>('travel_biasa');
  
  const [meetingPoint, setMeetingPoint] = useState('');
  const [shuttleTime, setShuttleTime] = useState('');
  const [rentalDuration, setRentalDuration] = useState('6 jam');
  
  const [carLocation] = useState('Pool Pusat - Jl. Pasirkaliki No. 120');
  const [passengerCapacity, setPassengerCapacity] = useState<4 | 8>(4);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const shuttleSchedules = ['06:00 WIB', '09:00 WIB', '12:00 WIB', '15:00 WIB', '18:00 WIB', '21:00 WIB'];
  
  const rentalDurations = [
    { value: '1 jam', label: '1 Jam' },
    { value: '3 jam', label: '3 Jam' },
    { value: '6 jam', label: '6 Jam' },
    { value: '16 jam', label: '16 Jam' },
    { value: '1 hari', label: '1 Hari Full' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-8 text-white">
          <h1 className="text-2xl font-bold tracking-tight">Pemesanan Kendaraan & Travel</h1>
          <p className="text-slate-300 text-sm mt-1">Lengkapi data perjalanan dan opsi armada kustom Anda</p>
        </div>

        <div className="p-8 space-y-8">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Pilih Jenis Layanan</label>
            <div className="grid grid-cols-3 gap-3">
              {(['travel_biasa', 'shuttle', 'sewa'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setServiceType(type)}
                  className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                    serviceType === type
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {type === 'travel_biasa' && '✈️ Travel Biasa'}
                  {type === 'shuttle' && '🚌 Shuttle Reguler'}
                  {type === 'sewa' && '🚗 Sewa Mobil'}
                </button>
              ))}
            </div>
          </div>

          {serviceType === 'shuttle' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">📍 Lokasi Titik Kumpul Shuttle</label>
                <select
                  value={meetingPoint}
                  onChange={(e) => setMeetingPoint(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none"
                >
                  <option value="">-- Pilih Titik Keberangkatan --</option>
                  <option value="cbn_bandung">CBN Office Bandung (Dago)</option>
                  <option value="pasteur_pool">Pool Shuttle Pasteur</option>
                  <option value="soetta_t1">Bandara Soekarno-Hatta - Terminal 1</option>
                  <option value="stasiun_bdg">Stasiun Bandung (Pintu Utara)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">⏰ Jam Keberangkatan Shuttle Available</label>
                <div className="grid grid-cols-3 gap-2">
                  {shuttleSchedules.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setShuttleTime(time)}
                      className={`py-2 px-3 text-xs font-medium rounded-md border text-center transition-all ${
                        shuttleTime === time
                          ? 'bg-emerald-600 border-emerald-600 text-white font-bold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {serviceType === 'sewa' && (
            <div className="space-y-6 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">📍 Lokasi Serah Terima / Titik Kumpul Mobil</label>
                <select
                  value={meetingPoint}
                  onChange={(e) => setMeetingPoint(e.target.value)}
                  className="w-full max-w-md rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none"
                >
                  <option value="">-- Pilih Lokasi Pengambilan --</option>
                  <option value="cbn_bandung">CBN Office Bandung (Dago)</option>
                  <option value="pasteur_pool">Pool Shuttle Pasteur</option>
                  <option value="stasiun_bdg">Stasiun Bandung (Pintu Utara)</option>
                </select>
              </div>

              <div className="p-5 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-3">
                <h3 className="text-sm font-bold text-indigo-950 flex items-center gap-1">⏱️ Durasi Penyewaan Mobil</h3>
                <div className="flex flex-wrap gap-2">
                  {rentalDurations.map((dur) => (
                    <button
                      key={dur.value}
                      type="button"
                      onClick={() => setRentalDuration(dur.value)}
                      className={`py-2 px-5 rounded-full border text-xs font-semibold transition-all ${
                        rentalDuration === dur.value
                          ? 'bg-indigo-700 border-indigo-700 text-white shadow'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {dur.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {serviceType === 'travel_biasa' && (
            <div className="space-y-6 pt-4 border-t border-slate-100">
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">📍 Lokasi Titik Kumpul Perjalanan</label>
                <select
                  value={meetingPoint}
                  onChange={(e) => setMeetingPoint(e.target.value)}
                  className="w-full max-w-md rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none"
                >
                  <option value="">-- Pilih Titik Keberangkatan --</option>
                  <option value="cbn_bandung">CBN Office Bandung (Dago)</option>
                  <option value="pasteur_pool">Pool Shuttle Pasteur</option>
                  <option value="stasiun_bdg">Stasiun Bandung (Pintu Utara)</option>
                </select>
              </div>

              <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50/30 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl mt-0.5 select-none">📍</span>
                  <div>
                    <h4 className="text-sm font-bold text-amber-900">Lokasi Penjemputan / Garasi Mobil Saat Ini</h4>
                    <p className="text-xs text-amber-800/80 mt-0.5 font-medium">{carLocation}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl self-start sm:self-center shadow-sm">
                  <img 
                    src="/dart.png" 
                    alt="🎯" 
                    className="w-5 h-5 object-contain select-none animate-pulse"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.parentElement?.querySelector('.fallback-emoji');
                      if (fallback) fallback.classList.remove('hidden');
                    }}
                  />
                  <span className="fallback-emoji hidden text-base select-none">🎯</span>
                  <span className="text-xl font-black text-emerald-700 tracking-tight font-mono">
                    5.4 km
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">👥 Opsi Kapasitas Maksimal Penumpang</label>
                <div className="flex space-x-4">
                  {[4, 8].map((capacity) => (
                    <label
                      key={capacity}
                      className={`flex-1 flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        passengerCapacity === capacity
                          ? 'border-indigo-600 bg-indigo-50/40 text-indigo-950 font-bold'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                      onClick={() => {
                        setPassengerCapacity(capacity as 4 | 8);
                        setSelectedSeats([]);
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{capacity === 4 ? '🚗' : '🚐'}</span>
                        <div>
                          <p className="text-sm">Tipe Kendaraan ({capacity === 4 ? '1-4' : '1-8'} Orang)</p>
                          <p className="text-xs text-slate-400 font-normal">
                            {capacity === 4 ? 'Avanza / Xenia Reguler' : 'HiAce Luxury / Elf Big'}
                          </p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="capacity"
                        checked={passengerCapacity === capacity}
                        onChange={() => {}}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-3">
                  <label className="block text-sm font-bold text-slate-800">✈️ Denah Posisi Kursi (One-Way Mode Airplane Layout)</label>
                  <p className="text-xs text-slate-500">Pilih kursi favorit Anda langsung pada panel visual kabin di bawah ini</p>
                </div>
                <SeatSelection 
                  maxPassengers={passengerCapacity} 
                  onSeatSelect={(seats) => setSelectedSeats(seats)} 
                />
                {selectedSeats.length > 0 && (
                  <div className="mt-3 text-center text-sm text-indigo-600 font-semibold bg-indigo-50 py-2 rounded-lg">
                    Kursi yang Anda pilih: {selectedSeats.join(', ')}
                  </div>
                )}
              </div>

            </div>
          )}

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg"
              onClick={() => alert('Pemesanan UI berhasil dikonfirmasi!')}
            >
              Lanjutkan Pemesanan →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { SeatSelection } from './SeatSelection';

export const TravelAddons: React.FC = () => {
  const [meetingPoint, setMeetingPoint] = useState('');
  const [shuttleTime, setShuttleTime] = useState('');
  const [rentalDuration, setRentalDuration] = useState('6 jam');
  const [passengerCapacity, setPassengerCapacity] = useState<4 | 8>(4);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [showPlaneSeats, setShowPlaneSeats] = useState(false);

  return (
    <div className="mt-6 p-6 bg-white rounded-xl border border-slate-200 shadow-sm space-y-6 text-left">
      <h3 className="text-lg font-bold text-slate-900 border-b pb-2">🛠️ Opsi Tambahan Perjalanan</h3>

      {/* 1 & 2: Titik Kumpul & Jam Shuttle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">📍 Pilihlah Titik Kumpul</label>
          <select 
            value={meetingPoint} 
            onChange={(e) => setMeetingPoint(e.target.value)}
            className="w-full text-xs rounded border border-slate-300 p-2 focus:outline-none focus:border-indigo-500"
          >
            <option value="">-- Pilih Titik Temu --</option>
            <option value="pool_dago">Pool Dago (Office)</option>
            <option value="pasteur">Pool Pasteur</option>
            <option value="stasiun">Stasiun Utama</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">⏰ Jadwal Keberangkatan Shuttle</label>
          <div className="grid grid-cols-3 gap-1">
            {['07:00', '12:00', '17:00'].map(time => (
              <button
                key={time}
                type="button"
                onClick={() => setShuttleTime(time)}
                className={`p-1.5 text-[11px] font-medium rounded border text-center ${
                  shuttleTime === time ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-50 text-slate-700'
                }`}
              >
                {time} WIB
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3: Durasi Sewa Mobil */}
      <div className="p-3 bg-slate-50 rounded-lg">
        <label className="block text-xs font-bold text-slate-700 mb-1.5">⏱️ Durasi Sewa Mobil (Jika Memilih Sewa)</label>
        <div className="flex flex-wrap gap-1.5">
          {['1 jam', '3 jam', '6 jam', '16 jam', '1 hari'].map(dur => (
            <button
              key={dur}
              type="button"
              onClick={() => setRentalDuration(dur)}
              className={`px-3 py-1 text-xs rounded-full border ${
                rentalDuration === dur ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600'
              }`}
            >
              {dur}
            </button>
          ))}
        </div>
      </div>

      {/* Travel Biasa Specific Options */}
      <div className="pt-4 border-t border-slate-100 space-y-4">
        <div className="text-xs bg-amber-50 text-amber-800 p-2.5 rounded border border-amber-200">
          <strong>📍 Lokasi Armada Sekarang:</strong> Pool Pusat - Jl. Pasirkaliki No. 120
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">👥 Opsi Kapasitas Penumpang (Travel Biasa)</label>
          <div className="grid grid-cols-2 gap-2">
            {[4, 8].map(cap => (
              <button
                key={cap}
                type="button"
                onClick={() => { setPassengerCapacity(cap as 4|8); setSelectedSeats([]); }}
                className={`p-2 text-xs rounded border text-left ${passengerCapacity === cap ? 'border-indigo-600 bg-indigo-50/50 font-bold' : 'bg-white'}`}
              >
                Kapasitas 1-{cap} Orang ({cap === 4 ? 'Avanza' : 'HiAce'})
              </button>
            ))}
          </div>
        </div>

        {/* Airplane Seat Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowPlaneSeats(!showPlaneSeats)}
            className="w-full text-center py-2 bg-slate-900 text-white rounded text-xs font-bold"
          >
            {showPlaneSeats ? '🙈 Sembunyikan Denah Kursi' : '✈️ Pilih Posisi Duduk (Model Pesawat Sekali Jalan)'}
          </button>
          
          {showPlaneSeats && (
            <div className="mt-3 animate-fadeIn">
              <SeatSelection maxPassengers={passengerCapacity} onSeatSelect={(seats) => setSelectedSeats(seats)} />
              {selectedSeats.length > 0 && (
                <p className="text-center text-xs font-bold text-indigo-600 mt-2">Kursi Terpilih: {selectedSeats.join(', ')}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';

interface SeatSelectionProps {
  maxPassengers: 4 | 8;
  onSeatSelect: (seats: string[]) => void;
}

export const SeatSelection: React.FC<SeatSelectionProps> = ({ maxPassengers, onSeatSelect }) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const occupiedSeats = ['B1', 'D2'];

  const seatsLayout = maxPassengers === 4 
    ? [
        { row: 'Front', left: [], right: ['A1'] },
        { row: 'Row 1', left: ['B1'], right: ['B2'] },
        { row: 'Row 2', left: ['C1'], right: ['C2'] },
      ]
    : [
        { row: 'Front', left: [], right: ['A1'] },
        { row: 'Row 1', left: ['B1'], right: ['B2'] },
        { row: 'Row 2', left: ['C1'], right: ['C2'] },
        { row: 'Row 3', left: ['D1'], right: ['D2'] },
        { row: 'Row 4', left: ['E1'], right: ['E2'] },
      ];

  const handleSeatClick = (seatId: string) => {
    if (occupiedSeats.includes(seatId)) return;
    let updatedSeats = [...selectedSeats];
    if (updatedSeats.includes(seatId)) {
      updatedSeats = updatedSeats.filter(s => s !== seatId);
    } else {
      if (updatedSeats.length >= maxPassengers) {
        alert(`Maksimal pemilihan untuk opsi ini adalah ${maxPassengers} kursi.`);
        return;
      }
      updatedSeats.push(seatId);
    }
    setSelectedSeats(updatedSeats);
    onSeatSelect(updatedSeats);
  };

  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm max-w-xs mx-auto my-3">
      <div className="text-center font-semibold text-xs text-slate-400 uppercase tracking-wider mb-2">Bagian Depan</div>
      <div className="flex justify-between items-center border-b border-dashed border-slate-300 pb-2 mb-4">
        <div className="text-xs">🚗</div>
        <div className="w-8 h-8 bg-slate-100 rounded border border-slate-300 opacity-40 flex items-center justify-center text-[10px]">Supir</div>
      </div>
      <div className="space-y-2">
        {seatsLayout.map((layoutRow, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex space-x-1 w-5/12 justify-end">
              {layoutRow.left.map(seatId => (
                <button
                  key={seatId}
                  type="button"
                  onClick={() => handleSeatClick(seatId)}
                  className={`w-8 h-8 rounded text-[10px] font-bold flex items-center justify-center border ${
                    occupiedSeats.includes(seatId) ? 'bg-slate-300 text-slate-500 cursor-not-allowed' :
                    selectedSeats.includes(seatId) ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 border-slate-300'
                  }`}
                  disabled={occupiedSeats.includes(seatId)}
                >
                  {seatId}
                </button>
              ))}
            </div>
            <div className="text-[9px] text-slate-300 font-mono w-2/12 text-center">GANG</div>
            <div className="flex space-x-1 w-5/12 justify-start">
              {layoutRow.right.map(seatId => (
                <button
                  key={seatId}
                  type="button"
                  onClick={() => handleSeatClick(seatId)}
                  className={`w-8 h-8 rounded text-[10px] font-bold flex items-center justify-center border ${
                    occupiedSeats.includes(seatId) ? 'bg-slate-300 text-slate-500 cursor-not-allowed' :
                    selectedSeats.includes(seatId) ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 border-slate-300'
                  }`}
                  disabled={occupiedSeats.includes(seatId)}
                >
                  {seatId}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
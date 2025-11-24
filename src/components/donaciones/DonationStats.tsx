import { DollarSign, Package } from 'lucide-react';

interface Props {
  totalMonetario: number;
  totalEspecie: number;
}

export default function DonationStats({ totalMonetario, totalEspecie }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
        <div className="p-3 bg-green-100 text-green-600 rounded-full">
          <DollarSign size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">Recaudación Monetaria</p>
          <h3 className="text-2xl font-bold text-slate-800">S/ {totalMonetario.toLocaleString('es-PE')}</h3>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
        <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
          <Package size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">Donaciones en Especie</p>
          <h3 className="text-2xl font-bold text-slate-800">{totalEspecie} items</h3>
        </div>
      </div>
    </div>
  );
}
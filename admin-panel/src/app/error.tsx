'use client'; import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { t } from '@/lib/i18n'; export default function Error({ error, reset,
}: { error: Error & { digest?: string }; reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white [#1A1A24] rounded-2xl shadow-xl border border-gray-100 p-8 text-center space-y-6">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-10 h-10 text-amber-500 " />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2"> Kutilmagan xatolik yuz berdi </h2>
          <p className="text-sm text-gray-500 "> Tizimda vaqtinchalik nosozlik yuzaga keldi. Iltimos, sahifani yangilang yoki birozdan so'ng urinib ko'ring. </p>
        </div>
        <button onClick={() => reset()} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-all" >
          <RefreshCcw className="w-5 h-5" /> <span>Qaytadan urinib ko'rish</span>
        </button>
      </div>
    </div>
  );
}

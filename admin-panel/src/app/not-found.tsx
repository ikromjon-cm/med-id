'use client'; 
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-12 h-12 text-red-500 " />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 ">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 "> Sahifa topilmadi </h2>
        <p className="text-gray-500 "> Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki o'chirilgan. </p>
        <div className="pt-4">
          <Link href="/admin/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20" >
            <ArrowLeft className="w-5 h-5" /> <span>Bosh sahifaga qaytish</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

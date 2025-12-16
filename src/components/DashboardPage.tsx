import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.tsx';
import DashboardNavbar from './DashboardNavbar';
import { useAuth } from '../contexts/AuthContext';
import { Scan, History, ShoppingBag, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from './ui/button.tsx';

export default function DashboardPage() {
  const { user,loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  
  return (
    <div className="min-h-screen">
      <DashboardNavbar />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-8 text-white mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8" />
            <h1 className="text-4xl">Selamat Datang, {user?.name}!</h1>
          </div>
          <p className="text-xl opacity-90">
            Siap menemukan palet warna yang sempurna untuk Anda hari ini?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link to="/dashboard/analisis">
            <Card className="border-2 border-purple-100 hover:border-purple-400 hover:shadow-lg transition-all cursor-pointer h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl flex items-center justify-center mb-2">
                  <Scan className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Analisis Warna</CardTitle>
                <CardDescription>
                  Upload foto dan temukan palet warna personal Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
                  Mulai Analisis <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/dashboard/riwayat">
            <Card className="border-2 border-purple-100 hover:border-purple-400 hover:shadow-lg transition-all cursor-pointer h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl flex items-center justify-center mb-2">
                  <History className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Riwayat Analisis</CardTitle>
                <CardDescription>
                  Lihat semua hasil analisis yang pernah Anda lakukan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full border-purple-300 text-purple-600 hover:bg-purple-50">
                  Lihat Riwayat
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/dashboard/katalog">
            <Card className="border-2 border-purple-100 hover:border-purple-400 hover:shadow-lg transition-all cursor-pointer h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl flex items-center justify-center mb-2">
                  <ShoppingBag className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Katalog Produk</CardTitle>
                <CardDescription>
                  Jelajahi koleksi fashion dari byneera.id
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full border-purple-300 text-purple-600 hover:bg-purple-50">
                  Lihat Katalog
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-pink-50 to-white border-pink-200">
            <CardHeader>
              <CardTitle>Tips Foto yang Baik</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 mt-1">•</span>
                  <span>Pastikan pencahayaan cukup dan merata</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 mt-1">•</span>
                  <span>Wajah terlihat jelas tanpa halangan</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 mt-1">•</span>
                  <span>Gunakan background netral</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 mt-1">•</span>
                  <span>Hindari makeup yang terlalu tebal</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-200">
            <CardHeader>
              <CardTitle>Tentang Analisis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Sistem kami menganalisis skintone Anda untuk menentukan palet warna yang paling sesuai. 
                Hasil analisis akan menampilkan kategori warna dan rekomendasi produk fashion dari byneera.id.
              </p>
              <p className="text-gray-600 text-sm">
                Hasil analisis akan otomatis tersimpan di riwayat Anda.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

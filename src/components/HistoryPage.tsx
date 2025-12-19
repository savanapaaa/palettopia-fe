import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.tsx';
import { Button } from './ui/button.tsx';
import { Badge } from './ui/badge.tsx';
import DashboardNavbar from './DashboardNavbar';
import { History, Eye, Trash2, Calendar, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog.tsx';
import { toast } from "sonner";
import api, { getCsrfCookie, getImageUrl } from '../services/api';

interface HistoryItem {
  id: number;
  palette_name: string;
  colors: string[];
  undertone?: string;
  explanation?: string;
  image_url?: string;
  created_at: string;
}

export default function HistoryPage() {
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<HistoryItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch history dari backend
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      await getCsrfCookie();
      
      const response = await api.get('/history');
      console.log('History from backend:', response.data);
      
      const historyData = Array.isArray(response.data) ? response.data : response.data.data || [];
      setHistoryList(historyData);
    } catch (error: any) {
      console.error('Error fetching history:', error);
      toast.error('Gagal memuat riwayat analisis');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await getCsrfCookie();
      await api.delete(`/history/${id}`);
      
      setHistoryList(historyList.filter(item => item.id !== id));
      toast.success('Riwayat berhasil dihapus');
    } catch (error: any) {
      console.error('Error deleting history:', error);
      toast.error('Gagal menghapus riwayat');
    }
  };

  const handleViewDetail = (item: HistoryItem) => {
    setSelectedHistory(item);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen">
      <DashboardNavbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl mb-2">Riwayat Analisis</h1>
              <p className="text-xl text-gray-600">
                Lihat kembali semua hasil analisis warna yang pernah Anda lakukan
              </p>
            </div>
            <Link to="/dashboard/analisis">
              <Button className="bg-gradient-to-r from-pink-500 
              to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
                Buat Analisis Baru
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <span className="ml-3 text-gray-600">Memuat riwayat...</span>
            </div>
          ) : historyList.length === 0 ? (
            <Card className="border-2 border-purple-100">
              <CardContent className="pt-16 pb-16 text-center">
                <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl mb-2 text-gray-600">Belum Ada Riwayat</h3>
                <p className="text-gray-500 mb-6">
                  Anda belum melakukan analisis warna. 
                  Mulai sekarang untuk mendapatkan rekomendasi palet warna personal!
                </p>
                <Link to="/dashboard/analisis">
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
                    Mulai Analisis
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {historyList.map((item) => (
                <Card key={item.id} className="border-2 border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2 text-gray-600">
                      <div className='flex items-center gap-2'>
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{formatDate(item.created_at)}</span>
                      </div>

                      <Badge className="text-white bg-gradient-to-r from-pink-500 to-purple-600">
                        {item.undertone || 'Hasil'}
                      </Badge>
                      </div>

                      <CardTitle>
                        <span className="capitalize">{item.palette_name}</span>
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="bg-white space-y-4">
                    {/* Image Preview */}
                    {item.image_url && (
                      <img 
                        src={getImageUrl(item.image_url)} 
                        alt="Analysis"
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          // Fallback jika gambar gagal load
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=No+Image';
                        }}
                      />
                    )}
                    
                    {/* Color Preview */}
                    <div className="grid grid-cols-4 gap-2">
                      {item.colors.slice(0, 8).map((color, index) => (
                        <div
                          key={index}
                          className="h-12 rounded border-2 border-gray-200"
                          style={{ backgroundColor: color }}
                        ></div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleViewDetail(item)}
                        variant="outline"
                        className="flex-1 border-purple-300 text-purple-600 hover:bg-purple-50"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Detail
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon" className="border-red-300 text-red-600 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white border border-gray-200 shadow-lg">
                            <AlertDialogHeader >
                              <AlertDialogTitle>Hapus Riwayat?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tindakan ini tidak dapat dibatalkan. Riwayat analisis ini akan dihapus permanen dari akun Anda.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(item.id)}
                                className="text-white bg-red-600 hover:bg-red-700"
                              >
                                Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Detail Modal */}
          {selectedHistory && (
            <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4">
              <Card className="max-w-2xl w-full bg-white max-h-[90vh] overflow-y-auto">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl capitalize">
                        {selectedHistory.palette_name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(selectedHistory.created_at)}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedHistory(null)}
                    >
                      ✕
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg mb-3">Palet Warna</h3>
                    <div className="grid grid-cols-4 gap-3">
                      {selectedHistory.colors.map((color, index) => (
                        <div key={index} className="text-center">
                          <div
                            className="w-full h-20 rounded-lg border-2 border-gray-200 mb-2"
                            style={{ backgroundColor: color }}
                          ></div>
                          <p className="text-xs text-gray-600">{color}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link to="/dashboard/katalog" className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
                        Lihat Produk Rekomendasi
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedHistory(null)}
                      className="flex-1 border-purple-300 text-purple-600"
                    >
                      Tutup
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

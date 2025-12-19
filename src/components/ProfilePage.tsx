import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.tsx';
import { Button } from './ui/button.tsx';
import { Badge } from './ui/badge.tsx';
import { Input } from './ui/input.tsx';
import { Label } from './ui/label.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs.tsx';
import DashboardNavbar from './DashboardNavbar';
import { User, Phone, Mail, History, Eye, Trash2, Calendar, Edit2, Save, BarChart, Palette } from 'lucide-react';
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
import { useAuth } from '../contexts/AuthContext';
import api, { getCsrfCookie } from '../services/api';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface AnalysisHistory {
  id: number;
  result_palette: string;
  colors?: string[];
  undertone?: string;
  image_url?: string;
  created_at: string;
}

interface ProfileData {
  name: string;
  phone: string;
  email: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    phone: '',
    email: ''
  });
  const [historyList, setHistoryList] = useState<AnalysisHistory[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<AnalysisHistory | null>(null);

  // Fetch profile dari backend
  useEffect(() => {
    fetchProfile();
    fetchHistory();
  }, []);

  const fetchProfile = async () => {
    try {
      await getCsrfCookie();
      const response = await api.get('/profile');
      console.log('Profile from backend:', response.data);
      
      const profile = response.data.data || response.data;
      setProfileData(profile);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast.error('Gagal memuat profil');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      await getCsrfCookie();
      const response = await api.get('/history');
      const historyData = Array.isArray(response.data) ? response.data : response.data.data || [];
      console.log('History data:', historyData);
      setHistoryList(historyData);
    } catch (error: any) {
      console.error('Error fetching history:', error);
    }
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        await getCsrfCookie();
        await api.put('/profile', {
          name: profileData.name,
          phone: profileData.phone
        });
        toast.success('Profil berhasil diperbarui');
        fetchProfile(); 
      } catch (error: any) {
        console.error('Error updating profile:', error);
        toast.error(error.response?.data?.message || 'Gagal memperbarui profil');
        return; 
      }
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData({ ...profileData, [field]: value });
  };

  const handleDelete = async (id: number) => {
    try {
      await getCsrfCookie();
      await api.delete(`/history/${id}`);
      setHistoryList(historyList.filter(item => item.id !== id));
      toast.success('Riwayat berhasil dihapus');
      fetchProfile(); 
    } catch (error: any) {
      console.error('Error deleting history:', error);
      toast.error('Gagal menghapus riwayat');
    }
  };

  const handleViewDetail = (item: AnalysisHistory) => {
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
          <div className="mb-8">
            <h1 className="text-4xl mb-2">Profil Saya</h1>
            <p className="text-xl text-gray-600">
              Kelola informasi profil dan lihat riwayat analisis Anda
            </p>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Informasi Profil
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="w-4 h-4" />
                Riwayat Analisis
              </TabsTrigger>
            </TabsList>

            {/* Tab Profil */}
            <TabsContent value="profile">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                  <span className="ml-3 text-gray-600">Memuat profil...</span>
                </div>
              ) : (
                <Card className="border-2 border-purple-100">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Kelola informasi akun Anda</CardTitle>
                      </div>
                      <Button
                        onClick={handleEditToggle}
                        variant={isEditing ? "default" : "outline"}
                        className={isEditing 
                          ? "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white" 
                          : "border-purple-300 text-purple-600 hover:bg-purple-50"
                        }
                      >
                        {isEditing ? (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Simpan
                          </>
                        ) : (
                          <>
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit Profil
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
                      <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-12 h-12 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl mb-1">{profileData.name || 'User'}</h3>
                        <p className="text-gray-600">{profileData.email}</p>
                      </div>
                    </div>

                    {/* Form Section */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Nama Lengkap
                        </Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          disabled={!isEditing}
                          className="border-purple-200 focus:border-purple-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Nomor Telepon
                        </Label>
                        <Input
                          id="phone"
                          type='tel'
                          value={profileData.phone}
                          onChange={(e) => 
                            handleInputChange(
                              'phone', 
                              e.target.value.replace(/\D/g,''))}
                          minLength={10}
                          maxLength={13}
                          disabled={!isEditing}
                          className="border-purple-200 focus:border-purple-400"
                        />
                      </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        disabled={true}
                        className="border-purple-200 bg-gray-50"
                      />
                    </div>
                  </div>

                  {/* Stats Section */}
                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      Statistik Analisis
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">

                      <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <BarChart className="w-4 h-4" />
                          <span className="text-sm">Total Analisis</span>
                        </div>
                        <p className="text-xl font-semibold text-gray-800">
                          {historyList.length}
                          </p>
                      </div>

                      <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <Palette className="w-4 h-4" />
                          <span className="text-sm">Kategori Terakhir</span>
                        </div>
                        <p className="text-xl font-semibold text-gray-800 capitalize">
                          {historyList.length > 0 ? historyList[0].result_palette : '-'}
                          </p>
                      </div>

                      <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">Analisis Terakhir</span>
                        </div>
                        <p className="text-xl font-semibold text-gray-800 capitalize">
                          {historyList.length > 0 ? formatDate(historyList[0].created_at) : '-'}
                        </p>
                      </div>
                      
                    </div>
                  </div>
                </CardContent>
              </Card>
              )}
            </TabsContent>

            {/* Tab Riwayat Analisis */}
            <TabsContent value="history">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl mb-1">Riwayat Analisis Warna</h2>
                    <p className="text-gray-600">
                      Lihat kembali semua hasil analisis warna yang pernah Anda lakukan
                    </p>
                  </div>
                  <Link to="/dashboard/analisis">
                    <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
                      Analisis Baru
                    </Button>
                  </Link>
                </div>

                {historyList.length === 0 ? (
                  <Card className="border-2 border-purple-100">
                    <CardContent className="pt-16 pb-16 text-center">
                      <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl mb-2 text-gray-600">Belum Ada Riwayat</h3>
                      <p className="text-gray-500 mb-6">
                        Anda belum melakukan analisis warna. 
                        Mulai sekarang untuk mendapatkan rekomendasi palet warna personal!
                      </p>
                      <Link to="/dashboard/analisis">
                        <Button 
                        className="bg-gradient-to-r from-pink-500 to-purple-600 
                        hover:from-pink-600 hover:to-purple-700 text-white">
                          Mulai Analisis
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {historyList.map((item) => (
                      <Card key={item.id} className="border-2 border-purple-100 
                      hover:border-purple-300 hover:shadow-lg transition-all">
                        <CardHeader>
                          <div className="flex items-center gap-2 mb-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">{formatDate(item.created_at)}</span>
                          </div>
                          <CardTitle className="flex items-center justify-between">
                            <span>{item.result_palette}</span>
                            <Badge className="text-white bg-gradient-to-r from-pink-500 to-purple-600">
                              {item.undertone || 'Hasil'}
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Color Preview */}
                          <div className="grid grid-cols-4 gap-2">
                            {item.colors?.map((color, index) => (
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
                                <Button variant="outline" size="icon" 
                                className="border-red-300 text-red-600 hover:bg-red-50">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Hapus Riwayat?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tindakan ini tidak dapat dibatalkan. 
                                    Riwayat analisis ini akan dihapus permanen dari akun Anda.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(item.id)}
                                    className="bg-red-600 hover:bg-red-700"
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
              </div>
            </TabsContent>
          </Tabs>

          {/* Detail Modal */}
          {selectedHistory && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">
                        {selectedHistory.result_palette}
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
                <CardContent className="bg-white space-y-6">
                  <div>
                    <h3 className="text-lg mb-3">Palet Warna</h3>
                    <div className="grid grid-cols-4 gap-3">
                      {selectedHistory.colors?.map((color, index) => (
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
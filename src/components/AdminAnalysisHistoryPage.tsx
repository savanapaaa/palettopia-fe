import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.tsx';
import { Input } from './ui/input.tsx';
import { Badge } from './ui/badge.tsx';
import { Button } from './ui/button.tsx';
import AdminNavbar from './AdminNavbar';
import { History, Search, Download, Eye, Calendar, User, Loader2, Filter } from 'lucide-react';
import api, { getCsrfCookie, getImageUrl } from '../services/api';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface Analysis {
  id: number;
  user_id: number;
  result_palette: string;
  colors: string[];
  image_url?: string;
  notes?: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export default function AdminAnalysisHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [totalAnalyses, setTotalAnalyses] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPalette, setFilterPalette] = useState('all');
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);

  useEffect(() => {
    fetchAnalyses();
  }, [searchQuery, filterPalette]);

  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      await getCsrfCookie();
      
      const params = new URLSearchParams();
      params.append('per_page', '1000'); // Tampilkan semua data
      if (filterPalette !== 'all') {
        params.append('palette', filterPalette);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      const url = `/admin/analyses${params.toString() ? '?' + params.toString() : ''}`;
      const response = await api.get(url);
      console.log('Analyses from backend:', response.data);
      
      const analysesData = response.data.data || response.data;
      if (analysesData.data) {
        setAnalyses(analysesData.data);
        setTotalAnalyses(analysesData.total);
      } else if (Array.isArray(analysesData)) {
        setAnalyses(analysesData);
        setTotalAnalyses(analysesData.length);
      }
    } catch (error: any) {
      console.error('Error fetching analyses:', error);
      toast.error('Gagal memuat riwayat analisis');
    } finally {
      setLoading(false);
    }
  };

  const paletteOptions = [
    { value: 'all', label: 'Semua Palette' },
    { value: 'winter clear', label: 'Winter Clear' },
    { value: 'summer cool', label: 'Summer Cool' },
    { value: 'spring bright', label: 'Spring Bright' },
    { value: 'autumn warm', label: 'Autumn Warm' }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleExport = () => {
    const csvContent = 'ID,Nama,Email,Palette,Tanggal\n' +
      analyses.map(item => 
        `${item.id},${item.user.name},${item.user.email},${item.result_palette},${formatDate(item.created_at)}`
      ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `riwayat-analisis-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Data berhasil di-export');
  };

  return (
    <div className="min-h-screen">
      <AdminNavbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl mb-2">Riwayat Analisis Pengguna</h1>
              <p className="text-xl text-gray-600">
                Pantau semua tes analisis warna yang dilakukan oleh pengguna
              </p>
            </div>
            <Button
              onClick={handleExport}
              variant="outline"
              className="border-purple-300 text-purple-600 hover:bg-purple-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Card className="border-2 border-purple-100">
              <CardContent className="pt-6">
                <p className="text-2xl mb-1">{totalAnalyses}</p>
                <p className="text-sm text-gray-600">Total Analisis</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-purple-100">
              <CardContent className="pt-6">
                <p className="text-2xl mb-1">{analyses.length}</p>
                <p className="text-sm text-gray-600">Ditampilkan</p>
              </CardContent>
            </Card>
          </div>

          {/* Search & Filter */}
          <Card className="border-2 border-purple-100 mb-6">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Cari berdasarkan nama atau email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-purple-200 focus:border-purple-400"
                  />
                </div>
                <div className="relative">
                  <Filter className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                  <Select value={filterPalette} onValueChange={setFilterPalette}>
                    <SelectTrigger className="pl-10 border-purple-200 bg-white">
                      <SelectValue placeholder="Filter palette" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {paletteOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* History Table */}
          <Card className="border-2 border-purple-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Daftar Riwayat Analisis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                  <span className="ml-3 text-gray-600">Memuat data...</span>
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nama Pengguna</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Hasil Palette</TableHead>
                        {/* <TableHead>Gambar</TableHead> */}
                        <TableHead>Tanggal</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analyses.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono text-sm text-gray-500">
                            #{item.id}
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-semibold">
                                  {item.user.name.charAt(0)}
                                </span>
                              </div>
                              {item.user.name}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {item.user.email}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 capitalize">
                              {item.result_palette}
                            </Badge>
                          </TableCell>
                          {/* <TableCell>
                            {item.image_url ? (
                              <img 
                                src={getImageUrl(item.image_url)} 
                                alt="Analysis" 
                                className="w-12 h-12 object-cover rounded"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                <History className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </TableCell> */}
                          <TableCell>
                            <div className="flex items-center gap-1 text-gray-600 text-sm">
                              <Calendar className="w-4 h-4" />
                              {formatDate(item.created_at)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedAnalysis(item)}
                              className="border-purple-300 text-purple-600 hover:bg-purple-50"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Detail
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {analyses.length === 0 && (
                    <div className="text-center py-12">
                      <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">Tidak ada riwayat yang ditemukan</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedAnalysis && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Detail Analisis</CardTitle>
                  <p className="text-gray-600 mt-2">{selectedAnalysis.userName}</p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedAnalysis(null)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* User Info */}
              <div className="space-y-3 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Nama Pengguna</p>
                    <p className="font-medium">{selectedAnalysis.user.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Waktu Analisis</p>
                    <p className="font-medium">{formatDate(selectedAnalysis.created_at)}</p>
                  </div>
                </div>
              </div>

              {/* Image
              {selectedAnalysis.image_url && (
                <div>
                  <h3 className="text-lg mb-3">Foto Analisis</h3>
                  <img 
                    src={getImageUrl(selectedAnalysis.image_url)} 
                    alt="Analysis" 
                    className="w-full rounded-lg"
                  />
                </div>
              )} */}

              {/* Color Palette */}
              <div>
                <h3 className="text-lg mb-3 capitalize">Hasil Palette: {selectedAnalysis.result_palette}</h3>
                <div className="grid grid-cols-4 gap-3">
                  {selectedAnalysis.colors.map((color, index) => (
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

              {/* Notes */}
              {selectedAnalysis.notes && (
                <div>
                  <h3 className="text-lg mb-3">Catatan</h3>
                  <p className="text-gray-600 text-sm bg-gray-50 p-4 rounded-lg">
                    {selectedAnalysis.notes}
                  </p>
                </div>
              )}

              <Button
                variant="outline"
                onClick={() => setSelectedAnalysis(null)}
                className="w-full border-purple-300 text-purple-600"
              >
                Tutup
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

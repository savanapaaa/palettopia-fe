import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button.tsx';
import AdminNavbar from './AdminNavbar';
import { Package, History, Users, TrendingUp, ArrowRight, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import api, { getCsrfCookie } from '../services/api';
import { toast } from 'sonner';

interface DashboardStats {
  total_users: number;
  total_admins: number;
  total_products: number;
  total_analyses: number;
  products_by_palette: Record<string, number>;
  analyses_by_palette: Record<string, number>;
  recent_analyses: Array<{
    id: number;
    user: {
      id: number;
      name: string;
      email: string;
    };
    result_palette: string;
    created_at: string;
  }>;
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      await getCsrfCookie();
      const response = await api.get('/admin/statistics');
      console.log('📊 Dashboard statistics:', response.data);
      const data = response.data.data || response.data;
      setStats(data);
    } catch (error: any) {
      console.error('❌ Error fetching statistics:', error);
      toast.error('Gagal memuat statistik dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    return `${diffDays} hari yang lalu`;
  };

  const statsCards = stats ? [
    {
      title: 'Total Produk',
      value: stats.total_products.toString(),
      icon: Package,
      color: 'from-blue-500 to-cyan-500',
      change: 'Produk terdaftar'
    },
    {
      title: 'Total Pengguna',
      value: stats.total_users.toString(),
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      change: `${stats.total_admins} admin`
    },
    {
      title: 'Total Analisis',
      value: stats.total_analyses.toString(),
      icon: History,
      color: 'from-orange-500 to-red-500',
      change: 'Analisis dilakukan'
    },
    {
      title: 'Analisis Terbaru',
      value: stats.recent_analyses.length.toString(),
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      change: 'Aktivitas terbaru'
    }
  ] : [];

  const quickActions = [
    {
      title: 'Kelola Produk',
      description: 'Tambah, ubah, atau hapus produk fashion',
      link: '/admin/products',
      icon: Package,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Riwayat Analisis',
      description: 'Lihat semua riwayat analisis pengguna',
      link: '/admin/analysis-history',
      icon: History,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="min-h-screen">
      <AdminNavbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl mb-2">Dashboard Admin</h1>
            <p className="text-xl text-gray-600">
              Kelola produk dan pantau aktivitas pengguna Palettopia
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <span className="ml-3 text-gray-600">Memuat statistik...</span>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="border-2 border-purple-100 hover:shadow-lg transition-all">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-3xl mb-1">{stat.value}</h3>
                    <p className="text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-sm text-green-600">{stat.change}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-2xl mb-4">Akses Cepat</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Card key={index} className="border-2 border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <CardTitle>{action.title}</CardTitle>
                          <CardDescription>{action.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Link to={action.link}>
                        <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
                          Buka Halaman
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <Card className="border-2 border-purple-100">
            <CardHeader>
              <CardTitle>Aktivitas Terbaru</CardTitle>
              <CardDescription>Pantau aktivitas pengguna terbaru di platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats && stats.recent_analyses.length > 0 ? (
                  stats.recent_analyses.map((analysis) => (
                    <div key={analysis.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">{analysis.user.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">{analysis.user.name}</span> melakukan analisis warna
                            <span className="ml-1 text-purple-600 capitalize">({analysis.result_palette})</span>
                          </p>
                          <p className="text-xs text-gray-500">{formatDate(analysis.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">Belum ada aktivitas terbaru</p>
                )}
              </div>
            </CardContent>
          </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.tsx';
import { Button } from './ui/button.tsx';
import { Input } from './ui/input.tsx';
import { Badge } from './ui/badge.tsx';
import AdminNavbar from './AdminNavbar';
import { Package, Plus, Edit2, Trash2, Search, Loader2, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select.tsx';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table.tsx';
import { toast } from "sonner";
import api, { getCsrfCookie, getImageUrl } from '../services/api';

interface Product {
  id: number;
  name: string;
  category: string;
  price: string | number;
  stock: number;
  brand?: string;
  image_url: string | null;
  palette_category: string;
  palettes?: { palette_name: string }[];
  description?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  created_at?: string;
  updated_at?: string;
}

interface Stats {
  total_products: number;
  total_stock: number;
  total_categories: number;
  total_palettes: number;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPalette, setSelectedPalette] = useState<string>('all');
  const [stats, setStats] = useState<Stats>({
    total_products: 0,
    total_stock: 0,
    total_categories: 0,
    total_palettes: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, [selectedPalette, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      await getCsrfCookie();
      
      const params = new URLSearchParams();
      if (selectedPalette !== 'all') {
        params.append('palette_category', selectedPalette);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      const url = `/admin/products${params.toString() ? '?' + params.toString() : ''}`;
      const response = await api.get(url);
      console.log('Products from backend:', response.data);

      const responseData = response.data;
      
      //produk
      if (responseData.data) {
        const productsArray = responseData.data.data || responseData.data;
        setProducts(Array.isArray(productsArray) ? productsArray : []);
      }
      
      // stats
      if (responseData.stats) {
        setStats(responseData.stats);
      }
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast.error('Gagal memuat produk');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await getCsrfCookie();
      await api.delete(`/admin/products/${id}`);
      toast.success('Produk berhasil dihapus');
      fetchProducts();
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error('Gagal menghapus produk');
    }
  };

  const paletteColors = [
    { value: 'all', label: 'Semua Palette' },
    { value: 'winter clear', label: 'Winter Clear' },
    { value: 'summer cool', label: 'Summer Cool' },
    { value: 'spring bright', label: 'Spring Bright' },
    { value: 'autumn warm', label: 'Autumn Warm' }
  ];

  return (
    <div className="min-h-screen">
      <AdminNavbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl mb-2">Kelola Produk</h1>
              <p className="text-xl text-gray-600">
                Tambah, ubah, atau hapus produk byneera.id
              </p>
            </div>
            <Link to="/admin/products/add">
              <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Produk Baru
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <Card className="border-2 border-purple-100">
              <CardContent className="pt-6">
                <p className="text-2xl font-bold mb-1">{stats.total_products}</p>
                <p className="text-sm text-gray-600">Total Produk</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-purple-100">
              <CardContent className="pt-6">
                <p className="text-2xl font-bold mb-1">{stats.total_stock}</p>
                <p className="text-sm text-gray-600">Total Stok</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-purple-100">
              <CardContent className="pt-6">
                <p className="text-2xl font-bold mb-1">{stats.total_categories}</p>
                <p className="text-sm text-gray-600">Kategori</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-purple-100">
              <CardContent className="pt-6">
                <p className="text-2xl font-bold mb-1">{stats.total_palettes}</p>
                <p className="text-sm text-gray-600">Palet Warna</p>
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
                    placeholder="Cari produk berdasarkan nama atau kategori..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-purple-200 focus:border-purple-400"
                  />
                </div>
                <div className="relative">
                  <Filter className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                  <Select value={selectedPalette} onValueChange={setSelectedPalette}>
                    <SelectTrigger className="pl-10 border-purple-200">
                      <SelectValue placeholder="Filter Palette" />
                    </SelectTrigger>
                    <SelectContent>
                      {paletteColors.map((palette) => (
                        <SelectItem key={palette.value} value={palette.value}>
                          {palette.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Table */}
          <Card className="border-2 border-purple-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Daftar Produk
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                  <span className="ml-3 text-gray-600">Memuat produk...</span>
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Gambar</TableHead>
                        <TableHead>Nama Produk</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Harga</TableHead>
                        <TableHead>Palet warna</TableHead>
                        <TableHead>Stok</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            {product.image_url ? (
                              <img
                                src={getImageUrl(product.image_url)}
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded border-2 border-gray-200"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                                <Package className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            {product.name}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{product.category || '-'}</span>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              Rp {typeof product.price === 'string' 
                                ? parseFloat(product.price).toLocaleString('id-ID')
                                : product.price?.toLocaleString('id-ID') || '0'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {product.palettes && product.palettes.length > 0 ? (
                                product.palettes.map((p, idx) => (
                                  <Badge 
                                    key={idx} 
                                    className="bg-gradient-to-r from-pink-500 to-purple-600 capitalize text-xs"
                                  >
                                    {p.palette_name}
                                  </Badge>
                                ))
                              ) : (
                                <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 capitalize text-xs">
                                  {product.palette_category}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">{product.stock || 0}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Link to={`/admin/products/edit/${product.id}`}>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="border-purple-300 text-purple-600 hover:bg-purple-50"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                              </Link>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="border-red-300 text-red-600 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-white border border-gray-200 shadow-lg">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Hapus Produk?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tindakan ini tidak dapat dibatalkan. Produk akan dihapus permanen dari database.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(product.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Hapus
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {products.length === 0 && (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">Tidak ada produk yang ditemukan</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

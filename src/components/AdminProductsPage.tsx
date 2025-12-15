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
  image_url: string | null;
  palette_category: string;
  description: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

interface ProductsResponse {
  current_page: number;
  data: Product[];
  per_page: number;
  total: number;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPalette, setSelectedPalette] = useState<string>('all');
  const [totalProducts, setTotalProducts] = useState(0);

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
      console.log('📦 Products from backend:', response.data);
      
      const productsData = response.data.data || response.data;
      if (productsData.data) {
        setProducts(productsData.data);
        setTotalProducts(productsData.total);
      } else if (Array.isArray(productsData)) {
        setProducts(productsData);
        setTotalProducts(productsData.length);
      }
    } catch (error: any) {
      console.error('❌ Error fetching products:', error);
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
      fetchProducts(); // Refresh list
    } catch (error: any) {
      console.error('❌ Error deleting product:', error);
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
                Tambah, ubah, atau hapus produk fashion byneera.id
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
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Card className="border-2 border-purple-100">
              <CardContent className="pt-6">
                <p className="text-2xl mb-1">{totalProducts}</p>
                <p className="text-sm text-gray-600">Total Produk</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-purple-100">
              <CardContent className="pt-6">
                <p className="text-2xl mb-1">4</p>
                <p className="text-sm text-gray-600">Kategori Palette</p>
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
                    placeholder="Cari produk berdasarkan nama..."
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
                Daftar Produk ({products.length})
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
                        <TableHead>Palette</TableHead>
                        <TableHead>Deskripsi</TableHead>
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
                          <TableCell className="font-medium max-w-xs">
                            <div className="line-clamp-2">{product.name}</div>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 capitalize">
                              {product.palette_category}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-md">
                            <div className="line-clamp-2 text-sm text-gray-600">
                              {product.description || '-'}
                            </div>
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

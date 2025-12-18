import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card.tsx';
import { Button } from './ui/button.tsx';
import { Badge } from './ui/badge.tsx';
import DashboardNavbar from './DashboardNavbar';
import { ShoppingBag, ExternalLink, Filter, Loader2} from 'lucide-react';
import { ImageWithFallback } from './Fallback/ImageGirlFallback.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select.tsx';
import api, { getImageUrl } from '../services/api';
import { toast } from 'sonner';

interface Product {
  id: number;
  name: string;
  price: number;
  palette_category?: string;
  description?: string;
  image_url?: string;
  link?: string;
}

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPalette, setSelectedPalette] = useState<string>('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      console.log('Products from backend:', response.data);

      const productsData = Array.isArray(response.data) ? response.data : response.data.data || [];
      setProducts(productsData);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast.error('Gagal memuat katalog produk');

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    if (selectedPalette === 'all') return true;
    return product.palette_category?.toLowerCase() === selectedPalette.toLowerCase();
  });

  const palettes = ['all', 'winter clear', 'summer cool', 'spring bright', 'autumn warm'];

  const formatRupiah = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);

  return (
    <div className="min-h-screen">
      <DashboardNavbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl mb-2 font-bold">Katalog Produk byneera.id</h1>
            <p className="text-md md:text-xl text-gray-600">
              Jelajahi koleksi fashion lengkap dari byneera.id
            </p>
          </div>

          {/* Filters */}
          <Card className="border-2 border-purple-100 mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4 items-center">

                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">Filter by Palette:</span>
                </div>

                <Select value={selectedPalette} onValueChange={setSelectedPalette}>
                  <SelectTrigger className="w-48 md:w-64">
                    <SelectValue placeholder="Pilih Palette" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50 shadow-lg border">
                    <SelectItem value="all">Semua Palette</SelectItem>
                    {palettes.filter(p => p !== 'all').map(palette => (
                      <SelectItem key={palette} value={palette} className="capitalize">
                        {palette}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="ml-auto text-gray-600 text-sm md:text-base">
                  {filteredProducts.length} produk ditemukan
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Products Grid RESPONSIVE */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <span className="ml-3 text-gray-600">Memuat produk...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <Card className="border-2 border-purple-100">
              <CardContent className="pt-16 pb-16 text-center">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl mb-2 text-gray-600">Tidak Ada Produk</h3>
                <p className="text-gray-500">
                  {products.length === 0 
                    ? 'Belum ada produk di katalog. Admin belum menambahkan produk.'
                    : 'Tidak ada produk yang sesuai dengan filter yang dipilih'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} 
                className="border-2 border-purple-100 hover:border-purple-300 
                hover:shadow-lg transition-all overflow-hidden group">
                  <div className="relative h-52 sm:h-64 md:h-72 overflow-hidden">
                    <ImageWithFallback
                      src={getImageUrl(product.image_url) || 'https://via.placeholder.com/400'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 
                      transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      {product.palette_category && (
                        <Badge className="bg-white text-purple-600 capitalize">
                          {product.palette_category}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardContent className="pt-4 flex flex-col justify-between">
                    <h3 className="text-base sm:text-lg mb-2 font-semibold">{product.name}</h3>
                    {product.description && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                    )}
                    <p className="text-purple-600 mb-4 font-bold">
                      {formatRupiah(product.price)}
                    </p>

                        <Button 
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 
                        hover:from-pink-600 hover:to-purple-700 text-white"
                        onClick={()=>
                          window.open('https://wa.me/6282229638559', '_blank')
                        }
                        >
                            Lihat Detail <ExternalLink className="ml-2 w-4 h-4" />
                        </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Info Banner */}
          <Card className="mt-8 border-2 border-purple-300 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
            <CardContent className="pt-6 text-center">
              <ShoppingBag className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-2xl mb-2">Temukan Produk yang Cocok untuk Anda</h3>
              <p className="text-lg opacity-90 mb-4">
                Lakukan analisis warna untuk mendapatkan rekomendasi produk yang sesuai dengan palet warna personal Anda
              </p>
              <Button
                onClick={() => window.location.href = '/dashboard/analisis'}
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100"
              >
                Mulai Analisis Sekarang
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}

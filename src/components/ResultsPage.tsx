import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.tsx';
import { Button } from './ui/button.tsx';
import { Badge } from './ui/badge.tsx';
import DashboardNavbar from './DashboardNavbar';
import { Sparkles, ShoppingBag, CheckCircle, ArrowRight, ExternalLink, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import api, { getCsrfCookie, getImageUrl } from '../services/api';

export default function ResultsPage() {
  const location = useLocation();
  
  const uploadedImage = location.state?.image;
  const palette = location.state?.palette || 'Tidak Terdeteksi';
  const explanation = location.state?.explanation || 'Tidak ada penjelasan';
  const colors = location.state?.colors || [];
  const undertone = location.state?.undertone || '';
  const recommendations = location.state?.recommendations || [];

  const [showProducts, setShowProducts] = useState(false);
  const [saved, setSaved] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  console.log('Data diterima di ResultsPage:', {
    palette,
    explanation,
    colors,
    undertone,
    recommendations
  });

  useEffect(() => {
    if (showProducts && palette && palette !== 'Tidak Terdeteksi') {
      fetchProducts();
    }
  }, [showProducts, palette]);

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      await getCsrfCookie();
      
      const paletteCategory = palette.toLowerCase();
      const response = await api.get(`/products?palette_category=${encodeURIComponent(paletteCategory)}`);
      
      console.log('Products from backend:', response.data);
      const productsData = Array.isArray(response.data) ? response.data : response.data.data || [];
      setProducts(productsData);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast.error('Gagal memuat produk rekomendasi');
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleShowProducts = () => {
    setShowProducts(true);
    if (!saved) {
      setSaved(true);
      toast.success('Hasil analisis telah disimpan ke riwayat Anda!', {
        icon: <CheckCircle className="w-5 h-5" />
      });
    }
  };

  return (
    <div className="min-h-screen">
      <DashboardNavbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Success Message */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 
          rounded-2xl p-6 text-white mb-8 flex items-center gap-4">
            <CheckCircle className="w-12 h-12 flex-shrink-0" />
            <div>
              <h2 className="text-2xl mb-1">Analisis Selesai!</h2>
              <p className="opacity-90">Kami telah menemukan palet warna yang sempurna untuk Anda</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Uploaded Photo */}
            {uploadedImage && (
              <Card className="border-2 border-purple-100">
                <CardHeader>
                  <CardTitle>Foto Anda</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="w-full h-80 object-cover rounded-lg"
                  />
                </CardContent>
              </Card>
            )}

            {/* Analysis Result */}
            <Card className="border-2 border-purple-100 bg-gradient-to-br from-pink-50 to-purple-50">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  <CardTitle>Hasil Analisis</CardTitle>
                </div>
                <CardDescription className="text-lg">
                  Kategori Personal Color Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Badge className="text-lg px-4 py-2 text-white bg-gradient-to-r from-pink-500 to-purple-600">
                    {palette}
                  </Badge>
                </div>
                {undertone && (
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Undertone:</span> {undertone}
                  </p>
                )}
                <div className="text-gray-700 whitespace-pre-wrap">{explanation}</div>
              </CardContent>
            </Card>
          </div>

          {/* Color Palette*/}
          {colors && colors.length > 0 && (
            <Card className="border-2 border-purple-100 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">Palet Warna Anda</CardTitle>
                <CardDescription>
                  Warna-warna ini akan membuat Anda terlihat lebih menawan
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                  {colors.map((color: string, index: number) => (
                    <div key={index} className="text-center">
                      <div
                        className="w-full h-24 rounded-lg shadow-md mb-2 border-2 border-gray-200"
                        style={{ backgroundColor: color }}
                      ></div>
                      <p className="text-xs text-gray-600">{color}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Product Recommendations*/}
          {recommendations && recommendations.length > 0 && (
            <Card className="border-2 border-purple-100 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">Rekomendasi Produk untuk Anda</CardTitle>
                <CardDescription>
                  Produk yang cocok dengan palet warna Anda
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map((product: any, index: number) => (
                    <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative">
                      <img
                        src={getImageUrl(product.image_url || product.image) || 'https://via.placeholder.com/400'}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                        }}
                      />

                      <Badge className="absolute top-3 right-3 bg-white text-purple-600">
                          {product.palette_category}
                        </Badge>
                      </div>
                      <CardContent className="pt-4">
                        <h3 className="mb-2">{product.name}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                        <p className="text-purple-600 mb-4 font-bold">
                              Rp {typeof product.price === 'string' 
                                ? parseFloat(product.price).toLocaleString('id-ID')
                                : product.price?.toLocaleString('id-ID') || '0'}
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
              </CardContent>
            </Card>
          )}

          {/* Product Recommendation */}
          {!showProducts && (
            <Card className="border-2 border-purple-300 bg-gradient-to-r from-pink-500 
            to-purple-600 text-white">
              <CardContent className="pt-6 text-center">
                <ShoppingBag className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-2xl mb-2">Temukan Produk yang Cocok!</h3>
                <p className="text-lg mb-6 opacity-90">
                  Lihat rekomendasi produk fashion dari byneera.id yang sesuai dengan palet warna Anda
                </p>
                <Button
                  onClick={handleShowProducts}
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100"
                >
                  Lihat Rekomendasi Produk <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Product Recommendations */}
          {showProducts && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl mb-2">Rekomendasi Produk untuk Anda</h2>
                  <p className="text-xl text-gray-600">Koleksi byneera.id yang cocok 
                    dengan palet warna Anda</p>
                </div>
                <Link to="/dashboard/katalog">
                  <Button variant="outline" className="border-purple-300 text-purple-600 
                  hover:bg-purple-50">
                    Lihat Semua Produk
                  </Button>
                </Link>
              </div>

              {/* Jika produk kosong */}
              {loadingProducts ? (
                <div className="col-span-full flex justify-center items-center py-12">
                  <Loader2 className="animate-spin h-8 w-8 text-purple-600" />
                  <span className="ml-3 text-gray-600">Memuat produk...</span>
                </div>
              ) : products.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Belum ada produk untuk kategori ini.</p>
                </div>
              ) : (

                // Menampilkan produk lainnya
                <div className="grid md:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Card key={product.id} 
                    className="border-2 border-purple-100 
                    hover:border-purple-300 hover:shadow-lg transition-all overflow-hidden">
                      <div className="relative h-64">
                        <img
                          src={getImageUrl(product.image_url)}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-3 right-3 bg-white text-purple-600">
                          {product.palette_category}
                        </Badge>
                      </div>
                      <CardContent className="pt-4">
                        <h3 className="mb-2">{product.name}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                        <p className="text-purple-600 mb-4 font-bold">
                              Rp {typeof product.price === 'string' 
                                ? parseFloat(product.price).toLocaleString('id-ID')
                                : product.price?.toLocaleString('id-ID') || '0'}
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
            </div>
          )}

          {/* Saved Notification */}
          {saved && (
            <Card className="border-2 border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 text-green-700">
                  <CheckCircle className="w-6 h-6" />
                  <div>
                    <p>Hasil analisis ini telah tersimpan di <Link to="/dashboard/riwayat" 
                    className="underline hover:text-green-900">Riwayat Analisis</Link> Anda</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:gap-2">
            <Link to="/dashboard/analisis" className="flex-1">
              <Button
                variant="outline"
                className="w-full border-purple-300 text-purple-600 hover:bg-purple-50 text-sm py-2"
              >
                Analisis Baru
              </Button>
            </Link>

            <Link to="/dashboard/riwayat" className="flex-1">
              <Button
                variant="outline"
                className="w-full border-purple-300 text-purple-600 hover:bg-purple-50 text-sm py-2"
              >
                Lihat Riwayat
              </Button>
            </Link>

            <Link to="/dashboard" className="flex-1">
              <Button
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 
                hover:from-pink-600 hover:to-purple-700 text-white text-sm py-2"
              >
                Kembali ke Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

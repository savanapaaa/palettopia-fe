import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.tsx';
import { Button } from './ui/button.tsx';
import { Badge } from './ui/badge.tsx';
import DashboardNavbar from './DashboardNavbar';
import { Sparkles, ShoppingBag, CheckCircle, ArrowRight, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from './Fallback/ImageGirlFallback.tsx';
import { getImageUrl } from '../services/api';

// Mock data produk
const mockProducts = [
  {
    id: 1,
    name: 'Dress Terracotta Elegant',
    price: 'Rp 450.000',
    image: 'https://images.unsplash.com/photo-1745695894760-600be9c8c307?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGZhc2hpb24lMjBkcmVzc3xlbnwxfHx8fDE3NjIyMTY3MTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    color: 'Terracotta'
  },
  {
    id: 2,
    name: 'Blouse Mustard Premium',
    price: 'Rp 350.000',
    image: 'https://images.unsplash.com/photo-1592867874873-85480a35d2aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjBjb2xsZWN0aW9ufGVufDF8fHx8MTc2MjMyNTU0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    color: 'Mustard'
  },
  {
    id: 3,
    name: 'Hijab Olive Green',
    price: 'Rp 150.000',
    image: 'https://images.unsplash.com/photo-1569388330292-79cc1ec67270?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzYyMjU1NzMxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    color: 'Olive Green'
  },
  {
    id: 4,
    name: 'Tunik Rust Casual',
    price: 'Rp 380.000',
    image: 'https://images.unsplash.com/photo-1592867874873-85480a35d2aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjBjb2xsZWN0aW9ufGVufDF8fHx8MTc2MjMyNTU0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    color: 'Rust'
  },
  {
    id: 5,
    name: 'Cardigan Caramel',
    price: 'Rp 420.000',
    image: 'https://images.unsplash.com/photo-1745695894760-600be9c8c307?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGZhc2hpb24lMjBkcmVzc3xlbnwxfHx8fDE3NjIyMTY3MTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    color: 'Caramel'
  },
  {
    id: 6,
    name: 'Set Burgundy Formal',
    price: 'Rp 650.000',
    image: 'https://images.unsplash.com/photo-1569388330292-79cc1ec67270?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzYyMjU1NzMxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    color: 'Burgundy'
  }
];

export default function ResultsPage() {
  const location = useLocation();
  
  // 🔥 Ambil data dari backend (dari navigate state)
  const uploadedImage = location.state?.image;
  const palette = location.state?.palette || 'Tidak Terdeteksi';
  const explanation = location.state?.explanation || 'Tidak ada penjelasan';
  const colors = location.state?.colors || [];
  const undertone = location.state?.undertone || '';
  const recommendations = location.state?.recommendations || [];
  
  const [showProducts, setShowProducts] = useState(false);
  const [saved, setSaved] = useState(false);

  // Debug: lihat data yang diterima
  console.log('📥 Data diterima di ResultsPage:', {
    palette,
    explanation,
    colors,
    undertone,
    recommendations
  });

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
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white mb-8 flex items-center gap-4">
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
                  Kategori Personal Colour Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600">
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

          {/* Color Palette from Backend */}
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

          {/* Product Recommendations from Backend */}
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
                      <img
                        src={getImageUrl(product.image_url || product.image) || 'https://via.placeholder.com/400'}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                        }}
                      />
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-lg mb-2">{product.name}</h4>
                        <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-purple-600 font-bold">
                            Rp {product.price?.toLocaleString('id-ID') || 'N/A'}
                          </span>
                          {product.link && (
                            <a
                              href={product.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:text-purple-700"
                            >
                              <ExternalLink className="w-5 h-5" />
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Product Recommendation CTA */}
          {!showProducts && (
            <Card className="border-2 border-purple-300 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
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
                  <p className="text-xl text-gray-600">Koleksi byneera.id yang cocok dengan palet warna Anda</p>
                </div>
                <Link to="/dashboard/katalog">
                  <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50">
                    Lihat Semua Produk
                  </Button>
                </Link>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {mockProducts.map((product) => (
                  <Card key={product.id} className="border-2 border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all overflow-hidden">
                    <div className="relative h-64">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-3 right-3 bg-white text-purple-600">
                        {product.color}
                      </Badge>
                    </div>
                    <CardContent className="pt-4">
                      <h3 className="mb-2">{product.name}</h3>
                      <p className="text-purple-600 mb-4">{product.price}</p>
                      <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
                        Lihat Detail <ExternalLink className="ml-2 w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Saved Notification */}
              {saved && (
                <Card className="border-2 border-green-200 bg-green-50">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 text-green-700">
                      <CheckCircle className="w-6 h-6" />
                      <div>
                        <p>Hasil analisis ini telah tersimpan di <Link to="/dashboard/riwayat" className="underline hover:text-green-900">Riwayat Analisis</Link> Anda</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <Link to="/dashboard/analisis" className="flex-1">
              <Button variant="outline" className="w-full border-purple-300 text-purple-600 hover:bg-purple-50">
                Analisis Baru
              </Button>
            </Link>
            <Link to="/dashboard/riwayat" className="flex-1">
              <Button variant="outline" className="w-full border-purple-300 text-purple-600 hover:bg-purple-50">
                Lihat Riwayat
              </Button>
            </Link>
            <Link to="/dashboard" className="flex-1">
              <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
                Kembali ke Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

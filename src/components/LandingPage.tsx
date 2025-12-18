import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import Navbar from './Navbar';
import { Palette, Sparkles, ShoppingBag, Camera, ArrowRight, BookOpen, Sun, Snowflake, Leaf, Droplet } from 'lucide-react';
import { ImageWithFallback } from './Fallback/ImageGirlFallback';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Temukan{' '}
              <span className="bg-gradient-to-r from-pink-600 to-purple-600 
              bg-clip-text text-transparent">
                Warna Perfect
              </span>{' '}
              Untuk Kulitmu
            </h1>

            <p className="text-xl text-gray-600">
              Platform analisis personal colour palette yang membantu Anda 
              menemukan palet warna terbaik berdasarkan skintone, 
              langsung terhubung dengan koleksi fashion byneera.id
            </p>

            <div className="flex gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 
                hover:from-pink-600 hover:to-purple-700 text-white">
                  Mulai Sekarang <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/tentang-kami">
                <Button size="lg" variant="outline" className="border-purple-300 text-purple-600 
                hover:bg-purple-50">
                  Pelajari Lebih Lanjut
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-600 
            rounded-3xl blur-3xl opacity-20"></div>
            <ImageWithFallback
              src="https://example.com/banner.png"
              alt="Girl"
              className="relative rounded-3xl shadow-2xl w-full object-cover h-[500px]"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl mb-4">Kenapa Memilih Palettopia?</h2>
          <p className="text-xl text-gray-600">Solusi lengkap untuk menemukan warna 
            yang sempurna untukmu</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-2 border-purple-100 hover:border-purple-300 
          transition-all hover:shadow-lg">
            <CardContent className="pt-6">
              <div className="bg-gradient-to-br from-pink-100 to-purple-100 w-16 h-16 
              rounded-2xl flex items-center justify-center mb-4">
                <Camera className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl mb-3">Analisis Personal</h3>
              <p className="text-gray-600">
                Upload foto wajahmu dan biarkan teknologi kami menganalisis skintone 
                untuk memberikan rekomendasi palet warna yang akurat
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-100 hover:border-purple-300 
          transition-all hover:shadow-lg">
            <CardContent className="pt-6">
              <div className="bg-gradient-to-br from-pink-100 to-purple-100 w-16 h-16 
              rounded-2xl flex items-center justify-center mb-4">
                <Palette className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl mb-3">Palet Warna Custom</h3>
              <p className="text-gray-600">
                Dapatkan rekomendasi palet warna yang dipersonalisasi khusus untukmu, 
                meningkatkan penampilan dan kepercayaan diri
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-100 hover:border-purple-300 
          transition-all hover:shadow-lg">
            <CardContent className="pt-6">
              <div className="bg-gradient-to-br from-pink-100 to-purple-100 w-16 h-16 
              rounded-2xl flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl mb-3">Integrasi byneera.id</h3>
              <p className="text-gray-600">
                Langsung terhubung dengan koleksi fashion byneera.id. Temukan produk yang 
                sesuai dengan palet warnamu dengan mudah
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white/50 backdrop-blur-sm py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4">Cara Kerja Palettopia</h2>
            <p className="text-xl text-gray-600">Tiga langkah mudah untuk menemukan warna idealmu</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white w-16 
              h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl mb-2">Daftar & Login</h3>
              <p className="text-gray-600">Buat akun gratis dan masuk ke platform Palettopia</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white w-16 
              h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl mb-2">Upload Foto</h3>
              <p className="text-gray-600">Upload foto wajah untuk analisis skintone yang akurat</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white w-16 
              h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl mb-2">Dapatkan Hasil</h3>
              <p className="text-gray-600">Terima palet warna personal dan rekomendasi produk fashion</p>
            </div>
          </div>
        </div>
      </section>

      {/* Educational Articles Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-8 h-8 text-purple-600" />
            <h2 className="text-4xl">Edukasi Personal Colour</h2>
          </div>
          <p className="text-xl text-gray-600">Pelajari lebih dalam tentang personal 
            colour dan bagaimana menemukan warna terbaikmu</p>
        </div>

        {/* Main Featured Article */}
        <div className="mb-12">
          <Card className="border-2 border-purple-100 overflow-hidden hover:shadow-2xl transition-all">
            <div className="grid md:grid-cols-2 gap-0">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600"
                alt="Color Analysis"
                className="w-full h-full object-cover min-h-[300px]"
              />
              <CardContent className="p-8 flex flex-col justify-center">
                <div className="mb-4">
                  <span className="px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-600 
                  text-white text-sm rounded-full">
                    Artikel Utama
                  </span>
                </div>
                <h3 className="text-3xl mb-4">Apa Itu Personal Colour Analysis?</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Personal colour analysis adalah metode untuk menentukan palet warna yang paling sesuai dengan karakteristik alami seseorang, 
                  termasuk warna kulit, mata, dan rambut. Dengan mengetahui personal colour, Anda dapat memilih pakaian dan makeup yang 
                  membuat Anda terlihat lebih cerah, segar, dan percaya diri. Metode ini telah digunakan oleh stylist profesional di seluruh 
                  dunia untuk membantu klien mereka tampil maksimal.
                </p>

                <div className="flex gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full">
                    Skintone</span>
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full">
                    Fashion</span>
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full">
                    Beauty</span>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* Four Seasons Grid */}
        <div className="mb-12">
          <h3 className="text-3xl text-center mb-8">4 Kategori Personal Colour</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Spring Bright */}
            <Card className="border-2 border-purple-100 hover:border-pink-300 
            transition-all hover:shadow-lg group">
              <CardContent className="pt-6">
                <div className="bg-gradient-to-br from-pink-100 to-yellow-100 w-16 
                h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 
                transition-transform">
                  <Sun className="w-8 h-8 text-pink-600" />
                </div>

                <h4 className="text-2xl mb-3">Spring Bright</h4>
                <p className="text-gray-600 mb-4">
                  Cocok untuk undertone hangat dengan kulit cerah keemasan. Warna-warna cerah, 
                  fresh, dan warm seperti coral, peach, dan turquoise.
                </p>

                <div className="grid grid-cols-4 gap-2">
                  <div className="h-10 rounded" style={{ backgroundColor: '#FFB5E8' }}></div>
                  <div className="h-10 rounded" style={{ backgroundColor: '#FF9CEE' }}></div>
                  <div className="h-10 rounded" style={{ backgroundColor: '#FFCCF9' }}></div>
                  <div className="h-10 rounded" style={{ backgroundColor: '#F6A6FF' }}></div>
                </div>
              </CardContent>
            </Card>

            {/* Summer Cool */}
            <Card className="border-2 border-purple-100 hover:border-blue-300 
            transition-all hover:shadow-lg group">
              <CardContent className="pt-6">
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-16 
                h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 
                transition-transform">
                  <Droplet className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-2xl mb-3">Summer Cool</h4>
                <p className="text-gray-600 mb-4">
                  Ideal untuk undertone dingin dengan kulit cerah pink. 
                  Warna-warna soft, cool, dan muted seperti lavender, powder blue, dan rose.
                </p>
                <div className="grid grid-cols-4 gap-2">
                  <div className="h-10 rounded" style={{ backgroundColor: '#85E3FF' }}></div>
                  <div className="h-10 rounded" style={{ backgroundColor: '#ACE7FF' }}></div>
                  <div className="h-10 rounded" style={{ backgroundColor: '#A7C7E7' }}></div>
                  <div className="h-10 rounded" style={{ backgroundColor: '#95E1D3' }}></div>
                </div>
              </CardContent>
            </Card>

            {/* Autumn Warm */}
            <Card className="border-2 border-purple-100 hover:border-orange-300 
            transition-all hover:shadow-lg group">
              <CardContent className="pt-6">
                <div className="bg-gradient-to-br from-orange-100 to-red-100 w-16 h-16 
                rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 
                transition-transform">
                  <Leaf className="w-8 h-8 text-orange-600" />
                </div>
                <h4 className="text-2xl mb-3">Autumn Warm</h4>
                <p className="text-gray-600 mb-4">
                  Sempurna untuk undertone hangat dengan kulit medium ke gelap. 
                  Warna-warna rich, warm, dan earthy seperti terracotta, olive, dan burgundy.
                </p>
                <div className="grid grid-cols-4 gap-2">
                  <div className="h-10 rounded" style={{ backgroundColor: '#E07A5F' }}></div>
                  <div className="h-10 rounded" style={{ backgroundColor: '#F2CC8F' }}></div>
                  <div className="h-10 rounded" style={{ backgroundColor: '#C1666B' }}></div>
                  <div className="h-10 rounded" style={{ backgroundColor: '#D4A373' }}></div>
                </div>
              </CardContent>
            </Card>

            {/* Winter Clear */}
            <Card className="border-2 border-purple-100 hover:border-indigo-300 
            transition-all hover:shadow-lg group">
              <CardContent className="pt-6">
                <div className="bg-gradient-to-br from-indigo-100 to-slate-100 w-16
                 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 
                 transition-transform">
                  <Snowflake className="w-8 h-8 text-indigo-600" />
                </div>
                <h4 className="text-2xl mb-3">Winter Clear</h4>
                <p className="text-gray-600 mb-4">
                  Terbaik untuk undertone dingin dengan kontras tinggi. Warna-warna bold, 
                  clear, dan jewel tones seperti royal blue, emerald, dan magenta.
                </p>
                <div className="grid grid-cols-4 gap-2">
                  <div className="h-10 rounded" style={{ backgroundColor: '#7FB3D5' }}></div>
                  <div className="h-10 rounded" style={{ backgroundColor: '#5499C7' }}></div>
                  <div className="h-10 rounded" style={{ backgroundColor: '#2980B9' }}></div>
                  <div className="h-10 rounded" style={{ backgroundColor: '#1F618D' }}></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tips & Benefits */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-2 border-purple-100 hover:shadow-lg transition-all">
            <CardContent className="pt-6">
              <h3 className="text-2xl mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                Manfaat Mengetahui Personal Colour
              </h3>
              <ul className="space-y-3 list-disc list-outside pl-5 text-gray-600">
                <li className="marker:text-purple-600">
                  Meningkatkan penampilan dan membuat wajah terlihat lebih cerah dan fresh
                </li>
                <li className="marker:text-purple-600">
                  Menghemat waktu dan uang dengan membeli pakaian yang benar-benar cocok
                </li>
                <li className="marker:text-purple-600">
                  Meningkatkan kepercayaan diri dengan tampil maksimal setiap hari
                </li>
                <li className="marker:text-purple-600">
                  Memudahkan dalam memilih makeup dan aksesori yang sesuai
                </li>
                <li className="marker:text-purple-600">
                  Menciptakan lemari pakaian yang lebih kohesif dan mudah di-mix & match
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-100 hover:shadow-lg transition-all">
            <CardContent className="pt-6">
              <h3 className="text-2xl mb-4 flex items-center gap-2">
                <Palette className="w-6 h-6 text-purple-600" />
                Tips Memilih Warna yang Tepat
              </h3>
              <ul className="space-y-3 list-disc list-outside pl-5 text-gray-600">
                <li className="marker:text-purple-600">
                  Perhatikan undertone kulit Anda - hangat (golden) atau dingin (pink)
                </li>
                <li className="marker:text-purple-600">
                  Warna yang tepat akan membuat mata Anda terlihat lebih berbinar
                </li>
                <li className="marker:text-purple-600">
                  Hindari warna yang membuat kulit terlihat kusam atau keabu-abuan
                </li>
                <li className="marker:text-purple-600">
                  Gunakan analisis profesional untuk hasil yang paling akurat
                </li>
                <li className="marker:text-purple-600">
                  Jangan takut bereksperimen dengan nuansa berbeda dalam palet Anda
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-12 
        text-center text-white">
          <Sparkles className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-4xl mb-4">Siap Menemukan Warna Terbaikmu?</h2>
          <p className="text-xl mb-8 opacity-90">
            Bergabunglah dengan Palettopia sekarang dan temukan palet warna yang sempurna 
            untuk meningkatkan penampilanmu
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              Daftar Gratis Sekarang
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded-lg">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl">Palettopia</span>
              </div>
              <p className="text-gray-400">
                Platform analisis personal colour palette untuk brand byneera.id
              </p>
            </div>
            {/* <div>
              <h4 className="mb-4">Menu</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/tentang-kami" className="hover:text-white transition-colors">
                Tentang Kami</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">
                Register</Link></li>
              </ul>
            </div> */}

            <div>
              <h4 className="mb-4">Partner</h4>
              <p className="text-gray-400">byneera.id</p>
            </div>
            <div>
              <p className="text-gray-400 mt-4">© 2025 Palettopia. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
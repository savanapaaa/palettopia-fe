import { Link } from 'react-router-dom';
import { Button } from './ui/button.tsx';
import { Card, CardContent } from './ui/card.tsx';
import Navbar from './Navbar.tsx';
import { Palette, Target, Lightbulb, Users, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './Fallback/ImageCeritaFallback.tsx';
import Banner from "../assets/img/cerita.png";


import T1 from "../assets/img/team1.png";
import T2 from "../assets/img/team2.png";
import T3 from "../assets/img/team3.png";
import T4 from "../assets/img/team4.png";
import T5 from "../assets/img/team5.png";
import T6 from "../assets/img/team6.png";


const teamPhotos = [T1, T2, T3, T4, T5, T6];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl mb-6">Tentang Palettopia</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            Platform inovatif yang membantu Anda menemukan personal colour palette yang sempurna, 
            terintegrasi dengan koleksi fashion byneera.id
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl mb-6">Cerita Kami</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Palettopia lahir dari pemahaman bahwa setiap orang memiliki palet warna unik yang dapat 
                meningkatkan penampilan dan kepercayaan diri mereka. Kami menyadari bahwa banyak orang 
                kesulitan menemukan warna yang benar-benar cocok dengan skintone mereka.
              </p>
              <p>
                Dikembangkan khusus untuk brand byneera.id, Palettopia menggunakan teknologi analisis 
                gambar untuk memberikan rekomendasi palet warna yang akurat dan personal. Platform ini 
                tidak hanya membantu pengguna menemukan warna ideal mereka, tetapi juga langsung 
                menghubungkan mereka dengan produk fashion yang sesuai.
              </p>
              <p>
                Dengan Palettopia, pengalaman menemukan dan berbelanja fashion menjadi lebih mudah, 
                personal, dan menyenangkan.
              </p>
            </div>
          </div>
          <div className="relative rounded-3xl overflow-hidden w-full h-[400px] bg-white">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-600 rounded-3xl blur-3xl opacity-20"></div>
            <ImageWithFallback
              src={Banner}
              alt="Color Palette"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-white/50 backdrop-blur-sm py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4">Nilai-Nilai Kami</h2>
            <p className="text-xl text-gray-600">Prinsip yang memandu setiap keputusan kami</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 border-purple-100 hover:border-purple-300 transition-all">
              <CardContent className="pt-6 text-center">
                <div className="bg-gradient-to-br from-pink-100 to-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl mb-2">Akurasi</h3>
                <p className="text-gray-600">
                  Memberikan analisis yang tepat dan rekomendasi yang akurat untuk setiap pengguna
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-100 hover:border-purple-300 transition-all">
              <CardContent className="pt-6 text-center">
                <div className="bg-gradient-to-br from-pink-100 to-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl mb-2">Inovasi</h3>
                <p className="text-gray-600">
                  Terus berinovasi untuk memberikan pengalaman terbaik kepada pengguna
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-100 hover:border-purple-300 transition-all">
              <CardContent className="pt-6 text-center">
                <div className="bg-gradient-to-br from-pink-100 to-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl mb-2">Personalisasi</h3>
                <p className="text-gray-600">
                  Setiap pengguna unik, dan kami memberikan solusi yang dipersonalisasi
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-100 hover:border-purple-300 transition-all">
              <CardContent className="pt-6 text-center">
                <div className="bg-gradient-to-br from-pink-100 to-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl mb-2">Kemudahan</h3>
                <p className="text-gray-600">
                  Membuat pengalaman menemukan warna dan berbelanja menjadi mudah dan menyenangkan
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12">
          <Card className="border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-white">
            <CardContent className="pt-6">
              <h3 className="text-3xl mb-4">Visi Kami</h3>
              <p className="text-gray-700 text-lg">
                Menjadi platform terdepan dalam analisis personal colour palette di Indonesia, 
                membantu setiap orang menemukan dan mengekspresikan diri mereka melalui warna yang tepat.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
            <CardContent className="pt-6">
              <h3 className="text-3xl mb-4">Misi Kami</h3>
              <p className="text-gray-700 text-lg">
                Memberikan solusi teknologi yang mudah digunakan untuk menganalisis skintone dan 
                merekomendasikan palet warna personal, sambil mengintegrasikan pengalaman berbelanja 
                fashion yang seamless dengan byneera.id.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-white/50 backdrop-blur-sm py-20">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-4xl mb-4">Tim Kami</h2>
      <p className="text-xl text-gray-600">
        Tim yang berdedikasi untuk memberikan pengalaman terbaik
      </p>
    </div>

    {/* Grid 6 Foto */}
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
      {teamPhotos.map((img, i) => (
        <div key={i} className="flex justify-center">
          <ImageWithFallback
            src={img}
            alt={`Team Member ${i + 1}`}
            className="w-32 h-32 rounded-full object-cover shadow-lg"
          />
        </div>
      ))}
    </div>

    <p className="text-center text-gray-600 mt-8 text-lg">
      Kami adalah tim yang passionate tentang fashion, teknologi, dan membantu orang 
      menemukan versi terbaik dari diri mereka.
    </p>
  </div>
</section>


      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl mb-4">Siap Memulai Perjalanan Anda?</h2>
          <p className="text-xl mb-8 opacity-90">
            Bergabunglah dengan Palettopia dan temukan palet warna yang sempurna untuk Anda
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              Mulai Sekarang <ArrowRight className="ml-2 w-5 h-5" />
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
            <div>
              <h4 className="mb-4">Menu</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/tentang-kami" className="hover:text-white transition-colors">Tentang Kami</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Partner</h4>
              <p className="text-gray-400">byneera.id</p>
              <p className="text-gray-400 mt-4">© 2025 Palettopia. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button.tsx';
import { Input } from './ui/input.tsx';
import { Label } from './ui/label.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.tsx';
import { Palette, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import api from "../services/api.ts";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    nomorTelepon: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi
    if (!formData.nama || !formData.email || !formData.nomorTelepon || !formData.password || !formData.confirmPassword) {
      toast.error('Semua field harus diisi!');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Password dan konfirmasi password tidak cocok!');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password minimal 8 karakter!');
      return;
    }
    try {
      // Ambil CSRF token 

    // BARU kemudian register
    const registerData = {
      full_name: formData.nama,
      email: formData.email,
      phone: formData.nomorTelepon,
      password: formData.password,
      password_confirmation: formData.confirmPassword, 
    };

    //Cek data yang akan dikirim
    console.log('Data yang akan dikirim ke backend:', registerData);
    console.log('Password match:', formData.password === formData.confirmPassword);

    const response = await api.post("/register", registerData);

      console.log('Response dari backend:', response.data);
    toast.success("Registrasi berhasil! Silakan login.");

    setTimeout(() => {
      navigate("/login");
    }, 1500);

  } catch (error: any) {
    toast.error(error.response?.data?.message || "Registrasi gagal.");
  }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 text-gray-600 
        hover:text-purple-600 mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Kembali ke Beranda
        </Link>

        <Card className="border-2 border-purple-100 shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-3 rounded-2xl">
                <Palette className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl">Daftar Akun Baru</CardTitle>
            <CardDescription className="text-base">
              Buat akun untuk mulai menemukan personal colour palette Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Lengkap</Label>
                <Input
                  id="nama"
                  name="nama"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={formData.nama}
                  onChange={handleChange}
                  className="border-purple-200 focus:border-purple-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="border-purple-200 focus:border-purple-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nomorTelepon">Nomor Telepon</Label>
                <Input
                  id="nomorTelepon"
                  name="nomorTelepon"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={formData.nomorTelepon}
                  onChange={handleChange}
                  minLength={10}
                  maxLength={13}
                  className="border-purple-200 focus:border-purple-400"
                />
              </div>


              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimal 8 karakter"
                    value={formData.password}
                    onChange={handleChange}
                    className="border-purple-200 focus:border-purple-400 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 
                    hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ketik ulang password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="border-purple-200 focus:border-purple-400"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 
                    hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 
                hover:from-pink-600 hover:to-purple-700 text-white"
              >
                Daftar
              </Button>

              <p className="text-center text-gray-600">
                Sudah punya akun?{' '}
                <Link to="/login" className="text-purple-600 hover:text-purple-700">
                  Login di sini
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button.tsx';
import { Input } from './ui/input.tsx';
import { Label } from './ui/label.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.tsx';
import { Palette, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import api, { getCsrfCookie } from '../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Semua field harus diisi!');
      return;
    }

    try {
      // Ambil CSRF token dulu
      await getCsrfCookie();

      // BARU kemudian login
      const loginData = {
        email: formData.email,
        password: formData.password,
      };

      // Debug: Cek data yang akan dikirim
      console.log('📤 Data login yang akan dikirim:', loginData);

      const response = await api.post("/login", loginData);

      console.log('Response dari backend:', response.data);

      // SIMPAN USER KE CONTEXT
      login(response.data.user);

      toast.success('Login berhasil!');
      navigate("/dashboard");

    } catch (err: any) {
      console.error('Error login:', err.response?.data || err);
      toast.error(err.response?.data?.message || "Gagal terhubung ke server");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-8 transition-colors">
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
            <CardTitle className="text-3xl">Selamat Datang Kembali</CardTitle>
            <CardDescription className="text-base">
              Masuk ke akun Anda untuk melanjutkan
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

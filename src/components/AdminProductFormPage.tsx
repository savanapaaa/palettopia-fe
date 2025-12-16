import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.tsx';
import { Button } from './ui/button.tsx';
import { Input } from './ui/input.tsx';
import { Label } from './ui/label.tsx';
import { Textarea } from './ui/textarea.tsx';
import AdminNavbar from './AdminNavbar';
import { ArrowLeft, Upload, Save, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import api, { getCsrfCookie, getImageUrl } from '../services/api';

export default function AdminProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: 0,
    stock: 0,
    palettes: [] as string[], // Multiple palette selection
    description: '',
    image: null as File | null,
  });

  useEffect(() => {
    if (isEditMode && id) {
      fetchProduct(id);
    }
  }, [id, isEditMode]);

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      await getCsrfCookie();
      const response = await api.get(`/admin/products`);
      const productsData = response.data.data || response.data;
      const products = productsData.data || productsData;
      const product = products.find((p: any) => p.id === parseInt(productId));
      
      if (product) {
        setFormData({
          name: product.name,
          category: product.category || '',
          price: typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0),
          stock: product.stock || 0,
          palettes: product.palettes?.map((p: any) => p.palette_name) || (product.palette_category ? [product.palette_category] : []),
          description: product.description || '',
          image: null
        });
        if (product.image_url) {
          setImagePreview(getImageUrl(product.image_url));
        }
      }
    } catch (error: any) {
      console.error('Error fetching product:', error);
      toast.error('Gagal memuat data produk');
    } finally {
      setLoading(false);
    }
  };

  const paletteCategories = [
    { value: 'winter clear', label: 'Winter Clear' },
    { value: 'summer cool', label: 'Summer Cool' },
    { value: 'spring bright', label: 'Spring Bright' },
    { value: 'autumn warm', label: 'Autumn Warm' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });
      
      // Preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi
    if (!formData.name || !formData.category || formData.palettes.length === 0 || !formData.price || !formData.stock) {
      toast.error('Nama, kategori, palet warna, harga, dan stok wajib diisi!');
      return;
    }

    try {
      setLoading(true);
      await getCsrfCookie();

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('price', formData.price.toString());
      formDataToSend.append('stock', formData.stock.toString());
      // Send palettes as array or first palette as palette_category
      formDataToSend.append('palette_category', formData.palettes[0] || '');
      formData.palettes.forEach(palette => {
        formDataToSend.append('palettes[]', palette);
      });
      if (formData.description) {
        formDataToSend.append('description', formData.description);
      }
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      if (isEditMode && id) {
        // Update product
        await api.post(`/admin/products/${id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
          params: { _method: 'PUT' }
        });
        toast.success('Produk berhasil diperbarui!');
      } else {
        // Create product
        await api.post('/admin/products', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Produk baru berhasil ditambahkan!');
      }

      navigate('/admin/products');
    } catch (error: any) {
      console.error('Error saving product:', error);
      const errorMsg = error.response?.data?.message || 'Gagal menyimpan produk';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <AdminNavbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link to="/admin/products" className="flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-6 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Kelola Produk
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl mb-2">
              {isEditMode ? 'Ubah Produk' : 'Tambah Produk Baru'}
            </h1>
            <p className="text-xl text-gray-600">
              {isEditMode ? 'Perbarui informasi produk yang ada' : 'Masukkan detail produk fashion baru'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Card className="border-2 border-purple-100 mb-6">
              <CardHeader>
                <CardTitle>Informasi Produk</CardTitle>
                <CardDescription>
                  Isi detail lengkap tentang produk
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Nama Produk */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Nama Produk <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Contoh: Spring Bright Lipstick #FFCCF9 by ByNeer - Rp 85.000"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="border-purple-200 focus:border-purple-400"
                  />
                </div>

                {/* Kategori Produk */}
                <div className="space-y-2">
                  <Label htmlFor="category">
                    Kategori <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="category"
                    placeholder="Pilih Kategori"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="border-purple-200 focus:border-purple-400"
                  />
                </div>

                {/* Harga & Stok */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">
                      Harga (Rp) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="249000"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">
                      Stok <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="stock"
                      type="number"
                      placeholder="24"
                      value={formData.stock}
                      onChange={(e) => handleInputChange('stock', e.target.value)}
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                </div>

                {/* Deskripsi */}
                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi Produk</Label>
                  <Textarea
                    id="description"
                    placeholder="Jelaskan detail produk, bahan, ukuran, dll"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="border-purple-200 focus:border-purple-400"
                  />
                </div>

                {/* Upload Gambar */}
                <div className="space-y-2">
                  <Label htmlFor="image">Gambar Produk</Label>
                  <div className="border-2 border-dashed border-purple-200 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                    {imagePreview ? (
                      <div className="mb-4">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="max-w-xs mx-auto rounded-lg"
                        />
                      </div>
                    ) : (
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    )}
                    <p className="text-sm text-gray-600 mb-2">
                      {formData.image ? formData.image.name : imagePreview ? 'Gambar saat ini' : 'Klik untuk upload gambar atau drag & drop'}
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      PNG, JPG, JPEG, GIF hingga 10MB
                    </p>
                    <Input
                      id="image"
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/gif"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('image')?.click()}
                      className="border-purple-300 text-purple-600 hover:bg-purple-50"
                    >
                      Pilih Gambar
                    </Button>
                  </div>
                </div>

                {/* Asosiasi Palet Warna */}
                <div className="space-y-3">
                  <Label>
                    Asosiasi Palet Warna <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-sm text-gray-500">Pilih palet warna yang sesuai dengan produk ini</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {paletteCategories.map((cat) => (
                      <div key={cat.value} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={cat.value}
                          checked={formData.palettes.includes(cat.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                palettes: [...formData.palettes, cat.value]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                palettes: formData.palettes.filter(p => p !== cat.value)
                              });
                            }
                          }}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <label htmlFor={cat.value} className="text-sm font-medium text-gray-700 cursor-pointer">
                          {cat.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isEditMode ? 'Perbarui Produk' : 'Tambah Produk'}
                  </>
                )}
              </Button>
              <Link to="/admin/products" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={loading}
                >
                  Batal
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

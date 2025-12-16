import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.tsx';
import { Button } from './ui/button';
import DashboardNavbar from './DashboardNavbar';
import { Upload, Camera, Image as ImageIcon, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from './ui/alert.tsx';
import api, { getCsrfCookie } from '../services/api';

export default function AnalysisPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [lowLight, setLowLight] = useState(false);
  const [lightCheckInterval, setLightCheckInterval] = useState<any>(null);
  const [uploadMethod, setUploadMethod] = useState<'file' | 'camera' | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);
  const navigate = useNavigate();

  // Upload file
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      setUploadMethod('file');
    };
    reader.readAsDataURL(file);
  };

  // Ambil foto dari kamera
  const capturePhoto = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setSelectedImage(imageSrc);
      setUploadMethod('camera');
      setShowCamera(false);
      toast.success('Foto berhasil diambil!');
    } else {
      toast.error('Gagal mengambil foto, coba lagi.');
    }
  };

  const handleCameraCapture = () => {
    setShowCamera(true);
    setUploadMethod('camera');
  };

  const handleStartAnalysis = async () => {
  if (!selectedImage) {
    toast.error('Silakan upload foto terlebih dahulu!');
    return;
  }

  try {
    setIsAnalyzing(true);

    // Ambil CSRF token dulu
    await getCsrfCookie();

    // STEP 1: Upload foto ke backend
    toast.info('Mengunggah foto...');
    
    // Convert base64 to blob/file
    const blob = await fetch(selectedImage).then(r => r.blob());
    const formData = new FormData();
    formData.append('image', blob, 'photo.jpg');

    const uploadResponse = await api.post('/uploads/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    const imageUrl = uploadResponse.data.url || uploadResponse.data.path;
    console.log('Image uploaded:', imageUrl);

    // 🔹 STEP 2: Request analisis dengan image_url yang sudah diupload
    toast.info('Menganalisis foto...');
    
    const analysisResponse = await api.post('/analysis', {
      image_url: imageUrl,
      // atau image_path: imageUrl, tergantung backend
    });

    console.log('RESPONSE DARI BACKEND:', analysisResponse.data);

    // Backend mengirim: { success: true, data: { palette_name, colors, ... } }
    const result = analysisResponse.data.data || analysisResponse.data;
    
    console.log('📊 Analysis Result:', result);

    toast.success('Analisis selesai!');

    // 🔹 STEP 3: pindah ke halaman hasil
    navigate('/dashboard/hasil', {
      state: {
        image: selectedImage,
        palette: result.palette_name ?? 'tidak terdeteksi',
        explanation: result.explanation ?? 'Tidak ada penjelasan',
        colors: result.colors ?? [],
        undertone: result.undertone ?? '',
        recommendations: result.recommendations ?? [],
      },
    });

  } catch (err: any) {
  console.error('ERROR FULL:', err.response?.data || err);
  toast.error(err.response?.data?.message || 'Gagal menganalisis foto');
} finally {
    setIsAnalyzing(false);
  }
};


  const handleRemoveImage = () => {
    setSelectedImage(null);
    setUploadMethod(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen">
      <DashboardNavbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl mb-2">Analisis Warna Personal</h1>
          <p className="text-xl text-gray-600 mb-8">
            Upload foto wajah Anda untuk mendapatkan rekomendasi palet warna yang sesuai
          </p>

          {/* Guidelines */}
          <Alert className="mb-6 border-purple-200 bg-purple-50">
            <AlertCircle className="h-4 w-4 text-purple-600" />
            <AlertDescription className="text-gray-700">
              <span>Untuk hasil terbaik:</span>
              <ul className="mt-2 space-y-1 ml-4">
                <li>• Gunakan pencahayaan yang cukup dan merata</li>
                <li>• Pastikan wajah terlihat jelas tanpa halangan</li>
                <li>• Gunakan background yang netral</li>
                <li>• Hindari makeup yang terlalu tebal</li>
                <li>• Pastikan foto yang dimasukkan close up</li>
                <li>• Hindari background ramai</li>
                <li>• Gunakan kamera depan yang bersih</li>
                <li>• Posisikan wajah di tengah frame dengan jarak 30–50 cm</li>
                <li>• Arahkan wajah langsung ke arah kamera</li>
                <li>• Pastikan rambut tidak menutupi wajah</li>
                <li>• Lepas topi, masker, atau aksesoris wajah lainnya</li>
                <li>• Gunakan ekspresi netral, tidak terlalu tersenyum</li>
                <li>• Jangan gunakan filter kamera atau beauty mode</li>
                <li>• Hindari cahaya berwarna (LED ungu, biru, kuning, dll)</li>
                <li>• Hindari backlight dari jendela atau lampu terang</li>
                <li>• Jangan bergerak saat foto diambil untuk menghindari blur</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Upload Area */}
            <Card className="border-2 border-purple-100">
              <CardHeader>
                <CardTitle>Upload Foto</CardTitle>
                <CardDescription>
                  Pilih metode untuk mengunggah foto wajah Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* FILE */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full h-auto py-6 border-2 border-dashed border-purple-300 hover:border-purple-500 hover:bg-purple-50"
                  disabled={isAnalyzing}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-purple-600" />
                    <div>
                      <div>Upload dari Perangkat</div>
                      <div className="text-sm text-gray-500">JPG, PNG, atau JPEG</div>
                    </div>
                  </div>
                </Button>

              {/* KAMERA */}
                <Button
                  onClick={handleCameraCapture}
                  variant="outline"
                  className="w-full h-auto py-6 border-2 border-dashed border-purple-300 hover:border-purple-500 hover:bg-purple-50"
                  disabled={isAnalyzing}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Camera className="w-8 h-8 text-purple-600" />
                    <div>
                      <div>Ambil Foto</div>
                      <div className="text-sm text-gray-500">Gunakan kamera perangkat</div>
                    </div>
                  </div>
                </Button>
              </CardContent>
            </Card>

            {/* Preview Area */}
            <Card className="border-2 border-purple-100">
              <CardHeader>
                <CardTitle>Preview Foto</CardTitle>
                <CardDescription>Foto yang akan dianalisis</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedImage ? (
                  <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden border-2 border-purple-200">
                      <img src={selectedImage} className="w-full h-64 object-cover" />

                      <div className="absolute top-2 right-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={handleRemoveImage}
                          disabled={isAnalyzing}
                        >
                          Hapus
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span>Foto siap dianalisis</span>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                      <p>Belum ada foto yang dipilih</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Camera View */}
          {showCamera && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
              <Card className="p-4 w-full max-w-md">
                <CardTitle className="mb-4">Ambil Foto</CardTitle>
                <div className='relative'>
                  <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="rounded-lg w-full"
                  videoConstraints={{ facingMode:"user"}}
                  onUserMedia={()=>{

                    // cek cahaya setiap 500s
                    const interval = setInterval(()=>{
                      if (!webcamRef.current) return;
                      const canvas = document.createElement("canvas");
                      const ctx = canvas.getContext("2d");
                      if (!ctx) return;
                      
                      canvas.width = 200;
                      canvas.height = 150;
                      ctx.drawImage(webcamRef.current.video!, 0, 0, 200, 150);
                      const frame = ctx.getImageData(0, 0, 200, 150);

                      const brightness = frame.data.reduce((acc, val, idx) =>
                        idx % 4 !== 3 ? acc + val : acc
                      , 0) / (frame.data.length * 0.75);

                      setLowLight(brightness < 60); // <60 = gelap
                    }, 500);

                    setLightCheckInterval(interval);
                          
                  }}
                />

                {/* WARNING CAHAYA */}
                {lowLight && (
                  <div className="mt-3 p-3 rounded-md bg-red-100 border border-red-400 text-red-700 text-sm text-center">
                    Pencahayaan kurang terang. Arahkan wajah ke sumber cahaya agar foto dapat terdeteksi dengan baik.
                  </div>
                )}
                </div>

                <div className="flex justify-between mt-4">
                  <Button onClick={() => setShowCamera(false)}className="bg-purple-600 text-white">
                    Batal
                  </Button>

                  <Button onClick={capturePhoto} className="bg-purple-600 text-white">
                    Jepret
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Analysis Button */}
          <Card className="mt-6 border-2 border-purple-100 bg-gradient-to-br from-pink-50 to-purple-50">
            <CardContent className="pt-6">
              <Button
                onClick={handleStartAnalysis}
                disabled={!selectedImage || isAnalyzing}
                className="w-full h-14 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    Menganalisis...
                  </>
                ) : (
                  'Mulai Analisis'
                )}
              </Button>

              {isAnalyzing && (
                <p className="text-center mt-4 text-gray-600">
                  Mohon tunggu, kami sedang menganalisis foto Anda...
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

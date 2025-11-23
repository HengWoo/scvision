import React, { useRef, useState } from 'react';
import { Camera, Upload, X, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useToast } from './ui/use-toast';
import { t } from '@/lib/translations';

export default function ImageUpload({ onImageSelected }) {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const [useCamera, setUseCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const { toast } = useToast();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageSelected(event.target.result, file);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setUseCamera(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        variant: "destructive",
        title: t('error.cameraFailed'),
        description: error.message,
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setUseCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);

      canvas.toBlob((blob) => {
        const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        onImageSelected(url, file);
        stopCamera();
      }, 'image/jpeg', 0.95);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!useCamera ? (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">{t('upload.title')}</h2>
            <p className="text-sm md:text-base text-muted-foreground">{t('upload.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <Button
              onClick={startCamera}
              size="lg"
              className="h-20 sm:h-24 text-base sm:text-lg"
              variant="default"
            >
              <Camera className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              {t('upload.useCamera')}
            </Button>

            <Button
              onClick={() => fileInputRef.current?.click()}
              size="lg"
              className="h-20 sm:h-24 text-base sm:text-lg"
              variant="secondary"
            >
              <Upload className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              {t('upload.uploadImage')}
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <p className="text-sm sm:text-base font-semibold mb-3 flex items-center gap-2">
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                {t('upload.tips.title')}
              </p>
              <ul className="space-y-2 text-xs sm:text-sm md:text-base text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{t('upload.tips.lighting')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{t('upload.tips.fullLeaf')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{t('upload.tips.avoidShadow')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{t('upload.tips.focusDisease')}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full aspect-video object-cover"
            />
          </Card>

          <div className="flex gap-3 justify-center max-w-2xl mx-auto">
            <Button onClick={capturePhoto} size="lg" className="flex-1 text-base sm:text-lg">
              <Camera className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              {t('upload.capture')}
            </Button>
            <Button onClick={stopCamera} size="lg" variant="outline" className="flex-1 text-base sm:text-lg">
              {t('upload.cancel')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useRef, useState, useEffect } from 'react';
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
  const [debugInfo, setDebugInfo] = useState([]);
  const [cameraError, setCameraError] = useState(null);
  const { toast } = useToast();

  const addDebugInfo = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugInfo(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(message);
  };

  // Effect to attach stream to video when camera mode is activated
  useEffect(() => {
    if (useCamera && stream && videoRef.current) {
      addDebugInfo('🎥 useEffect: Attaching stream to video element');

      try {
        videoRef.current.srcObject = stream;

        addDebugInfo(`Video element state: readyState=${videoRef.current.readyState}`);

        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          addDebugInfo(`✅ Video metadata loaded: ${videoRef.current.videoWidth}x${videoRef.current.videoHeight}`);

          videoRef.current.play()
            .then(() => {
              addDebugInfo('✅ Video playing successfully');
            })
            .catch(e => {
              addDebugInfo(`❌ Video play error: ${e.message}`);
            });
        };

        videoRef.current.onerror = (e) => {
          addDebugInfo(`❌ Video error: ${e}`);
        };

      } catch (e) {
        addDebugInfo(`❌ Error setting srcObject: ${e.message}`);
      }
    }
  }, [useCamera, stream]);

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
    setCameraError(null);
    setDebugInfo([]);

    try {
      addDebugInfo('📱 Starting camera initialization...');
      addDebugInfo(`🔒 Protocol: ${window.location.protocol}`);
      addDebugInfo(`🌐 Hostname: ${window.location.hostname}`);
      addDebugInfo(`📍 User Agent: ${navigator.userAgent}`);

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices) {
        throw new Error('navigator.mediaDevices 不存在');
      }
      addDebugInfo('✅ navigator.mediaDevices exists');

      if (!navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia 不支持');
      }
      addDebugInfo('✅ getUserMedia is supported');

      // Check for HTTPS (required for camera access)
      if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        throw new Error('相机访问需要 HTTPS 连接');
      }
      addDebugInfo('✅ HTTPS check passed');

      // Request camera with mobile-friendly constraints
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 }
        },
        audio: false
      };

      addDebugInfo('📸 Requesting camera access...');
      addDebugInfo(`Constraints: ${JSON.stringify(constraints)}`);

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

      addDebugInfo('✅ Camera access granted!');
      addDebugInfo(`Stream tracks: ${mediaStream.getTracks().length}`);

      // Log track details
      mediaStream.getTracks().forEach((track, index) => {
        addDebugInfo(`Track ${index}: ${track.kind} - ${track.label} (enabled: ${track.enabled}, muted: ${track.muted})`);
      });

      // Store stream first
      setStream(mediaStream);

      // Then switch to camera mode (useEffect will attach stream to video)
      setUseCamera(true);

      addDebugInfo('🎉 Camera initialization complete, switching to camera view...');
    } catch (error) {
      addDebugInfo(`❌ ERROR: ${error.name} - ${error.message}`);
      addDebugInfo(`Error stack: ${error.stack}`);

      let errorMessage = error.message;

      // Provide user-friendly error messages
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = '相机权限被拒绝。请在浏览器设置中允许相机访问。';
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage = '未找到相机设备。';
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMessage = '相机正在被其他应用使用。';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = '无法满足相机要求。';
      } else if (error.name === 'SecurityError') {
        errorMessage = '相机访问被安全策略阻止。请使用 HTTPS。';
      }

      setCameraError({ name: error.name, message: errorMessage, originalMessage: error.message });

      toast({
        variant: "destructive",
        title: t('error.cameraFailed'),
        description: errorMessage,
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

          {/* Debug Info Panel */}
          {(debugInfo.length > 0 || cameraError) && (
            <Card className="bg-destructive/10 border-destructive/50">
              <CardContent className="pt-6">
                <p className="text-sm font-bold mb-2">🔍 调试信息 (Debug Info):</p>

                {cameraError && (
                  <div className="mb-3 p-3 bg-destructive/20 rounded-lg">
                    <p className="text-sm font-bold text-destructive">错误类型: {cameraError.name}</p>
                    <p className="text-sm text-destructive">{cameraError.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">原始错误: {cameraError.originalMessage}</p>
                  </div>
                )}

                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {debugInfo.map((info, index) => (
                    <p key={index} className="text-xs font-mono bg-background/50 p-2 rounded">
                      {info}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full aspect-video object-cover"
              style={{ WebkitPlaysinline: 'true' }}
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

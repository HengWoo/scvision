import React, { useState, useEffect } from 'react';
import { Leaf, Loader2, AlertCircle, Camera } from 'lucide-react';
import ImageUpload from './components/ImageUpload';
import Results from './components/Results';
import History from './components/History';
import { loadModel, classifyImage } from './utils/model';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Separator } from './components/ui/separator';
import { Toaster } from './components/ui/toaster';
import { t } from './lib/translations';

export default function App() {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);
  const [modelError, setModelError] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('analyze');

  // Load model and history on mount
  useEffect(() => {
    const initModel = async () => {
      try {
        setModelLoading(true);
        setModelError(null);
        await loadModel('/best.onnx');
        setModelLoaded(true);
        setModelLoading(false);
      } catch (error) {
        console.error('Failed to load model:', error);
        setModelError(error.message);
        setModelLoading(false);
      }
    };

    // Load history from localStorage
    const savedHistory = localStorage.getItem('scvision-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to load history:', e);
      }
    }

    initModel();
  }, []);

  const handleImageSelected = async (imageUrl, file) => {
    setCurrentImage(imageUrl);
    setCurrentFile(file);
    setPrediction(null);
    setAnalyzing(true);

    try {
      const result = await classifyImage(file);
      setPrediction(result);
    } catch (error) {
      console.error('Classification error:', error);
      setAnalyzing(false);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleNewImage = () => {
    setCurrentImage(null);
    setCurrentFile(null);
    setPrediction(null);
  };

  const saveToHistory = () => {
    if (!prediction || !currentImage) return;

    const historyItem = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      image: currentImage,
      disease: prediction.disease,
      confidence: prediction.confidence,
      confidencePercent: prediction.confidencePercent,
    };

    const newHistory = [historyItem, ...history].slice(0, 50); // Keep last 50
    setHistory(newHistory);
    localStorage.setItem('scvision-history', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('scvision-history');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6">
          <div className="flex items-center gap-3">
            <Leaf className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary" />
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                {t('app.title')}
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1">
                {t('app.tagline')}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8">
        <Card className="animate-fade-in">
          <CardContent className="p-4 sm:p-6 md:p-8">
            {/* Model Loading State */}
            {modelLoading && (
              <div className="flex flex-col items-center justify-center py-12 sm:py-16 space-y-4">
                <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-primary animate-spin" />
                <div className="text-center">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold">{t('loading.model')}</h3>
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1">
                    {t('loading.modelHint')}
                  </p>
                </div>
              </div>
            )}

            {/* Model Error State */}
            {modelError && !modelLoading && (
              <div className="flex flex-col items-center justify-center py-12 sm:py-16 space-y-4">
                <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-destructive" />
                <div className="text-center max-w-md px-4">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold">{t('error.modelFailed')}</h3>
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-2">{modelError}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                    {t('error.modelHint')}
                  </p>
                </div>
                <Button onClick={() => window.location.reload()} className="mt-4 text-sm sm:text-base">
                  {t('error.retry')}
                </Button>
              </div>
            )}

            {/* Model Loaded - Show Tabs */}
            {modelLoaded && !modelLoading && (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 text-sm sm:text-base">
                  <TabsTrigger value="analyze">{t('tabs.analyze')}</TabsTrigger>
                  <TabsTrigger value="history">{t('tabs.history')}</TabsTrigger>
                </TabsList>

                <TabsContent value="analyze" className="mt-4 sm:mt-6">
                  {/* Analyzing State */}
                  {analyzing && (
                    <div className="flex flex-col items-center justify-center py-12 sm:py-16 space-y-4">
                      <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-primary animate-spin" />
                      <div className="text-center">
                        <h3 className="text-base sm:text-lg md:text-xl font-semibold">{t('loading.analyzing')}</h3>
                        <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1">
                          {t('loading.analyzingHint')}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Upload or Show Results */}
                  {!analyzing && !prediction && (
                    <ImageUpload onImageSelected={handleImageSelected} />
                  )}

                  {!analyzing && prediction && (
                    <Results
                      image={currentImage}
                      prediction={prediction}
                      onNewImage={handleNewImage}
                      onSaveToHistory={saveToHistory}
                    />
                  )}
                </TabsContent>

                <TabsContent value="history" className="mt-4 sm:mt-6">
                  <History
                    history={history}
                    onClearHistory={clearHistory}
                    onSelectImage={(item) => {
                      setCurrentImage(item.image);
                      setPrediction({
                        disease: item.disease,
                        confidence: item.confidence,
                        confidencePercent: item.confidencePercent,
                      });
                      setActiveTab('analyze');
                    }}
                  />
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>

        {/* How it Works Section */}
        {modelLoaded && !prediction && !analyzing && activeTab === 'analyze' && (
          <div className="mt-6 sm:mt-8 animate-fade-in">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 text-center">
              {t('howItWorks.title')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              {/* Step 1: Upload */}
              <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
                <CardContent className="pt-5 sm:pt-6 pb-5 sm:pb-6">
                  <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Camera className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-bold mb-1.5 sm:mb-2">{t('howItWorks.step1.title')}</h4>
                      <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                        {t('howItWorks.step1.description')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Step 2: AI Analysis */}
              <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-accent/20 via-accent/10 to-transparent">
                <CardContent className="pt-5 sm:pt-6 pb-5 sm:pb-6">
                  <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-accent/20 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 sm:w-7 sm:h-7 text-accent-foreground" />
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-bold mb-1.5 sm:mb-2">{t('howItWorks.step2.title')}</h4>
                      <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                        {t('howItWorks.step2.description')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Step 3: Treatment */}
              <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-secondary/10 via-secondary/5 to-transparent">
                <CardContent className="pt-5 sm:pt-6 pb-5 sm:pb-6">
                  <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-secondary/10 flex items-center justify-center">
                      <Leaf className="w-6 h-6 sm:w-7 sm:h-7 text-secondary-foreground" />
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-bold mb-1.5 sm:mb-2">{t('howItWorks.step3.title')}</h4>
                      <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                        {t('howItWorks.step3.description')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-primary/5 border-t mt-auto">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-3">
          {/* Minimal footer - no content needed */}
        </div>
      </footer>

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}

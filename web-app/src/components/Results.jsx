import React from 'react';
import { RotateCcw, Save, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { useToast } from './ui/use-toast';
import { t, zh } from '@/lib/translations';

export default function Results({ image, prediction, onNewImage, onSaveToHistory }) {
  const { toast } = useToast();

  if (!prediction) return null;

  const { disease, confidencePercent, allPredictions, inferenceTime, info } = prediction;

  // Get Chinese disease info
  const diseaseInfo = zh.diseases[disease];

  const handleSave = () => {
    onSaveToHistory();
    toast({
      title: "已保存",
      description: "分析结果已保存到历史记录",
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5 sm:space-y-6 animate-fade-in">
      {/* Header with Inference Time */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">{t('results.title')}</h2>
        <Badge variant="secondary" className="gap-1.5 text-xs sm:text-sm px-3 py-1.5 shadow-sm">
          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="font-bold">{inferenceTime}</span>{t('results.ms')}
        </Badge>
      </div>

      {/* Image Preview */}
      <Card className="overflow-hidden border-0 shadow-md">
        <img
          src={image}
          alt="Analyzed leaf"
          className="w-full h-auto object-contain max-h-56 sm:max-h-80 md:max-h-96"
        />
      </Card>

      {/* Main Diagnosis Card */}
      <Card className="relative overflow-hidden border-0 shadow-lg">
        {/* Gradient Background Overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            background: `linear-gradient(135deg, ${info.color} 0%, transparent 100%)`
          }}
        />

        <CardHeader className="relative pb-4 sm:pb-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between mb-4">
            <div
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold"
              style={{
                backgroundColor: info.color + '20',
                color: info.color
              }}
            >
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: info.color }} />
              检测完成
            </div>
            <div
              className="text-2xl sm:text-3xl md:text-4xl font-bold"
              style={{ color: info.color }}
            >
              {confidencePercent}%
            </div>
          </div>

          {/* Disease Name with Icon */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-3xl flex items-center justify-center text-3xl sm:text-4xl md:text-5xl shadow-lg"
              style={{
                backgroundColor: info.color + '15',
                border: `3px solid ${info.color}30`
              }}
            >
              {info.icon}
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2" style={{ color: info.color }}>
                {diseaseInfo.name}
              </CardTitle>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground font-medium">
                {t('results.confidence')}{confidencePercent}%
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-5 sm:space-y-6">
          {/* Description */}
          <div className="bg-muted/30 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-1 h-5 rounded-full"
                style={{ backgroundColor: info.color }}
              />
              <h4 className="text-base sm:text-lg md:text-xl font-bold">{t('results.description')}</h4>
            </div>
            <p className="text-sm sm:text-base md:text-lg text-foreground/80 leading-relaxed">
              {diseaseInfo.description}
            </p>
          </div>

          {/* Treatment */}
          <div className="bg-primary/5 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-1 h-5 rounded-full bg-primary"
              />
              <h4 className="text-base sm:text-lg md:text-xl font-bold flex items-center gap-2">
                {t('results.treatment')}
              </h4>
            </div>
            <p className="text-sm sm:text-base md:text-lg text-foreground/80 leading-relaxed">
              {diseaseInfo.treatment}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* All Predictions */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold">{t('results.allPredictions')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-5">
          {allPredictions.map((pred, index) => {
            const predDiseaseInfo = zh.diseases[pred.disease];
            const isTopPrediction = index === 0;
            return (
              <div
                key={index}
                className={`rounded-xl p-3 sm:p-4 transition-all ${
                  isTopPrediction ? 'bg-primary/5' : 'bg-muted/30'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-base sm:text-lg shadow-sm"
                      style={{
                        backgroundColor: pred.info.color + '20',
                        color: pred.info.color,
                        border: `2px solid ${pred.info.color}30`
                      }}
                    >
                      {pred.info.icon}
                    </div>
                    <span className="text-sm sm:text-base md:text-lg font-bold">{predDiseaseInfo.name}</span>
                  </div>
                  <span
                    className="text-base sm:text-lg md:text-xl font-bold"
                    style={{ color: pred.info.color }}
                  >
                    {(pred.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={pred.confidence * 100}
                  className="h-2.5 sm:h-3"
                  style={{
                    backgroundColor: pred.info.color + '20'
                  }}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleSave}
          variant="outline"
          size="lg"
          className="flex-1 h-12 sm:h-14 text-base sm:text-lg font-semibold shadow-sm hover:shadow-md transition-shadow"
        >
          <Save className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
          {t('results.saveToHistory')}
        </Button>
        <Button
          onClick={onNewImage}
          size="lg"
          className="flex-1 h-12 sm:h-14 text-base sm:text-lg font-semibold shadow-md hover:shadow-lg transition-shadow"
        >
          <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
          {t('results.analyzeAnother')}
        </Button>
      </div>
    </div>
  );
}

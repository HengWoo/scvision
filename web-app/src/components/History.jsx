import React from 'react';
import { History as HistoryIcon, Trash2, Image as ImageIcon, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { t, zh } from '@/lib/translations';

export default function History({ history, onClearHistory, onSelectImage }) {
  if (!history || history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-16 space-y-4">
        <HistoryIcon className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground/50" />
        <div className="text-center px-4">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold">{t('history.empty')}</h3>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1">
            {t('history.emptyHint')}
          </p>
        </div>
      </div>
    );
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleClear = () => {
    if (confirm(t('history.clearConfirm'))) {
      onClearHistory();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2">
          <HistoryIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          {t('history.title')}
        </h2>
        <Button variant="destructive" size="sm" onClick={handleClear} className="text-xs sm:text-sm">
          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">{t('history.clear')}</span>
          <span className="sm:hidden">清空</span>
        </Button>
      </div>

      <Separator />

      {/* History Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {history.map((item) => {
          const diseaseInfo = zh.diseases[item.disease];
          const DISEASE_INFO = {
            Healthy: { color: '#10b981', icon: '✓' },
            Mosaic: { color: '#f59e0b', icon: '⚠' },
            Redrot: { color: '#ef4444', icon: '✗' },
            Rust: { color: '#d97706', icon: '!' },
            Yellow: { color: '#eab308', icon: '⚠' },
          };
          const info = DISEASE_INFO[item.disease];

          return (
            <Card
              key={item.id}
              className="cursor-pointer hover:shadow-lg transition-shadow animate-fade-in"
              onClick={() => onSelectImage(item)}
            >
              <CardHeader className="p-0">
                <div className="relative">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={diseaseInfo.name}
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-40 bg-muted flex items-center justify-center rounded-t-lg">
                      <ImageIcon className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                  <Badge
                    className="absolute top-2 right-2"
                    style={{
                      backgroundColor: info.color,
                      color: 'white',
                    }}
                  >
                    {diseaseInfo.name}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                    style={{
                      backgroundColor: info.color + '20',
                      color: info.color,
                    }}
                  >
                    {info.icon}
                  </span>
                  <span className="font-bold text-lg">{item.confidencePercent}%</span>
                </div>
                <div className="flex items-center text-xs text-muted-foreground gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTimestamp(item.timestamp)}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* History Count */}
      <div className="text-center text-xs sm:text-sm md:text-base text-muted-foreground">
        共 {history.length} 条记录
      </div>
    </div>
  );
}

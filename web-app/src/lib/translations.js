// 中文翻译 (Simplified Chinese)
export const zh = {
  // App title and tagline
  app: {
    title: '甘蔗病害检测器',
    tagline: 'AI智能叶片病害分类 • 98.4% 准确率',
  },

  // Loading states
  loading: {
    model: '加载AI模型中...',
    modelHint: '首次加载可能需要一点时间',
    analyzing: '分析图像中...',
    analyzingHint: '正在运行AI推理',
  },

  // Errors
  error: {
    modelFailed: '模型加载失败',
    modelHint: '请确保 best.onnx 文件在 public/ 文件夹中。',
    retry: '🔄 重试',
    cameraFailed: '无法访问相机。请改为上传图像。',
  },

  // Image upload
  upload: {
    title: '上传甘蔗叶片图像',
    subtitle: '拍照或上传现有图像',
    useCamera: '📸 使用相机',
    uploadImage: '📁 上传图像',
    capture: '📸 拍摄照片',
    cancel: '✕ 取消',
    tips: {
      title: '最佳拍摄效果提示：',
      lighting: '使用良好光线',
      fullLeaf: '拍摄整片叶子',
      avoidShadow: '避免阴影和模糊',
      focusDisease: '如果可见，聚焦病变区域',
    },
  },

  // Results
  results: {
    title: '分析结果',
    confidence: '置信度：',
    description: '描述',
    treatment: '💊 治疗方案',
    allPredictions: '所有预测：',
    analyzeAnother: '🔄 分析其他图像',
    saveToHistory: '💾 保存到历史记录',
    inferenceTime: '推理时间：',
    ms: '毫秒',
  },

  // How it works section
  howItWorks: {
    title: '工作原理',
    step1: {
      title: '📸 拍摄',
      description: '拍摄甘蔗叶片照片或上传图像',
    },
    step2: {
      title: '🤖 分析',
      description: '我们的AI模型在毫秒内分析叶片',
    },
    step3: {
      title: '💊 治疗',
      description: '获取诊断和治疗建议',
    },
  },

  // Footer
  footer: {
    stats: '由 YOLO11n-cls 提供支持 • 训练于 2,569 张图像 • 准确率 98.44%',
    disclaimer: '注意：此工具仅提供指导。请咨询农业专家进行治疗。',
  },

  // Tabs
  tabs: {
    analyze: '分析',
    history: '历史记录',
  },

  // History
  history: {
    title: '分析历史记录',
    empty: '暂无历史记录',
    emptyHint: '开始分析图像以查看您的历史记录',
    clear: '清除历史记录',
    clearConfirm: '确定要清除所有历史记录吗？',
    timestamp: '时间：',
    viewDetails: '查看详情',
  },

  // Disease information
  diseases: {
    Healthy: {
      name: '健康',
      description: '叶片看起来健康，没有明显的病害症状。',
      treatment: '继续定期作物维护和监测。',
    },
    Mosaic: {
      name: '花叶病',
      description: '花叶病会导致叶片发黄和生长受阻。',
      treatment: '移除感染植株，控制蚜虫媒介，使用抗病品种。',
    },
    Redrot: {
      name: '红腐病',
      description: '红腐病导致叶片变红和茎杆腐烂。',
      treatment: '改善排水，使用杀菌剂，移除感染茎杆，实行轮作。',
    },
    Rust: {
      name: '锈病',
      description: '锈病在叶片上形成橙褐色脓疱。',
      treatment: '施用杀菌剂，移除感染叶片，确保适当间距。',
    },
    Yellow: {
      name: '黄叶病',
      description: '黄叶病导致叶片变黄和枯死。',
      treatment: '控制蚜虫媒介，使用抗病品种，移除感染植株。',
    },
  },
};

// Helper function to get translation
export const t = (key) => {
  const keys = key.split('.');
  let value = zh;

  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
  }

  return value;
};

// Export disease names mapping
export const diseaseNames = {
  Healthy: zh.diseases.Healthy.name,
  Mosaic: zh.diseases.Mosaic.name,
  Redrot: zh.diseases.Redrot.name,
  Rust: zh.diseases.Rust.name,
  Yellow: zh.diseases.Yellow.name,
};

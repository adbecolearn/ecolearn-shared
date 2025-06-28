# Shared Libraries - EcoLearn

## 🔧 Komponen Shared untuk Micro Frontend

Folder ini berisi komponen, utilities, dan styles yang dapat digunakan oleh semua micro frontend EcoLearn.

### 📁 Struktur

```
shared/
├── components/              # Reusable UI components
│   ├── common/             # Common components
│   ├── forms/              # Form components
│   ├── navigation/         # Navigation components
│   └── ai/                 # AI-related components
├── utils/                  # Utility functions
│   ├── api/                # API utilities
│   ├── auth/               # Authentication utilities
│   ├── storage/            # Storage utilities
│   └── green/              # Green computing utilities
├── styles/                 # Global styles
│   ├── base/               # Base styles
│   ├── components/         # Component styles
│   └── themes/             # Theme configurations
└── constants/              # Constants & configurations
    ├── api.js              # API endpoints
    ├── config.js           # App configuration
    └── green-metrics.js    # Green computing metrics
```

### 🌱 Green Computing Features

- **Minimal Bundle Size**: Setiap komponen < 5KB
- **Tree Shaking**: Hanya import yang diperlukan
- **Lazy Loading**: Load komponen saat dibutuhkan
- **Performance Monitoring**: Built-in performance tracking

### 📦 Usage

```javascript
// Import specific components
import { Button } from '../shared/components/common/Button.js';
import { apiCall } from '../shared/utils/api/client.js';
import { trackCarbonFootprint } from '../shared/utils/green/monitor.js';

// Use in micro frontend
const button = new Button({
  text: 'Click me',
  onClick: () => trackCarbonFootprint('button_click')
});
```

### 🎯 Design Principles

1. **Modularity**: Setiap komponen independent
2. **Reusability**: Dapat digunakan di semua micro frontend
3. **Performance**: Optimized untuk speed dan efficiency
4. **Green**: Minimal resource usage
5. **Accessibility**: WCAG 2.1 compliant

# 🚀 GitHub Setup Instructions

## 1. Create GitHub Organization & Repository

### Create Organization (if not exists):
1. Go to: https://github.com/settings/organizations
2. Click "New organization"
3. Organization name: `adbecolearn`
4. Plan: Free

### Create Repository:
1. Go to: https://github.com/organizations/adbecolearn/repositories/new
2. Repository name: `ecolearn-shared`
3. Description: `🔧 EcoLearn Shared Libraries - Green computing utilities untuk semua micro frontend`
4. Visibility: **Public** (untuk GitHub Pages)
5. **JANGAN** initialize dengan README, .gitignore, atau license

## 2. Enable GitHub Pages

After repository is created:
1. Go to repository Settings
2. Scroll to "Pages" section  
3. Source: "Deploy from a branch"
4. Branch: `main`
5. Folder: `/ (root)`
6. Save

## 3. Push Code

Run these commands in terminal:

```bash
# Push to GitHub
git push -u origin main

# Verify push
git remote -v
```

## 4. Test GitHub Pages

After push, test at:
- Repository: https://github.com/adbecolearn/ecolearn-shared
- GitHub Pages: https://adbecolearn.github.io/ecolearn-shared/
- Test Page: https://adbecolearn.github.io/ecolearn-shared/test.html

## 5. Update URLs in Code

After GitHub Pages is live, update these files:
- Update CDN URLs in documentation
- Test import URLs in micro frontends

## Expected Structure:

```
https://adbecolearn.github.io/ecolearn-shared/
├── index.js                    # Main entry point
├── components/
│   └── common/EcoButton.js     # Button component
├── utils/
│   ├── auth/AuthUtils.js       # Auth utilities
│   └── green/CarbonTracker.js  # Carbon tracking
├── services/
│   └── ApiService.js           # API service
├── styles/
│   ├── base/variables.css      # CSS variables
│   └── components/button.css   # Button styles
├── config/
│   └── Config.js               # Configuration
└── test.html                   # Test page
```

## Usage in Micro Frontends:

```javascript
// Import from GitHub Pages CDN
import { 
    initEcoLearn, 
    EcoButton, 
    carbonTracker 
} from 'https://adbecolearn.github.io/ecolearn-shared/index.js';
```

## Next Steps:

After GitHub setup complete:
1. ✅ Test GitHub Pages deployment
2. ✅ Verify all imports work
3. 🚀 Create first micro frontend (ecolearn-auth)

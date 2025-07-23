# Student Grade Predictor - Frontend Components

## 🎯 Mô tả
Đây là tập hợp các component đã được căn chỉnh và tối ưu hóa cho hệ thống dự đoán điểm số sinh viên.

## 📱 Components đã được cải thiện

### 1. AdminDashboardNew
- **Vị trí**: `/src/pages/admin/AdminDashboardNew.tsx`
- **Mô tả**: Dashboard admin với layout responsive và hiện đại
- **Tính năng**:
  - Sidebar cố định với menu điều hướng
  - Stats cards hiển thị số liệu tổng quan
  - Performance statistics với biểu đồ tròn
  - Outstanding students list
  - Access time tracking
  - Score distribution với dropdown filters

### 2. SubjectTableImproved  
- **Vị trí**: `/src/components/detailscore/SubjectTableImproved.tsx`
- **Mô tả**: Bảng hiển thị môn học với thiết kế đẹp mắt
- **Tính năng**:
  - Gradient header
  - Icons và colors cho điểm số
  - Hover effects
  - Responsive design
  - Empty state đẹp mắt

### 3. DemoPage
- **Vị trí**: `/src/pages/DemoPage.tsx`
- **Mô tả**: Trang demo tổng hợp tất cả components
- **Tính năng**:
  - Full-screen admin dashboard
  - Subject table section
  - Features showcase
  - Professional footer

## 🚀 Cách sử dụng

### Chạy ứng dụng
```bash
cd frontend
npm install
npm run dev
```

### Truy cập các trang
- **Demo page**: http://localhost:5173/demo
- **Admin Dashboard mới**: http://localhost:5173/admin-new
- **Admin Dashboard cũ**: http://localhost:5173/admin

## 🎨 Thiết kế

### Color Palette
- **Primary**: Indigo (600, 500, 400)
- **Secondary**: Purple (600, 500, 400)
- **Accent**: Red (400) cho logo
- **Success**: Green (600, 500, 100)
- **Warning**: Yellow (600, 500, 100)
- **Danger**: Red (600, 500, 100)

### Typography
- **Headers**: Font-bold, text-gray-900
- **Body**: Font-medium/normal, text-gray-700
- **Secondary**: Font-normal, text-gray-500

### Layout
- **Desktop**: Grid responsive với breakpoints
- **Mobile**: Stack layout với full-width components
- **Spacing**: Consistent padding và margins

## 📦 Component Structure

```
frontend/src/
├── components/
│   ├── common/
│   │   └── StatCard.tsx          # Reusable stat card
│   ├── detailscore/
│   │   ├── SubjectTable.tsx      # Original table
│   │   └── SubjectTableImproved.tsx # Improved table
│   └── icons/
│       ├── ChevronDown.tsx
│       └── LucideChevronDown.tsx
├── pages/
│   ├── admin/
│   │   ├── AdminDashboardNew.tsx # New dashboard
│   │   ├── admindashboard.tsx    # Original dashboard
│   │   └── [other components]
│   └── DemoPage.tsx              # Demo page
└── assets/
    └── admin/
        └── images.ts             # SVG assets
```

## 🔧 Customization

### Thay đổi colors
Chỉnh sửa trong tailwind.config.js hoặc sử dụng CSS custom properties.

### Thêm animations
Sử dụng Tailwind transitions và transforms có sẵn.

### Responsive breakpoints
- `sm`: 640px+
- `md`: 768px+
- `lg`: 1024px+
- `xl`: 1280px+

## 🌟 Tính năng nổi bật

### ✅ Responsive Design
- Tối ưu cho mọi kích thước màn hình
- Touch-friendly trên mobile

### ✅ Performance
- Lazy loading cho images
- Optimized re-renders
- Minimal bundle size

### ✅ Accessibility
- ARIA labels
- Keyboard navigation
- Screen reader friendly

### ✅ User Experience
- Smooth transitions
- Loading states
- Error boundaries
- Intuitive navigation

## 🔮 Roadmap

- [ ] Dark mode support
- [ ] Animations với Framer Motion
- [ ] Charts với Recharts/Chart.js
- [ ] Data export functionality
- [ ] Real-time updates với WebSocket

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License

MIT License - xem file LICENSE để biết thêm chi tiết.

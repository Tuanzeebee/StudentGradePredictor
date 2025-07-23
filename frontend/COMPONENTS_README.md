# Student Grade Prediction System - Frontend Components

## Mô tả
Dự án này bao gồm các component React cho hệ thống dự đoán điểm số học sinh, bao gồm dashboard admin và bảng điểm chi tiết.

## Cấu trúc Components

### 1. Admin Dashboard (`/src/pages/admin/`)
- **AdminDashboard**: Component chính cho dashboard quản trị
- **DashboardStatsSection**: Sidebar navigation với menu
- **PerformanceRatingSection**: Hiển thị thống kê hiệu suất học tập
- **AccessTimeSection**: Thống kê thời gian truy cập hệ thống
- **TopCoursesSection**: Danh sách học sinh xuất sắc

### 2. Subject Table (`/src/components/detailscore/`)
- **SubjectTable**: Bảng hiển thị chi tiết điểm dự đoán các môn học

### 3. Icons (`/src/components/icons/`)
- **ChevronDown**: Icon mũi tên xuống
- **LucideChevronDown**: Icon mũi tên xuống với style khác

### 4. Assets (`/src/assets/admin/`)
- **images.ts**: Tập hợp các hình ảnh và icon SVG dạng base64

## Cách sử dụng

### Khởi chạy ứng dụng
```bash
npm install
npm run dev
```

### Các route có sẵn:
- `/` - Trang chủ
- `/admin` - Dashboard admin
- `/demo` - Trang demo tích hợp tất cả components
- `/auth/login` - Đăng nhập
- `/auth/register` - Đăng ký
- Các route khác...

### Demo page
Truy cập `/demo` để xem tất cả components hoạt động cùng nhau:
- Dashboard admin với thống kê đầy đủ
- Bảng điểm dự đoán với dữ liệu mẫu
- Giao diện responsive và thân thiện

## Tính năng chính

### Admin Dashboard
- Thống kê tổng quan (tổng số sinh viên, giảng viên, học sinh có nguy cơ)
- Biểu đồ phân phối điểm số
- Thống kê thời gian truy cập hệ thống
- Danh sách học sinh xuất sắc
- Navigation sidebar với các chức năng quản lý

### Subject Table
- Hiển thị các môn học chưa có điểm thực tế
- Dự đoán điểm số cho từng môn
- Nút "Learn" để chuyển đến trang học tập
- Giao diện bảng responsive

## Công nghệ sử dụng
- React 19.1.0
- React Router DOM 7.6.3
- TypeScript 5.8.3
- Tailwind CSS 4.1.11
- Vite 7.0.0

## Lưu ý
- Tất cả hình ảnh đều sử dụng placeholder SVG/base64 để tránh lỗi missing files
- Components được thiết kế responsive và có accessibility support
- Dữ liệu mẫu được cung cấp để demo functionality
- Icons và assets được tự generate để đảm bảo ứng dụng chạy được ngay lập tức

# DevOps Learning Hub - Kiến trúc hệ thống

## 1. Tổng quan

DevOps Learning Hub là một ứng dụng học tập trực tuyến chia thành hai phần:
- Frontend: website React/Vite cho người học tương tác.
- Backend: API Node.js/Express cung cấp dữ liệu, xác thực và xử lý logic.

Ứng dụng hỗ trợ:
- Roadmap học DevOps
- Bài học Markdown
- Quiz và đánh giá
- Đăng ký / Đăng nhập
- Google Login
- Bookmark, note, comment, progress
- Admin quản lý nội dung

## 2. Kiến trúc hệ thống

### Frontend
- React 19
- Vite
- TypeScript
- Zustand cho state management
- React Router DOM
- React Hook Form
- React Markdown + remark-gfm + rehype-highlight
- Radix UI, Sonner, Framer Motion

### Backend
- Node.js với Express
- TypeScript
- Prisma ORM
- PostgreSQL làm database chính
- Redis (cache/session/token) nếu cần
- JWT cho xác thực
- Nodemailer cho email OTP/forgot password
- Google Auth (Google OAuth / ID Token)
- CORS + Helmet + rate-limit cho bảo mật

### Deployment
- Frontend deploy trên Vercel
- Backend deploy trên Render (hoặc Vercel API function)
- Database PostgreSQL external (Neon, Supabase, Render Postgres...)
- Redis có thể chạy local trong docker compose hoặc dịch vụ external

## 3. Công nghệ chính

| Layer | Công nghệ | Mô tả |
|---|---|---|
| Frontend | React, Vite, TypeScript | UI và SPA client-side |
| State | Zustand | Quản lý trạng thái ứng dụng |
| Routing | React Router DOM | Định tuyến trang |
| UI | Radix UI, Tailwind CSS (cùng plugin Vite) | Component UI, styling |
| Rich Content | React Markdown, remark-gfm, rehype-highlight | Hiển thị nội dung Markdown |
| Backend | Node.js, Express, TypeScript | API REST, middleware |
| ORM | Prisma | Quản lý schema & truy vấn database |
| Database | PostgreSQL | Lưu dữ liệu người dùng, quiz, progress, comment |
| Cache | Redis | Hỗ trợ cache, session hoặc token |
| Auth | JWT, Google OAuth | Xác thực và refresh token |
| Email | Nodemailer | Gửi OTP / xác nhận email |
| Security | helmet, cors, express-rate-limit | Bảo mật header, CORS, giới hạn request |

## 4. Chức năng chính

### Người dùng (User)
- Đăng ký, đăng nhập
- Đăng nhập bằng Google
- Quên mật khẩu / xác thực email
- Xem roadmap và bài học
- Làm quiz
- Lưu tiến trình học
- Bookmark bài học
- Ghi chú cá nhân
- Bình luận nội dung
- Xem dashboard và lịch sử học

### Khách (Guest)
- Xem roadmap
- Xem nội dung học
- Thực hiện quiz
- Xem kết quả cơ bản

### Admin
- Quản lý user
- Quản lý nội dung roadmap / bài học
- Quản lý quiz
- Thống kê hoạt động

## 5. Dữ liệu và luồng chính

### Dữ liệu backend
- `User`
- `Quiz`
- `Progress`
- `Bookmark`
- `Note`
- `Comment`
- `Lesson` / `Content`
- `Admin`

### Luồng request
1. Frontend gọi API qua `api/<endpoint>` hoặc `VITE_API_URL`.
2. Backend kiểm tra CORS, xác thực JWT.
3. Backend truy cập PostgreSQL qua Prisma.
4. Backend trả dữ liệu JSON cho frontend.
5. Frontend cập nhật state và hiển thị.

## 6. Các file / thư mục quan trọng

### Root
- `docker-compose.yml`: cấu hình local PostgreSQL và Redis.
- `DEPLOYMENT.md`: hướng dẫn deploy.
- `vercel.json`: cấu hình deploy frontend.

### Backend
- `backend/package.json`: script và dependency backend.
- `backend/vercel.json`: cấu hình serverless backend.
- `backend/api/index.ts`: entry point Vercel API.
- `backend/src/app.ts`: cấu hình Express.
- `backend/src/config/index.ts`: cấu hình env.
- `backend/src/routes/`: định nghĩa route API.
- `backend/prisma/schema.prisma`: schema DB.
- `backend/prisma/seed.ts`: dữ liệu seed.

### Frontend
- `frontend/package.json`: script và dependency frontend.
- `frontend/vite.config.ts`: cấu hình Vite và proxy local.
- `frontend/tsconfig.json`: cấu hình TypeScript.
- `frontend/src/lib/api.ts`: client API chung.
- `frontend/src/stores/`: store Zustand.
- `frontend/src/pages/`: các trang.
- `frontend/src/components/`: component UI.

## 7. Phát triển local

- Dùng `npm run dev` ở root để chạy frontend + backend cùng lúc.
- Docker compose local chạy PostgreSQL + Redis.
- Chạy `npm install --prefix backend` và `npm install --prefix frontend` trước.
- Sử dụng `npm run db:push` và `npm run db:seed` để tạo schema và dữ liệu.

## 8. Lưu ý deployment
- Frontend cần `VITE_API_URL` trỏ đến backend API.
- Backend cần `FRONTEND_URL` để cấu hình CORS.
- Không commit `.env` chứa `DATABASE_URL`, `JWT_SECRET`, `SMTP_PASS`, `GOOGLE_CLIENT_SECRET`.
- Với Vercel, frontend deploy từ root và backend deploy từ `backend`.

## 9. Gợi ý nâng cấp tiếp theo
- Tách backend thành microservices nếu cần mở rộng.
- Sử dụng Redis cache cho quiz / nội dung.
- Thêm monitoring, logging, và tracing.
- Thêm role-based access control (RBAC) cho admin.
- Xây dựng CI/CD tự động deploy trên push.

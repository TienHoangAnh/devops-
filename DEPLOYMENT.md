# Hướng dẫn deploy DevOps Learning Hub lên Vercel

Ứng dụng gồm hai phần độc lập nên cần deploy thành **hai Vercel Project** từ cùng một Git repository:

| Project | Thư mục gốc trên Vercel | Vai trò |
|---|---|---|
| Frontend | Repository root | Website React/Vite mà người dùng truy cập |
| Backend | `backend` | REST API Express chạy dưới dạng Vercel Serverless Function |

Bạn cũng cần một PostgreSQL managed, ví dụ Neon hoặc Supabase. Docker Compose chỉ dùng cho máy local, không dùng được trên Vercel.

## Chuẩn bị trước khi deploy

1. Push toàn bộ source code lên GitHub/GitLab/Bitbucket.
2. Tạo một PostgreSQL database trên Neon hoặc Supabase.
3. Sao chép chuỗi kết nối database (connection string), thường có dạng:

```text
postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require
```

4. Tạo hai JWT secret khác nhau. Có thể tạo bằng PowerShell:

```powershell
[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 }))
```

Không dùng các giá trị mẫu trong `.env.example` cho môi trường production.

## Phần 1: Deploy backend API

### 1. Tạo Vercel Project cho backend

1. Vào [Vercel Dashboard](https://vercel.com/dashboard) và chọn **Add New → Project**.
2. Import repository của dự án.
3. Trong **Configure Project**, chọn **Root Directory → Edit** rồi chọn `backend`.
4. Giữ framework ở chế độ tự nhận diện. File `backend/vercel.json` và `backend/api/index.ts` đã cấu hình serverless entry point.
5. Chưa cần bấm Deploy nếu chưa nhập Environment Variables.

### 2. Khai báo biến môi trường backend

Vào **Project Settings → Environment Variables**. Thêm các biến bên dưới cho môi trường **Production**; nên thêm cả **Preview** nếu muốn test preview deployment.

```text
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require
JWT_SECRET=<chuỗi-random-thứ-nhất>
JWT_REFRESH_SECRET=<chuỗi-random-thứ-hai-khác-JWT_SECRET>
FRONTEND_URL=https://<ten-frontend>.vercel.app
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<email-gui-otp>
SMTP_PASS=<gmail-app-password>
EMAIL_FROM=DevOps Learning <email-gui-otp>
GOOGLE_CLIENT_ID=<google-oauth-client-id>
GOOGLE_CLIENT_SECRET=<google-oauth-client-secret>
NODE_ENV=production
```

Giải thích các biến quan trọng:

- `DATABASE_URL`: bắt buộc để lưu user, progress, quiz, bookmark và comment.
- `JWT_SECRET` và `JWT_REFRESH_SECRET`: bắt buộc, phải khác nhau và không được public.
- `FRONTEND_URL`: domain frontend chính xác, dùng để CORS cho phép frontend gọi API.
- `SMTP_*`: cần khi sử dụng đăng ký/OTP/quên mật khẩu. Nếu chưa cấu hình, OTP không gửi được email.
- `GOOGLE_*`: chỉ cần khi bật Google Login.

Sau khi điền biến môi trường, bấm **Deploy**. Sau khi hoàn tất, copy URL backend, ví dụ:

```text
https://devops-learning-api.vercel.app
```

### 3. Tạo schema và dữ liệu database

Trên máy local, tạo file `.env` ở repository root hoặc `backend/.env` với `DATABASE_URL` của production database. Sau đó chạy:

```powershell
npm.cmd install --prefix backend
npm.cmd run db:generate --prefix backend
npm.cmd run db:push --prefix backend
```

`db:push` tạo/cập nhật các bảng Prisma trong database production.

Nếu database đang trống và bạn muốn có roadmap/dữ liệu demo, chạy tiếp:

```powershell
npm.cmd run db:seed --prefix backend
```

> Cảnh báo: script seed hiện xóa dữ liệu hiện có trước khi tạo lại dữ liệu mẫu. Không chạy `db:seed` trên production khi đã có người dùng hoặc dữ liệu thật.

Mở URL sau để kiểm tra backend sau deploy:

```text
https://<ten-backend>.vercel.app/api/health
```

Kết quả hợp lệ có dạng JSON với `status: "ok"`.

## Phần 2: Deploy frontend

### 1. Tạo Vercel Project cho frontend

1. Trong Vercel, chọn **Add New → Project**.
2. Import lại **cùng repository** một lần nữa.
3. Không đổi Root Directory, để ở repository root.
4. File `vercel.json` ở root tự chạy build cho thư mục `frontend` và cấu hình SPA fallback cho React Router.

### 2. Khai báo biến môi trường frontend

Vào **Project Settings → Environment Variables** của frontend và thêm:

```text
VITE_API_URL=https://<ten-backend>.vercel.app/api
VITE_GOOGLE_CLIENT_ID=<google-oauth-client-id>
```

Ví dụ:

```text
VITE_API_URL=https://devops-learning-api.vercel.app/api
```

Lưu ý:

- `VITE_` nghĩa là giá trị này được đóng gói vào mã frontend. Không đặt secret (mật khẩu, JWT secret, DATABASE_URL) dưới dạng `VITE_*`.
- Phải bấm **Redeploy** sau khi thêm hoặc đổi `VITE_API_URL`, vì Vite đọc biến này tại thời điểm build.

Sau deploy, mở domain frontend và thử truy cập `/devops-roadmap`, `/quiz` và đăng nhập.

## Phần 3: Cập nhật CORS sau khi có domain frontend

Khi biết URL frontend cuối cùng, quay về Backend Project:

1. Mở **Settings → Environment Variables**.
2. Đặt `FRONTEND_URL` bằng đúng domain frontend, ví dụ:

```text
FRONTEND_URL=https://devops-learning.vercel.app
```

3. Redeploy backend.

Nếu cần cho phép nhiều domain, phân tách bằng dấu phẩy:

```text
FRONTEND_URL=https://devops-learning.vercel.app,https://preview-domain.vercel.app
```

Không thêm dấu `/` ở cuối URL. Nếu CORS lỗi, kiểm tra domain frontend có khớp chính xác biến này hay không.

## Phần 4: Cấu hình Google Login

1. Vào [Google Cloud Console](https://console.cloud.google.com/).
2. Chọn hoặc tạo project mới.
3. Vào **APIs & Services → Credentials**.
4. Tạo **OAuth client ID** loại **Web application**.
5. Trong **Authorized JavaScript origins**, thêm:

```text
http://localhost:5173
https://<ten-frontend>.vercel.app
```

6. Copy Client ID vào cả `VITE_GOOGLE_CLIENT_ID` (frontend) và `GOOGLE_CLIENT_ID` (backend).
7. Copy Client Secret vào `GOOGLE_CLIENT_SECRET` của backend.

Ứng dụng sử dụng Google Identity Services để gửi ID token về API, nên không cần thêm redirect URI cho luồng đăng nhập hiện tại.

## Phần 5: Cấu hình Gmail SMTP cho OTP

Nếu dùng Gmail để gửi OTP:

1. Bật xác minh 2 bước cho tài khoản Gmail.
2. Tạo **App Password** trong Google Account → Security.
3. Dùng App Password đó làm `SMTP_PASS`, không dùng mật khẩu Gmail thông thường.
4. Đặt `SMTP_USER` là email Gmail và `EMAIL_FROM` là địa chỉ gửi.

Ví dụ:

```text
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=xxxx-xxxx-xxxx-xxxx
EMAIL_FROM=DevOps Learning <your-email@gmail.com>
```

## Kiểm tra sau deploy

- Mở `https://<backend>.vercel.app/api/health`: phải trả JSON `status: ok`.
- Mở frontend: không có trang trắng khi refresh ở các route `/devops-roadmap`, `/learn/...`, `/quiz`.
- Mở DevTools → Network: request API phải đến domain backend, không phải domain frontend `/api`.
- Thử đăng ký/login, lưu progress, bookmark, comment và quiz.
- Nếu dùng Google Login, thử trên domain Vercel, không chỉ localhost.

## Lỗi thường gặp

| Hiện tượng | Nguyên nhân thường gặp | Cách xử lý |
|---|---|---|
| Frontend gọi API bị CORS | `FRONTEND_URL` sai hoặc backend chưa redeploy | Đặt chính xác URL frontend, redeploy backend |
| API lỗi 500 / Prisma | `DATABASE_URL` sai hoặc chưa chạy `db:push` | Kiểm tra URL PostgreSQL và chạy `db:push` |
| Login Google không hoạt động | Thiếu Authorized JavaScript origin hoặc Client ID sai | Thêm domain Vercel vào Google Cloud, kiểm tra hai Client ID giống nhau |
| Không nhận OTP | SMTP chưa có App Password | Cấu hình lại `SMTP_USER`/`SMTP_PASS` |
| Refresh trang React bị 404 | Deploy sai project/config | Frontend phải deploy từ repository root để dùng `vercel.json` |
| Dữ liệu demo biến mất | Chạy `db:seed` | Không chạy seed trên database đã có dữ liệu thật |

## Checklist bảo mật

- Không commit `.env`, password, API key hoặc database URL.
- Dùng JWT secret dài, ngẫu nhiên và khác nhau.
- Không đưa `DATABASE_URL`, `SMTP_PASS`, `GOOGLE_CLIENT_SECRET` vào biến `VITE_*`.
- Đổi hoặc xóa tài khoản demo trong `backend/prisma/seed.ts` trước khi public.
- Sao lưu PostgreSQL trước khi chạy seed hoặc thay đổi schema quan trọng.

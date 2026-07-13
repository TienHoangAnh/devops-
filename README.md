Đây là bản thiết kế hệ thống chi tiết.

1. Mục tiêu hệ thống
Tên đề xuất

DevOps Interactive Roadmap

hoặc

DevOps Learning Hub

Mục tiêu

Xây dựng website học DevOps theo roadmap.

Người dùng có thể

học từng chủ đề
xem lý thuyết
xem hình minh họa
xem ví dụ thực tế
thực hành
làm quiz
theo dõi tiến trình
lưu tiến trình nếu đăng nhập

Đối tượng

Beginner
Intern
Fresher
Junior DevOps
Sinh viên CNTT
2. Chức năng hệ thống
Khách (Guest)

Không cần đăng nhập.

Được phép

✓ Xem roadmap

✓ Đọc toàn bộ lý thuyết

✓ Xem ví dụ

✓ Xem code

✓ Làm quiz

✓ Xem điểm quiz

KHÔNG được

✗ Lưu tiến trình

✗ Đồng bộ nhiều thiết bị

✗ Bình luận

✗ Bookmark

Thành viên

Đăng ký

Đăng nhập

Quên mật khẩu

Được phép

✓ Lưu tiến trình

✓ Đánh dấu hoàn thành

✓ Điểm quiz

✓ Lịch sử học

✓ Bookmark

✓ Gợi ý học tiếp

✓ Dashboard

Admin

Quản lý

User
Roadmap
Quiz
Flashcard
Bài học
Thống kê
3. Quy trình đăng ký
Người dùng

↓

Nhập

Tên
Email
Password

↓

Kiểm tra Email tồn tại?

↓

Không

↓

Sinh OTP

↓

Gửi Gmail

↓

Nhập OTP

↓

Đúng

↓

Tạo tài khoản

↓

Đăng nhập
4. Quy trình Login

Có hai cách

Cách 1

Email

Password

↓

JWT

↓

Login

Cách 2

Google Login

↓

OAuth Google

↓

Lấy Email

↓

Nếu chưa có

↓

Tạo User

↓

Login

5. Kiến trúc hệ thống
                React
                  │
                  │ REST API
                  ▼
          NodeJS (Express)
                  │
      ┌───────────┴────────────┐
      │                        │
 PostgreSQL              Redis Cache
      │
      │
      ▼
 Lesson
 Quiz
 User
 Progress

                  │
                  ▼
        Gmail SMTP / SendGrid

                  │
                  ▼
           Google OAuth
6. Roadmap

Ví dụ

01 Linux

02 Networking

03 Git

04 Docker

05 CI/CD

06 Kubernetes

07 Cloud

08 Terraform

09 Monitoring

10 Security

11 Interview
7. Một chapter

Ví dụ

Docker


bao gồm

Khái niệm

↓

Vì sao cần

↓

Kiến trúc

↓

Workflow

↓

Command

↓

Ví dụ

↓

Practice

↓

Quiz

↓

Tài liệu

↓

Đánh dấu hoàn thành
8. Nội dung bài học

Ví dụ Linux

Linux

Khái niệm

Lịch sử

Phân phối

Ubuntu

CentOS

Debian


Tiếp

Terminal

pwd

ls

mkdir

rm

cp

mv

Ví dụ

mkdir project

cd project

touch app.py

Animation

Command

↓

Terminal chạy

↓

Kết quả hiện
9. Mỗi bài học gồm
Theory

Giải thích

Diagram

Ví dụ

Filesystem

/

├── home

├── etc

├── var

└── usr
Image

Ảnh minh họa

Video

Youtube Embed

Example

Ví dụ

Practice

Bài tập

Ví dụ

Tạo folder

project

logs

backup
Answer

Hiện đáp án

Quiz

10 câu

Random

Summary

Tóm tắt

Cheat Sheet

PDF

10. Quiz

Nhiều loại

Multiple Choice
HTTP port?

80

22

25

53
Drag Drop
Build

↓

Test

↓

Deploy
Match
Git

Docker

Kubernetes

↓

Version Control

Container

Orchestrator
Fill Blank
Docker chạy _______

Container
True False
Docker là Virtual Machine

False
11. Sau Quiz

Hiện

Điểm

8/10


Hiện

Đúng

Sai

Giải thích


Lưu DB nếu Login.

12. Dashboard

Hiển thị

Progress

72%


Chapter

Linux

✔

Networking

✔

Docker

○

Quiz

Linux

9/10

Git

7/10

Streak

7 ngày liên tục

Thời gian học

35 giờ
13. Bookmark

Ví dụ

Docker Compose

☆


Click

★


Lưu

Favorites

14. Search
Docker


Hiện

Docker

Dockerfile

Docker Compose

Docker Network
15. Comment

Đăng nhập

↓

Comment

↓

Reply

↓

Like

16. Dark Mode
🌞

🌙
17. Responsive

Desktop

Tablet

Mobile

18. Database
User
id

name

email

password

googleId

verified

avatar

role

createdAt
OTP
id

email

otp

expiredAt
Roadmap
id

title

order
Lesson
id

roadmapId

title

content

summary
Quiz
id

lessonId

question

type
Answer
id

quizId

answer

correct
Progress
userId

lessonId

completed

updatedAt
QuizResult
userId

lessonId

score

time

date
Bookmark
userId

lessonId
19. API

Authentication

POST /register

POST /verify

POST /login

POST /google

POST /forgot-password

POST /reset-password

GET /me

Roadmap

GET /roadmaps

GET /roadmaps/:id

GET /lessons/:id

Quiz

GET /quiz/:lesson

POST /quiz/submit

Progress

GET /progress

POST /progress

PUT /progress

Bookmark

POST /bookmark

DELETE /bookmark

GET /bookmark
20. Công nghệ đề xuất
Thành phần	Công nghệ
Frontend	React + Vite + TypeScript + Tailwind CSS + React Router + Zustand/Redux Toolkit
Backend	Node.js + Express + TypeScript
Database	PostgreSQL
ORM	Prisma
Authentication	JWT + Google OAuth 2.0
Email xác thực	Nodemailer (Gmail SMTP) hoặc Resend
Cache/OTP	Redis
Lưu trữ media	AWS S3 hoặc Cloudinary
Triển khai	Frontend: Vercel • Backend: Railway/Render hoặc AWS EC2 • Database: Neon PostgreSQL hoặc Supabase PostgreSQL
21. Các tính năng nổi bật để tăng giá trị portfolio

Ngoài các yêu cầu hiện tại, bạn có thể bổ sung:

Roadmap trực quan: hiển thị dạng cây hoặc timeline, mở khóa từng chương khi hoàn thành chương trước (tùy chọn).
Interactive Terminal: mô phỏng terminal Linux để người học gõ lệnh và nhận phản hồi ngay trên web.
Flashcards: ôn tập nhanh các khái niệm và lệnh.
Cheat Sheets: tóm tắt các lệnh, sơ đồ và bảng tra cứu cho từng chủ đề.
Quiz ngẫu nhiên: lấy câu hỏi từ ngân hàng câu hỏi để mỗi lần làm có trải nghiệm khác nhau.
Thống kê học tập: biểu đồ tiến độ, thời gian học, điểm trung bình, số bài đã hoàn thành.
Chứng nhận hoàn thành: cấp chứng chỉ PDF sau khi hoàn thành toàn bộ roadmap và đạt mức điểm tối thiểu.
AI Assistant (giai đoạn sau): giải thích khái niệm, tạo câu hỏi mới hoặc chấm bài thực hành bằng AI.
Kiến trúc tổng thể
                    Internet
                         │
               React + Tailwind (Vercel)
                         │
                    REST API
                         │
         Node.js + Express + Prisma + JWT
          ┌──────────────┼──────────────┐
          │              │              │
     PostgreSQL       Redis        Google OAuth
          │              │
          │         OTP / Session
          │
      Lessons / Quiz / Progress / Users
                         │
                  Email Service
          (SMTP hoặc Resend)
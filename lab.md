Thực hành 1: Làm quen với biến và kiểu dữ liệu
Mục tiêu
Khai báo biến
Làm việc với String, Number, Boolean
Yêu cầu

Tạo các biến:

Server Name
IP Address
Port
Environment (dev, test, prod)
Is Running (True/False)

In ra màn hình:

Server Information

Name : Web01
IP   : 192.168.1.10
Port : 80
Env  : Production
Status : Running
Thực hành 2: Quản lý danh sách Server
Mục tiêu
List
for
Yêu cầu

Cho danh sách

servers = [
    "web01",
    "web02",
    "db01",
    "cache01"
]

In ra

Checking server...

web01
web02
db01
cache01

Done.
Thực hành 3: Dictionary
Mục tiêu

Lưu thông tin server.

Ví dụ

server = {
    "hostname": "web01",
    "ip": "192.168.1.10",
    "os": "Ubuntu",
    "status": "Running"
}

In đẹp toàn bộ thông tin.

Thực hành 4: Hàm
Mục tiêu

Viết hàm

check_server(server_name)

Kết quả

Checking web01...

Server web01 is running.

Gọi hàm với nhiều server khác nhau.

Thực hành 5: Đọc file
Mục tiêu

Đọc file

servers.txt

Ví dụ

web01
web02
db01
cache01

Python đọc từng dòng

In

Found Server

web01

Found Server

web02

...
Thực hành 6: Ghi file

Tạo file

report.txt

Ghi nội dung

Backup Completed

Time:
2026-06-30

Status:
Success
Thực hành 7: Sao lưu file
Mục tiêu

Sử dụng

shutil

Cho

config/

    nginx.conf

Copy sang

backup/

    nginx.conf
Thực hành 8: Tạo thư mục Backup theo ngày

Sử dụng

datetime

Tự tạo

backup/

    2026-06-30/

    2026-07-01/

    ...
Thực hành 9: Quản lý File Log

Thư mục

logs/

app.log

system.log

nginx.log

Python

đếm số file
in tên file
kích thước file
Thực hành 10: Exception

Cho người dùng nhập tên file

Ví dụ

config.txt

Nếu file không tồn tại

Không để chương trình lỗi

Hiển thị

File not found.
Thực hành 11: Đọc Log

Cho file

server.log
INFO Login

ERROR Database

INFO Logout

ERROR Timeout

WARNING Disk

Yêu cầu

Đếm

INFO : 2

ERROR : 2

WARNING : 1
Thực hành 12: Quản lý Inventory

Tạo

inventory.txt
web01

web02

db01

db02

Python đọc file

Tạo Dictionary

{
    "web01":"online",

    "web02":"online",

    "db01":"online",

    "db02":"online"
}

In kết quả.

Thực hành 13: Mini Project - Backup Config
Cấu trúc
project/

│

├── config/

│      nginx.conf

│      app.conf

│

├── backup/

│

└── backup.py

Yêu cầu

Chạy

python backup.py

Python sẽ

tạo thư mục theo ngày
copy toàn bộ file config
ghi log
hiển thị số file đã backup

Ví dụ

Backup Started...

Creating Folder...

Copy nginx.conf

Copy app.conf

Backup Success!

Total Files : 2
Thực hành 14: Mini Project - Log Analyzer

Cho

access.log

Python sẽ

đọc file
đếm INFO
đếm ERROR
đếm WARNING
ghi báo cáo

Ví dụ

========= REPORT =========

INFO : 150

WARNING : 12

ERROR : 5

==========================
Thực hành 15: Mini Project - DevOps Utility

Tạo một chương trình menu:

========= DevOps Utility =========

1. List Files

2. Backup Config

3. Read Log

4. Show Current Time

5. Exit

Chọn từng chức năng để thực hiện các thao tác tương ứng:

List Files: Liệt kê các file trong thư mục hiện tại (os.listdir()).
Backup Config: Sao chép file cấu hình sang thư mục backup/ (shutil.copy()).
Read Log: Đọc file log và thống kê số lượng INFO, WARNING, ERROR.
Show Current Time: Hiển thị thời gian hiện tại (datetime.now()).
Exit: Kết thúc chương trình.


Lộ trình ôn luyện đề xuất (2 giờ)
Thời gian	Nội dung
20 phút	Biến, kiểu dữ liệu, List, Dictionary (Bài 1–3)
20 phút	Hàm và vòng lặp (Bài 4)
30 phút	Đọc/Ghi file (Bài 5–6)
20 phút	os, shutil, datetime (Bài 7–9)
15 phút	Exception (Bài 10)
15 phút	Log Analyzer (Bài 11)
30 phút	Mini Project Backup Config hoặc DevOps Utility (Bài 13 hoặc 15)
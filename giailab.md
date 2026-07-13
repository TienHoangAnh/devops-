# Thực hành 1: Làm quen với biến và kiểu dữ liệu
# Mục tiêu
# Khai báo biến
# Làm việc với String, Number, Boolean
# Yêu cầu

# Tạo các biến:

# Server Name
# IP Address
# Port
# Environment (dev, test, prod)
# Is Running (True/False)

# In ra màn hình:

# Server Information

# Name : Web01
# IP   : 192.168.1.10
# Port : 80
# Env  : Production
# Status : Running

name = "Web01"
ip = "192.168.1.1"
port = 8080
env = "Production"
# status = "Running"
status = True

print("Server Information")
print("Server Name: ", name)
print("Server IP: ", ip)
print("Server Port: ", port)
print("Env: ", env)
print("Server Status: ", status if status else "Stopped")


# Thực hành 2: Quản lý danh sách Server
# Mục tiêu
# List
# for
# Yêu cầu

# Cho danh sách

# servers = [
#     "web01",
#     "web02",
#     "db01",
#     "cache01"
# ]

# In ra

# Checking server...

# web01
# web02
# db01
# cache01

# Done.

servers = [
    "web01",
    "web02",
    "db01",
    "cache01"
]

print("Checking server...")
# print(servers[0:4])

for server in servers:
    print(f"{server}")

print("Done")

# Thực hành 3: Dictionary
# Mục tiêu

# Lưu thông tin server.

# Ví dụ

# server = {
#     "hostname": "web01",
#     "ip": "192.168.1.10",
#     "os": "Ubuntu",
#     "status": "Running"
# }

# In đẹp toàn bộ thông tin.

server = {
    "hostname": "web01",
    "ip": "192.168.1.10",
    "os": "Ubuntu",
    "status": "Running"
}

print("Server Information")
print("Hostname: ", server["hostname"]) 
print("IP Address: ", server["ip"])
print("Operating System: ", server["os"])
print("Status: ", server["status"])


# Thực hành 4: Hàm
# Mục tiêu

# Viết hàm

# check_server(server_name)

# Kết quả

# Checking web01...

# Server web01 is running.

# Gọi hàm với nhiều server khác nhau.

server_name = ["web01", "web02", "db01", "cache01"]

def check_server(name):
    print("Checking", name)
    print(name, "is running" if name in server_name else "is stopped / not in the list server_name")
    print()

check_server("web01")
check_server("web02")
check_server("db01")
check_server("cache01")
check_server("cdbakam")


# Thực hành 4: Hàm
# Mục tiêu

# Viết hàm

# check_server(server_name)

# Kết quả

# Checking web01...

# Server web01 is running.

# Gọi hàm với nhiều server khác nhau.


# phân tích cách làm:

# Mở file

# ↓

# Đọc nội dung

# ↓

# Lặp từng dòng

# ↓

# In với strip() bỏ khoảng trắng đầu cuối


with open("cv_nguyenvantien.txt", "r") as file:
    for line in file:
        print(line.strip())


# Thực hành 6: Ghi file

# Tạo file

# report.txt

# Ghi nội dung

# Backup Completed

# Time:
# 2026-06-30

# Status:
# Success

# phân tích cách làm:

# Open

# ↓

# Write

# ↓

# Close

import datetime

with open("report.txt", "w") as file:
    file.write("Backup Completed\n")
    file.write("Time: " + datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S") + "\n")
    file.write("Status: Success\n")
    print("Updated and saved to report.txt")

with open("report.txt", "r") as file:
    for line in file:
        print(line.strip())


# Thực hành 7: Sao lưu file
# Mục tiêu

# Sử dụng

# shutil

# Cho

# config/

#     nginx.conf

# Copy sang

# backup/

#     nginx.conf

# Phân tích

# Python có sẵn thư viện

# import shutil

# để copy file.


import shutil

shutil.copy("config/test.txt", "backup/test.txt")

# Nếu muốn sửa nội dung file backup/test.txt, mở file đó và ghi nội dung mới vào. Dưới đây là ví dụ:
# with open("backup/test.txt", "r") as file:
#     for line in file:
#         print(line.strip())
#         with open("backup/test.txt", "w") as file_update:
#             file_update.write("File Backup\n")

print("Backup completed")


# Thực hành 8: Tạo thư mục Backup theo ngày

# Sử dụng

# datetime

# Tự tạo

# backup/

#     2026-06-30/

#     2026-07-01/

#     ...

# Phân tích

# Lấy ngày hôm nay

# ↓

# Tạo thư mục

from datetime import datetime
import os
today = datetime.now().strftime("%Y-%m-%d")
os.makedirs(f"backup/{today}", exist_ok=True)

print("Folder created: backup/" + today)


# Thực hành 9: Quản lý File Log

# Thư mục

# logs/

# app.log

# system.log

# nginx.log

# Python

# đếm số file
# in tên file
# kích thước file

# os.listdir đọc folder logs, đếm số file, in tên file và kích thước file.

import os

files = os.listdir("backup")

print("Total:", len(files))

for file in files:
    print(file)


# Thực hành 10: Exception

# Cho người dùng nhập tên file

# Ví dụ

# config.txt

# Nếu file không tồn tại

# Không để chương trình lỗi

# Hiển thị

# File not found.

filename = input("Enter file name: ")

try:
    with open(filename, "r") as file:
        print(file.read())

except FileNotFoundError:
    print("File not found.")


# Thực hành 11: Đọc Log

# Cho file

# server.log
# INFO Login

# ERROR Database

# INFO Logout

# ERROR Timeout

# WARNING Disk

# Yêu cầu

# Đếm

# INFO : 2

# ERROR : 2

# WARNING : 1

# Mục tiêu

# Đếm số dòng chứa INFO, WARNING, ERROR.

# Phân tích
# Đọc từng dòng

# ↓

# Kiểm tra từ khóa

# ↓

# Tăng bộ đếm

# ↓

# In kết quả


information_count = 0
error_count = 0
warning_count = 0

with open("server.log", "r") as file:
    for line in file:
        if "INFO" in line: 
            information_count += 1
        elif "ERROR" in line:
            error_count += 1
        elif "WARNING" in line:
            warning_count += 1

print("INFO:", information_count)
print("ERROR:", error_count)
print("WARNING:", warning_count)


# Thực hành 12: Quản lý Inventory

# Tạo

# inventory.txt
# web01

# web02

# db01

# db02

# Python đọc file

# Tạo Dictionary

# {
#     "web01":"online",

#     "web02":"online",

#     "db01":"online",

#     "db02":"online"
# }

# In kết quả.


# 🎯 Mục tiêu
# Đọc file
# List
# Dictionary
# for
# strip()

# 🔍 Phân tích

# Các bước:

# Mở file
#       ↓
# Đọc từng dòng
#       ↓
# Loại bỏ ký tự xuống dòng
#       ↓
# Thêm vào Dictionary
#       ↓
# In kết quả


inventory = {}

with open("inventory.txt", "r") as file:
    for line in file:
        server = line.strip()
        inventory[server] = "online"

print("--------------Inventory----------------")
for server, status in inventory.items():
    print(f"{server} -> {status}")


# Thực hành 13: Mini Project - Backup Config
# Cấu trúc
# project/

# │

# ├── config/

# │      nginx.conf

# │      app.conf

# │

# ├── backup/

# │

# └── backup.py

# Yêu cầu

# Chạy

# python backup.py

# Python sẽ

# tạo thư mục theo ngày
# copy toàn bộ file config
# ghi log
# hiển thị số file đã backup

# Ví dụ

# Backup Started...

# Creating Folder...

# Copy nginx.conf

# Copy app.conf

# Backup Success!

# Total Files : 2

# 🎯 Mục tiêu

# Kết hợp

# os
# shutil
# datetime
# loop
# file

# 🔍 Phân tích

# Quy trình

# Lấy ngày hiện tại
#         ↓
# Tạo thư mục backup
#         ↓
# Lấy danh sách file
#         ↓
# Copy từng file
#         ↓
# Đếm số file
#         ↓
# Hiển thị kết quả

import os
import shutil
from datetime import datetime

today = datetime.now().strftime("%Y-%m-%d")
backup_folder = os.path.join("backup", today)
os.makedirs(backup_folder, exist_ok=True)

count = 0

for filename in os.listdir("config"):
    source = os.path.join("config", filename)
    destination = os.path.join(backup_folder, filename)
    shutil.copy(source, destination)
    print("Copied: ", filename)
    count += 1

print("Backup Success!")
print("Total Files: ", count)



# Thực hành 14: Mini Project - Log Analyzer

# Cho

# access.log

# Python sẽ

# đọc file
# đếm INFO
# đếm ERROR
# đếm WARNING
# ghi báo cáo

# Ví dụ

# ========= REPORT =========

# INFO : 150

# WARNING : 12

# ERROR : 5


# 🔍 Phân tích

# Khởi tạo

# info = 0
# warning = 0
# error = 0

# Đọc từng dòng

# ↓

# Nếu chứa INFO

# ↓

# Tăng biến

information_count = 0
error_count = 0
warning_count = 0

with open("access.log", "r") as file:
    for line in file:
        if "INFO" in line: 
            information_count += 1
        elif "ERROR" in line:
            error_count += 1
        elif "WARNING" in line:
            warning_count += 1

print("INFO:", information_count)
print("ERROR:", error_count)
print("WARNING:", warning_count)

with open("report.txt", "w") as report:
    report.write("----------- REPORT -----------\n")
    report.write(f"INFO    : {information_count}\n")
    report.write(f"WARNING : {warning_count}\n")
    report.write(f"ERROR   : {error_count}\n")

print("Report generated in report.txt")


# Thực hành 15: Mini Project - DevOps Utility

# Tạo một chương trình menu:

# ========= DevOps Utility =========

# 1. List Files

# 2. Backup Config

# 3. Read Log

# 4. Show Current Time

# 5. Exit

# Chọn từng chức năng để thực hiện các thao tác tương ứng:

# List Files: Liệt kê các file trong thư mục hiện tại (os.listdir()).
# Backup Config: Sao chép file cấu hình sang thư mục backup/ (shutil.copy()).
# Read Log: Đọc file log và thống kê số lượng INFO, WARNING, ERROR.
# Show Current Time: Hiển thị thời gian hiện tại (datetime.now()).
# Exit: Kết thúc chương trình.

# 🎯 Mục tiêu

# Kết hợp toàn bộ kiến thức đã học.

# 3. Read Log

# 4. Show Time

# 5. Exit
# 🔍 Phân tích

# Sử dụng

# while True

# ↓

# Hiển thị menu

# ↓

# Người dùng nhập lựa chọn

# ↓

# Thực hiện chức năng

# ↓

# Quay lại menu

import os
import shutil
from datetime import datetime

while True:

    print("\n====== DevOps Utility ======")
    print("1. List Files")
    print("2. Backup Config")
    print("3. Read Log")
    print("4. Show Current Time")
    print("5. Exit")

    choice = input("Select: ")

    if choice == "1":

        print()

        for file in os.listdir("."):

            print(file)

    elif choice == "2":

        folder = datetime.now().strftime("%Y-%m-%d")

        os.makedirs(f"backup/{folder}", exist_ok=True)

        for file in os.listdir("config"):

            shutil.copy(
                os.path.join("config", file),
                os.path.join("backup", folder, file)
            )

        print("Backup Success.")

    elif choice == "3":

        with open("access.log") as file:

            for line in file:

                print(line.strip())

    elif choice == "4":

        print(datetime.now())

    elif choice == "5":

        print("Bye.")

        break

    else:

        print("Invalid choice.")


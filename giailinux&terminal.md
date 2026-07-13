Ôn tập LAB 1
Tạo cây thư mục
mkdir devops-practice
cd devops-practice

mkdir linux docker kubernetes scripts

cd linux

touch server.txt database.txt nginx.conf app.log notes.md
Kiểm tra
pwd

ls

ls -l

ls -la
Kết quả cuối
devops-practice
│
├── docker
├── kubernetes
├── scripts
└── linux
      │
      ├── server.txt
      ├── database.txt
      ├── nginx.conf
      ├── app.log
      └── notes.md
Thử thách thêm (rất nên làm)
Tạo thêm thư mục logs trong linux.
Tạo 3 file: error.log, access.log, system.log.
Dùng cd .. quay về devops-practice.
Dùng cd linux/logs để vào thư mục logs.
Dùng pwd kiểm tra vị trí hiện tại.
Dùng ls -la để xem toàn bộ nội dung.

Nếu bạn muốn học theo đúng lộ trình, mình sẽ tiếp tục hướng dẫn LAB 2 (cp, mv, rm) theo cách chi tiết tương tự, giải thích từng lệnh và lỗi thường gặp.

Ôn tập LAB 2
Tóm tắt các lệnh đã học
Lệnh	Chức năng	Ví dụ
cp nguồn đích	Sao chép file	cp server.txt server_backup.txt
mv nguồn đích	Đổi tên hoặc di chuyển	mv database.txt mysql.txt
rm file	Xóa file	rm server_backup.txt
rm -r thư_mục	Xóa thư mục và nội dung	rm -r docker
rm -rf thư_mục	Xóa cưỡng bức, không hỏi	rm -rf docker
Bài tập mở rộng
Tạo thư mục backup.
Copy mysql.txt vào backup.
Đổi tên file trong backup thành mysql_backup.txt.
Copy toàn bộ thư mục backup thành backup_copy (gợi ý: dùng cp -r).
Xóa backup_copy bằng rm -r.

Hoàn thành các bài này sẽ giúp bạn sử dụng thành thạo cp, mv và rm trong các tình huống thường gặp của DevOps.

LAB 3
Tóm tắt các lệnh đã học
Chức năng	Lệnh
Xem toàn bộ file	cat app.log
Xem 3 dòng đầu	head -n 3 app.log
Xem 2 dòng cuối	tail -n 2 app.log
Mở để đọc	less app.log
Tìm trong less	/ERROR
Kết quả tiếp theo	n
Kết quả trước	Shift + N
Thoát less	q

Sau lab này, bạn sẽ thành thạo bốn lệnh đọc file cơ bản trong Linux: cat, head, tail và less.

lab 4
Tổng kết các tùy chọn của grep
Lệnh	Chức năng
grep "ERROR" app.log	Tìm dòng chứa ERROR
grep -c "INFO" app.log	Đếm số dòng chứa INFO
grep -i "error" app.log	Tìm không phân biệt hoa/thường
grep -n "ERROR" app.log	Hiển thị kèm số dòng
grep "ERROR" app.log > errors.txt	Lưu kết quả vào file
grep "ERROR" app.log >> errors.txt	Thêm kết quả vào cuối file
grep -v "INFO" app.log	Hiển thị các dòng không chứa INFO
grep -r "ERROR" logs/	Tìm ERROR trong toàn bộ thư mục logs/

Sau LAB này, bạn sẽ nắm được những tùy chọn grep được sử dụng thường xuyên trong Linux và DevOps: -c, -i, -n, cùng với cách kết hợp grep và chuyển hướng đầu ra (> và >>).

lab 5
find là gì?

find dùng để tìm kiếm file hoặc thư mục theo nhiều điều kiện:

Tên
Loại (file/thư mục)
Kích thước
Thời gian sửa
Quyền
Chủ sở hữu
...

Cú pháp:

find <đường_dẫn> <điều_kiện>

Ví dụ:

find . -name "*.txt"
.: tìm từ thư mục hiện tại
-name: tìm theo tên
"*.txt": mọi file có đuôi .txt


Tổng kết các tùy chọn find

Lệnh	                Chức năng
find . -name "*.txt"	Tìm file .txt
find . -name "*.log"	Tìm file .log
find . -iname "*.log"	Tìm .log không phân biệt hoa/thường
find . -size +1M	    Tìm file lớn hơn 1 MB
find . -type d -name "scripts"	Tìm thư mục scripts
find . -type f	Chỉ tìm file
find . -type d	Chỉ tìm thư mục
find . -mtime -1	Tìm file sửa trong 24 giờ gần nhất

lab 6
Bước 1: Tạo file users.txt

Có thể dùng Here Document:

cat << EOF > users.txt
admin
dev
admin
guest
dev
dev
root
EOF

Kiểm tra:

cat users.txt

Kết quả:

admin
dev
admin
guest
dev
dev
root


Tóm tắt các lệnh
Lệnh	Chức năng
wc -l users.txt	Đếm số dòng
sort users.txt	Sắp xếp theo alphabet
sort users.txt | uniq	Xóa các dòng trùng
sort users.txt | uniq -c	Đếm số lần xuất hiện
sort users.txt | uniq -c | sort -nr	Đếm và sắp xếp theo số lần xuất hiện giảm dần
wc users.txt	Hiển thị số dòng, số từ và số ký tự
wc -w users.txt	Đếm số từ
wc -c users.txt	Đếm số ký tự
Kiến thức quan trọng cần nhớ
sort dùng để sắp xếp dữ liệu.
uniq không tự xóa toàn bộ dòng trùng, mà chỉ xóa các dòng trùng đứng liền nhau, nên thường phải kết hợp với sort.
| (pipe) truyền đầu ra của lệnh bên trái làm đầu vào cho lệnh bên phải.
wc có ba tùy chọn quan trọng:
-l: đếm dòng.
-w: đếm từ.
-c: đếm ký tự/byte.

Đây là nhóm lệnh rất phổ biến trong Linux và DevOps để xử lý log, thống kê dữ liệu và phân tích nội dung file.

lab7
Process là gì?

Process (tiến trình) là một chương trình đang chạy trên hệ điều hành.

Ví dụ:

Chrome đang mở
VS Code đang chạy
Terminal
SSH
Docker
sleep

Mỗi process đều có:

PID (Process ID)
User
CPU
RAM
Trạng thái


Một số lệnh hữu ích
Xem tất cả process
ps aux
Xem process theo tên
ps -ef | grep nginx
Tìm PID
pgrep nginx
Kill theo PID
kill 1234
Kill theo tên
pkill sleep
Kill tất cả process cùng tên
killall sleep

Tóm tắt
Lệnh	Chức năng
ps	Xem process của terminal hiện tại
ps -ef	Xem tất cả process
ps aux	Hiển thị chi tiết tất cả process
top	Theo dõi process theo thời gian thực
htop	Giao diện trực quan hơn top (nếu đã cài)
sleep 300	Tạo một process chạy trong 300 giây
ps -ef | grep sleep	Tìm process sleep
pgrep sleep	Lấy PID của sleep
pidof sleep	Lấy PID theo tên chương trình
kill <PID>	Kết thúc process
kill -9 <PID>	Buộc dừng process
pkill sleep	Kết thúc process theo tên
killall sleep	Kết thúc tất cả process cùng tên

Đây là các lệnh quản lý tiến trình cơ bản nhưng rất quan trọng trong Linux và DevOps, thường được dùng khi giám sát dịch vụ, xử lý ứng dụng bị treo hoặc dừng các tiến trình không mong muốn.


lab8
Mục tiêu

Học các lệnh:

df
free
du
fallocate hoặc dd

Tóm tắt các lệnh
Lệnh	Chức năng
df -h	Xem dung lượng ổ cứng
free -h	Xem RAM
df -i	Xem inode
fallocate -l 500M bigfile.img	Tạo file 500 MB nhanh
dd if=/dev/zero of=bigfile.img bs=1M count=500	Tạo file 500 MB bằng dd
ls -lh bigfile.img	Kiểm tra kích thước file
du -sh bigfile.img	Xem dung lượng file
rm bigfile.img	Xóa file


Kiến thức quan trọng cần nhớ
df dùng để xem dung lượng của toàn bộ hệ thống file.
du dùng để xem dung lượng của một file hoặc thư mục cụ thể.
free dùng để xem tình trạng sử dụng RAM và swap.
df -i giúp kiểm tra inode, rất hữu ích khi hệ thống báo "No space left on device" dù ổ đĩa vẫn còn trống.
fallocate tạo file rất nhanh vì chỉ cấp phát không gian, còn dd thực sự ghi dữ liệu nên chậm hơn nhưng có mặt trên hầu hết các hệ thống Linux.

lab 9
Mục tiêu

Học cách sử dụng:

chmod
ls -l
Quyền rwx
Quyền dạng số (755, 644,...)

Tóm tắt các lệnh
Lệnh	Chức năng
touch script.sh	Tạo file
nano script.sh	Chỉnh sửa file
cat script.sh	Xem nội dung
ls -l	Xem quyền file
chmod +x script.sh	Cấp quyền thực thi
chmod -x script.sh	Thu hồi quyền thực thi
chmod 755 script.sh	Đặt quyền rwxr-xr-x
chmod 644 script.sh	Đặt quyền rw-r--r--
chmod 700 script.sh	Chỉ chủ sở hữu có toàn quyền
chmod 600 script.sh	Chỉ chủ sở hữu được đọc/ghi

Ghi nhớ cho DevOps
755: Thường dùng cho script và thư mục cần thực thi.
644: Thường dùng cho file cấu hình và mã nguồn.
700: Dùng cho script hoặc thư mục chỉ chủ sở hữu được truy cập.
600: Dùng cho các file nhạy cảm như khóa SSH (~/.ssh/id_rsa), thông tin đăng nhập hoặc chứng chỉ riêng tư.

lab 10
Mục tiêu

Học:

Biến (Variable)
echo
read
Command Substitution ($(...))
Lệnh date


Tóm tắt các lệnh
Lệnh	Chức năng
NAME="DevOps"	Tạo biến
echo $NAME	In giá trị biến
AGE=25	Tạo biến số
echo "Tôi $AGE tuổi"	In chuỗi có biến
read NAME	Nhập dữ liệu từ bàn phím
read -p "Nhập tên: " NAME	Nhập dữ liệu có lời nhắc
date	Hiển thị ngày giờ hiện tại
TODAY=$(date)	Lưu kết quả lệnh date vào biến
Lưu ý
Trong Bash, mọi biến đều được lưu dưới dạng chuỗi (string). 
Bash sẽ tự chuyển đổi khi thực hiện các phép tính số học (ví dụ với (( )) hoặc expr), đây sẽ là nội dung của các bài thực hành tiếp theo.

lab 11
Mục tiêu
Học:
if
else
So sánh số
Kiểm tra file
Kiểm tra thư mục
Cấu trúc if
if [ điều_kiện ]
then
    lệnh
fi

Hoặc:

if [ điều_kiện ]
then
    lệnh 1
else
    lệnh 2
fi


Tóm tắt các toán tử
So sánh số
Toán tử	Ý nghĩa
-eq	bằng
-ne	khác
-gt	lớn hơn
-lt	nhỏ hơn
-ge	lớn hơn hoặc bằng
-le	nhỏ hơn hoặc bằng
Kiểm tra file
Điều kiện	Ý nghĩa
-f file	File tồn tại
-d dir	Thư mục tồn tại
-r file	Có quyền đọc
-w file	Có quyền ghi
-x file	Có quyền thực thi
-s file	File không rỗng
Cú pháp cần nhớ
if [ điều_kiện ]
then
    # lệnh khi điều kiện đúng
else
    # lệnh khi điều kiện sai
fi

Lưu ý quan trọng về cú pháp Bash:

Phải có dấu cách sau [ và trước ].
Ví dụ đúng:
if [ $AGE -ge 18 ]
Ví dụ sai:
if [$AGE -ge 18]

Bash sẽ báo lỗi vì thiếu khoảng trắng.

Đây là nền tảng để viết các script tự động trong Linux và DevOps, 
chẳng hạn như kiểm tra dịch vụ, xác minh file cấu hình hoặc quyết định thực hiện các bước triển khai dựa trên điều kiện.

lab 12
Mục tiêu

Học:

for
Duyệt danh sách
Duyệt file
Đổi tên file
Thực hiện phép tính
Cấu trúc for
for biến in danh_sách
do
    lệnh
done

Ví dụ:

for i in 1 2 3
do
    echo $i
done

Kết quả:

1
2
3

Kiến thức quan trọng
Duyệt danh sách
for x in A B C
do
    echo $x
done
Duyệt số
for i in {1..10}
Duyệt file
for file in *
Duyệt file .txt
for file in *.txt
Tính toán
$(( ))

Ví dụ:

echo $((5 * 10))

Kết quả:

50
Tóm tắt
Lệnh	Chức năng
for i in {1..5}	Lặp từ 1 đến 5
for i in {1..100}	Lặp từ 1 đến 100
for file in *	Duyệt tất cả file và thư mục
for file in *.txt	Duyệt các file .txt
mv "$file" "backup_$file"	Đổi tên file
$((2*i))	Tính toán trong Bash
seq 1 100	Sinh dãy số từ 1 đến 100
Lưu ý khi đổi tên hàng loạt

Nếu thư mục không có file .txt, một số shell sẽ coi *.txt là chuỗi ký tự thay vì danh sách file, dẫn đến lỗi như:

mv: cannot stat '*.txt': No such file or directory

Để tránh lỗi này, bạn có thể kiểm tra trước:

for file in *.txt
do
    [ -e "$file" ] || continue
    mv "$file" "backup_$file"
done

Đây là cách viết an toàn và thường được sử dụng trong các Bash script thực tế.

lab 13
Mục tiêu

Học cách sử dụng:

>
>>
<
2>
2>&1
&>
Redirect là gì?

Mỗi lệnh trong Linux có 3 luồng dữ liệu mặc định:

Luồng	Số	Ý nghĩa
stdin	0	Đầu vào
stdout	1	Kết quả bình thường
stderr	2	Thông báo lỗi

Ví dụ:

ls

Kết quả sẽ in ra màn hình (stdout).

Ta có thể chuyển hướng kết quả này sang file.



Sơ đồ Redirect
           stdin (0)
                │
                ▼
            Command
           /       \
 stdout (1)         stderr (2)
      │                 │
      ▼                 ▼
  màn hình          màn hình

Có thể redirect:

stdout → file

stderr → file

stdout + stderr → cùng file

Tóm tắt
Lệnh	Chức năng
ls > list.txt	Ghi kết quả vào file (ghi đè)
pwd >> list.txt	Thêm kết quả vào cuối file
cat abc.txt 2> error.log	Lưu thông báo lỗi
(ls; cat abc.txt) > output.log 2>&1	Gộp stdout và stderr vào một file
(ls; cat abc.txt) &> output.log	Cách viết ngắn gọn trên Bash
while read line; do echo "$line"; done < users.txt	Đọc file qua stdin

Ghi nhớ nhanh
Ký hiệu	Ý nghĩa
>	Ghi đè đầu ra (stdout)
>>	Thêm đầu ra vào cuối file
<	Đọc đầu vào từ file
2>	Chuyển hướng lỗi (stderr)
2>>	Thêm lỗi vào cuối file
2>&1	Gộp stderr vào stdout
&>	Chuyển cả stdout và stderr vào cùng một nơi (Bash)
/dev/null	Loại bỏ đầu ra hoặc lỗi (không lưu, không hiển thị)

Đây là những kỹ thuật redirect rất quan trọng trong Bash và DevOps, 
thường dùng để ghi log, lưu lỗi, xử lý đầu vào từ file và tự động hóa các tác vụ.



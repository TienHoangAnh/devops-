import { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Loader2, RotateCcw, Trophy } from 'lucide-react';
import { topics, type Topic } from './DevopsRoadmapPage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Question = { id: string; prompt: string; options: string[]; correct: number; explanation: string };
type StudyUnit = { title: string; summary: string; goals: string[]; example?: string; questions: Question[] };

const specificUnits: Record<string, Omit<StudyUnit, 'title'>> = {
  'foundation/0': {
    summary: 'Python là lựa chọn thực tế để tự động hóa công việc DevOps: xử lý file, gọi API, đọc JSON/YAML và viết script CI/CD.',
    goals: ['Dùng virtual environment để cô lập thư viện.', 'Đọc biến môi trường và xử lý lỗi an toàn.', 'Viết script nhỏ, rõ ràng, có thể chạy lặp lại.'],
    example: 'from pathlib import Path\n\nfor log in Path("./logs").glob("*.log"):\n    print(log.name)',
    questions: [
      { id: 'python-venv', prompt: 'Lệnh nào tạo virtual environment Python?', options: ['python -m venv .venv', 'pip create .venv', 'python --virtual .venv', 'venv install'], correct: 0, explanation: '`python -m venv .venv` tạo môi trường ảo trong thư mục `.venv`.' },
      { id: 'python-pathlib', prompt: 'Trong ví dụ, `Path("./logs").glob("*.log")` dùng để làm gì?', options: ['Tạo container', 'Liệt kê các file .log', 'Xóa thư mục logs', 'Cài package'], correct: 1, explanation: '`glob` tìm các file khớp mẫu; ở đây là mọi file có đuôi `.log`.' },
      { id: 'python-devops', prompt: 'Tác vụ nào phù hợp nhất cho Python trong DevOps?', options: ['Tự động gọi API và xử lý JSON', 'Thay kernel Linux', 'Biên dịch Docker daemon', 'Thay DNS resolver'], correct: 0, explanation: 'Python rất phù hợp với automation, API integration và xử lý cấu hình/dữ liệu.' },
      { id: 'python-boolean', prompt: 'Trong lab, biểu thức `status if status else "Stopped"` dùng để làm gì?', options: ['In "Running" khi status là True, ngược lại in "Stopped"', 'Gán status thành chuỗi', 'Đọc status từ file', 'Tạo biến Boolean mới'], correct: 0, explanation: 'Đây là conditional expression: nếu `status` đúng thì lấy vế đầu, nếu sai thì lấy vế sau.' },
      { id: 'python-for-list', prompt: 'Đoạn `for server in servers:` có tác dụng gì?', options: ['Duyệt lần lượt từng phần tử trong danh sách servers', 'Chỉ lấy server đầu tiên', 'Sắp xếp danh sách', 'Xóa server khỏi danh sách'], correct: 0, explanation: 'Vòng lặp `for` gán từng phần tử của list vào biến `server` theo thứ tự.' },
      { id: 'python-dict', prompt: 'Cách nào lấy IP từ dictionary `server` trong lab?', options: ['server["ip"]', 'server.ip', 'server("ip")', 'server.get[ip]'], correct: 0, explanation: 'Dictionary được truy cập theo key bằng cú pháp ngoặc vuông: `server["ip"]`.' },
      { id: 'python-membership', prompt: 'Biểu thức `name in server_name` trong hàm check_server kiểm tra điều gì?', options: ['Tên có nằm trong danh sách server_name hay không', 'Tên có phải kiểu string hay không', 'Server có mở port hay không', 'File server_name có tồn tại hay không'], correct: 0, explanation: 'Toán tử `in` kiểm tra một giá trị có xuất hiện trong list, string hoặc collection khác không.' },
      { id: 'python-strip', prompt: 'Khi đọc file theo từng dòng, vì sao dùng `line.strip()`?', options: ['Bỏ khoảng trắng và ký tự xuống dòng ở đầu/cuối', 'Mã hóa file', 'Đóng file', 'Chuyển dòng thành số'], correct: 0, explanation: '`strip()` giúp tên server/log không mang theo ký tự xuống dòng `\n`.' },
      { id: 'python-with-open', prompt: 'Lợi ích chính của `with open("report.txt", "w") as file:` là gì?', options: ['File được tự đóng kể cả khi có lỗi', 'File chỉ đọc được', 'Tự tạo Docker volume', 'Chạy code song song'], correct: 0, explanation: 'Context manager `with` đảm bảo file được đóng đúng cách sau khi khối lệnh kết thúc.' },
      { id: 'python-write-mode', prompt: 'Mode `"w"` khi mở `report.txt` có hành vi nào?', options: ['Ghi mới và ghi đè nội dung file cũ', 'Chỉ đọc file', 'Chỉ thêm vào cuối file', 'Không tạo file nếu chưa có'], correct: 0, explanation: '`w` mở file để ghi, tạo file nếu chưa tồn tại và xóa nội dung cũ nếu file đã tồn tại.' },
      { id: 'python-shutil-copy', prompt: 'Hàm `shutil.copy(source, destination)` trong bài backup dùng để làm gì?', options: ['Sao chép file từ source sang destination', 'Đổi tên thư mục', 'Nén file thành zip', 'Xóa file nguồn'], correct: 0, explanation: '`shutil.copy` sao chép nội dung file và metadata cơ bản sang đường dẫn đích.' },
      { id: 'python-makedirs', prompt: 'Ý nghĩa của `os.makedirs(backup_folder, exist_ok=True)` là gì?', options: ['Tạo cả cây thư mục và không lỗi nếu thư mục đã có', 'Chỉ kiểm tra thư mục', 'Xóa thư mục backup cũ', 'Đổi tên thư mục'], correct: 0, explanation: '`exist_ok=True` cho phép chạy script lặp lại mà không lỗi khi thư mục đã tồn tại.' },
      { id: 'python-listdir', prompt: 'Trong DevOps Utility, `os.listdir(".")` trả về gì?', options: ['Danh sách tên mục trong thư mục hiện tại', 'Dung lượng ổ đĩa', 'Nội dung tất cả file', 'Danh sách process'], correct: 0, explanation: 'Dấu `.` là thư mục hiện tại; `os.listdir` trả về tên file và thư mục con trong đó.' },
      { id: 'python-exception', prompt: 'Exception nào được bắt khi người dùng nhập file không tồn tại?', options: ['FileNotFoundError', 'ValueError', 'KeyError', 'TypeError'], correct: 0, explanation: 'Mở một đường dẫn không tồn tại bằng `open` sẽ phát sinh `FileNotFoundError`.' },
      { id: 'python-log-count', prompt: 'Trong Log Analyzer, biến đếm phải đặt ở đâu để không bị reset ở mỗi dòng?', options: ['Trước vòng lặp đọc file', 'Bên trong từng nhánh if', 'Sau khi in report', 'Bên trong `open(..., "w")`'], correct: 0, explanation: 'Khởi tạo trước vòng lặp để biến giữ được tổng số dòng khớp trong toàn bộ file log.' },
      { id: 'python-path-join', prompt: 'Vì sao dùng `os.path.join("backup", folder, file)` khi tạo đường dẫn?', options: ['Tạo đường dẫn đúng trên các hệ điều hành', 'Mã hóa file', 'Đếm file', 'Tạo dictionary'], correct: 0, explanation: '`os.path.join` ghép các phần của đường dẫn bằng dấu phân cách phù hợp với hệ điều hành.' },
      { id: 'python-while-menu', prompt: 'Trong DevOps Utility, `while True` kết hợp `break` dùng để làm gì?', options: ['Giữ menu chạy đến khi người dùng chọn Exit', 'Chạy menu đúng một lần', 'Chỉ tạo thư mục backup', 'Bắt lỗi file'], correct: 0, explanation: 'Vòng lặp vô hạn hiển thị menu liên tục; `break` ở lựa chọn 5 kết thúc chương trình.' },
    ],
  },
  'foundation/1': {
    summary: 'Bash và Linux command line là công cụ nền tảng để quản lý file, đọc log, xử lý process và tự động hóa tác vụ DevOps.',
    goals: ['Điều hướng, tạo và thao tác file/thư mục an toàn.', 'Đọc log, tìm kiếm và xử lý dữ liệu bằng pipe.', 'Quản lý process, quyền, tài nguyên và redirect trong Bash.'],
    example: 'grep -i "error" app.log | tail -n 10 > recent-errors.txt',
    questions: [
      { id: 'bash-pwd', prompt: 'Lệnh nào in ra đường dẫn thư mục hiện tại?', options: ['pwd', 'path', 'where', 'cd'], correct: 0, explanation: '`pwd` (print working directory) cho biết bạn đang đứng ở thư mục nào.' },
      { id: 'bash-mkdir', prompt: 'Sau `mkdir devops-practice`, lệnh nào đi vào thư mục vừa tạo?', options: ['cd devops-practice', 'mv devops-practice', 'ls devops-practice', 'touch devops-practice'], correct: 0, explanation: '`cd` thay đổi thư mục làm việc hiện tại.' },
      { id: 'bash-touch', prompt: 'Lệnh nào tạo nhanh các file `server.txt` và `app.log`?', options: ['touch server.txt app.log', 'mkdir server.txt app.log', 'cat server.txt app.log', 'cp server.txt app.log'], correct: 0, explanation: '`touch` tạo file rỗng nếu file chưa tồn tại.' },
      { id: 'bash-ls-la', prompt: '`ls -la` khác `ls` ở điểm nào?', options: ['Hiện cả file ẩn và thông tin chi tiết', 'Chỉ hiện file .log', 'Xóa file ẩn', 'Chỉ hiện thư mục'], correct: 0, explanation: '`-l` là dạng chi tiết, `-a` bao gồm cả file bắt đầu bằng dấu chấm.' },
      { id: 'bash-cp', prompt: 'Lệnh nào sao chép `server.txt` thành `server_backup.txt`?', options: ['cp server.txt server_backup.txt', 'mv server.txt server_backup.txt', 'rm server.txt server_backup.txt', 'touch server.txt server_backup.txt'], correct: 0, explanation: '`cp nguồn đích` tạo một bản sao, còn `mv` sẽ đổi tên/di chuyển file gốc.' },
      { id: 'bash-rm-r', prompt: 'Khi nào cần dùng `rm -r backup_copy`?', options: ['Xóa thư mục cùng toàn bộ nội dung bên trong', 'Đọc nội dung thư mục', 'Đổi tên thư mục', 'Sao chép thư mục'], correct: 0, explanation: '`-r` xóa đệ quy. Cần kiểm tra kỹ đường dẫn trước khi dùng, đặc biệt với `rm -rf`.' },
      { id: 'bash-tail', prompt: 'Lệnh nào xem 2 dòng cuối của `app.log`?', options: ['tail -n 2 app.log', 'head -n 2 app.log', 'cat -n 2 app.log', 'less -n 2 app.log'], correct: 0, explanation: '`tail` xem cuối file; `-n 2` giới hạn hai dòng.' },
      { id: 'bash-less', prompt: 'Khi đang mở file bằng `less`, phím nào thoát chương trình?', options: ['q', 'Esc', 'x', 'Ctrl+C'], correct: 0, explanation: 'Trong `less`, nhấn `q` để quit; `/ERROR` để tìm kiếm và `n` để tới kết quả tiếp theo.' },
      { id: 'bash-grep-count', prompt: '`grep -c "INFO" app.log` trả về gì?', options: ['Số dòng chứa INFO', 'Nội dung tất cả dòng INFO', 'Số ký tự INFO', 'Tên file log'], correct: 0, explanation: 'Tùy chọn `-c` đếm số dòng khớp với mẫu tìm kiếm.' },
      { id: 'bash-grep-append', prompt: 'Khác biệt giữa `>` và `>>` khi redirect output là gì?', options: ['`>` ghi đè, `>>` thêm vào cuối file', '`>` đọc file, `>>` xóa file', 'Không có khác biệt', '`>>` chỉ redirect lỗi'], correct: 0, explanation: '`>` tạo/ghi đè file đích; `>>` giữ nội dung cũ và nối thêm output mới.' },
      { id: 'bash-find', prompt: 'Lệnh nào chỉ tìm thư mục tên `scripts` từ thư mục hiện tại?', options: ['find . -type d -name "scripts"', 'find . -type f -name "scripts"', 'grep scripts .', 'ls -d scripts'], correct: 0, explanation: '`-type d` giới hạn kết quả là directory, còn `.` là điểm bắt đầu tìm.' },
      { id: 'bash-sort-uniq', prompt: 'Vì sao thường dùng `sort users.txt | uniq -c` thay vì chỉ `uniq -c users.txt`?', options: ['uniq chỉ xử lý các dòng trùng đứng liền nhau', 'sort tự đếm số dòng', 'uniq chỉ chạy với file .txt', 'pipe xóa file gốc'], correct: 0, explanation: 'Sắp xếp trước sẽ đưa các dòng giống nhau cạnh nhau để `uniq` có thể gom và đếm đúng.' },
      { id: 'bash-pipe', prompt: 'Dấu `|` trong Bash dùng để làm gì?', options: ['Chuyển output của lệnh trước vào input lệnh sau', 'Chạy lệnh với quyền root', 'Tạo file', 'Chuyển thư mục'], correct: 0, explanation: 'Pipe nối output chuẩn của lệnh bên trái vào input chuẩn của lệnh bên phải.' },
      { id: 'bash-process', prompt: 'Lệnh nào lấy PID của process tên `nginx`?', options: ['pgrep nginx', 'ps nginx', 'kill nginx', 'top nginx'], correct: 0, explanation: '`pgrep` tìm process theo tên và in PID; PID dùng được với `kill <PID>`.' },
      { id: 'bash-disk', prompt: 'Lệnh nào xem dung lượng sử dụng của toàn bộ filesystem ở dạng dễ đọc?', options: ['df -h', 'du -sh', 'free -h', 'ls -lh'], correct: 0, explanation: '`df -h` xem dung lượng filesystem; `du -sh` thường dùng cho một file hoặc thư mục cụ thể.' },
      { id: 'bash-permission', prompt: 'Quyền `chmod 644 nginx.conf` tương ứng với quyền nào?', options: ['Chủ sở hữu đọc/ghi; nhóm và người khác chỉ đọc', 'Mọi người đều thực thi', 'Chỉ chủ sở hữu đọc/ghi/thực thi', 'Mọi người đọc/ghi/thực thi'], correct: 0, explanation: '644 tương ứng `rw-r--r--`, phù hợp với file cấu hình không cần thực thi.' },
      { id: 'bash-command-substitution', prompt: 'Dòng `TODAY=$(date)` trong Bash làm gì?', options: ['Lưu output của lệnh date vào biến TODAY', 'In biến TODAY ra màn hình', 'Tạo file date', 'So sánh hai ngày'], correct: 0, explanation: '`$(...)` là command substitution: chạy lệnh bên trong rồi lấy output làm giá trị biến.' },
      { id: 'bash-if-space', prompt: 'Cú pháp Bash nào đúng để kiểm tra file `config.txt` tồn tại?', options: ['if [ -f config.txt ]', 'if [-f config.txt]', 'if ( -f config.txt )', 'if { -f config.txt }'], correct: 0, explanation: 'Bash cần khoảng trắng sau `[` và trước `]`; `-f` kiểm tra file thường tồn tại.' },
      { id: 'bash-for-glob', prompt: 'Trong vòng lặp đổi tên `*.txt`, dòng nào tránh lỗi khi không có file khớp?', options: ['[ -e "$file" ] || continue', 'rm "$file"', 'touch "$file"', 'exit 1'], correct: 0, explanation: 'Kiểm tra `-e` trước; nếu không tồn tại thì `continue` sang lượt tiếp theo.' },
      { id: 'bash-stderr', prompt: 'Redirect `2>&1` có ý nghĩa gì?', options: ['Gộp stderr vào cùng nơi stdout đang đi tới', 'Ghi stdin vào file', 'Chỉ bỏ stderr', 'Chạy lệnh nền'], correct: 0, explanation: 'File descriptor 2 là stderr; `2>&1` gửi nó tới cùng đích với stdout (descriptor 1).' },
    ],
  },
  'containers/0': {
    summary: 'Docker image là template bất biến; container là instance đang chạy của image.',
    goals: ['Phân biệt image, container, volume và network.', 'Không lưu dữ liệu bền vững trong writable layer của container.', 'Dùng image có tag rõ ràng khi deploy.'],
    example: 'docker run --rm -p 8080:80 nginx:alpine',
    questions: [{ id: 'docker-image', prompt: 'Docker image là gì?', options: ['Template dùng để tạo container', 'Một container đang chạy', 'Một volume', 'Một reverse proxy'], correct: 0, explanation: 'Image chứa filesystem và metadata để tạo các container.' }],
  },
  'cicd/0': {
    summary: 'GitHub Actions workflow tự động chạy các bước build, test và deploy khi repository có sự kiện mới.',
    goals: ['Kích hoạt workflow qua push hoặc pull request.', 'Tách build/test/deploy thành các job rõ ràng.', 'Không ghi secret trực tiếp vào YAML.'],
    example: 'on: [push]\njobs:\n  test:\n    runs-on: ubuntu-latest',
    questions: [{ id: 'actions-trigger', prompt: '`on: [push]` trong GitHub Actions có ý nghĩa gì?', options: ['Workflow chạy khi có push', 'Tạo branch mới', 'Xóa artifact', 'Mở port'], correct: 0, explanation: 'Trường `on` khai báo sự kiện kích hoạt workflow.' }],
  },
  'kubernetes/0': {
    summary: 'Pod là đơn vị triển khai nhỏ nhất trong Kubernetes, có thể chứa một hoặc nhiều container cùng chia sẻ network.',
    goals: ['Không deploy trực tiếp Pod cho workload dài hạn.', 'Dùng Deployment để quản lý replica và rollout.', 'Đặt resource request/limit cho production.'],
    example: 'kubectl get pods -A',
    questions: [{ id: 'k8s-pod', prompt: 'Đơn vị triển khai nhỏ nhất trong Kubernetes là gì?', options: ['Pod', 'Node', 'Cluster', 'Ingress'], correct: 0, explanation: 'Pod là đơn vị nhỏ nhất Kubernetes tạo và quản lý.' }],
  },
};

function fallbackUnit(topic: Topic, index: number): StudyUnit {
  const title = topic.details[index];
  return {
    title,
    summary: `${title} là một năng lực thuộc ${topic.title}. Hãy nắm mục đích, cách dùng an toàn và tình huống áp dụng trong vận hành hệ thống.`,
    goals: ['Hiểu khái niệm và vai trò trong hệ thống.', 'Thực hành với môi trường thử nghiệm.', 'Ghi lại lệnh, cấu hình và cách khắc phục lỗi thường gặp.'],
    questions: [
      { id: `${topic.id}-${index}-purpose`, prompt: `Mục tiêu chính khi học “${title}” là gì?`, options: ['Vận hành và tự động hóa hệ thống tốt hơn', 'Thay thế toàn bộ ngôn ngữ lập trình', 'Không cần kiểm thử', 'Loại bỏ hoàn toàn bảo mật'], correct: 0, explanation: 'Mỗi kỹ năng trong roadmap giúp xây dựng, vận hành hoặc bảo vệ hệ thống một cách tin cậy hơn.' },
      { id: `${topic.id}-${index}-practice`, prompt: `Cách học hiệu quả nhất với “${title}” là gì?`, options: ['Thực hành trong môi trường thử nghiệm và ghi lại kết quả', 'Chỉ đọc lý thuyết', 'Dùng trực tiếp trên production không kiểm tra', 'Bỏ qua tài liệu'], correct: 0, explanation: 'Thực hành có kiểm soát giúp bạn hiểu công cụ, quan sát lỗi và hình thành quy trình an toàn.' },
    ],
  };
}

function getUnit(topic: Topic, index: number): StudyUnit {
  const special = specificUnits[`${topic.id}/${index}`];
  return special ? { title: topic.details[index], ...special } : fallbackUnit(topic, index);
}

function QuestionSet({ questions }: { questions: Question[] }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = questions.filter((q) => answers[q.id] === q.correct).length;
  return <div className="space-y-4">
    {questions.map((question, index) => <Card key={question.id}>
      <CardHeader><CardTitle className="text-base">{index + 1}. {question.prompt}</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {question.options.map((option, optionIndex) => {
          const selected = answers[question.id] === optionIndex;
          const resultClass = submitted && optionIndex === question.correct ? 'border-success bg-success/10' : submitted && selected ? 'border-destructive bg-destructive/10' : selected ? 'border-primary bg-primary/10' : 'border-border';
          return <button key={option} disabled={submitted} onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }))} className={cn('w-full rounded-lg border p-3 text-left text-sm', resultClass)}>{option}</button>;
        })}
        {submitted && <div className={cn('rounded-lg p-3 text-sm', answers[question.id] === question.correct ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive')}>
          <p className="font-medium">{answers[question.id] === question.correct ? 'Đúng!' : `Chưa đúng. Đáp án đúng: ${question.options[question.correct]}`}</p>
          <p className="mt-1 text-muted-foreground">{question.explanation}</p>
        </div>}
      </CardContent>
    </Card>)}
    {submitted ? <div className="flex items-center gap-3"><span className="font-semibold">Kết quả: {score}/{questions.length}</span><Button variant="outline" onClick={() => { setAnswers({}); setSubmitted(false); }}><RotateCcw className="h-4 w-4" /> Làm lại</Button></div> : <Button disabled={Object.keys(answers).length !== questions.length} onClick={() => setSubmitted(true)}>Nộp đáp án</Button>}
  </div>;
}

export function StudyUnitPage() {
  const { topicId, lessonIndex } = useParams();
  const topic = topics.find((item) => item.id === topicId);
  const index = Number(lessonIndex);
  if (!topic || !Number.isInteger(index) || !topic.details[index]) return <Navigate to="/devops-roadmap" replace />;
  const unit = getUnit(topic, index);
  return <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
    <Link to="/devops-roadmap" className="text-sm text-primary hover:underline">← Quay lại roadmap</Link>
    <h1 className="mt-4 text-3xl font-bold">{unit.title}</h1><p className="mt-3 text-muted-foreground">{unit.summary}</p>
    <Card className="my-6"><CardHeader><CardTitle className="text-lg">Mục tiêu ôn luyện</CardTitle></CardHeader><CardContent><ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">{unit.goals.map((goal) => <li key={goal}>{goal}</li>)}</ul>{unit.example && <pre className="mt-5 overflow-x-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100"><code>{unit.example}</code></pre>}</CardContent></Card>
    <h2 className="mb-4 text-xl font-semibold">Kiểm tra nhanh</h2><QuestionSet questions={unit.questions} />
  </div>;
}

function shuffle<T>(items: T[]) { return [...items].sort(() => Math.random() - 0.5); }

export function PracticeQuizPage() {
  const [version, setVersion] = useState(0);
  const [isLoadingNewQuiz, setIsLoadingNewQuiz] = useState(false);
  const questions = useMemo(() => {
    const all = topics.flatMap((topic) => topic.details.flatMap((_, index) => getUnit(topic, index).questions));
    return shuffle(all).slice(0, Math.min(12, all.length));
  }, [version]);
  const newQuiz = () => {
    if (isLoadingNewQuiz) return;
    setIsLoadingNewQuiz(true);
    window.setTimeout(() => {
      setVersion((v) => v + 1);
      setIsLoadingNewQuiz(false);
    }, 3_000);
  };
  return <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><p className="flex items-center gap-2 text-primary"><Trophy className="h-5 w-5" /> Quiz tổng hợp</p><h1 className="mt-1 text-3xl font-bold">Ôn luyện DevOps</h1><p className="mt-2 text-muted-foreground">Bộ đề lấy ngẫu nhiên từ các chuyên đề trong roadmap.</p></div><Button variant="outline" onClick={newQuiz} disabled={isLoadingNewQuiz}>{isLoadingNewQuiz ? <><Loader2 className="h-4 w-4 animate-spin" /> Đang tạo đề…</> : <><RotateCcw className="h-4 w-4" /> Đề mới</>}</Button></div>
    {isLoadingNewQuiz ? <Card><CardContent className="flex min-h-72 flex-col items-center justify-center gap-3 text-muted-foreground"><Loader2 className="h-8 w-8 animate-spin text-primary" /><p>Đang tạo bộ đề mới…</p><p className="text-xs">Đáp án cũ sẽ được xóa sau khi tải xong.</p></CardContent></Card> : <QuestionSet key={version} questions={questions} />}
  </div>;
}

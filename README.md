# VSTEP B1–B2 Personal Coach

Ứng dụng web học cá nhân giúp ôn luyện **VSTEP trình độ B1–B2** theo **lộ trình 14 ngày** (2 tiếng/ngày). Chạy hoàn toàn trên trình duyệt, không cần backend hay database; mọi tiến độ được lưu riêng trên trình duyệt của từng người bằng `localStorage`.

---

## Cách tải về và chạy (Dành cho mọi người)

> **Yêu cầu:** Máy đã cài [Node.js](https://nodejs.org/) (phiên bản 18 trở lên).

### Cách 1: Chạy bằng Terminal (Windows / macOS / Linux)

```bash
git clone https://github.com/anhtu280705/Vstep_Coach.git
cd Vstep_Coach
npm install
npm run dev
```

Sau đó mở trình duyệt tại **`http://localhost:5173`**.

*(Trên Windows PowerShell, nếu bị chặn script `npm.ps1`, dùng `npm.cmd install` và `npm.cmd run dev`.)*

### Cách 2: Chạy nhanh 1 chạm trên Windows

1. Tải repo về (`git clone` hoặc **Code → Download ZIP** rồi giải nén).
2. Nhấp đúp vào file **`start-app.bat`** — lần đầu chạy file sẽ tự cài thư viện (`npm install`) rồi tự mở trình duyệt tại `http://localhost:5173`.

---

## Tính năng chính

- **Lộ trình 14 ngày (120 phút/ngày):** Chia sẵn mục tiêu từng ngày (Tuần 1 xây nền, Tuần 2 bứt tốc kỹ năng & tổng duyệt), kèm đồng hồ tập trung 25p / 50p / 120p.
- **Kho từ vựng 14 chủ đề × 30 từ = 420 từ B1–B2:**
  - Flashcard lật 2 mặt (IPA, nghĩa tiếng Việt, ví dụ ngữ cảnh, collocations) + **Tự động phát âm (TTS)** giọng Anh–Mỹ (`en-US`) / Anh–Anh (`en-GB`).
  - **Ôn tập xen kẽ tự động sau mỗi 10 từ:** Trộn 4 dạng (*Chọn từ đúng nghĩa*, *Điền từ đúng nghĩa*, *Chọn nghĩa đúng*, *Nghe & Chọn từ*) hỗ trợ phím tắt `1–4` và `Enter`.
  - **Lặp lại ngắt quãng (SRS)** + **Speed Review 20 từ đã học** + thêm/nhập hàng loạt từ cá nhân.
- **8 chuyên đề Ngữ pháp B1–B2:** Công thức, dấu hiệu, lỗi sai hay gặp và 48 câu trắc nghiệm có giải thích chi tiết.
- **Chiến thuật & Thực hành 4 Kỹ năng VSTEP:**
  - **Listening (Part 1–3):** Mini-test có chế độ *Thi thật (nghe 1 lần)* và Transcript.
  - **Reading (4 Passages):** Chiến thuật 60 phút + 3 bài đọc thực hành chấm điểm.
  - **Writing (Task 1 & 2):** 12 đề mẫu, khung mẫu câu copy 1 chạm, đồng hồ 20p/40p và khung viết đếm từ tự động.
  - **Speaking (Part 1–3):** 9 đề nói mẫu (Part 3 có sơ đồ Mindmap), bộ mẫu câu vạn năng và **ghi âm micro nghe lại**.
- **Giao diện Sáng / Tối & Rồng Á Đông đồng hành:** Hiệu ứng kính mờ + rồng bay lượn quanh thẻ (bật/tắt 1 chạm), kèm xuất/nhập file sao lưu JSON.

---

## Cấu trúc thư mục dự án

```text
Vstep_Coach/
├── index.html                  # Trang HTML gốc & font chữ tiếng Việt
├── package.json                # Khai báo thư viện & lệnh chạy (dev, build)
├── vite.config.ts              # Cấu hình bundler Vite + Tailwind CSS
├── tsconfig.json               # Cấu hình TypeScript
├── start-app.bat               # File khởi chạy nhanh bằng 1 click trên Windows
└── src/
    ├── App.tsx                 # Khung giao diện chính & điều hướng các màn hình
    ├── main.tsx                # Điểm khởi chạy React
    ├── index.css               # Tailwind CSS & hiệu ứng lật thẻ / kính mờ
    ├── types/                  # Định nghĩa kiểu dữ liệu TypeScript
    ├── context/                # Quản lý trạng thái học tập & lưu localStorage
    ├── utils/                  # Tiện ích phát âm TTS, tính lịch SRS & ngày tháng
    ├── data/                   # Toàn bộ dữ liệu 420 từ, ngữ pháp, đề thi & lộ trình
    └── components/
        ├── Dashboard/          # Trang Tổng quan, Lộ trình 14 ngày & Đồng hồ tập trung
        ├── Vocab/              # Flashcard, Mini-Quiz 10 từ & Quản lý từ cá nhân
        ├── Grammar/            # Lý thuyết Ngữ pháp & Trắc nghiệm giải thích
        ├── Skills/             # Chiến thuật & Thực hành 4 kỹ năng (Nghe/Đọc/Viết/Nói)
        ├── Layout/             # Thanh điều hướng Sidebar & Hiệu ứng Rồng đồng hành
        └── Settings/           # Cài đặt lịch thi, giọng đọc & Sao lưu JSON
```

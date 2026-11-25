# VSTEP B1–B2 Personal Coach

Ứng dụng web học cá nhân giúp ôn luyện **VSTEP trình độ B1–B2** theo **lộ trình cấp tốc 14 ngày** (2 tiếng/ngày), chạy hoàn toàn trên trình duyệt và tự động lưu tiến độ học tập riêng của từng người bằng `localStorage`.

- **Trang web trực tuyến (sau khi bật GitHub Pages):** `https://anhtu280705.github.io/Vstep_Coach/`

---

## Tính năng chính

- **Lộ trình 14 ngày (120 phút/ngày):** Chia sẵn mục tiêu từng ngày (Tuần 1 xây nền tảng, Tuần 2 bứt tốc kỹ năng & tổng duyệt), kèm đồng hồ tập trung 25p / 50p / 120p và theo dõi tiến độ phút mỗi ngày.
- **Kho từ vựng 14 chủ đề × 30 từ = 420 từ B1–B2:**
  - Flashcard lật 2 mặt đầy đủ IPA, nghĩa tiếng Việt, câu ví dụ ngữ cảnh và collocations.
  - **Tự động phát âm (TTS)** hỗ trợ chọn giọng Anh–Mỹ (`en-US`) hoặc Anh–Anh (`en-GB`) và tốc độ đọc.
  - **Ôn tập xen kẽ tự động sau mỗi 10 từ:** Trộn 4 dạng (*Chọn từ đúng nghĩa*, *Điền từ đúng nghĩa*, *Chọn nghĩa đúng*, *Nghe & Chọn từ*) với 4 phương án nằm ngay trong chặng vừa học + phím tắt `1–4` và `Enter`.
  - **Lặp lại ngắt quãng (SRS)** + chế độ **Speed Review 20 từ đã học** + thêm/nhập hàng loạt từ mới cá nhân.
- **8 chuyên đề Ngữ pháp B1–B2:** Công thức, dấu hiệu nhận biết, lỗi sai hay gặp, 48 câu trắc nghiệm có giải thích chi tiết và ghi chú cá nhân.
- **Chiến thuật & Thực hành 4 Kỹ năng VSTEP:**
  - **Listening (Part 1–3):** Bài nghe mini-test kèm chế độ *Thi thật (nghe 1 lần)* và Transcript.
  - **Reading (4 Passages):** Chiến thuật 60 phút + 3 bài đọc thực hành chấm điểm giải thích.
  - **Writing (Task 1 & 2):** 12 đề thi mẫu, khung mẫu câu copy 1 chạm, đồng hồ 20p/40p và khung viết đếm từ tự động.
  - **Speaking (Part 1–3):** 9 đề nói mẫu (Part 3 có sơ đồ Mindmap), bộ mẫu câu vạn năng và **ghi âm micro nghe lại**.
- **Giao diện Sáng / Tối & Rồng Á Đông đồng hành:** Hiệu ứng kính mờ + rồng bay lượn quanh thẻ (có nút Bật/Tắt 1 chạm), kèm xuất/nhập file sao lưu JSON.

---

## Chạy trên máy cá nhân

```bash
git clone https://github.com/anhtu280705/Vstep_Coach.git
cd Vstep_Coach
npm install
npm run dev
```

Mở trình duyệt tại `http://localhost:5173`.

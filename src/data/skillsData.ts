import { SkillGuide, SkillType } from '../types';

export const SKILL_META: Record<
  SkillType,
  { label: string; labelVi: string; duration: string; structure: string; badgeColor: string }
> = {
  listening: {
    label: 'Listening',
    labelVi: 'Kỹ năng Nghe',
    duration: '~40 phút (35 câu)',
    structure: '3 Parts · Nghe 1 lần duy nhất · Không trừ điểm câu sai',
    badgeColor: 'sky',
  },
  reading: {
    label: 'Reading',
    labelVi: 'Kỹ năng Đọc',
    duration: '60 phút (40 câu)',
    structure: '4 Passages · Mỗi bài ~400–500 từ · 10 câu/bài',
    badgeColor: 'emerald',
  },
  writing: {
    label: 'Writing',
    labelVi: 'Kỹ năng Viết',
    duration: '60 phút (2 Tasks)',
    structure: 'Task 1: Thư/Email (1/3 điểm) · Task 2: Essay (2/3 điểm)',
    badgeColor: 'amber',
  },
  speaking: {
    label: 'Speaking',
    labelVi: 'Kỹ năng Nói',
    duration: '12 phút (3 Parts)',
    structure: 'Part 1: Giao tiếp · Part 2: Giải pháp · Part 3: Phát triển chủ đề',
    badgeColor: 'violet',
  },
};

export const SKILL_GUIDES: SkillGuide[] = [
  // ================= LISTENING =================
  {
    id: 'listening-part1',
    skill: 'listening',
    partLabel: 'Part 1 · Câu 1–8',
    title: 'Thông báo, hướng dẫn & tin nhắn ngắn',
    duration: '8 câu · Mỗi đoạn 1 câu hỏi',
    taskInfo:
      'Nghe 8 đoạn độc thoại ngắn (thông báo sân bay, siêu thị, tin nhắn thoại, hướng dẫn lớp học) và chọn đáp án đúng A, B, C, D. Đoạn băng chỉ phát MỘT lần.',
    steps: [
      'Tận dụng 15–20 giây đọc đề trước khi băng chạy: gạch chân từ để hỏi (What, Where, When, Who, Why) và khác biệt giữa 4 phương án A/B/C/D.',
      'Chú ý đặc biệt các thông tin dễ đổi ý ở cuối câu: giờ khởi hành mới, số phòng thay đổi, điều kiện áp dụng.',
      'Nghe được đáp án thì chọn ngay và chuyển mắt xuống câu tiếp theo — tuyệt đối không dừng lại nuối tiếc câu đã qua.',
    ],
    traps: [
      'Bẫy đổi thông tin (Self-correction): "The meeting was set for Tuesday at 9, oh sorry, it’s moved to Thursday at 10." → Luôn nghe hết câu chứa mốc thời gian/địa điểm.',
      'Bẫy lặp từ (Word-matching): Phương án nhắc lại nguyên xi một từ trong băng nhưng sai ngữ cảnh (ví dụ từ đó nằm trong câu phủ định "not", "instead of", "used to").',
      'Bẫy số đếm & phát âm tương tự: 13 vs 30, 15 vs 50, ngày 14 vs 40.',
    ],
    templates: [
      {
        label: 'Từ khóa tín hiệu chuyển hướng hay gặp trong băng',
        phrases: [
          'However / Actually / Instead -> thông tin đúng thường nằm ngay sau',
          'Please note that / Be advised that -> nội dung chính của thông báo',
          'Due to + [lý do] -> đáp án cho câu hỏi Why',
          'Originally scheduled for..., now... -> đáp án là mốc "now"',
        ],
      },
    ],
    sample: {
      title: 'Ví dụ phân tích bẫy Part 1 (Thông báo thư viện)',
      content:
        'Băng nghe: "Attention students. The main library will close at 6 p.m. today instead of the usual 9 p.m. due to electrical maintenance. The computer room on the second floor, however, remains open until 8 p.m."\n→ Câu hỏi: "When does the computer room close today?"\n→ Phân tích: Người nghe vội sẽ chọn 6 p.m. hoặc 9 p.m. (thư viện chính), đáp án đúng phải là 8 p.m. (phòng máy tính).',
    },
    checklist: [
      { id: 'l1-c1', text: 'Đọc lướt từ khóa câu hỏi trước khi audio bắt đầu' },
      { id: 'l1-c2', text: 'Nghe hết câu có tín hiệu "however / instead / moved to"' },
      { id: 'l1-c3', text: 'Không bỏ trống bất kỳ câu nào (đoán có cơ sở nếu lỡ nhịp)' },
    ],
  },
  {
    id: 'listening-part2',
    skill: 'listening',
    partLabel: 'Part 2 · Câu 9–20',
    title: 'Hội thoại 2 người (3 đoạn × 4 câu)',
    duration: '12 câu · 3 đoạn hội thoại',
    taskInfo:
      'Nghe 3 cuộc hội thoại về đời sống, công việc hoặc học tập (mỗi đoạn 4 câu hỏi). Câu hỏi thường theo đúng trình tự thời gian của cuộc nói chuyện.',
    steps: [
      'Trong thời gian nghỉ đọc câu hỏi, xác định xem 2 người đang nói chuyện về bối cảnh gì (bệnh viện, du lịch, đăng ký môn học, phỏng vấn).',
      'Theo dõi thái độ & ý kiến riêng của từng nhân vật (Nam nói gì, Nữ đồng ý hay phản đối) vì câu hỏi hay hỏi "What does the woman think / suggest?".',
      'Chú ý cấu trúc đồng tình/phản đối gián tiếp (ví dụ: "That sounds pricey" = đắt quá -> từ chối).',
    ],
    traps: [
      'Người A gợi ý phương án X, người B khen một chút rồi từ chối bằng "but..." và chọn phương án Y → Đáp án cuối cùng là Y.',
      'Câu hỏi suy luận thái độ (How does the man feel?): Không nghe thấy từ "disappointed" trực tiếp mà phải nghe ngữ điệu hoặc cụm đồng nghĩa như "it wasn’t what I expected".',
    ],
    templates: [
      {
        label: 'Cấu trúc đồng ý / từ chối gián tiếp cần nhận diện',
        phrases: [
          'Why don’t we...? / How about...? -> Đưa ra gợi ý (Suggestion)',
          'I’d love to, but... / To be honest, I’m not sure... -> Từ chối lịch sự',
          'You have a point there / Couldn’t agree more -> Đồng ý',
          'Wait, let’s double-check... -> Sắp sửa thông tin',
        ],
      },
    ],
    sample: {
      title: 'Mẹo bám mạch 4 câu hỏi theo trình tự',
      content:
        'Quy luật VSTEP: Câu 1 luôn nằm ở 20–30% đầu đoạn hội thoại (thường hỏi lý do gặp nhau/chủ đề), Câu 2–3 ở phần thân (chi tiết vấn đề/lựa chọn), Câu 4 ở 20% cuối (quyết định cuối cùng hoặc việc họ sẽ làm tiếp theo). Khi nghe đến ý câu 3 mà chưa kịp chọn câu 2, hãy bỏ câu 2 và bắt ngay câu 3.',
    },
    checklist: [
      { id: 'l2-c1', text: 'Phân biệt rõ câu hỏi hỏi ý kiến của người Nam hay người Nữ' },
      { id: 'l2-c2', text: 'Ghi chú nhanh từ khóa bên cạnh 4 câu trước khi nghe' },
      { id: 'l2-c3', text: 'Bắt tín hiệu chuyển ý để không bị lạc sang câu kế tiếp' },
    ],
  },
  {
    id: 'listening-part3',
    skill: 'listening',
    partLabel: 'Part 3 · Câu 21–35',
    title: 'Bài giảng & Bài nói học thuật (3 đoạn × 5 câu)',
    duration: '15 câu · Khó nhất phần Nghe (quyết định B2)',
    taskInfo:
      'Nghe 3 bài nói chuyện hoặc bài giảng ngắn (về môi trường, tâm lý, công nghệ, lịch sử...). Đòi hỏi nghe hiểu ý chính, ví dụ minh họa và từ đồng nghĩa (paraphrase).',
    steps: [
      'Đọc kỹ câu hỏi đầu tiên (thường là Main idea / Topic) và 4 câu còn lại để hình dung cấu trúc bài giảng.',
      'Nghe kỹ 2 câu mở đầu của diễn giả để bắt chủ đề chính (Today we’re going to explore...).',
      'Khi diễn giả nói các từ chuyển đoạn ("First of all", "Another factor", "In contrast", "To sum up"), đó là mốc báo hiệu đáp án cho câu hỏi tiếp theo.',
    ],
    traps: [
      'Bẫy Paraphrase: Trong băng nói "prevent soil erosion", đáp án ghi "protect the land from wearing away". Đừng chờ nghe đúng từ trên màn hình.',
      'Ví dụ minh họa bị nhầm thành ý chính: Câu hỏi "What is the talk mainly about?" thường bẫy bằng 1 chi tiết xuất hiện ở giữa bài.',
    ],
    templates: [
      {
        label: 'Dấu hiệu chuyển mục trong bài giảng học thuật',
        phrases: [
          'Today I’d like to focus on... -> Đáp án câu Main Idea',
          'For instance / Take X as an example -> Giải thích chi tiết ngay sau đó',
          'Surprisingly / Contrary to popular belief -> Dấu hiệu câu hỏi suy luận/nhấn mạnh',
          'The main reason for this is... -> Đáp án câu nguyên nhân',
        ],
      },
    ],
    sample: {
      title: 'Chiến thuật ghi điểm B2 ở Part 3',
      content:
        'Để đạt B1 bạn cần ~14–16/35 câu đúng, để đạt B2 cần ~21–24/35 câu đúng. Hãy ưu tiên làm chắc 8 câu Part 1 + 10 câu Part 2 (18 điểm chắc), sau đó Part 3 tập trung vào các câu hỏi chi tiết rõ ràng và câu mở đầu, kết hợp loại trừ các phương án cực đoan chứa "always, never, only, completely".',
    },
    checklist: [
      { id: 'l3-c1', text: 'Bắt trọn câu mở bài của diễn giả để chốt câu Main Idea' },
      { id: 'l3-c2', text: 'Cảnh giác với phương án chứa từ tuyệt đối (always/never/all)' },
      { id: 'l3-c3', text: 'Nghe hiểu ý paraphrase thay vì dò từng từ đơn lẻ' },
    ],
  },

  // ================= READING =================
  {
    id: 'reading-strategy',
    skill: 'reading',
    partLabel: 'Chiến thuật 60 phút',
    title: 'Quản lý thời gian & Skimming / Scanning',
    duration: '4 Passages · ~15 phút / bài',
    taskInfo:
      'Đề Reading VSTEP gồm 4 bài đọc (~400–500 từ/bài, 40 câu). Độ khó tăng dần từ Passage 1 (B1) đến Passage 3–4 (B2–C1). Không đủ thời gian là lỗi phổ biến nhất.',
    steps: [
      'Phân bổ thời gian chuẩn: Passage 1 (10–12 phút), Passage 2 (13–15 phút), Passage 3 (15–17 phút), Passage 4 (15–17 phút). Dư 3 phút kiểm tra các câu khoanh tạm.',
      'KHÔNG đọc dịch toàn bộ bài từ đầu đến cuối. Bước 1: Đọc tiêu đề + câu đầu mỗi đoạn trong 60 giây (Skimming).',
      'Bước 2: Đọc câu hỏi, gạch từ khóa (tên riêng, năm, con số, danh từ chuyên ngành), rồi quét mắt tìm đúng đoạn chứa thông tin (Scanning).',
      'Làm câu dễ trước (Vocabulary, Reference, Detail có từ khóa), để câu Main Idea và Inference làm cuối cùng khi đã hiểu gần hết bài.',
    ],
    traps: [
      'Sa lầy quá 20 phút ở 1 bài đọc khó khiến mất trắng điểm dễ ở bài sau.',
      'Suy diễn dựa vào kiến thức đời sống cá nhân thay vì bám vào thông tin viết trong bài.',
    ],
    templates: [
      {
        label: 'Thứ tự ưu tiên làm câu hỏi trong mỗi Passage',
        phrases: [
          'Ưu tiên 1: Reference (What does "it/they/this" refer to?) -> Đọc ngay 1-2 câu trước đó',
          'Ưu tiên 2: Vocabulary in context (closest in meaning to) -> Thay 4 đáp án vào ngữ cảnh',
          'Ưu tiên 3: Detail (According to paragraph X...) -> Quét đúng đoạn X',
          'Ưu tiên 4: Inference / NOT mentioned -> Đọc kỹ & loại trừ',
          'Ưu tiên 5: Main Idea / Title / Purpose -> Làm cuối cùng sau khi đã đọc qua các đoạn',
        ],
      },
    ],
    sample: {
      title: 'Quy tắc vàng: Không bỏ câu + Quản trị đồng hồ',
      content:
        'Nếu đến phút thứ 45 bạn mới đang ở Passage 3, hãy làm ngay các câu có số đoạn rõ ràng (In paragraph 2..., The word "X" in line 10...) của cả Passage 3 và 4 trước khi suy nghĩ các câu suy luận dài.',
    },
    checklist: [
      { id: 'r1-c1', text: 'Skimming tiêu đề + câu đầu đoạn trong 60 giây' },
      { id: 'r1-c2', text: 'Làm câu Vocab/Reference/Detail trước, Main Idea làm sau cùng' },
      { id: 'r1-c3', text: 'Giới hạn tối đa 15–17 phút cho mỗi Passage' },
    ],
  },
  {
    id: 'reading-detail-vocab',
    skill: 'reading',
    partLabel: 'Dạng Detail, Vocab & Reference',
    title: 'Xử lý câu hỏi Chi tiết, Từ vựng & Quy chiếu',
    duration: 'Chiếm ~60% tổng số câu Reading',
    taskInfo:
      'Đây là nhóm câu hỏi "ăn điểm chắc" nhất để đảm bảo vượt ngưỡng B1 và chạm B2. Chỉ cần tìm đúng câu chứa thông tin trong bài và đọc kỹ nghĩa.',
    steps: [
      'Với câu **Vocabulary in context**: Tìm từ trong bài, đọc trọn câu chứa từ đó + câu liền trước/sau. Xác định sắc thái tích cực/tiêu cực, thử thay từng đáp án A/B/C/D vào xem câu có hợp nghĩa không.',
      'Với câu **Reference (they/it/these/which)**: Đại từ luôn thay thế cho danh từ xuất hiện NGAY PHÍA TRƯỚC nó. Kiểm tra sự hòa hợp số ít/số nhiều (it = số ít, they/them/those = số nhiều).',
      'Với câu **Detail / NOT true**: Đọc kỹ câu hỏi xem hỏi TRUE hay EXCEPT/NOT. Khoanh vùng đúng 1–2 câu trong bài rồi đối chiếu ý (paraphrase), tránh chọn theo mặt chữ.',
    ],
    traps: [
      'Từ vựng quen thuộc nhưng mang nghĩa thứ 2 trong ngữ cảnh (ví dụ "address" là giải quyết, "issue" là vấn đề hoặc phát hành).',
      'Câu hỏi "All of the following are true EXCEPT..." → Phải tìm 3 ý CÓ xuất hiện để loại, ý còn lại không có hoặc bị nói ngược là đáp án.',
    ],
    templates: [
      {
        label: 'Dấu hiệu đoán nghĩa từ mới ngay trong đoạn văn',
        phrases: [
          'A, or [định nghĩa], ... / X, which means ... -> Định nghĩa ngay phía sau',
          'such as / including / for example -> Suy ra loại từ qua ví dụ liệt kê',
          'Unlike X, Y is... / However, ... -> Đoán nghĩa đối lập với vế đã biết',
        ],
      },
    ],
    sample: {
      title: 'Ví dụ câu Reference & Vocabulary',
      content:
        'Đoạn văn: "Solar panels convert sunlight directly into electricity. Although they require a high upfront investment, their maintenance costs remain remarkably low."\n→ "they" thay cho danh từ số nhiều đứng trước là "Solar panels" (chứ không phải "electricity" hay "sunlight").\n→ "upfront" (đi trước investment, đối lập với "low maintenance costs" về sau) mang nghĩa "ban đầu / trả trước" = initial.',
    },
    checklist: [
      { id: 'r2-c1', text: 'Kiểm tra số ít / số nhiều khi làm câu Reference' },
      { id: 'r2-c2', text: 'Thay thử từng phương án vào ngữ cảnh ở câu Vocabulary' },
      { id: 'r2-c3', text: 'Đọc kỹ chữ NOT / EXCEPT trong đề câu hỏi chi tiết' },
    ],
  },
  {
    id: 'reading-inference-main',
    skill: 'reading',
    partLabel: 'Dạng Main Idea, Inference & Purpose',
    title: 'Xử lý câu Ý chính, Suy luận & Mục đích tác giả',
    duration: 'Nhóm câu phân loại điểm B2–C1',
    taskInfo:
      'Yêu cầu tổng hợp thông tin từ nhiều câu hoặc cả đoạn văn để rút ra ý bao quát, điều có thể suy ra hợp lý, hoặc thái độ của tác giả.',
    steps: [
      'Với **Main Idea / Best Title**: Tổng hợp Topic Sentence (câu 1–2) của từng đoạn. Đáp án đúng phải KHÔNG quá hẹp (chỉ nói về 1 đoạn) và KHÔNG quá rộng (vượt ngoài phạm vi bài).',
      'Với **Inference (What can be inferred / implied...)**: Đáp án đúng KHÔNG viết nguyên văn trong bài, mà là hệ quả logic 100% chắc chắn từ dữ kiện bài cho.',
      'Với **Author’s Purpose / Tone**: Xem mục đích viết (to inform, to warn, to criticize, to compare). Chú ý các tính từ bộc lộ thái độ của tác giả.',
    ],
    traps: [
      'Bẫy Main Idea "Too narrow": Đáp án chép đúng y hệt một câu có thật ở đoạn 2 để lừa thí sinh chọn vội, nhưng nó không bao trùm đoạn 1, 3, 4.',
      'Bẫy Inference "Over-generalization": Phương án chứa các từ khẳng định quá đà (always, every, impossible, completely) thường là sai.',
    ],
    templates: [
      {
        label: 'Từ khóa nhận diện thái độ & mục đích tác giả',
        phrases: [
          'Informative / Objective -> đưa số liệu, nghiên cứu, không phán xét',
          'Cautious / Concerned -> dùng may/might, warn, risk, threat',
          'Optimistic / Supportive -> dùng promising, effective, breakthrough',
          'Critical / Skeptical -> dùng fail to, flawed, questionable, however',
        ],
      },
    ],
    sample: {
      title: 'Ví dụ câu Suy luận chuẩn B2',
      content:
        'Bài đọc viết: "Prior to 2015, fewer than 10% of rural schools had high-speed internet. Today, over 85% are connected."\n→ Suy luận hợp lý (Inferred): Access to high-speed internet in rural schools has expanded dramatically since 2015.\n→ Suy luận sai (Too extreme): All rural students now prefer online classes over traditional ones (bài không nhắc đến sở thích học sinh).',
    },
    checklist: [
      { id: 'r3-c1', text: 'Loại phương án Main Idea quá hẹp (chỉ đúng 1 đoạn) hoặc quá rộng' },
      { id: 'r3-c2', text: 'Không suy diễn ngoài dữ kiện bài với câu Inference' },
      { id: 'r3-c3', text: 'Kiểm tra các từ tuyệt đối để loại trừ đáp án nhiễu' },
    ],
  },

  // ================= WRITING =================
  {
    id: 'writing-task1-informal',
    skill: 'writing',
    partLabel: 'Task 1 · Thư thân mật',
    title: 'Informal Letter / Email (Bạn bè, người thân)',
    duration: '20 phút · Tối thiểu 120 từ (nên viết 140–170 từ)',
    taskInfo:
      'Viết thư/email cho bạn bè hoặc người quen (mời đi chơi, kể về kỳ nghỉ, cho lời khuyên, xin lỗi bạn thân, cảm ơn). Phải trả lời ĐỦ tất cả các ý hỏi trong đề.',
    steps: [
      'Phút 1–3: Đọc đề, xác định người nhận (bạn thân -> Informal) và gạch chân đủ 3–4 yêu cầu (bullet points) trong đề để không sót ý.',
      'Phút 4–16: Viết theo bố cục 4 phần: Lời chào + Hỏi thăm (Opening) → Mục đích thư & Giải quyết hết các ý đề hỏi (Body 1–2) → Câu kết + Lời chúc (Closing).',
      'Phút 17–20: Đếm số từ (>120 từ), rà lỗi chia động từ (thì quá khứ/tương lai), lỗi chính tả và mạo từ.',
    ],
    traps: [
      'Lẫn lộn văn phong: Viết thư cho bạn thân nhưng lại dùng "Dear Sir/Madam" hoặc "I would be grateful if..." (lỗi sai Register bị trừ nặng điểm Task Achievement).',
      'Viết thiếu 1 ý phụ trong đề bài (ví dụ đề bảo vừa kể chuyến đi, vừa gợi ý chỗ ở, vừa hẹn gặp mà quên mất phần hẹn gặp).',
    ],
    templates: [
      {
        label: 'Khung mẫu Informal Email ăn điểm B1–B2',
        phrases: [
          'Chào & Mở bài: Hi [Name], / How have you been? Sorry I haven’t written for a while, I’ve been snowed under with work/exams lately.',
          'Nêu lý do viết: I’m writing to tell you about... / I was thrilled to hear that you’re visiting...',
          'Đưa gợi ý / Khuyên: Why don’t we...? / If I were you, I’d... / You really shouldn’t miss...',
          'Kết thư: Anyway, I’d better get back to work now. Drop me a line soon! / Looking forward to catching up soon.',
          'Ký tên: Best wishes, / Warmly, / Cheers, + [Tên]',
        ],
      },
    ],
    sample: {
      title: 'Đoạn mẫu Informal Email (Cho lời khuyên bạn sắp sang Việt Nam)',
      content:
        'Hi Sarah,\n\nIt was lovely to hear from you! I’m so excited that you’ve decided to visit Vietnam next month.\n\nSince you’re only staying for five days, I’d strongly recommend spending two days in Hanoi and taking a short trip to Ha Long Bay. As for accommodation, the Old Quarter is super convenient because you can walk to most attractions and try amazing street food. Just remember to pack light clothes, as it’s quite humid this time of year.\n\nLet me know your flight details so I can pick you up at the airport!\n\nBest wishes,\nMinh',
    },
    checklist: [
      { id: 'w1-c1', text: 'Đủ tối thiểu 120 từ (khuyên 140–170 từ)' },
      { id: 'w1-c2', text: 'Trả lời trọn vẹn mọi câu hỏi / gạch đầu dòng trong đề' },
      { id: 'w1-c3', text: 'Dùng đúng giọng văn thân mật (dùng viết tắt I’m, you’ll tự nhiên)' },
    ],
    timerPresets: [
      { label: 'Bấm giờ Task 1 (20 phút)', seconds: 20 * 60 },
      { label: 'Luyện nhanh (15 phút)', seconds: 15 * 60 },
    ],
  },
  {
    id: 'writing-task1-formal',
    skill: 'writing',
    partLabel: 'Task 1 · Thư trang trọng',
    title: 'Formal Letter / Email (Phàn nàn, Xin việc, Hỏi thông tin)',
    duration: '20 phút · Tối thiểu 120 từ',
    taskInfo:
      'Viết thư gửi trung tâm, nhà tuyển dụng, quản lý khách sạn, giáo sư hoặc ban tổ chức (phàn nàn dịch vụ, xin học bổng/việc làm, hỏi thông tin khóa học, xin nghỉ/hoãn lịch).',
    steps: [
      'Phút 1–3: Xác định đúng tên người nhận: nếu không biết tên dùng "Dear Sir or Madam," (kết bằng "Yours faithfully,"); nếu biết họ/tên dùng "Dear Mr./Ms. Smith," (kết bằng "Yours sincerely,").',
      'Phút 4–16: Viết câu đầu nêu rõ mục đích thư ("I am writing to inquire about / complain about / apply for..."). Chia rõ 2 đoạn thân bài giải quyết toàn bộ yêu cầu đề.',
      'Phút 17–20: Kiểm tra tuyệt đối KHÔNG dùng từ viết tắt (I’m -> I am, can’t -> cannot) và không dùng tiếng lóng.',
    ],
    traps: [
      'Dùng sai cặp chào – kết ("Dear Sir or Madam" lại kết là "Yours sincerely" hoặc ngược lại).',
      'Dùng từ viết tắt (don’t, I’d, gonna) hoặc từ thân mật (thanks a lot, awesome) trong thư trang trọng.',
    ],
    templates: [
      {
        label: 'Bộ câu mẫu Formal Letter cho 4 tình huống hay thi nhất',
        phrases: [
          'Hỏi thông tin: I am writing to inquire about the upcoming [tên khóa học/sự kiện] advertised on your website.',
          'Phàn nàn: I am writing to express my dissatisfaction with the service I received at your [tên nơi] on [ngày].',
          'Xin lỗi/Hoãn lịch: I am writing to sincerely apologize for any inconvenience caused by...',
          'Đề xuất giải pháp/Yêu cầu: I would be grateful if you could provide me with... / I would appreciate a prompt refund or replacement.',
          'Kết thư: Thank you for your time and consideration. I look forward to hearing from you soon.',
        ],
      },
    ],
    sample: {
      title: 'Đoạn mẫu Formal Email (Phàn nàn khóa học / dịch vụ)',
      content:
        'Dear Sir or Madam,\n\nI am writing to express my dissatisfaction with the condition of the room I stayed in at your hotel from 12th to 14th November.\n\nFirstly, the air conditioning did not function properly, which made the room extremely uncomfortable at night. Although I reported this issue to the reception desk twice, no technician arrived to fix it. Furthermore, the Wi-Fi connection was too unstable for me to join an important online meeting.\n\nUnder these circumstances, I would appreciate a partial refund for my stay. Please contact me at this email address at your earliest convenience.\n\nYours faithfully,\nNguyen Van An',
    },
    checklist: [
      { id: 'w2-c1', text: 'Không viết tắt (không dùng I’m, don’t, can’t)' },
      { id: 'w2-c2', text: 'Đúng cặp chào – kết (Sir/Madam -> faithfully | Mr./Ms. -> sincerely)' },
      { id: 'w2-c3', text: 'Câu đầu tiên nêu trực diện lý do viết thư' },
    ],
    timerPresets: [
      { label: 'Bấm giờ Task 1 (20 phút)', seconds: 20 * 60 },
    ],
  },
  {
    id: 'writing-task2-opinion',
    skill: 'writing',
    partLabel: 'Task 2 · Opinion & Discussion',
    title: 'Bài luận Quan điểm & Thảo luận 2 chiều',
    duration: '40 phút · Tối thiểu 250 từ (chiếm 2/3 điểm Writing)',
    taskInfo:
      'Gồm 2 dạng phổ biến nhất: (1) Opinion (Do you agree or disagree? / To what extent...) và (2) Discussion (Discuss both views and give your own opinion). Nên viết 260–310 từ trong 4 đoạn rõ ràng.',
    steps: [
      'Phút 1–5 (Lập dàn ý): Paraphrase đề bài cho câu mở đầu. Chọn lập trường rõ ràng (Đồng ý hoàn toàn / Đồng ý một phần / Ủng hộ vế nào). Ghi nhanh 2 luận điểm lớn + 2 ví dụ.',
      'Phút 6–10 (Introduction - 2 câu): Câu 1 dẫn bối cảnh (Paraphrase đề); Câu 2 (Thesis statement) nêu rõ quan điểm của bạn.',
      'Phút 11–30 (2 đoạn Body - mỗi đoạn 90–110 từ): Mở đoạn bằng Topic Sentence → Giải thích lý do (This is because...) → Đưa ví dụ thực tế (For instance...) → Chốt kết quả (As a result...).',
      'Phút 31–35 (Conclusion - 2 câu): Tóm lại 2 ý chính bằng từ ngữ khác và khẳng định lại quan điểm (tuyệt đối KHÔNG thêm ý mới ở kết bài).',
      'Phút 36–40: Rà soát lỗi S–V agreement, từ nối và số từ (≥ 250 từ).',
    ],
    traps: [
      'Không trả lời thẳng câu hỏi của đề (đề hỏi "Discuss both views AND give your opinion" nhưng chỉ thảo luận 2 bên mà quên nêu quan điểm bản thân).',
      'Chép nguyên văn câu đề bài vào phần mở bài (phải paraphrase bằng từ đồng nghĩa hoặc đổi cấu trúc câu).',
      'Viết quá dài (>350 từ) dẫn tới không kịp kiểm tra lỗi ngữ pháp cơ bản.',
    ],
    templates: [
      {
        label: 'Khung câu chuẩn B2 cho Opinion & Discussion Essay',
        phrases: [
          'Mở bài (Bối cảnh): In recent years, the question of whether [chủ đề] has sparked considerable debate.',
          'Thesis (Opinion): While I acknowledge certain drawbacks, I firmly believe that [quan điểm] brings far greater benefits.',
          'Thesis (Discussion): This essay will examine both perspectives before explaining why I lean toward the latter view.',
          'Body 1: On the one hand, there are compelling reasons why some people support... First and foremost,...',
          'Body 2: On the other hand, I would argue that... Another significant point to consider is that...',
          'Kết bài: In conclusion, although [ý đối lập], I remain convinced that [quan điểm chính].',
        ],
      },
      {
        label: '5 cách mở đầu câu học thuật nâng band B2 (tham khảo Bảo - Brian)',
        phrases: [
          '1. Bị động khách quan: It is widely believed / acknowledged that + [S + V]...',
          '2. Nhìn từ góc độ cụ thể: From an economic / environmental perspective, + [S + V]...',
          '3. Nêu bối cảnh thực tế: Given the rapid rise of + [N/V-ing], + [S + V]...',
          '4. Đặt vấn đề cân bằng: While it is true that [ý A], + [ý B]...',
          '5. Dùng V-ing làm chủ ngữ: Investing in / Adopting + [N] + brings long-term benefits to...',
        ],
      },
    ],
    sample: {
      title: 'Ví dụ cấu trúc 1 đoạn Body đạt chuẩn B2 (PEEL)',
      content:
        '[Point] First and foremost, remote work significantly boosts employee productivity by eliminating daily commutes. [Explain] Without spending hours stuck in traffic congestion, workers feel less exhausted and can allocate more time and energy to core tasks. [Example] For instance, a survey conducted in major tech firms revealed that staff working from home completed projects 15% faster than office-based peers. [Link] Consequently, flexible working arrangements benefit both individual well-being and company output.',
    },
    checklist: [
      { id: 'w3-c1', text: 'Đạt tối thiểu 250 từ (mục tiêu an toàn 270–300 từ)' },
      { id: 'w3-c2', text: 'Có Thesis Statement trả lời trực tiếp câu hỏi đề' },
      { id: 'w3-c3', text: 'Mỗi đoạn Body phát triển đủ Point → Explain → Example' },
      { id: 'w3-c4', text: 'Sử dụng đa dạng câu phức (Although, Which, If, Not only...)' },
    ],
    timerPresets: [
      { label: 'Bấm giờ Task 2 (40 phút)', seconds: 40 * 60 },
      { label: 'Luyện lập dàn ý (5 phút)', seconds: 5 * 60 },
    ],
  },
  {
    id: 'writing-task2-cause-adv',
    skill: 'writing',
    partLabel: 'Task 2 · Causes–Solutions & Adv–Disadv',
    title: 'Bài luận Nguyên nhân – Giải pháp & Lợi ích – Hạn chế',
    duration: '40 phút · Tối thiểu 250 từ',
    taskInfo:
      'Gồm 2 dạng phổ biến khác: (1) Causes–Effects/Solutions (What are the reasons/effects and what solutions can be taken?) và (2) Advantages–Disadvantages (Do the advantages outweigh the disadvantages?).',
    steps: [
      'Với **Causes & Solutions**: Body 1 trình bày 2 nguyên nhân (hoặc tác hại), Body 2 trình bày 2 giải pháp tương ứng với từng nguyên nhân đó (giải pháp ở cấp Chính phủ/Trường học & cấp Cá nhân).',
      'Với **Advantages & Disadvantages**: Nếu đề hỏi "Do advantages outweigh disadvantages?", bắt buộc phải nêu rõ bên nào nặng hơn ngay ở Mở bài và Kết bài.',
      'Giữ cân bằng độ dài giữa Body 1 và Body 2 (mỗi đoạn khoảng 90–110 từ).',
    ],
    traps: [
      'Viết giải pháp quá chung chung ("Everyone should raise awareness") mà không nói rõ bằng cách nào (qua chiến dịch truyền thông, đưa vào chương trình học, hay phạt tiền).',
      'Liệt kê 4–5 ý trong một đoạn mà không giải thích ý nào tới nơi tới chốn → hãy chọn 2 ý tốt nhất và phân tích sâu.',
    ],
    templates: [
      {
        label: 'Từ nối & Cụm học thuật cho Causes/Solutions & Adv/Disadv',
        phrases: [
          'Nêu nguyên nhân: One primary driver of this issue is... / This trend can be attributed to...',
          'Nêu giải pháp: To tackle this problem effectively, governments should... / Another viable measure would be to...',
          'Nêu lợi ích: One undeniable advantage of... is that... / Furthermore, it offers the benefit of...',
          'Nêu nhược điểm: Despite these merits, a major drawback is that... / Equally concerning is the fact that...',
          'Chốt Outweigh: Overall, I firmly believe that the benefits far outweigh the potential drawbacks.',
        ],
      },
    ],
    sample: {
      title: 'Ví dụ cặp Nguyên nhân – Giải pháp ăn điểm',
      content:
        'Nguyên nhân: Urban air pollution stems primarily from heavy reliance on private fossil-fuel vehicles.\nGiải pháp tương ứng: To address this, local authorities should invest heavily in reliable public transport networks, such as metro lines and electric buses, while imposing higher congestion charges on private cars in city centers.',
    },
    checklist: [
      { id: 'w4-c1', text: 'Mỗi đoạn thân bài chọn đúng 2 ý và giải thích sâu (không liệt kê)' },
      { id: 'w4-c2', text: 'Giải pháp cụ thể (ai làm + làm gì + kết quả ra sao)' },
      { id: 'w4-c3', text: 'Nếu có từ "outweigh", nêu rõ bên nào hơn ở Mở bài & Kết bài' },
    ],
    timerPresets: [
      { label: 'Bấm giờ Task 2 (40 phút)', seconds: 40 * 60 },
    ],
  },

  // ================= SPEAKING =================
  {
    id: 'speaking-part1',
    skill: 'speaking',
    partLabel: 'Part 1 · 3 phút',
    title: 'Social Interaction (Tương tác xã hội)',
    duration: 'Trả lời 2 chủ đề · Mỗi chủ đề 3 câu hỏi',
    taskInfo:
      'Máy hiển thị lần lượt 2 chủ đề quen thuộc (Hobbies, Hometown, Work/Study, Music, Food, Sports...), mỗi chủ đề có 3 câu hỏi ngắn. Không có thời gian chuẩn bị riêng — cần phản xạ ngay.',
    steps: [
      'Áp dụng công thức A.R.E (Answer + Reason + Example/Extra): Tuyệt đối không chỉ trả lời "Yes, I do" hoặc "It’s nice" rồi im lặng.',
      'Mỗi câu hỏi nên nói khoảng 2–4 câu (tương đương 20–30 giây), tốc độ vừa phải, phát âm rõ âm cuối (-s, -ed, -t).',
      'Tránh im lặng quá 3 giây: sử dụng câu đệm tự nhiên trong lúc nghĩ ý.',
    ],
    traps: [
      'Nói quá ngắn (1 câu cụt lủn) khiến không đủ dữ liệu chấm từ vựng & ngữ pháp B1–B2.',
      'Học thuộc lòng câu trả lời kiểu robot khiến ngữ điệu cứng đờ.',
    ],
    templates: [
      {
        label: 'Câu đệm câu giờ tự nhiên + Khung mở rộng A.R.E',
        phrases: [
          'Câu đệm khi nghĩ ý: Well, to be honest,... / That’s an interesting question. Actually,... / Let me see, if I have to choose,...',
          'Mở đầu trả lời (Answer): Personally, I’m really into... / In my daily life, I tend to... / To be fair, it depends on...',
          'Kéo dài ý khi không rành chủ đề: I’m not really an expert on this, but from my observation,...',
          'Đưa ví dụ nhanh (Example): For example, last weekend I... / Usually, I do this twice a week with my friends.',
        ],
      },
      {
        label: '5 lý do "vạn năng" lắp được vào hầu hết mọi câu hỏi Part 1',
        phrases: [
          '1. Giảm stress & thư giãn: The main reason is that it helps me unwind and recharge my batteries after a tiring day.',
          '2. Tốt cho sức khỏe: Above all, it keeps me physically active and boosts my overall well-being.',
          '3. Tiết kiệm thời gian / tiền bạc: Plus, it is super convenient and cost-effective, which suits my busy schedule.',
          '4. Kết nối mọi người: What I love most is that it creates great opportunities to bond and catch up with friends.',
          '5. Mở mang kiến thức: Besides, it helps me broaden my horizons and pick up practical life skills.',
        ],
      },
      {
        label: 'Top 5 Idioms dễ dùng, tự nhiên ăn điểm Speaking B2',
        phrases: [
          'recharge my batteries (nạp lại năng lượng): Listening to music helps me recharge my batteries after work.',
          'once in a blue moon (rất hiếm khi): I only eat fast food once in a blue moon.',
          'let my hair down (thư giãn, xả hơi): On weekends, I hang out with friends to let my hair down.',
          'kill two birds with one stone (một công đôi việc): Cycling to work kills two birds with one stone — saving money and keeping fit.',
          'a breath of fresh air (làn gió mới, cảm giác dễ chịu mới mẻ): Visiting the countryside is always a breath of fresh air.',
        ],
      },
    ],
    sample: {
      title: 'Ví dụ trả lời Part 1 đạt B2 (Topic: Reading Habits)',
      content:
        'Câu hỏi: "Do you prefer reading paper books or e-books?"\n→ Trả lời mẫu: "Well, to be honest, I much prefer reading traditional paper books. The main reason is that turning real pages feels more relaxing and keeps me away from smartphone distractions. For example, I always read a novel for twenty minutes before going to bed, which helps me sleep much better."',
    },
    checklist: [
      { id: 's1-c1', text: 'Mỗi câu trả lời đều có Trả lời + Lý do + Ví dụ (2–4 câu)' },
      { id: 's1-c2', text: 'Không để khoảng lặng quá 3 giây (dùng câu đệm tự nhiên)' },
      { id: 's1-c3', text: 'Chia đúng thì quá khứ/hiện tại theo câu hỏi của đề' },
    ],
    timerPresets: [
      { label: 'Luyện trả lời Part 1 (3 phút)', seconds: 3 * 60 },
      { label: '1 câu hỏi mẫu (30 giây)', seconds: 30 },
    ],
  },
  {
    id: 'speaking-part2',
    skill: 'speaking',
    partLabel: 'Part 2 · 4 phút (1p chuẩn bị + 3p nói)',
    title: 'Solution Discussion (Thảo luận giải pháp)',
    duration: '1 phút chuẩn bị · 2–3 phút trình bày',
    taskInfo:
      'Đề đưa ra một tình huống thực tế và 3 lựa chọn (Option A, B, C). Bạn phải chọn 1 phương án tốt nhất, giải thích lý do chọn VÀ giải thích lý do KHÔNG chọn 2 phương án còn lại.',
    steps: [
      'Trong 1 phút chuẩn bị: Viết nhanh ra nháp theo 3 cột: Phương án CHỌN (2 lý do) — Phương án LOẠI 1 (1 nhược điểm) — Phương án LOẠI 2 (1 nhược điểm). Không viết cả câu dài.',
      'Mở bài (15 giây): Nhắc lại tình huống đề bài và chốt ngay phương án bạn chọn.',
      'Thân bài 1 (60 giây): Đưa 2 lý do thuyết phục vì sao chọn phương án đó (+ ví dụ ngắn).',
      'Thân bài 2 (45 giây): Lần lượt bác bỏ 2 phương án còn lại bằng câu so sánh hoặc câu điều kiện loại 2 ("If I chose X, it would...").',
      'Kết bài (15 giây): Khẳng định lại sự lựa chọn.',
    ],
    traps: [
      'Chỉ khen phương án mình chọn mà quên giải thích tại sao loại 2 phương án kia (thiếu phần quan trọng của đề Part 2).',
      'Nói quá nhanh khiến hết ý chỉ sau 45 giây rồi im lặng suốt 2 phút còn lại.',
    ],
    templates: [
      {
        label: 'Khung Speaking Part 2 học thuộc dùng cho mọi đề',
        phrases: [
          'Mở bài: Today, I’m going to talk about the situation where [tình huống]. Among the three options, I firmly believe that [Option X] is the best choice for several reasons.',
          'Lý do chọn 1: First and foremost, [Option X] is far more practical and cost-effective because...',
          'Lý do chọn 2: In addition, it allows [đối tượng] to..., which is really beneficial in the long run.',
          'Loại Option Y: On the other hand, I wouldn’t opt for [Option Y] mainly because it tends to be too expensive / time-consuming.',
          'Loại Option Z: Similarly, [Option Z] doesn’t seem suitable here, as it could lead to...',
          'Kết bài: For all these reasons, [Option X] is definitely the most sensible decision.',
        ],
      },
      {
        label: 'Mẫu câu bác bỏ 2 phương án còn lại (dùng cho mọi đề)',
        phrases: [
          'Chê đắt / tốn kém: If I chose [Option], it would put a financial burden on a student/family on a tight budget.',
          'Chê tốn thời gian / bất tiện: Although [Option] sounds interesting, it is quite time-consuming and inconvenient for people with a hectic schedule.',
          'Chê không hợp đối tượng: Compared to [Option X], [Option Y] seems less practical because it might not suit everyone’s taste or needs.',
          'Chê rủi ro / thiếu bền vững: Another drawback of [Option] is that it depends heavily on weather / luck, which makes it unreliable.',
        ],
      },
    ],
    sample: {
      title: 'Ví dụ minh họa (Chọn quà tặng bạn thân sắp du học: Sách, Ba lô, Đồng hồ)',
      content:
        'Chọn: Ba lô (Backpack) → Bền, dùng hằng ngày khi đi học ở nước ngoài, đựng được laptop.\nLoại Sách: Nặng hành lý khi đi máy bay, có thể đọc e-book.\nLoại Đồng hồ: Khó chọn đúng gu thẩm mỹ và giá thành khá đắt đối với sinh viên.',
    },
    checklist: [
      { id: 's2-c1', text: 'Nói đủ 4 phần: Mở bài → 2 lý do chọn → Lý do loại 2 phương án kia → Kết luận' },
      { id: 's2-c2', text: 'Dùng ít nhất 1 câu so sánh hơn và 1 câu điều kiện loại 2' },
      { id: 's2-c3', text: 'Kiểm soát thời lượng nói từ 1 phút 45 giây đến 2 phút 30 giây' },
    ],
    timerPresets: [
      { label: 'Chuẩn bị nháp (1 phút)', seconds: 60 },
      { label: 'Nói Part 2 (3 phút)', seconds: 3 * 60 },
    ],
  },
  {
    id: 'speaking-part3',
    skill: 'speaking',
    partLabel: 'Part 3 · 5 phút (1p chuẩn bị + 4p nói & follow-up)',
    title: 'Topic Development (Phát triển chủ đề + Follow-up)',
    duration: '1 phút chuẩn bị · ~3p thuyết trình + 1p câu hỏi phụ',
    taskInfo:
      'Đề cho một câu chủ đề trung tâm kèm sơ đồ 3 ý gợi ý sẵn và 1 ô "[Your own idea]" (ý của bạn). Sau khi thuyết trình, bạn trả lời thêm 1–3 câu hỏi mở rộng (Follow-up questions).',
    steps: [
      'Trong 1 phút chuẩn bị: Nghĩ ngay 1 ý thứ 4 (Your own idea) thật dễ nói + viết 2–3 từ khóa ví dụ cho từng ý trong sơ đồ.',
      'Mở bài: Diễn giải lại chủ đề trung tâm (Topic) để giới thiệu bài nói.',
      'Thân bài: Lần lượt đi qua Ý 1 → Ý 2 → Ý 3 → Ý tự nghĩ (Your own idea). Với MỖI ý, nói theo 2 bước: Nêu ý + Giải thích/Ví dụ (2–3 câu/ý).',
      'Kết bài: Tóm gọn và trả lời các câu hỏi Follow-up ở cuối màn hình bằng công thức A.R.E giống Part 1 nhưng sâu hơn một chút (góc nhìn xã hội).',
    ],
    traps: [
      'Đọc y nguyên 3 cụm từ trong sơ đồ mà không giải thích hay lấy ví dụ (bài nói chỉ dài 30 giây).',
      'Quên mất phần "Your own idea" hoặc quên trả lời câu hỏi Follow-up hiển thị ở dưới sơ đồ.',
    ],
    templates: [
      {
        label: 'Khung dẫn mạch 4 ý + Kết nối Follow-up Part 3',
        phrases: [
          'Mở bài: It is widely recognized that [Chủ đề]. There are several important aspects to consider regarding this topic.',
          'Ý 1: Firstly, let’s look at [Ý 1]. This means that... For instance,...',
          'Ý 2: Secondly, [Ý 2] plays a crucial role because...',
          'Ý 3: Another key point is [Ý 3]. As a result,...',
          'Ý của bạn: Last but not least, from my own perspective, I’d like to add [Ý riêng]. For example,...',
          'Chuyển sang Follow-up: Now, moving on to the follow-up questions. Regarding the first question,...',
        ],
      },
      {
        label: 'Mẫu câu mở rộng ý & xử lý câu hỏi Follow-up khó',
        phrases: [
          'Kéo dài mỗi nhánh ý trong sơ đồ: In simple terms, this allows people to... Take students as an example: when they..., they can...',
          'Trả lời câu hỏi "What can be done / How to encourage...": In my opinion, both the government/schools and individuals need to take action. First, authorities should... Meanwhile, each person can...',
          'Trả lời câu hỏi "Do you agree / Will X disappear?": Honestly, it’s a double-edged sword / I partly agree. On one hand,... However, on the other hand,...',
          'Câu chốt kết bài khi sắp hết giờ: To sum up, all these factors clearly show why this issue matters so much in modern life.',
        ],
      },
    ],
    sample: {
      title: 'Ví dụ sơ đồ: "Reading is beneficial to students" (3 ý sẵn + 1 ý riêng)',
      content:
        '• Ý 1: Expand knowledge (Mở rộng kiến thức về thế giới)\n• Ý 2: Improve vocabulary & writing (Tăng vốn từ, viết tốt hơn)\n• Ý 3: Reduce stress (Thư giãn sau giờ học)\n• Your own idea: Boost concentration / Focus (Rèn khả năng tập trung sâu trong thời đại mạng xã hội).\n• Follow-up: "How can schools encourage students to read more?" -> Thiết lập thư viện thân thiện + tổ chức câu lạc bộ sách.',
    },
    checklist: [
      { id: 's3-c1', text: 'Phát triển đầy đủ cả 3 ý cho sẵn + 1 ý tự nghĩ (Your own idea)' },
      { id: 's3-c2', text: 'Mỗi ý đều kèm ít nhất 1 câu giải thích hoặc ví dụ' },
      { id: 's3-c3', text: 'Dành đủ thời gian trả lời các câu hỏi Follow-up ở dưới cùng' },
    ],
    timerPresets: [
      { label: 'Chuẩn bị Part 3 (1 phút)', seconds: 60 },
      { label: 'Nói + Follow-up (4 phút)', seconds: 4 * 60 },
    ],
  },
];

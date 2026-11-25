import { GrammarTopic } from '../types';

export const GRAMMAR_TOPICS: GrammarTopic[] = [
  {
    id: 'tenses',
    title: 'Các thì cốt lõi (Tenses)',
    subtitle: 'Hiện tại đơn, Quá khứ đơn, Hiện tại hoàn thành & Tương lai',
    level: 'B1',
    summary:
      'Làm chủ 5 thì hay dùng nhất giúp bạn không bị trừ điểm ngữ pháp ở Writing Task 1/2 và kể chuyện mạch lạc trong Speaking Part 1 & 3.',
    formulas: [
      {
        label: 'Hiện tại đơn (Present Simple)',
        structure: 'S + V(s/es) | S + am/is/are',
        example: 'Public transport reduces traffic congestion in major cities.',
      },
      {
        label: 'Hiện tại hoàn thành (Present Perfect)',
        structure: 'S + have/has + V3/ed',
        example: 'Technology has changed the way students learn over the past decade.',
      },
      {
        label: 'Quá khứ đơn (Past Simple)',
        structure: 'S + V2/ed | S + was/were',
        example: 'Last summer, I attended an intensive English workshop.',
      },
      {
        label: 'Quá khứ tiếp diễn (Past Continuous)',
        structure: 'S + was/were + V-ing',
        example: 'While I was waiting for the bus, it started to rain heavily.',
      },
    ],
    signalWords: [
      'Hiện tại hoàn thành: since, for, recently, lately, so far, over the past few years',
      'Quá khứ đơn: yesterday, last week, ... ago, in 2020',
      'Hiện tại đơn: usually, nowadays, in general, as a rule',
    ],
    vstepUsage:
      'Trong Writing Task 2, câu mở bài mô tả xu hướng hiện nay rất hay dùng Hiện tại hoàn thành ("In recent years, online learning has become increasingly popular..."), sau đó phân tích nguyên nhân/lợi ích bằng Hiện tại đơn.',
    commonMistakes: [
      {
        wrong: 'Since 2020, many people moved to big cities.',
        right: 'Since 2020, many people have moved to big cities.',
        reason: 'Có mốc "Since + thời điểm quá khứ" kéo dài tới hiện tại phải dùng Hiện tại hoàn thành.',
      },
      {
        wrong: 'Nowadays, young people are preferring to shop online.',
        right: 'Nowadays, young people prefer to shop online.',
        reason: 'Động từ chỉ trạng thái/sở thích (prefer, know, believe) không chia ở thì tiếp diễn.',
      },
    ],
    quiz: [
      {
        id: 'tenses-q1',
        question: 'Over the past decade, remote work ______ much more common among office employees.',
        options: ['becomes', 'became', 'has become', 'will become'],
        answerIndex: 2,
        explanation: 'Cụm "Over the past decade" diễn tả sự thay đổi kéo dài từ quá khứ đến hiện tại → dùng Hiện tại hoàn thành (has become).',
      },
      {
        id: 'tenses-q2',
        question: 'When the manager ______ into the meeting room, the team was discussing the budget.',
        options: ['walked', 'was walking', 'has walked', 'walks'],
        answerIndex: 0,
        explanation: 'Hành động cắt ngang một hành động đang diễn ra trong quá khứ (was discussing) → dùng Quá khứ đơn (walked).',
      },
      {
        id: 'tenses-q3',
        question: 'I ______ to my English teacher twice since the beginning of this semester.',
        options: ['spoke', 'have spoken', 'speak', 'am speaking'],
        answerIndex: 1,
        explanation: 'Có "since + mốc thời gian" và số lần lặp lại tính đến hiện tại → dùng Hiện tại hoàn thành.',
      },
      {
        id: 'tenses-q4',
        question: 'Nowadays, regular exercise ______ a vital role in maintaining mental well-being.',
        options: ['played', 'plays', 'was playing', 'had played'],
        answerIndex: 1,
        explanation: 'Sự thật chung ở hiện tại với dấu hiệu "Nowadays" → dùng Hiện tại đơn (plays).',
      },
      {
        id: 'tenses-q5',
        question: 'Two years ago, the local government ______ a new policy to limit single-use plastics.',
        options: ['introduces', 'has introduced', 'introduced', 'is introducing'],
        answerIndex: 2,
        explanation: 'Mốc thời gian xác định đã kết thúc trong quá khứ ("Two years ago") → dùng Quá khứ đơn.',
      },
      {
        id: 'tenses-q6',
        question: 'By the time we arrived at the conference hall, the keynote speech ______.',
        options: ['already started', 'has already started', 'had already started', 'starts'],
        answerIndex: 2,
        explanation: 'Hành động xảy ra trước một mốc/hành động khác trong quá khứ (arrived) → dùng Quá khứ hoàn thành (had already started).',
      },
    ],
  },
  {
    id: 'passive',
    title: 'Câu bị động (Passive Voice)',
    subtitle: 'Bị động các thì & Bị động khách quan (B2)',
    level: 'B1',
    summary:
      'Câu bị động giúp văn phong Writing Task 1 (thư trang trọng) và Task 2 trở nên khách quan, học thuật hơn thay vì lặp lại "People think / We should".',
    formulas: [
      {
        label: 'Công thức tổng quát',
        structure: 'S + be (chia theo thì) + V3/ed (+ by O)',
        example: 'Strict traffic laws should be enforced by the authorities.',
      },
      {
        label: 'Bị động với Modal Verbs',
        structure: 'S + can/should/must/may + be + V3/ed',
        example: 'Renewable energy must be subsidized to encourage green habits.',
      },
      {
        label: 'Bị động khách quan (Nâng band B2)',
        structure: 'It is believed / argued / widely acknowledged that + S + V',
        example: 'It is widely acknowledged that reading improves vocabulary.',
      },
    ],
    signalWords: [
      'Chủ ngữ là vật/khái niệm trừu tượng không tự thực hiện hành động (policies, waste, skills...)',
      'Trạng từ học thuật đi kèm: widely, commonly, effectively, strictly',
    ],
    vstepUsage:
      'Khi viết giải pháp trong Task 2, thay vì viết "The government should build more parks", hãy viết "More green spaces should be constructed to improve urban air quality."',
    commonMistakes: [
      {
        wrong: 'Plastic waste should recycle instead of being burned.',
        right: 'Plastic waste should be recycled instead of being burned.',
        reason: 'Rác thải nhựa không tự tái chế được → cần dạng bị động "should be recycled".',
      },
      {
        wrong: 'A new library is building in our neighborhood.',
        right: 'A new library is being built in our neighborhood.',
        reason: 'Bị động Hiện tại tiếp diễn phải có "being + V3/ed".',
      },
    ],
    quiz: [
      {
        id: 'pass-q1',
        question: 'Practical life skills ______ into the secondary school curriculum.',
        options: ['should integrate', 'should be integrated', 'should be integrating', 'integrated'],
        answerIndex: 1,
        explanation: 'Kỹ năng sống là đối tượng được tích hợp → dùng bị động với modal verb: should be integrated.',
      },
      {
        id: 'pass-q2',
        question: 'Several historic buildings in the old quarter ______ since last year.',
        options: ['have been restored', 'have restored', 'restored', 'are restoring'],
        answerIndex: 0,
        explanation: '"historic buildings" (vật) + "since last year" → Bị động Hiện tại hoàn thành: have been restored.',
      },
      {
        id: 'pass-q3',
        question: 'It ______ that early exposure to a second language boosts cognitive flexibility.',
        options: ['widely believes', 'is widely believed', 'has widely believing', 'widely believed'],
        answerIndex: 1,
        explanation: 'Cấu trúc bị động khách quan: It is widely believed that...',
      },
      {
        id: 'pass-q4',
        question: 'All applications for the scholarship must ______ before 5 p.m. on Friday.',
        options: ['submit', 'be submitting', 'be submitted', 'submitted'],
        answerIndex: 2,
        explanation: 'Sau "must" ở dạng bị động là "be + V3/ed" → be submitted.',
      },
      {
        id: 'pass-q5',
        question: 'At the moment, the main bridge ______ to ease rush-hour congestion.',
        options: ['is expanding', 'is being expanded', 'expands', 'has expanded'],
        answerIndex: 1,
        explanation: '"At the moment" (hiện tại tiếp diễn) + chủ ngữ "the main bridge" (bị động) → is being expanded.',
      },
      {
        id: 'pass-q6',
        question: 'The workshop was canceled because too few tickets ______.',
        options: ['had sold', 'were sold', 'are sold', 'have sold'],
        answerIndex: 1,
        explanation: 'Câu kể ở quá khứ ("was canceled"), vé được bán → bị động Quá khứ đơn: were sold.',
      },
    ],
  },
  {
    id: 'relative-clauses',
    title: 'Mệnh đề quan hệ (Relative Clauses)',
    subtitle: 'Who, Which, That, Whose, Where & Mệnh đề rút gọn',
    level: 'B1',
    summary:
      'Mệnh đề quan hệ là cách nhanh nhất để gộp 2 câu đơn thành 1 câu phức mượt mà — tiêu chí bắt buộc để chạm mức điểm B2 ở Writing và Speaking.',
    formulas: [
      {
        label: 'Xác định (Defining)',
        structure: 'N + who / which / that / whose / where + Clause',
        example: 'Students who manage their time well rarely feel overwhelmed before exams.',
      },
      {
        label: 'Không xác định (Non-defining - có dấu phẩy)',
        structure: 'N, which/who + ..., V (KHÔNG dùng "that")',
        example: 'Remote work saves commuting time, which helps employees spend more time with family.',
      },
      {
        label: 'Rút gọn chủ động / bị động (B2)',
        structure: 'N + V-ing (chủ động) | N + V3/ed (bị động)',
        example: 'Policies introduced by the council reduced noise pollution.',
      },
    ],
    signalWords: [
      'Cụm ", which + V(số ít)" dùng để nhận xét cả mệnh đề đứng trước (rất ăn điểm Writing/Speaking).',
      'Không bao giờ dùng "that" ngay sau dấu phẩy hoặc giới từ (in which, on which).',
    ],
    vstepUsage:
      'Trong Speaking Part 2 & 3, bạn dễ dàng kéo dài câu trả lời bằng mệnh đề ", which means that..." hoặc ", which allows people to...".',
    commonMistakes: [
      {
        wrong: 'Online courses offer flexibility, that is ideal for busy workers.',
        right: 'Online courses offer flexibility, which is ideal for busy workers.',
        reason: 'Mệnh đề quan hệ bổ nghĩa cho cả câu trước (sau dấu phẩy) bắt buộc dùng "which", không dùng "that".',
      },
      {
        wrong: 'The city where I visited last year was peaceful.',
        right: 'The city which/that I visited last year was peaceful.',
        reason: '"visit" cần tân ngữ trực tiếp (visit the city) nên dùng "which/that", không dùng "where".',
      },
    ],
    quiz: [
      {
        id: 'rel-q1',
        question: 'Many people work long hours, ______ often leads to chronic stress and fatigue.',
        options: ['that', 'which', 'what', 'who'],
        answerIndex: 1,
        explanation: 'Thay thế cho cả mệnh đề phía trước sau dấu phẩy luôn dùng "which".',
      },
      {
        id: 'rel-q2',
        question: 'Applicants ______ resumes meet our requirements will be invited for an interview.',
        options: ['who', 'whom', 'whose', 'which'],
        answerIndex: 2,
        explanation: 'Chỉ sự sở hữu ("hồ sơ của ứng viên" = applicants’ resumes) → dùng "whose".',
      },
      {
        id: 'rel-q3',
        question: 'The university ______ I earned my bachelor’s degree has just opened a new campus.',
        options: ['which', 'where', 'that', 'whom'],
        answerIndex: 1,
        explanation: '"I earned my degree AT that university" → trạng từ chỉ nơi chốn dùng "where" (hoặc at which).',
      },
      {
        id: 'rel-q4',
        question: 'Students ______ in team sports tend to develop stronger communication skills.',
        options: ['participate', 'participated', 'participating', 'are participating'],
        answerIndex: 2,
        explanation: 'Rút gọn mệnh đề quan hệ mang nghĩa chủ động ("who participate") → V-ing: participating.',
      },
      {
        id: 'rel-q5',
        question: 'The equipment ______ for the science lab arrived two weeks behind schedule.',
        options: ['ordering', 'ordered', 'which ordered', 'was ordered'],
        answerIndex: 1,
        explanation: 'Rút gọn mệnh đề quan hệ mang nghĩa bị động ("which was ordered") → V3/ed: ordered.',
      },
      {
        id: 'rel-q6',
        question: 'Professor Lan, ______ teaches environmental science, won the national research award.',
        options: ['that', 'whom', 'who', 'whose'],
        answerIndex: 2,
        explanation: 'Mệnh đề không xác định (có dấu phẩy) chỉ người làm chủ ngữ → chỉ được dùng "who".',
      },
    ],
  },
  {
    id: 'conditionals',
    title: 'Câu điều kiện (Conditionals)',
    subtitle: 'Loại 1, Loại 2, Loại 3 & Cấu trúc giả định B2',
    level: 'B1',
    summary:
      'Câu điều kiện giúp bạn lập luận hệ quả ("Nếu chính phủ đầu tư vào X thì Y sẽ xảy ra") cực kỳ thuyết phục trong Writing Task 2 và Speaking Part 2.',
    formulas: [
      {
        label: 'Loại 1 (Có thể xảy ra ở hiện tại/tương lai)',
        structure: 'If + S + V(hiện tại đơn), S + will/can/should + V',
        example: 'If schools offer career counseling, students will choose majors more wisely.',
      },
      {
        label: 'Loại 2 (Không có thật / Giả định ở hiện tại)',
        structure: 'If + S + V2/ed (were), S + would/could + V',
        example: 'If public transport were faster, fewer people would drive private cars.',
      },
      {
        label: 'Loại 3 (Không có thật trong quá khứ)',
        structure: 'If + S + had + V3/ed, S + would/could + have + V3/ed',
        example: 'If I had checked the timetable earlier, I would not have missed the train.',
      },
      {
        label: 'Thay thế If (Nâng điểm B2)',
        structure: 'Unless (= If...not) | Provided that | Without + N',
        example: 'Without strict regulations, industrial pollution will continue to worsen.',
      },
    ],
    signalWords: [
      'Unless = If... not (Không dùng phủ định thêm trong mệnh đề Unless)',
      'Were dùng cho mọi chủ ngữ trong câu điều kiện loại 2 trang trọng (If I were / If it were)',
    ],
    vstepUsage:
      'Khi giải thích lý do chọn phương án ở Speaking Part 2, hãy thêm 1 câu Loại 2 để chứng tỏ khả năng ngữ pháp: "If we chose option B, it would cost too much time and money."',
    commonMistakes: [
      {
        wrong: 'If the government will ban plastic bags, pollution drops.',
        right: 'If the government bans plastic bags, pollution will drop.',
        reason: 'Không dùng "will" trong mệnh đề If của câu điều kiện loại 1.',
      },
      {
        wrong: 'Unless you don’t study hard, you won’t pass the test.',
        right: 'Unless you study hard, you won’t pass the test.',
        reason: '"Unless" đã mang nghĩa phủ định (trừ phi/nếu không), không thêm "don’t".',
      },
    ],
    quiz: [
      {
        id: 'cond-q1',
        question: 'If cities ______ more bicycle lanes, commuting would become safer and greener.',
        options: ['build', 'built', 'will build', 'had built'],
        answerIndex: 1,
        explanation: 'Vế chính là "would become" → Câu điều kiện loại 2 → mệnh đề If chia Quá khứ đơn (built).',
      },
      {
        id: 'cond-q2',
        question: '______ immediate action is taken, coastal erosion will threaten local villages.',
        options: ['If', 'Unless', 'Provided', 'Suppose'],
        answerIndex: 1,
        explanation: 'Nghĩa câu: "Nếu hành động ngay KHÔNG được thực hiện, xói mòn sẽ đe dọa..." → Unless.',
      },
      {
        id: 'cond-q3',
        question: 'If she had submitted the application on time, she ______ the internship.',
        options: ['would get', 'got', 'would have gotten', 'will have gotten'],
        answerIndex: 2,
        explanation: 'Mệnh đề If chia "had submitted" → Câu điều kiện loại 3 → vế chính: would have + V3/ed.',
      },
      {
        id: 'cond-q4',
        question: '______ affordable childcare, many parents find it hard to return to full-time work.',
        options: ['If not', 'Unless', 'Without', 'In case'],
        answerIndex: 2,
        explanation: 'Theo sau là danh từ "affordable childcare" → dùng giới từ "Without + N".',
      },
      {
        id: 'cond-q5',
        question: 'If I ______ you, I would practice speaking aloud for 15 minutes every morning.',
        options: ['am', 'was', 'were', 'had been'],
        answerIndex: 2,
        explanation: 'Câu khuyên bảo giả định loại 2 trang trọng dùng "If I were you".',
      },
      {
        id: 'cond-q6',
        question: 'Students can borrow laptops from the library ______ they return them within 48 hours.',
        options: ['unless', 'provided that', 'otherwise', 'despite'],
        answerIndex: 1,
        explanation: '"provided that" = miễn là (với điều kiện là), tương đương "if".',
      },
    ],
  },
  {
    id: 'complex-sentences',
    title: 'Câu ghép & Câu phức (Complex Sentences)',
    subtitle: 'Liên từ nhượng bộ, nguyên nhân, kết quả chuẩn Writing',
    level: 'B1',
    summary:
      'Sử dụng đúng nhóm từ nối nhượng bộ (Although vs Despite) và nguyên nhân (Because vs Because of) giúp tránh lỗi sai kinh điển và tăng điểm Coherence & Cohesion.',
    formulas: [
      {
        label: 'Nhượng bộ (Concession)',
        structure: 'Although / Even though + S + V | Despite / In spite of + N / V-ing',
        example: 'Despite its high initial cost, solar power saves money in the long run.',
      },
      {
        label: 'Nguyên nhân (Cause)',
        structure: 'Because / Since / As + S + V | Because of / Due to + N / V-ing',
        example: 'Due to heavy traffic, many commuters prefer taking the metro.',
      },
      {
        label: 'Tương phản (Contrast)',
        structure: 'Whereas / While + S + V | However, + S + V',
        example: 'Studying abroad builds independence; however, it can be financially demanding.',
      },
    ],
    signalWords: [
      'Sau Although / Because / Whereas LUÔN là mệnh đề (S + V).',
      'Sau Despite / In spite of / Due to / Because of LUÔN là danh từ / cụm danh từ / V-ing.',
    ],
    vstepUsage:
      'Dùng "Although + Clause A, Clause B" để viết câu chủ đề có tính phản biện (balanced argument) trong Writing Task 2.',
    commonMistakes: [
      {
        wrong: 'Although the weather was bad, but we still enjoyed the trip.',
        right: 'Although the weather was bad, we still enjoyed the trip.',
        reason: 'Trong tiếng Anh KHÔNG dùng cả "Although" và "but" trong cùng một câu.',
      },
      {
        wrong: 'Despite she studied hard, she felt nervous before the speaking test.',
        right: 'Despite studying hard, she felt nervous before the speaking test.',
        reason: 'Sau "Despite" không đi với mệnh đề S+V mà dùng V-ing hoặc cụm danh từ (hoặc "Despite the fact that + S + V").',
      },
    ],
    quiz: [
      {
        id: 'comp-q1',
        question: '______ the rapid growth of online shopping, traditional markets remain popular.',
        options: ['Although', 'Despite', 'Even though', 'Because'],
        answerIndex: 1,
        explanation: 'Phía sau là cụm danh từ "the rapid growth of online shopping" → dùng giới từ "Despite".',
      },
      {
        id: 'comp-q2',
        question: 'The outdoor concert was postponed ______ the sudden thunderstorm.',
        options: ['because', 'since', 'due to', 'although'],
        answerIndex: 2,
        explanation: '"the sudden thunderstorm" là cụm danh từ chỉ nguyên nhân → dùng "due to".',
      },
      {
        id: 'comp-q3',
        question: '______ artificial intelligence offers great efficiency, it raises concerns about job security.',
        options: ['In spite of', 'Because of', 'While', 'However'],
        answerIndex: 2,
        explanation: 'Nối 2 mệnh đề tương phản trong một câu → dùng liên từ "While" (hoặc Although).',
      },
      {
        id: 'comp-q4',
        question: 'Public buses are inexpensive; ______, they are sometimes delayed during peak hours.',
        options: ['although', 'however', 'despite', 'whereas'],
        answerIndex: 1,
        explanation: 'Đứng sau dấu chấm phẩy và trước dấu phẩy để chuyển ý đối lập → trạng từ liên kết "however".',
      },
      {
        id: 'comp-q5',
        question: 'We decided to go by train ______ it was slower than flying.',
        options: ['despite', 'in spite of', 'even though', 'due to'],
        answerIndex: 2,
        explanation: 'Theo sau là mệnh đề "it was slower..." → dùng "even though".',
      },
      {
        id: 'comp-q6',
        question: 'City dwellers enjoy better healthcare services, ______ rural residents often have cleaner air.',
        options: ['whereas', 'despite', 'because of', 'therefore'],
        answerIndex: 0,
        explanation: 'So sánh đối chiếu 2 vế trái ngược nhau ("trong khi đó") → dùng "whereas".',
      },
    ],
  },
  {
    id: 'comparisons',
    title: 'Cấu trúc So sánh (Comparisons)',
    subtitle: 'So sánh hơn/nhất, ngang bằng & So sánh kép (B2)',
    level: 'B1',
    summary:
      'VSTEP Speaking Part 2 (chọn 1 trong 3 giải pháp) và Writing Task 2 liên tục yêu cầu bạn so sánh ưu/nhược điểm giữa các lựa chọn.',
    formulas: [
      {
        label: 'Nhấn mạnh so sánh hơn',
        structure: 'far / much / significantly + adj-er / more + adj + than',
        example: 'E-books are significantly more portable than printed textbooks.',
      },
      {
        label: 'So sánh ngang bằng',
        structure: 'as + adj/adv + as | not as + adj/adv + as',
        example: 'Online meetings are not as engaging as face-to-face discussions.',
      },
      {
        label: 'So sánh kép "Càng... càng..." (B2)',
        structure: 'The + so sánh hơn + S + V, the + so sánh hơn + S + V',
        example: 'The more frequently you practice speaking, the more confident you will become.',
      },
    ],
    signalWords: [
      'Bổ nghĩa nhấn mạnh cho so sánh hơn: much, far, a lot, slightly, significantly (KHÔNG dùng "very").',
      'So sánh kép luôn có "The" ở đầu cả hai vế.',
    ],
    vstepUsage:
      'Trong Speaking Part 2: "Option A is far more cost-effective than Option B, and it is also the most practical choice for college students."',
    commonMistakes: [
      {
        wrong: 'Learning with a teacher is very better than self-study.',
        right: 'Learning with a teacher is much better than self-study.',
        reason: 'Không dùng "very" trước tính từ so sánh hơn; hãy dùng "much / far / a lot".',
      },
      {
        wrong: 'This software is more easier to use than the old version.',
        right: 'This software is much easier to use than the old version.',
        reason: 'Không ghép "more" với tính từ đã thêm đuôi "-er" (easier).',
      },
    ],
    quiz: [
      {
        id: 'cmp-q1',
        question: 'Traveling by high-speed train is ______ more convenient than taking a long-distance coach.',
        options: ['very', 'far', 'so', 'too'],
        answerIndex: 1,
        explanation: 'Dùng "far" (hoặc much/significantly) để nhấn mạnh mức độ của so sánh hơn "more convenient".',
      },
      {
        id: 'cmp-q2',
        question: 'The earlier we address environmental issues, ______ it will be to restore ecosystems.',
        options: ['the easy', 'easier', 'the easier', 'the easiest'],
        answerIndex: 2,
        explanation: 'Cấu trúc so sánh kép: The + so sánh hơn ..., the + so sánh hơn ... → the easier.',
      },
      {
        id: 'cmp-q3',
        question: 'Working from home is not ______ distracting as working in a crowded open office.',
        options: ['so', 'more', 'most', 'like'],
        answerIndex: 0,
        explanation: 'Trong câu phủ định so sánh bằng có thể dùng "not as ... as" hoặc "not so ... as".',
      },
      {
        id: 'cmp-q4',
        question: 'Of the three proposed venues, the downtown community center is ______ accessible.',
        options: ['more', 'the most', 'much', 'as'],
        answerIndex: 1,
        explanation: 'So sánh từ 3 đối tượng trở lên ("Of the three...") → dùng so sánh nhất: the most.',
      },
      {
        id: 'cmp-q5',
        question: 'The new laptop runs twice ______ fast as my five-year-old computer.',
        options: ['more', 'so', 'as', 'than'],
        answerIndex: 2,
        explanation: 'So sánh bội số dùng công thức: twice / three times + as + adj/adv + as.',
      },
      {
        id: 'cmp-q6',
        question: 'Living in the suburbs is usually ______ expensive than renting an apartment downtown.',
        options: ['less', 'fewer', 'least', 'little'],
        answerIndex: 0,
        explanation: '"expensive" là tính từ → so sánh kém hơn dùng "less + adj + than".',
      },
    ],
  },
  {
    id: 'modals',
    title: 'Động từ khuyết thiếu (Modals)',
    subtitle: 'Lời khuyên, nghĩa vụ, suy đoán hiện tại & quá khứ',
    level: 'B1',
    summary:
      'Động từ khuyết thiếu xuất hiện dày đặc trong bài nghe thông báo (Listening Part 1), thư phàn nàn/đề nghị (Writing Task 1) và phần nêu giải pháp (Task 2).',
    formulas: [
      {
        label: 'Lời khuyên & Nghĩa vụ',
        structure: 'should / ought to / must / have to + V(nguyên thể)',
        example: 'Students ought to balance academic studies with physical activity.',
      },
      {
        label: 'Khả năng & Dự đoán',
        structure: 'may / might / could + V(nguyên thể)',
        example: 'Excessive screen time may negatively affect children’s sleep quality.',
      },
      {
        label: 'Suy đoán trong quá khứ (B2)',
        structure: 'must / might / should + have + V3/ed',
        example: 'The flight is empty today; many passengers must have rebooked earlier.',
      },
    ],
    signalWords: [
      'must not (cấm đoán) KHÁC HOÀN TOÀN với do not have to (không cần thiết).',
      'should have + V3/ed: lẽ ra nên làm (nhưng đã không làm trong quá khứ).',
    ],
    vstepUsage:
      'Dùng "may / might / could" để giảm độ tuyệt đối khi lập luận trong Writing Task 2 ("hedging"): thay vì khẳng định "will cause", hãy viết "may lead to".',
    commonMistakes: [
      {
        wrong: 'Visitors mustn’t to bring food into the museum gallery.',
        right: 'Visitors mustn’t bring food into the museum gallery.',
        reason: 'Sau động từ khuyết thiếu (can, must, should, may) luôn là V nguyên thể KHÔNG "to".',
      },
      {
        wrong: 'It’s Sunday tomorrow, so you mustn’t wake up early.',
        right: 'It’s Sunday tomorrow, so you don’t have to wake up early.',
        reason: 'Không bắt buộc/không cần thiết phải làm gì dùng "don’t have to", không dùng "mustn’t" (cấm).',
      },
    ],
    quiz: [
      {
        id: 'mod-q1',
        question: 'Entrance to the public exhibition is free, so visitors ______ buy a ticket.',
        options: ['mustn’t', 'don’t have to', 'shouldn’t', 'can’t'],
        answerIndex: 1,
        explanation: 'Miễn phí nên "không cần thiết" mua vé → don’t have to (không phải cấm đoán).',
      },
      {
        id: 'mod-q2',
        question: 'Passengers ______ keep their seatbelts fastened while the aircraft is taking off.',
        options: ['might', 'must', 'could', 'needn’t'],
        answerIndex: 1,
        explanation: 'Quy định an toàn bắt buộc trên máy bay → must.',
      },
      {
        id: 'mod-q3',
        question: 'The ground is completely wet this morning. It ______ heavily last night.',
        options: ['must rain', 'should rain', 'must have rained', 'can’t rain'],
        answerIndex: 2,
        explanation: 'Suy đoán chắc chắn về một sự việc đã xảy ra trong quá khứ dựa vào bằng chứng hiện tại → must have + V3/ed.',
      },
      {
        id: 'mod-q4',
        question: 'You ______ left your keys at the office; let’s call the receptionist to check.',
        options: ['might have', 'mustn’t have', 'ought to', 'would'],
        answerIndex: 0,
        explanation: 'Suy đoán có khả năng đã xảy ra trong quá khứ (chưa chắc 100%) → might have + V3/ed.',
      },
      {
        id: 'mod-q5',
        question: 'I ______ backed up my essay before my laptop crashed yesterday.',
        options: ['should', 'should have', 'must have', 'may have'],
        answerIndex: 1,
        explanation: 'Tiếc nuối một việc lẽ ra nên làm trong quá khứ nhưng đã không làm → should have + V3/ed.',
      },
      {
        id: 'mod-q6',
        question: 'Without proper regulation, air pollution ______ worsen in rapidly growing cities.',
        options: ['could', 'has to', 'ought', 'need'],
        answerIndex: 0,
        explanation: 'Diễn đạt khả năng có thể xảy ra ("có thể trở nên tệ hơn") → could.',
      },
    ],
  },
  {
    id: 'b2-boosters',
    title: 'Cấu trúc nâng điểm B2 (Boosters)',
    subtitle: 'Đảo ngữ cơ bản, Chủ ngữ giả It/V-ing & Câu chẻ',
    level: 'B2',
    summary:
      'Chỉ cần khéo léo đưa 2–3 cấu trúc này vào bài Writing Task 2 hoặc Speaking Part 3, giám khảo sẽ đánh giá ngay năng lực ngữ pháp của bạn đạt chuẩn B2.',
    formulas: [
      {
        label: 'Not only... but also (Đảo ngữ)',
        structure: 'Not only + trợ V + S + V, but S + also + V',
        example: 'Not only does reading expand vocabulary, but it also reduces stress.',
      },
      {
        label: 'Cấu trúc "It is + adj + (for sb) + to V"',
        structure: 'It is essential / undeniable / crucial that + S + V',
        example: 'It is undeniable that technology plays a central role in modern education.',
      },
      {
        label: 'Danh động từ làm chủ ngữ (V-ing)',
        structure: 'V-ing + (O) + V(chia số ít)',
        example: 'Investing in renewable energy brings long-term economic benefits.',
      },
      {
        label: 'Câu chẻ nhấn mạnh (Cleft Sentence)',
        structure: 'It is + [đối tượng nhấn mạnh] + that/who + V...',
        example: 'It is practical experience that employers value most in new graduates.',
      },
    ],
    signalWords: [
      'Đảo ngữ với Not only / Never / Seldom đứng đầu câu: đưa trợ động từ (does/did/can/is) lên trước chủ ngữ.',
      'V-ing làm chủ ngữ luôn đi với động từ chia ở NGÔI SỐ ÍT.',
    ],
    vstepUsage:
      'Mỗi bài Writing Task 2 nên có ít nhất 1 câu "Not only does X..., but it also..." và 1 câu "It is undeniable that..." để ghi điểm Grammatical Range.',
    commonMistakes: [
      {
        wrong: 'Not only volunteering helps the community, but it also builds soft skills.',
        right: 'Not only does volunteering help the community, but it also builds soft skills.',
        reason: 'Khi "Not only" đứng đầu câu, mệnh đề ngay sau nó PHẢI đảo trợ động từ lên trước chủ ngữ.',
      },
      {
        wrong: 'Eating fresh fruits and vegetables daily improve your immune system.',
        right: 'Eating fresh fruits and vegetables daily improves your immune system.',
        reason: 'Chủ ngữ là cụm V-ing ("Eating...") → động từ chính chia số ít (improves).',
      },
    ],
    quiz: [
      {
        id: 'b2-q1',
        question: 'Not only ______ air pollution, but cycling also improves cardiovascular fitness.',
        options: ['it reduces', 'reduces it', 'does it reduce', 'is it reduce'],
        answerIndex: 2,
        explanation: 'Đảo ngữ với "Not only" đầu câu ở thì Hiện tại đơn: Not only + does + S + V(nguyên thể).',
      },
      {
        id: 'b2-q2',
        question: 'Learning a foreign language consistently ______ memory and problem-solving skills.',
        options: ['enhance', 'enhances', 'enhancing', 'are enhancing'],
        answerIndex: 1,
        explanation: 'Chủ ngữ là cụm V-ing ("Learning a foreign language consistently") → động từ chia số ít: enhances.',
      },
      {
        id: 'b2-q3',
        question: 'It is ______ regular practice rather than talent alone that leads to fluency.',
        options: ['which', 'what', 'that', 'whom'],
        answerIndex: 2,
        explanation: 'Câu chẻ nhấn mạnh: It is [X] that [V...].',
      },
      {
        id: 'b2-q4',
        question: 'Never ______ such a rapid shift toward digital classrooms.',
        options: ['schools have seen', 'have schools seen', 'saw schools', 'do schools saw'],
        answerIndex: 1,
        explanation: 'Trạng từ phủ định "Never" đứng đầu câu → đảo trợ động từ "have" lên trước chủ ngữ "schools".',
      },
      {
        id: 'b2-q5',
        question: 'It is crucial for young graduates ______ adaptable in a changing job market.',
        options: ['remaining', 'remain', 'to remain', 'remained'],
        answerIndex: 2,
        explanation: 'Cấu trúc chủ ngữ giả: It is + adj + for sb + to V → to remain.',
      },
      {
        id: 'b2-q6',
        question: '______ we allocate enough funding will the public transit project succeed.',
        options: ['Only when', 'Only if', 'Only by', 'Provided'],
        answerIndex: 1,
        explanation: 'Chỉ đúng nghĩa điều kiện ("Chỉ khi/nếu chúng ta cấp đủ ngân sách thì dự án mới thành công") + đảo ngữ "will the project succeed" ở vế chính → Only if.',
      },
    ],
  },
];

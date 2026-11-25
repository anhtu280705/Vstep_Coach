export interface ListeningQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface ListeningSectionPractice {
  id: string;
  title: string;
  speakerText: string;
  transcriptDisplay: string;
  questions: ListeningQuestion[];
}

export interface ReadingQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface ReadingPracticePassage {
  guideId: string;
  title: string;
  topicTag: string;
  paragraphs: string[];
  questions: ReadingQuestion[];
}

export interface WritingPromptItem {
  id: string;
  title: string;
  promptText: string;
  outlineHints: string[];
  suggestedVocab: string[];
}

export interface SpeakingPart1Prompt {
  id: string;
  title: string;
  topics: { name: string; questions: string[] }[];
}

export interface SpeakingPart2Prompt {
  id: string;
  title: string;
  situation: string;
  options: { label: string; pros: string; cons: string }[];
}

export interface SpeakingPart3Prompt {
  id: string;
  title: string;
  centralTopic: string;
  ideas: string[];
  yourOwnIdeaHint: string;
  followUpQuestions: string[];
}

// ==================== GÓI A1: LISTENING PRACTICE ====================
export const LISTENING_PRACTICE: Record<string, ListeningSectionPractice[]> = {
  'listening-part1': [
    {
      id: 'lp1-1',
      title: 'Đoạn 1 · Thông báo tại sân bay (Bẫy đổi thông tin)',
      speakerText:
        'Attention passengers traveling on Flight VN 214 to Da Nang. Due to minor technical maintenance, the departure has been rescheduled from 2:15 p.m. to 2:45 p.m. Please also note that boarding will now take place at Gate 14 instead of Gate 9. Thank you for your patience.',
      transcriptDisplay:
        'Attention passengers traveling on Flight VN 214 to Da Nang. Due to minor technical maintenance, the departure has been rescheduled from 2:15 p.m. to 2:45 p.m. Please also note that boarding will now take place at Gate 14 instead of Gate 9. Thank you for your patience.',
      questions: [
        {
          id: 'lp1-1-q1',
          question: 'Where should passengers for Flight VN 214 go to board?',
          options: ['Gate 9', 'Gate 14', 'At 2:15 p.m.', 'The main check-in desk'],
          answerIndex: 1,
          explanation:
            'Thông báo nói "...boarding will now take place at Gate 14 instead of Gate 9" (cửa 14 thay vì cửa 9).',
        },
      ],
    },
    {
      id: 'lp1-2',
      title: 'Đoạn 2 · Thông báo thư viện đại học',
      speakerText:
        'Good afternoon, students. The main library reading room will close early today at 6 p.m. instead of 9 p.m. because of electrical repairs. However, the computer lab on the second floor will stay open until 8 p.m. for anyone needing to submit assignments online.',
      transcriptDisplay:
        'Good afternoon, students. The main library reading room will close early today at 6 p.m. instead of 9 p.m. because of electrical repairs. However, the computer lab on the second floor will stay open until 8 p.m. for anyone needing to submit assignments online.',
      questions: [
        {
          id: 'lp1-2-q1',
          question: 'Until what time can students use the computer lab today?',
          options: ['6:00 p.m.', '8:00 p.m.', '9:00 p.m.', 'It is closed all day'],
          answerIndex: 1,
          explanation:
            '6 p.m. là giờ đóng phòng đọc chính; phòng máy tính tầng 2 mở đến 8 p.m. ("will stay open until 8 p.m.").',
        },
      ],
    },
    {
      id: 'lp1-3',
      title: 'Đoạn 3 · Tin nhắn thoại công việc',
      speakerText:
        'Hi Minh, this is Lan from the marketing department. Just a quick update: our Friday project review has been moved from Room 302 to Conference Room B because the air conditioner in 302 is broken. Also, please bring printed copies of your sales summary, as the projector is still under repair.',
      transcriptDisplay:
        'Hi Minh, this is Lan from the marketing department. Just a quick update: our Friday project review has been moved from Room 302 to Conference Room B because the air conditioner in 302 is broken. Also, please bring printed copies of your sales summary, as the projector is still under repair.',
      questions: [
        {
          id: 'lp1-3-q1',
          question: 'Why does Lan ask Minh to bring printed copies?',
          options: [
            'Room 302 is too hot.',
            'The meeting was moved to Thursday.',
            'The projector is not working.',
            'She lost her digital files.',
          ],
          answerIndex: 2,
          explanation:
            'Cuối đoạn nói: "...bring printed copies of your sales summary, as the projector is still under repair."',
        },
      ],
    },
  ],
  'listening-part2': [
    {
      id: 'lp2-1',
      title: 'Hội thoại · Đăng ký khóa học & Lựa chọn phương tiện',
      speakerText:
        'Woman: Hi David! Are you joining the weekend photography workshop at the cultural center? Man: I’d love to, Sarah, especially since my sister took it last month and loved the outdoor excursion. But I’m worried about the tuition fee. Woman: Actually, there’s a thirty percent student discount if you enroll before Wednesday. Man: Oh, really? That makes it affordable! How are you getting there on Saturday morning? My motorbike is in the shop. Woman: I’m taking the number 14 express bus. It stops right across from the center and avoids morning traffic congestion. Why don’t we meet at the central station at 8:15? Man: Sounds like a plan. I’ll bring my camera and a notebook.',
      transcriptDisplay:
        'Sarah: Hi David! Are you joining the weekend photography workshop at the cultural center?\nDavid: I’d love to, Sarah, especially since my sister took it last month and loved the outdoor excursion. But I’m worried about the tuition fee.\nSarah: Actually, there’s a thirty percent student discount if you enroll before Wednesday.\nDavid: Oh, really? That makes it affordable! How are you getting there on Saturday morning? My motorbike is in the shop.\nSarah: I’m taking the number 14 express bus. It stops right across from the center and avoids morning traffic congestion. Why don’t we meet at the central station at 8:15?\nDavid: Sounds like a plan. I’ll bring my camera and a notebook.',
      questions: [
        {
          id: 'lp2-1-q1',
          question: 'Why is David initially hesitant about joining the workshop?',
          options: [
            'He does not own a good camera.',
            'He is concerned about the cost.',
            'His sister did not enjoy the course.',
            'He has to work on Saturday morning.',
          ],
          answerIndex: 1,
          explanation: 'David nói "I’m worried about the tuition fee" (lo ngại về học phí).',
        },
        {
          id: 'lp2-1-q2',
          question: 'How can David pay a lower price for the workshop?',
          options: [
            'By signing up before Wednesday',
            'By bringing a friend along',
            'By volunteering at the center',
            'By skipping the outdoor excursion',
          ],
          answerIndex: 0,
          explanation: 'Sarah bảo được giảm 30% cho sinh viên nếu đăng ký trước thứ Tư ("enroll before Wednesday").',
        },
        {
          id: 'lp2-1-q3',
          question: 'Why does Sarah choose to take the express bus?',
          options: [
            'Her motorbike is being repaired.',
            'It is free for workshop members.',
            'It stops nearby and avoids heavy traffic.',
            'David asked her to pick him up.',
          ],
          answerIndex: 2,
          explanation: 'Sarah nói xe buýt số 14 dừng ngay đối diện trung tâm và tránh kẹt xe sáng ("avoids morning traffic congestion").',
        },
        {
          id: 'lp2-1-q4',
          question: 'What will the two speakers do on Saturday morning?',
          options: [
            'Meet at central station at 8:15',
            'Go to a motorbike repair shop',
            'Pay the fee at the center at 9:00',
            'Have breakfast at Sarah’s house',
          ],
          answerIndex: 0,
          explanation: 'Cuối hội thoại Sarah hẹn gặp ở ga trung tâm lúc 8:15 và David đồng ý ("Sounds like a plan").',
        },
      ],
    },
  ],
  'listening-part3': [
    {
      id: 'lp3-1',
      title: 'Bài giảng ngắn · Không gian xanh đô thị & Sức khỏe tinh thần',
      speakerText:
        'Today I’d like to explore how urban green spaces, such as city parks and tree-lined streets, contribute to residents’ mental health. With rapid urbanization, many city dwellers experience chronic stress and feel isolated in crowded apartment blocks. First of all, scientific studies show that spending just twenty minutes a day in a park lowers stress hormones and relieves anxiety. Secondly, green areas encourage physical recreation like walking and cycling, which combats a sedentary lifestyle. However, not all neighborhoods have equal access to these amenities. Low-income districts often suffer from a severe shortage of parks. To address this inequality, city planners are now converting unused rooftops and narrow alleys into affordable community gardens. In conclusion, preserving green spaces is not a luxury; it is a crucial investment in public well-being.',
      transcriptDisplay:
        'Today I’d like to explore how urban green spaces, such as city parks and tree-lined streets, contribute to residents’ mental health. With rapid urbanization, many city dwellers experience chronic stress and feel isolated in crowded apartment blocks. First of all, scientific studies show that spending just twenty minutes a day in a park lowers stress hormones and relieves anxiety. Secondly, green areas encourage physical recreation like walking and cycling, which combats a sedentary lifestyle. However, not all neighborhoods have equal access to these amenities. Low-income districts often suffer from a severe shortage of parks. To address this inequality, city planners are now converting unused rooftops and narrow alleys into affordable community gardens. In conclusion, preserving green spaces is not a luxury; it is a crucial investment in public well-being.',
      questions: [
        {
          id: 'lp3-1-q1',
          question: 'What is the main topic of the talk?',
          options: [
            'How to design luxury apartment blocks',
            'The benefits and fair access of urban green spaces',
            'Why city dwellers prefer indoor gyms',
            'The high cost of maintaining city roads',
          ],
          answerIndex: 1,
          explanation: 'Câu mở bài nêu lợi ích của không gian xanh với sức khỏe tinh thần và phần sau nói về giải pháp chia đều không gian xanh.',
        },
        {
          id: 'lp3-1-q2',
          question: 'According to studies mentioned, what can 20 minutes in a park do?',
          options: [
            'Replace all medical treatment',
            'Increase work productivity by 50%',
            'Lower stress hormones and reduce anxiety',
            'Eliminate air pollution completely',
          ],
          answerIndex: 2,
          explanation: 'Bài giảng nói: "...lowers stress hormones and relieves anxiety" (relieves = reduces).',
        },
        {
          id: 'lp3-1-q3',
          question: 'Which problem do low-income districts currently face?',
          options: [
            'Too many bicycle lanes',
            'A lack of parks and green amenities',
            'Excessive noise from rooftop gardens',
            'Overcrowded outdoor swimming pools',
          ],
          answerIndex: 1,
          explanation: '"Low-income districts often suffer from a severe shortage of parks" (shortage = lack).',
        },
        {
          id: 'lp3-1-q4',
          question: 'How are urban planners solving the shortage of land for parks?',
          options: [
            'By demolishing old hospitals',
            'By banning private cars downtown',
            'By turning rooftops and alleys into community gardens',
            'By charging entrance fees for public parks',
          ],
          answerIndex: 2,
          explanation: 'Đáp án nằm ở câu: "...converting unused rooftops and narrow alleys into affordable community gardens."',
        },
        {
          id: 'lp3-1-q5',
          question: 'What is the speaker’s attitude toward preserving green spaces?',
          options: [
            'It is an essential public investment.',
            'It is an unnecessary luxury.',
            'It is impossible in megacities.',
            'It only benefits wealthy tourists.',
          ],
          answerIndex: 0,
          explanation: 'Câu kết: "preserving green spaces is not a luxury; it is a crucial investment in public well-being."',
        },
      ],
    },
  ],
};

// ==================== GÓI A2: READING PRACTICE ====================
export const READING_PRACTICE: Record<string, ReadingPracticePassage> = {
  'reading-strategy': {
    guideId: 'reading-strategy',
    title: 'Passage Luyện tập 1 · The Rise of Hybrid Work',
    topicTag: 'Work & Technology · B1–B2',
    paragraphs: [
      '[1] Over the past few years, remote work has evolved from an emergency measure into a permanent feature of modern employment. Many firms now adopt a "hybrid" model, allowing employees to split their week between the office and home. Surveys suggest that eliminating daily commutes saves workers hours each week, which improves their work-life balance and lowers stress.',
      '[2] From an environmental perspective, hybrid schedules also bring undeniable benefits. Fewer commuters on the road mean reduced traffic congestion and lower carbon emissions during peak hours. In addition, companies can cut utility bills by downsizing oversized office floors that sit half-empty on Fridays.',
      '[3] Nevertheless, this shift is not without drawbacks. Junior staff sometimes struggle to learn informally when senior colleagues work remotely, and prolonged isolation can weaken team solidarity. Consequently, forward-thinking managers organize regular in-person collaboration days so employees maintain strong workplace bonds without sacrificing flexibility.',
    ],
    questions: [
      {
        id: 'rp1-q1',
        question: 'What is the main idea of the passage?',
        options: [
          'Remote work should be banned in large tech companies.',
          'The hybrid work model offers benefits alongside challenges that require balance.',
          'Office buildings are completely obsolete in modern cities.',
          'Junior employees prefer working alone at home.',
        ],
        answerIndex: 1,
        explanation: 'Đoạn 1–2 nêu lợi ích của mô hình hybrid, đoạn 3 nêu nhược điểm và cách cân bằng → đáp án B bao quát cả bài.',
      },
      {
        id: 'rp1-q2',
        question: 'The word "their" in paragraph [1] refers to ______.',
        options: ['surveys', 'firms', 'employees', 'hours'],
        answerIndex: 2,
        explanation: 'Câu trước nói "...saves workers hours each week, which improves their work-life balance" → "their" thay cho "workers / employees".',
      },
      {
        id: 'rp1-q3',
        question: 'The word "undeniable" in paragraph [2] is closest in meaning to ______.',
        options: ['unquestionable', 'expensive', 'temporary', 'harmful'],
        answerIndex: 0,
        explanation: '"undeniable" (không thể phủ nhận) đồng nghĩa với "unquestionable".',
      },
      {
        id: 'rp1-q4',
        question: 'According to paragraph [2], how does hybrid work help the environment?',
        options: [
          'By encouraging workers to buy electric cars',
          'By reducing rush-hour traffic and carbon emissions',
          'By banning paper use in corporate offices',
          'By planting trees around company headquarters',
        ],
        answerIndex: 1,
        explanation: 'Đoạn [2] viết rõ: "Fewer commuters on the road mean reduced traffic congestion and lower carbon emissions..."',
      },
      {
        id: 'rp1-q5',
        question: 'What can be inferred from paragraph [3] about junior workers?',
        options: [
          'They benefit from face-to-face interaction with experienced peers.',
          'They never experience feelings of isolation.',
          'They earn higher salaries than senior managers.',
          'They refuse to attend in-person collaboration days.',
        ],
        answerIndex: 0,
        explanation: 'Đoạn [3] nói nhân viên mới gặp khó học hỏi khi đồng nghiệp lâu năm làm từ xa → suy ra họ hưởng lợi từ tương tác trực tiếp.',
      },
    ],
  },
  'reading-detail-vocab': {
    guideId: 'reading-detail-vocab',
    title: 'Passage Luyện tập 2 · Urban Farming & Rooftop Gardens',
    topicTag: 'Environment & Urban Living · B1–B2',
    paragraphs: [
      '[1] As cities grow denser, finding land for fresh food production becomes increasingly difficult. Urban farming — growing vegetables on rooftops, balconies, and unused city plots — has emerged as a practical solution. Unlike conventional farms located hundreds of kilometers away, urban gardens supply produce directly to local neighborhoods.',
      '[2] Because food travels much shorter distances, urban agriculture helps cut transportation emissions and keeps vegetables fresher for longer. Moreover, green rooftops absorb rainwater during heavy storms, reducing the risk of urban flash floods while cooling down the buildings underneath.',
      '[3] However, starting a rooftop farm is not always straightforward. High upfront setup costs and strict building safety regulations can discourage small community groups. Experts suggest that local authorities offer small grants and technical training so more residents can transform concrete roofs into productive green spaces.',
    ],
    questions: [
      {
        id: 'rp2-q1',
        question: 'According to paragraph [1], how do urban farms differ from conventional farms?',
        options: [
          'They require huge rural land areas.',
          'They grow food right inside local city neighborhoods.',
          'They only produce organic fruits for export.',
          'They use more chemical fertilizers.',
        ],
        answerIndex: 1,
        explanation: 'Đoạn [1] đối chiếu "Unlike conventional farms located hundreds of kilometers away, urban gardens supply produce directly to local neighborhoods."',
      },
      {
        id: 'rp2-q2',
        question: 'All of the following are benefits of green rooftops in paragraph [2] EXCEPT ______.',
        options: [
          'Lowering transport emissions',
          'Absorbing storm rainwater',
          'Cooling down buildings below',
          'Generating solar electricity',
        ],
        answerIndex: 3,
        explanation: 'Đoạn [2] nhắc tới giảm khí thải vận chuyển, thấm nước mưa chống ngập, làm mát tòa nhà — KHÔNG nhắc tới điện mặt trời.',
      },
      {
        id: 'rp2-q3',
        question: 'The word "straightforward" in paragraph [3] is closest in meaning to ______.',
        options: ['simple', 'dangerous', 'illegal', 'ancient'],
        answerIndex: 0,
        explanation: '"not always straightforward" (không phải lúc nào cũng đơn giản/dễ dàng) → straightforward = simple.',
      },
      {
        id: 'rp2-q4',
        question: 'In paragraph [3], what prevents some community groups from starting rooftop farms?',
        options: [
          'Lack of interest from city residents',
          'Initial costs and building safety rules',
          'Too much rainfall during summer',
          'Competition from online supermarkets',
        ],
        answerIndex: 1,
        explanation: '"High upfront setup costs and strict building safety regulations can discourage small community groups."',
      },
      {
        id: 'rp2-q5',
        question: 'What do experts recommend to support urban farming?',
        options: [
          'Closing traditional supermarkets',
          'Forcing every apartment to build a garden',
          'Providing funding support and training from authorities',
          'Increasing taxes on imported vegetables',
        ],
        answerIndex: 2,
        explanation: 'Câu cuối đoạn [3]: "...local authorities offer small grants (trợ cấp tài chính) and technical training..."',
      },
    ],
  },
  'reading-inference-main': {
    guideId: 'reading-inference-main',
    title: 'Passage Luyện tập 3 · Lifelong Learning in the AI Era',
    topicTag: 'Education & AI · B2',
    paragraphs: [
      '[1] Until recently, earning a university degree in one’s early twenties was viewed as sufficient preparation for an entire career. Today, rapid automation and artificial intelligence are reshaping job descriptions faster than school curricula can update. Consequently, skills learned ten years ago may quickly become obsolete.',
      '[2] To remain competitive, modern workers must embrace lifelong learning — continuously acquiring new knowledge outside traditional classrooms. Online platforms and micro-credential courses now allow busy professionals to study cybersecurity, data analysis, or foreign languages during evenings or weekends at an affordable price.',
      '[3] Forward-looking companies also recognize this reality. Instead of laying off staff whose roles are automated, some employers subsidize training programs to help existing workers transition into emerging positions. Ultimately, adaptability and curiosity matter far more than any single diploma earned at graduation.',
    ],
    questions: [
      {
        id: 'rp3-q1',
        question: 'What is the author’s main purpose in writing this passage?',
        options: [
          'To warn students not to attend university',
          'To explain why continuous learning is essential in a fast-changing job market',
          'To advertise a specific online language platform',
          'To criticize companies for using artificial intelligence',
        ],
        answerIndex: 1,
        explanation: 'Toàn bài lập luận vì sao bằng đại học là chưa đủ và người lao động cần học tập suốt đời để thích nghi với AI.',
      },
      {
        id: 'rp3-q2',
        question: 'The word "obsolete" in paragraph [1] most nearly means ______.',
        options: ['outdated', 'valuable', 'compulsory', 'accurate'],
        answerIndex: 0,
        explanation: 'Kỹ năng học từ 10 năm trước nhanh chóng trở nên "obsolete" (lỗi thời) = outdated.',
      },
      {
        id: 'rp3-q3',
        question: 'The phrase "this reality" in paragraph [3] refers to ______.',
        options: [
          'the high cost of university tuition fees',
          'the need for ongoing skill development as jobs evolve',
          'the ban on traditional classrooms',
          'the difficulty of learning foreign languages on weekends',
        ],
        answerIndex: 1,
        explanation: '"this reality" nối tiếp ý của đoạn [1] và [2] về thực tế công việc thay đổi và cần học liên tục.',
      },
      {
        id: 'rp3-q4',
        question: 'What can be inferred about "forward-looking companies" in paragraph [3]?',
        options: [
          'They prefer retraining current staff over immediately firing them.',
          'They refuse to adopt any new automation tools.',
          'They only hire graduates with multiple master’s degrees.',
          'They require employees to pay for all training themselves.',
        ],
        answerIndex: 0,
        explanation: '"Instead of laying off staff..., some employers subsidize training programs to help existing workers transition..."',
      },
      {
        id: 'rp3-q5',
        question: 'Which statement best summarizes the final sentence of the passage?',
        options: [
          'University diplomas are completely useless.',
          'Ability to adapt and keep learning is more important than past qualifications alone.',
          'Curiosity makes employees change jobs too frequently.',
          'Graduates should avoid working in technology fields.',
        ],
        answerIndex: 1,
        explanation: '"adaptability and curiosity matter far more than any single diploma earned at graduation."',
      },
    ],
  },
};

// ==================== GÓI B1: WRITING PROMPTS (12 ĐỀ MẪU) ====================
export const WRITING_PROMPTS: Record<string, WritingPromptItem[]> = {
  'writing-task1-informal': [
    {
      id: 'wt1i-1',
      title: 'Đề 1 · Gợi ý du lịch Việt Nam cho bạn nước ngoài',
      promptText:
        'Your English friend, Alex, is planning to visit Vietnam for five days next month and asks for your advice. Write an email to Alex to: (1) suggest places he should visit, (2) recommend affordable accommodation and local food, and (3) offer to meet and show him around.',
      outlineHints: [
        'Mở thư: Hỏi thăm sức khỏe, bày tỏ sự hào hứng khi Alex sắp sang.',
        'Đoạn 1: Gợi ý 2 điểm đến (Hà Nội + Hạ Long hoặc Đà Nẵng + Hội An) vì vừa thời gian 5 ngày.',
        'Đoạn 2: Gợi ý homestay/khách sạn khu trung tâm tiện đi bộ + món ăn đường phố nên thử.',
        'Kết thư: Đề nghị đón ở sân bay và dặn gửi lịch bay sớm.',
      ],
      suggestedVocab: ['destination', 'accommodation', 'authentic', 'itinerary', 'catch up', 'hospitality'],
    },
    {
      id: 'wt1i-2',
      title: 'Đề 2 · Xin lỗi & kể về kỳ thi VSTEP sắp tới',
      promptText:
        'You could not attend your best friend’s birthday party last weekend because you were busy preparing for your upcoming English exam. Write an email to apologize, explain how your preparation is going, and suggest a day to catch up together.',
      outlineHints: [
        'Mở thư: Xin lỗi chân thành vì đã lỡ buổi tiệc cuối tuần qua.',
        'Đoạn 1: Giải thích đang tập trung ôn thi VSTEP B2, kể vắn tắt lịch ôn mỗi ngày.',
        'Đoạn 2: Hẹn cuối tuần này mời bạn đi cà phê/ăn tối để bù lại.',
      ],
      suggestedVocab: ['apologize', 'concentrate', 'exhausted', 'catch up', 'keep in touch', 'unwind'],
    },
    {
      id: 'wt1i-3',
      title: 'Đề 3 · Chia sẻ kinh nghiệm học tiếng Anh hiệu quả',
      promptText:
        'Your cousin wants to improve her English vocabulary and speaking skills in two months. Write a letter to give her practical tips on how to study daily and recommend useful apps or habits that worked for you.',
      outlineHints: [
        'Mở thư: Động viên em họ đừng lo lắng vì 2 tháng đủ tạo tiến bộ rõ rệt.',
        'Đoạn 1: Gợi ý học từ theo chủ đề bằng Flashcard + phát âm to mỗi ngày.',
        'Đoạn 2: Khuyên luyện nghe podcast ngắn và tự nói theo mẫu câu.',
      ],
      suggestedVocab: ['acquire', 'habit', 'routine', 'motivate', 'platform', 'user-friendly'],
    },
  ],
  'writing-task1-formal': [
    {
      id: 'wt1f-1',
      title: 'Đề 1 · Phàn nàn dịch vụ / Sản phẩm lỗi',
      promptText:
        'You recently purchased a laptop online from an electronics store, but it stopped charging after three days and customer support has not replied to your messages. Write a formal email to the store manager to complain about the issue and request a prompt replacement or full refund.',
      outlineHints: [
        'Chào: Dear Sir or Madam, (nhớ kết bằng Yours faithfully,)',
        'Mở bài: Nêu rõ lý do viết thư ("I am writing to express my dissatisfaction with...").',
        'Thân bài: Mô tả ngày mua, mã đơn hàng, lỗi sạc không vào và việc CSKH chưa phản hồi.',
        'Yêu cầu giải pháp: Đề nghị đổi máy mới còn bảo hành hoặc hoàn tiền toàn bộ trong 7 ngày.',
      ],
      suggestedVocab: ['defective', 'warranty', 'refund', 'purchase', 'receipt', 'apologize'],
    },
    {
      id: 'wt1f-2',
      title: 'Đề 2 · Hỏi thông tin khóa học tiếng Anh',
      promptText:
        'You saw an advertisement for an intensive evening English course at Bright Future Language Center. Write an email to the center’s coordinator to inquire about class schedules, tuition fees, student discounts, and whether learning materials are included.',
      outlineHints: [
        'Chào: Dear Sir or Madam,',
        'Mở bài: Nêu rõ tên khóa học và mục đích hỏi thông tin ("I am writing to inquire about...").',
        'Thân bài: Hỏi lần lượt 3–4 ý đề yêu cầu (lịch học tối, học phí, ưu đãi sinh viên, giáo trình).',
        'Kết bài: Mong sớm nhận phản hồi qua email hoặc điện thoại.',
      ],
      suggestedVocab: ['inquire', 'tuition fee', 'enroll', 'discount', 'curriculum', 'flexible'],
    },
    {
      id: 'wt1f-3',
      title: 'Đề 3 · Xin ứng tuyển vị trí Thực tập sinh',
      promptText:
        'You would like to apply for a summer marketing internship at an international company. Write a formal email to the HR Manager (Ms. Johnson) to introduce your educational background, highlight relevant soft skills, and ask for an interview opportunity.',
      outlineHints: [
        'Chào: Dear Ms. Johnson, (biết tên nên kết bằng Yours sincerely,)',
        'Mở bài: Nêu vị trí ứng tuyển và nơi đọc thông tin tuyển dụng.',
        'Thân bài: Nêu ngành học, kỹ năng giao tiếp/làm việc nhóm và sự nhiệt huyết.',
        'Kết bài: Đính kèm CV và mong muốn được tham gia phỏng vấn.',
      ],
      suggestedVocab: ['candidate', 'internship', 'qualification', 'collaborate', 'punctual', 'dedication'],
    },
  ],
  'writing-task2-opinion': [
    {
      id: 'wt2o-1',
      title: 'Đề 1 · Opinion: Học trực tuyến vs Học trực tiếp',
      promptText:
        'Some people believe that online learning will soon replace traditional face-to-face classrooms completely. To what extent do you agree or disagree with this statement? Write an essay of at least 250 words.',
      outlineHints: [
        'Mở bài: Paraphrase xu hướng học trực tuyến + Thesis nêu rõ quan điểm (Không đồng ý việc thay thế hoàn toàn).',
        'Body 1: Công nhận lợi ích của học online (tiết kiệm chi phí, linh hoạt thời gian, dễ tiếp cận).',
        'Body 2: Giải thích vì sao lớp học truyền thống không thể thay thế (tương tác trực tiếp, kỷ luật, kỹ năng xã hội).',
        'Kết bài: Khẳng định mô hình kết hợp (blended learning) mới là xu hướng tối ưu.',
      ],
      suggestedVocab: ['distance learning', 'accessible', 'interact', 'discipline', 'distraction', 'undeniable'],
    },
    {
      id: 'wt2o-2',
      title: 'Đề 2 · Discussion: Sống ở thành phố lớn hay vùng quê',
      promptText:
        'Many young adults prefer living in big cities for career opportunities, while others choose quieter rural areas for a healthier lifestyle. Discuss both views and give your own opinion. (≥ 250 words)',
      outlineHints: [
        'Mở bài: Giới thiệu 2 quan điểm + nêu rõ bản thân nghiêng về phía nào.',
        'Body 1 (Thành phố lớn): Cơ hội việc làm lương cao, dịch vụ y tế/giáo dục hiện đại.',
        'Body 2 (Nông thôn/Ngoại ô): Không khí sạch, chi phí sinh hoạt rẻ, ít áp lực kẹt xe.',
        'Kết bài: Tóm gọn 2 chiều và chốt quan điểm cá nhân (vd: làm ở phố khi trẻ nhưng cần không gian xanh).',
      ],
      suggestedVocab: ['career prospect', 'cost of living', 'traffic congestion', 'rural', 'pace of life', 'whereas'],
    },
    {
      id: 'wt2o-3',
      title: 'Đề 3 · Opinion: Trí tuệ nhân tạo (AI) trong công việc',
      promptText:
        'Artificial intelligence is taking over many routine tasks in offices and factories. Some argue that AI brings more benefits than threats to human workers. Do you agree or disagree? (≥ 250 words)',
      outlineHints: [
        'Mở bài: Dẫn xu hướng tự động hóa + chốt quan điểm (Lợi ích lớn hơn nếu con người nâng cấp kỹ năng).',
        'Body 1: Lợi ích (tăng năng suất, giảm việc lặp lại nhàm chán, tạo ngành nghề mới).',
        'Body 2: Thách thức (nguy cơ mất việc phổ thông) và lý do vẫn kiểm soát được nhờ đào tạo lại (lifelong learning).',
        'Kết bài: Chốt lại quan điểm.',
      ],
      suggestedVocab: ['artificial intelligence', 'automate', 'productive', 'obsolete', 'lifelong learning', 'outweigh'],
    },
  ],
  'writing-task2-cause-adv': [
    {
      id: 'wt2c-1',
      title: 'Đề 1 · Causes & Solutions: Ô nhiễm nhựa và rác thải đô thị',
      promptText:
        'Plastic waste is becoming a serious environmental threat in many large cities. What are the main causes of this problem, and what effective measures should be taken by governments and individuals? (≥ 250 words)',
      outlineHints: [
        'Mở bài: Paraphrase vấn nạn rác thải nhựa + nêu mục tiêu bài viết phân tích nguyên nhân & giải pháp.',
        'Body 1 (2 Nguyên nhân): Thói quen dùng đồ nhựa tiện lợi 1 lần (disposable plastics) + thiếu hệ thống phân loại/tái chế đồng bộ.',
        'Body 2 (2 Giải pháp): Chính phủ đánh thuế/cấm túi nilon & đầu tư tái chế; Cá nhân mang túi vải, nâng cao ý thức.',
        'Kết bài: Khẳng định cần phối hợp cả nhà nước lẫn người dân.',
      ],
      suggestedVocab: ['disposable', 'recycle', 'contaminate', 'measure', 'awareness', 'sustainable'],
    },
    {
      id: 'wt2c-2',
      title: 'Đề 2 · Causes & Solutions: Lối sống ít vận động ở giới trẻ',
      promptText:
        'Nowadays, an increasing number of young people suffer from health problems due to a sedentary lifestyle and poor diet. What are the reasons for this trend, and how can it be addressed? (≥ 250 words)',
      outlineHints: [
        'Mở bài: Nêu thực trạng sức khỏe giới trẻ + giới thiệu nguyên nhân và giải pháp.',
        'Body 1 (Nguyên nhân): Nghiện màn hình/mạng xã hội + lịch học/làm bận rộn dẫn tới ăn đồ ăn nhanh.',
        'Body 2 (Giải pháp): Nhà trường/công ty tạo không gian thể thao + cha mẹ/cá nhân giới hạn screen time.',
      ],
      suggestedVocab: ['sedentary', 'obesity', 'balanced diet', 'screen time', 'relieve', 'tackle'],
    },
    {
      id: 'wt2c-3',
      title: 'Đề 3 · Advantages vs Disadvantages: Làm việc từ xa (Remote Work)',
      promptText:
        'Remote working has become widespread in many industries. Do the advantages of working from home outweigh the disadvantages? Write an essay of at least 250 words.',
      outlineHints: [
        'Mở bài: Nêu xu hướng remote work + khẳng định ngay lợi ích có vượt trội nhược điểm hay không.',
        'Body 1 (Ưu điểm): Tiết kiệm thời gian đi lại, cân bằng công việc – cuộc sống, giảm khí thải.',
        'Body 2 (Nhược điểm): Cảm giác cô lập, khó tách bạch giờ nghỉ – giờ làm, xao nhãng tại nhà.',
        'Kết bài: Khẳng định lại bên nào nặng hơn ("outweigh").',
      ],
      suggestedVocab: ['remote work', 'commute', 'work-life balance', 'isolated', 'drawback', 'outweigh'],
    },
  ],
};

// ==================== GÓI B2: SPEAKING PROMPTS (9 ĐỀ MẪU) ====================
export const SPEAKING_PART1_PROMPTS: SpeakingPart1Prompt[] = [
  {
    id: 'sp1-1',
    title: 'Đề 1 · Hobbies & Hometown',
    topics: [
      {
        name: 'Topic 1: Leisure & Hobbies',
        questions: [
          'What do you usually do in your free time to unwind?',
          'Do you prefer indoor or outdoor leisure activities? Why?',
          'Has your favorite hobby changed compared to five years ago?',
        ],
      },
      {
        name: 'Topic 2: Your Hometown',
        questions: [
          'Can you describe the neighborhood where you currently live?',
          'What do you like most about your hometown?',
          'Would you recommend your hometown as a tourist destination?',
        ],
      },
    ],
  },
  {
    id: 'sp1-2',
    title: 'Đề 2 · Work/Study & Technology',
    topics: [
      {
        name: 'Topic 1: Daily Routine & Study/Work',
        questions: [
          'Are you a morning person or a night owl? Why?',
          'How do you manage tight deadlines when you are busy?',
          'What skill would you like to learn or improve this year?',
        ],
      },
      {
        name: 'Topic 2: Smartphones & Apps',
        questions: [
          'How many hours a day do you spend on your smartphone?',
          'Which mobile app do you find most useful for learning or work?',
          'Do you think people rely too much on digital devices nowadays?',
        ],
      },
    ],
  },
  {
    id: 'sp1-3',
    title: 'Đề 3 · Food & Travel',
    topics: [
      {
        name: 'Topic 1: Eating Habits',
        questions: [
          'Do you prefer home-cooked meals or eating out at restaurants?',
          'What is a traditional dish from your country that foreigners should try?',
          'How do you try to maintain a balanced diet despite a busy schedule?',
        ],
      },
      {
        name: 'Topic 2: Traveling',
        questions: [
          'Do you like traveling alone, with family, or with friends?',
          'What is the most memorable trip you have ever taken?',
          'How do you usually plan your accommodation before a holiday?',
        ],
      },
    ],
  },
];

export const SPEAKING_PART2_PROMPTS: SpeakingPart2Prompt[] = [
  {
    id: 'sp2-1',
    title: 'Đề 1 · Chọn phương tiện đi làm hằng ngày',
    situation:
      'You have just started a new job located 12 kilometers away from your home in a busy city. You are deciding between three ways to commute every day: riding a motorbike, taking the public bus, or buying an electric bicycle. Which is the best choice?',
    options: [
      {
        label: 'Public Bus (Xe buýt công cộng)',
        pros: 'Rẻ, an toàn khi mưa nắng, có thể nghe podcast/ôn từ vựng lúc đi.',
        cons: 'Đôi khi chờ lâu hoặc đông vào giờ cao điểm.',
      },
      {
        label: 'Motorbike (Xe máy cá nhân)',
        pros: 'Chủ động giờ giấc, linh hoạt đi nhiều nơi.',
        cons: 'Tốn xăng, hít khói bụi và căng thẳng khi kẹt xe.',
      },
      {
        label: 'Electric Bicycle (Xe đạp điện)',
        pros: 'Thân thiện môi trường, không tốn tiền xăng.',
        cons: 'Quãng đường 12 km khá xa và bất tiện khi trời mưa bão.',
      },
    ],
  },
  {
    id: 'sp2-2',
    title: 'Đề 2 · Chọn hoạt động cuối tuần cho câu lạc bộ tiếng Anh',
    situation:
      'Your university English club wants to organize a Saturday activity to help members improve speaking fluency and bond together. Three options are suggested: a coffee-shop speaking meetup, a movie screening with discussion, or an outdoor picnic with games. Which would you choose?',
    options: [
      {
        label: 'Coffee-shop Speaking Meetup',
        pros: 'Chi phí thấp, dễ chia nhóm nhỏ luyện nói trực diện, không phụ thuộc thời tiết.',
        cons: 'Không gian quán có thể hơi ồn nếu đông người.',
      },
      {
        label: 'Movie Screening & Discussion',
        pros: 'Luyện nghe tiếng Anh tự nhiên và giải trí.',
        cons: 'Thời gian xem phim chiếm hết 2 tiếng, ít cơ hội cho mọi người cùng nói.',
      },
      {
        label: 'Outdoor Picnic & Games',
        pros: 'Không khí thoáng đãng, gắn kết thành viên rất tốt.',
        cons: 'Rủi ro thời tiết mưa nắng và khó chuẩn bị đồ ăn, loa đài.',
      },
    ],
  },
  {
    id: 'sp2-3',
    title: 'Đề 3 · Chọn quà tốt nghiệp tặng bạn thân',
    situation:
      'Your best friend is graduating from university next week and moving to another city for her first full-time job. You are considering three gifts: a wristwatch, a laptop backpack, or a set of career-skills books. Which gift is the best option?',
    options: [
      {
        label: 'Laptop Backpack (Ba lô đựng laptop)',
        pros: 'Cực kỳ thiết thực dùng hằng ngày đi làm, bền và dễ hợp gu.',
        cons: 'Hơi đơn giản nếu muốn món quà mang tính kỷ niệm trang trọng.',
      },
      {
        label: 'Wristwatch (Đồng hồ đeo tay)',
        pros: 'Sang trọng, kỷ niệm lâu dài.',
        cons: 'Giá khá cao và khó chọn đúng kích thước, sở thích của bạn.',
      },
      {
        label: 'Career-Skills Books (Bộ sách kỹ năng)',
        pros: 'Ý nghĩa phát triển bản thân, chi phí hợp lý.',
        cons: 'Nặng khi chuyển nhà và bạn có thể đã đọc sách điện tử rồi.',
      },
    ],
  },
];

export const SPEAKING_PART3_PROMPTS: SpeakingPart3Prompt[] = [
  {
    id: 'sp3-1',
    title: 'Đề 1 · Lợi ích của việc đọc sách hằng ngày',
    centralTopic: 'Reading books regularly brings many benefits to students',
    ideas: [
      'Expand knowledge (Mở rộng kiến thức)',
      'Improve vocabulary & writing (Tăng vốn từ & kỹ năng viết)',
      'Relieve stress (Giảm căng thẳng)',
    ],
    yourOwnIdeaHint: 'Boost deep concentration (Rèn sự tập trung sâu giữa thời đại điện thoại)',
    followUpQuestions: [
      'Why do many young people today prefer short videos over reading books?',
      'What can schools do to encourage students to read more?',
      'Do you think printed books will eventually disappear?',
    ],
  },
  {
    id: 'sp3-2',
    title: 'Đề 2 · Lợi ích của làm việc tình nguyện',
    centralTopic: 'Volunteering is beneficial for both students and society',
    ideas: [
      'Help vulnerable communities (Giúp đỡ người yếu thế)',
      'Develop soft skills (Rèn giao tiếp & làm việc nhóm)',
      'Broaden social network (Mở rộng quan hệ xã hội)',
    ],
    yourOwnIdeaHint: 'Strengthen CV & career prospects (Làm đẹp hồ sơ xin việc/học bổng)',
    followUpQuestions: [
      'Should volunteer work be compulsory for university students?',
      'What kinds of volunteer activities are most needed in your city?',
      'How can busy workers contribute to charity if they lack time?',
    ],
  },
  {
    id: 'sp3-3',
    title: 'Đề 3 · Vai trò của thể thao với người trẻ',
    centralTopic: 'Playing sports regularly is essential for young people',
    ideas: [
      'Improve physical fitness (Tăng cường thể lực & miễn dịch)',
      'Reduce academic pressure (Giải tỏa áp lực học tập)',
      'Build teamwork & discipline (Rèn tinh thần đồng đội & kỷ luật)',
    ],
    yourOwnIdeaHint: 'Break sedentary screen habits (Giảm thời gian ngồi lì trước màn hình)',
    followUpQuestions: [
      'What prevents many office workers from exercising regularly?',
      'Should cities invest more in free public sports facilities?',
      'Which is better for teenagers: team sports or individual workouts?',
    ],
  },
];

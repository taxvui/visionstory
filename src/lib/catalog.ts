export interface StockAvatar {
  id: string;
  name: string;
  role: string;
  roleVi: string;
  category: 'presenter' | 'ugc' | 'podcast' | 'educator' | 'broadcast' | 'founder' | 'pet';
  image: string;
  defaultVoiceId: string;
  languages: number;
  styleTag: string;
  accentColor: string;
}

export interface VoiceOption {
  id: string;
  name: string;
  language: string;
  languageCode: string;
  gender: 'Female' | 'Male' | 'Neutral';
  style: string;
  styleVi: string;
  pitch: number;
  rate: number;
  isCloned?: boolean;
  sampleText: string;
}

export interface AIModelInfo {
  id: string;
  apiId: string;
  name: string;
  provider: string;
  category: 'avatar' | 'video' | 'image';
  badge: string;
  resolution: string;
  maxDuration: string;
  creditsPerUnit: string;
  summaryEn: string;
  summaryVi: string;
  capabilities: string[];
  showcaseImage: string;
}

export const STOCK_AVATARS: StockAvatar[] = [
  {
    id: 'av_aria_v4',
    name: 'Aria',
    role: 'Product & Brand Presenter',
    roleVi: 'MC Thương hiệu & Sản phẩm',
    category: 'presenter',
    image: '/assets/avatars/aria.jpg',
    defaultVoiceId: 'voice_alloy',
    languages: 88,
    styleTag: 'V-Character 4.0',
    accentColor: '#f26430',
  },
  {
    id: 'av_marcus_v4',
    name: 'Marcus',
    role: 'Executive & Podcast Host',
    roleVi: 'Host Kinh doanh & Podcast',
    category: 'podcast',
    image: '/assets/avatars/marcus.jpg',
    defaultVoiceId: 'voice_echo',
    languages: 88,
    styleTag: 'V-Character 4.0',
    accentColor: '#19b394',
  },
  {
    id: 'av_linh_v4',
    name: 'Linh Nguyen',
    role: 'UGC & Social Creator',
    roleVi: 'Creator UGC & Mạng xã hội',
    category: 'ugc',
    image: '/assets/avatars/linh.jpg',
    defaultVoiceId: 'voice_minh_anh',
    languages: 88,
    styleTag: 'UGC Ready',
    accentColor: '#f59e0b',
  },
  {
    id: 'av_david_v4',
    name: 'David',
    role: 'L&D Training Instructor',
    roleVi: 'Giảng viên Đào tạo & Onboarding',
    category: 'educator',
    image: '/assets/avatars/david.jpg',
    defaultVoiceId: 'voice_daniel',
    languages: 88,
    styleTag: 'Training Host',
    accentColor: '#3b82f6',
  },
  {
    id: 'av_sofia_v4',
    name: 'Sofia',
    role: 'Global News & Updates Anchor',
    roleVi: 'BTV Bản tin & Thông cáo',
    category: 'broadcast',
    image: '/assets/avatars/sofia.jpg',
    defaultVoiceId: 'voice_nova',
    languages: 88,
    styleTag: 'Broadcast HD',
    accentColor: '#10b981',
  },
  {
    id: 'av_kenji_v4',
    name: 'Kenji',
    role: 'Tech Founder & Keynote',
    roleVi: 'Founder Công nghệ & Keynote',
    category: 'founder',
    image: '/assets/avatars/kenji.jpg',
    defaultVoiceId: 'voice_kenji',
    languages: 88,
    styleTag: 'Keynote 2K',
    accentColor: '#06b6d4',
  },
  {
    id: 'av_golden_pet',
    name: 'Barnaby Gold',
    role: 'Viral Pet Podcast & Skit Star',
    roleVi: 'Thú cưng Podcast & Skit Viral',
    category: 'pet',
    image: '/assets/avatars/golden-podcaster.jpg',
    defaultVoiceId: 'voice_echo',
    languages: 88,
    styleTag: 'Pet Video',
    accentColor: '#eab308',
  },
];

export const VOICE_CATALOG: VoiceOption[] = [
  {
    id: 'voice_alloy',
    name: 'Alloy',
    language: 'English (US)',
    languageCode: 'en-US',
    gender: 'Female',
    style: 'Warm, articulate studio presenter',
    styleVi: 'Ấm áp, rõ chữ, chuẩn thuyết trình',
    pitch: 1.05,
    rate: 1.0,
    sampleText: 'Welcome to VisionStory! Turn any idea, photo, or script into a lifelike AI video in minutes.',
  },
  {
    id: 'voice_echo',
    name: 'Echo',
    language: 'English (US)',
    languageCode: 'en-US',
    gender: 'Male',
    style: 'Confident conversational podcast host',
    styleVi: 'Tự tin, tự nhiên chuẩn host podcast',
    pitch: 0.92,
    rate: 1.0,
    sampleText: 'Hey everyone! Today we are breaking down how AI video agents automate your entire creative production workflow.',
  },
  {
    id: 'voice_nova',
    name: 'Nova',
    language: 'English (Global)',
    languageCode: 'en-GB',
    gender: 'Female',
    style: 'Crisp broadcast & product launch tone',
    styleVi: 'Sắc nét, sang trọng cho ra mắt sản phẩm',
    pitch: 1.1,
    rate: 1.02,
    sampleText: 'Introducing our latest quarterly release, localized automatically across eighty-eight languages.',
  },
  {
    id: 'voice_minh_anh',
    name: 'Minh Anh',
    language: 'Tiếng Việt (VN)',
    languageCode: 'vi-VN',
    gender: 'Female',
    style: 'Tự nhiên, truyền cảm hứng, chuẩn UGC & Review',
    styleVi: 'Tự nhiên, truyền cảm hứng, chuẩn UGC & Review',
    pitch: 1.08,
    rate: 1.0,
    sampleText: 'Xin chào! Chỉ cần tải lên một bức ảnh và kịch bản, VisionStory sẽ tạo ngay video AI nói chuyện cực kỳ sống động.',
  },
  {
    id: 'voice_quang_huy',
    name: 'Quang Huy',
    language: 'Tiếng Việt (VN)',
    languageCode: 'vi-VN',
    gender: 'Male',
    style: 'Trầm ấm, chuyên nghiệp cho đào tạo & doanh nghiệp',
    styleVi: 'Trầm ấm, chuyên nghiệp cho đào tạo & doanh nghiệp',
    pitch: 0.9,
    rate: 0.98,
    sampleText: 'Chào mừng bạn đến với bản trình bày sản phẩm mới nhất được tạo tự động từ slide trên VisionStory AI.',
  },
  {
    id: 'voice_daniel',
    name: 'Daniel',
    language: 'English (UK)',
    languageCode: 'en-GB',
    gender: 'Male',
    style: 'Calm instructional & documentary narrator',
    styleVi: 'Điềm tĩnh, chuẩn đào tạo & tài liệu',
    pitch: 0.95,
    rate: 0.96,
    sampleText: 'In module three, we will walk step by step through onboarding your global customer success team.',
  },
  {
    id: 'voice_mateo',
    name: 'Mateo',
    language: 'Español (LatAm)',
    languageCode: 'es-ES',
    gender: 'Male',
    style: 'Energetic commercial & social creator',
    styleVi: 'Năng lượng cao cho quảng cáo & mạng xã hội',
    pitch: 1.0,
    rate: 1.04,
    sampleText: 'Transforma cualquier foto y guion en un video con avatar realista listo para publicar en minutos.',
  },
  {
    id: 'voice_kenji',
    name: 'Kenji',
    language: '日本語 / English',
    languageCode: 'ja-JP',
    gender: 'Male',
    style: 'Executive keynote & product demo',
    styleVi: 'Phong thái lãnh đạo công nghệ & demo sản phẩm',
    pitch: 0.94,
    rate: 1.0,
    sampleText: 'One consistent character across every angle, resolution, and language for global product launches.',
  },
];

export const AI_MODELS: AIModelInfo[] = [
  {
    id: 'v-character-4',
    apiId: 'vs_character_v4',
    name: 'V-Character 4.0',
    provider: 'VisionStory',
    category: 'avatar',
    badge: 'Native Flagship',
    resolution: '720p · 1080p · 2K',
    maxDuration: 'Up to 10 minutes',
    creditsPerUnit: '1 credit / 4s (720p)',
    summaryEn:
      "VisionStory's native talking-avatar model renders sharper faces, subtler expressions, accurate lip-sync, and natural hand and body motion from a single portrait.",
    summaryVi:
      'Mô hình avatar nói chuyện độc quyền của VisionStory tái tạo gương mặt sắc nét, biểu cảm tinh tế, nhép môi chuẩn xác và cử chỉ tay tự nhiên chỉ từ 1 bức ảnh.',
    capabilities: ['Talking Avatar', 'Single Photo Input', 'Singing Lip Sync', 'Green Screen', 'Up to 2K'],
    showcaseImage: '/assets/avatars/aria.jpg',
  },
  {
    id: 'seedance-2.5',
    apiId: 'seedance-2.5',
    name: 'Seedance 2.5',
    provider: 'ByteDance',
    category: 'video',
    badge: 'Multi-Reference',
    resolution: '1080p · 2K',
    maxDuration: '4–30s clips',
    creditsPerUnit: '2 credits / sec',
    summaryEn:
      'Turn text prompts, images, audio, video, and up to 50 references into controlled cinematic clips for ads, ecommerce, and storytelling.',
    summaryVi:
      'Biến câu lệnh văn bản, hình ảnh, âm thanh và tới 50 ảnh tham chiếu thành thước phim điện ảnh có độ nhất quán cao cho quảng cáo và kể chuyện.',
    capabilities: ['Text To Video', 'Image To Video', '30-Second Clips', 'AI Video Ads', 'Redraw Editing'],
    showcaseImage: '/assets/showcase/seedance-cinema.jpg',
  },
  {
    id: 'kling-o3',
    apiId: 'kling-o3',
    name: 'Kling O3',
    provider: 'Kuaishou',
    category: 'video',
    badge: 'True 4K · 60fps',
    resolution: '1080p · 4K 60fps',
    maxDuration: 'Up to 20s',
    creditsPerUnit: '3 credits / sec',
    summaryEn:
      "Kuaishou's flagship omni model: true 4K shots at up to 60 fps, native multilingual audio, voice cloning from reference video, and multi-shot storyboard control.",
    summaryVi:
      'Mô hình omni đầu bảng với khung hình 4K 60fps thực, âm thanh đa ngôn ngữ bản địa và điều khiển phân cảnh nhiều góc máy.',
    capabilities: ['4K 60fps', 'Native Audio', 'Multi-Shot Storyboard', 'Reference Voice'],
    showcaseImage: '/assets/showcase/music-singer.jpg',
  },
  {
    id: 'minimax-h3',
    apiId: 'minimax-h3',
    name: 'MiniMax H3',
    provider: 'MiniMax',
    category: 'video',
    badge: 'Stereo Audio',
    resolution: '1080p · 2K',
    maxDuration: 'Up to 15s',
    creditsPerUnit: '2 credits / sec',
    summaryEn:
      "MiniMax's omni-modal model: 2K clips with native stereo audio generated in one pass, plus reference control over characters, motion, and voices.",
    summaryVi:
      'Mô hình đa phương thức xuất video 2K kèm âm thanh stereo chỉ trong một lượt render, kiểm soát chặt nhân vật và chuyển động.',
    capabilities: ['2K Output', 'Native Stereo Audio', 'Motion Reference', 'Scene Revision'],
    showcaseImage: '/assets/showcase/podcast-studio.jpg',
  },
  {
    id: 'wan-3.0',
    apiId: 'wan-3.0',
    name: 'Wan 3.0',
    provider: 'Alibaba',
    category: 'video',
    badge: 'Omni-Reference',
    resolution: '720p · 1080p',
    maxDuration: '30s single-take',
    creditsPerUnit: '1.5 credits / sec',
    summaryEn:
      "Alibaba's newest model: 30-second single-take shots at up to 1080p, with Omni-Reference input — build video straight from documents, slides, and web pages.",
    summaryVi:
      'Quay liền mạch một cú máy dài 30 giây ở 1080p với đầu vào Omni-Reference từ tài liệu, slide và trang web.',
    capabilities: ['30s Single-Take', 'Doc & Slide Input', '1080p HD', 'Open Ecosystem'],
    showcaseImage: '/assets/showcase/seedance-cinema.jpg',
  },
  {
    id: 'nano-banana-2',
    apiId: 'nano-banana-2',
    name: 'Nano Banana 2',
    provider: 'Google',
    category: 'image',
    badge: 'AI Image 2K',
    resolution: '1K · 2K',
    maxDuration: 'Instant Still',
    creditsPerUnit: '1 credit / image',
    summaryEn:
      'Generate high-resolution portraits, product scenes, and campaign visuals, render text reliably, and refine results through conversational reference-guided edits.',
    summaryVi:
      'Tạo ảnh chân dung avatar, bối cảnh sản phẩm độ phân giải 2K, hiển thị chữ chuẩn xác và chỉnh sửa hội thoại thông minh.',
    capabilities: ['Prompt-to-Image', 'Reference Editing', 'Reliable Typography', '2K Portraits'],
    showcaseImage: '/assets/avatars/linh.jpg',
  },
];

export interface PricingPlan {
  id: 'free' | 'pro' | 'advanced' | 'ultra';
  name: string;
  monthlyPrice: number;
  annualMonthlyEquivalent: number;
  annualTotal: number;
  monthlyCredits: number;
  annualCredits: number;
  approxMinutes: string;
  weeklyBonus: number;
  maxLength: string;
  resolutions: string;
  concurrentTasks: number;
  cloneVoices: number;
  presentationSlides: string;
  customAvatars: string;
  popular?: boolean;
  featuresEn: string[];
  featuresVi: string[];
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    monthlyPrice: 0,
    annualMonthlyEquivalent: 0,
    annualTotal: 0,
    monthlyCredits: 10,
    annualCredits: 10,
    approxMinutes: '≈1 min',
    weeklyBonus: 4,
    maxLength: '30 seconds',
    resolutions: '720p',
    concurrentTasks: 1,
    cloneVoices: 0,
    presentationSlides: '5 Slides preview',
    customAvatars: '2 Custom Avatars',
    featuresEn: [
      '10 sign-up credits included',
      'Video length up to 30 seconds',
      '160+ Stock Avatars & V-Character 4.0',
      'Video resolution up to 720p',
      'Weekly Visit Bonus: 4 credits',
      'Free HD Photo & Video Face Swap',
    ],
    featuresVi: [
      'Tặng ngay 10 credits khi đăng ký',
      'Thời lượng video tối đa 30 giây',
      '160+ Avatar mẫu & mô hình V-Character 4.0',
      'Độ phân giải video lên tới 720p',
      'Thưởng ghé thăm hàng tuần: 4 credits',
      'Hoán đổi khuôn mặt ảnh & video HD miễn phí',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 9.99,
    annualMonthlyEquivalent: 8.33,
    annualTotal: 99.9,
    monthlyCredits: 120,
    annualCredits: 1440,
    approxMinutes: '≈8 mins',
    weeklyBonus: 8,
    maxLength: '10 minutes',
    resolutions: '720p',
    concurrentTasks: 10,
    cloneVoices: 10,
    presentationSlides: '20 Slides',
    customAvatars: 'Unlimited Avatars',
    featuresEn: [
      '120 monthly credits (unused roll over up to 2×)',
      'Video length up to 10 minutes',
      'No watermark & commercial rights',
      'Clone up to 10 custom voices',
      '10 concurrent tasks · Express priority',
      'Seedance 2.5, AI Agent, Podcast & Viral Music',
      'Weekly Visit Bonus: 8 credits',
    ],
    featuresVi: [
      '120 credits/tháng (cộng dồn tối đa 2× sang kỳ sau)',
      'Thời lượng video tối đa 10 phút',
      'Không đóng dấu watermark & bản quyền thương mại',
      'Nhân bản (Clone) tối đa 10 giọng nói',
      '10 tác vụ song song · Ưu tiên Express',
      'Mở khóa Seedance 2.5, AI Agent, Podcast & Viral Music',
      'Thưởng ghé thăm hàng tuần: 8 credits',
    ],
  },
  {
    id: 'advanced',
    name: 'Advanced',
    monthlyPrice: 29.9,
    annualMonthlyEquivalent: 24.92,
    annualTotal: 299.0,
    monthlyCredits: 480,
    annualCredits: 5760,
    approxMinutes: '≈32 mins',
    weeklyBonus: 20,
    maxLength: '10 minutes',
    resolutions: '720p · 1080p · 2K',
    concurrentTasks: 10,
    cloneVoices: 20,
    presentationSlides: '50 Slides',
    customAvatars: 'Unlimited Avatars',
    popular: true,
    featuresEn: [
      '480 monthly credits (unused roll over up to 2×)',
      'Full 1080p HD & crisp 2K export resolution',
      'Everything in Pro included',
      'Clone up to 20 custom voices',
      'AI Presentation up to 50 slides per deck',
      'Green Screen cutout & multi-angle control',
      'Weekly Visit Bonus: 20 credits',
    ],
    featuresVi: [
      '480 credits/tháng (cộng dồn tối đa 2× sang kỳ sau)',
      'Xuất video chuẩn 1080p Full HD & 2K siêu nét',
      'Bao gồm toàn bộ tính năng gói Pro',
      'Nhân bản (Clone) tối đa 20 giọng nói',
      'AI Presentation tối đa 50 trang slide/video',
      'Tách phông xanh Green Screen & đa góc máy',
      'Thưởng ghé thăm hàng tuần: 20 credits',
    ],
  },
  {
    id: 'ultra',
    name: 'Ultra',
    monthlyPrice: 99.9,
    annualMonthlyEquivalent: 83.25,
    annualTotal: 999.0,
    monthlyCredits: 1920,
    annualCredits: 23040,
    approxMinutes: '≈128 mins',
    weeklyBonus: 60,
    maxLength: '10 minutes',
    resolutions: '720p · 1080p · 2K · 4K',
    concurrentTasks: 10,
    cloneVoices: 50,
    presentationSlides: '100 Slides',
    customAvatars: 'Unlimited Avatars',
    featuresEn: [
      '1,920 monthly credits (5,760 rollover cap)',
      'Lowest cost per minute ($0.78/min at 720p)',
      'Everything in Advanced included',
      'Clone up to 50 custom brand voices',
      'AI Presentation up to 100 slides per deck',
      'Priority OpenAPI, CLI & MCP throughput',
      'Weekly Visit Bonus: 60 credits',
    ],
    featuresVi: [
      '1.920 credits/tháng (trần tích lũy 5.760 credits)',
      'Chi phí tối ưu nhất ($0.78/phút ở 720p)',
      'Bao gồm toàn bộ tính năng gói Advanced',
      'Nhân bản (Clone) tới 50 giọng thương hiệu',
      'AI Presentation tối đa 100 trang slide/video',
      'Băng thông ưu tiên cho OpenAPI, CLI & MCP',
      'Thưởng ghé thăm hàng tuần: 60 credits',
    ],
  },
];

export interface CreatorToolItem {
  slug: string;
  studioTab: string;
  studioSubTool?: string;
  badge: string;
  titleEn: string;
  titleVi: string;
  descEn: string;
  descVi: string;
  category: 'video' | 'voice' | 'image' | 'avatar';
}

export const CREATOR_TOOLS: CreatorToolItem[] = [
  {
    slug: 'ai-video',
    studioTab: 'ai-video',
    badge: 'V-Character 4.0',
    titleEn: 'AI Talking Video',
    titleVi: 'Tạo Video Avatar Nói Chuyện',
    descEn: 'Create talking videos from scripts, audio, or portraits with natural lip-sync and expressive gestures.',
    descVi: 'Tạo video nhân vật nói chuyện từ kịch bản, file âm thanh hoặc ảnh chân dung với nhép môi tự nhiên.',
    category: 'avatar',
  },
  {
    slug: 'ai-video-agent',
    studioTab: 'ai-agent',
    badge: 'Multi-Shot Agent',
    titleEn: 'AI Video Agent',
    titleVi: 'Trợ Lý Đạo Diễn AI Video Agent',
    descEn: 'Turn a prompt, URL, or deck into a multi-shot video — script, avatar, voiceover, and captions in one flow.',
    descVi: 'Biến câu lệnh, URL hoặc tài liệu thành video đa phân cảnh gồm kịch bản, avatar, giọng đọc và phụ đề.',
    category: 'video',
  },
  {
    slug: 'ai-music-video',
    studioTab: 'viral-music',
    badge: 'Singing Lip-Sync',
    titleEn: 'AI Music Video Generator',
    titleVi: 'Tạo MV Ca Nhạc AI',
    descEn: 'Turn one song (MP3, WAV, Suno, or Udio) and one photo into a cinematic singing music video.',
    descVi: 'Kết hợp 1 bài hát (MP3, WAV, link Suno/Udio) và 1 bức ảnh thành MV ca sĩ hát nhép môi sống động.',
    category: 'video',
  },
  {
    slug: 'video-face-swap',
    studioTab: 'face-swap',
    badge: 'Free · No Watermark',
    titleEn: 'Video & Photo Face Swap',
    titleVi: 'Hoán Đổi Khuôn Mặt Video & Ảnh',
    descEn: 'Swap any face into any video or photo with consistent lighting and frame-by-frame motion tracking.',
    descVi: 'Ghép khuôn mặt vào video hoặc ảnh giữ nguyên biểu cảm, chuyển động đầu và ánh sáng tự nhiên.',
    category: 'video',
  },
  {
    slug: 'video-podcast',
    studioTab: 'podcast',
    badge: 'Auto 2-Host Split',
    titleEn: 'AI Video Podcast',
    titleVi: 'Tạo Video Podcast 2 Host',
    descEn: 'Turn NotebookLM audio, MP3s, or two-speaker scripts into an animated studio conversation.',
    descVi: 'Biến file ghi âm NotebookLM, MP3 hoặc kịch bản đối thoại thành chương trình podcast có 2 MC trực quan.',
    category: 'video',
  },
  {
    slug: 'ai-presentation',
    studioTab: 'presentation',
    badge: 'Slides to Video',
    titleEn: 'AI Presentation Maker',
    titleVi: 'Thuyết Trình Slide AI',
    descEn: 'Transform slide decks and outlines into presenter-hosted training, sales, and onboarding videos.',
    descVi: 'Biến nội dung slide thành video thuyết trình có MC dẫn dắt chuyên nghiệp cho đào tạo và bán hàng.',
    category: 'video',
  },
  {
    slug: 'seedance-video',
    studioTab: 'seedance',
    badge: 'Seedance 2.5 · Kling O3',
    titleEn: 'AI Video Models Hub',
    titleVi: 'Kho Mô Hình Video Điện Ảnh',
    descEn: 'Generate cinematic B-roll, product ads, and 30s clips with Seedance 2.5, Kling O3, MiniMax H3, and Wan 3.0.',
    descVi: 'Tạo cảnh quay điện ảnh, quảng cáo sản phẩm với Seedance 2.5, Kling O3, MiniMax H3 và Wan 3.0.',
    category: 'video',
  },
  {
    slug: 'voice-clone',
    studioTab: 'ai-tools',
    studioSubTool: 'voice-clone',
    badge: '88 Languages',
    titleEn: 'Instant Voice Clone',
    titleVi: 'Nhân Bản Giọng Nói (Voice Clone)',
    descEn: 'Clone your personal or brand voice from a 10-second recording and speak across 88 languages.',
    descVi: 'Nhân bản giọng nói cá nhân chỉ từ mẫu thu âm 10 giây và phát âm chuẩn trên 88 ngôn ngữ.',
    category: 'voice',
  },
  {
    slug: 'text-to-speech',
    studioTab: 'ai-tools',
    studioSubTool: 'tts',
    badge: '1,000+ Voices',
    titleEn: 'AI Text to Speech',
    titleVi: 'Chuyển Văn Bản Thành Giọng Nói',
    descEn: 'Synthesize expressive voiceovers with speed, pitch, and emotion controls.',
    descVi: 'Tổng hợp giọng đọc tự nhiên với tùy chỉnh tốc độ, cao độ và sắc thái biểu cảm.',
    category: 'voice',
  },
  {
    slug: 'ai-image-generator',
    studioTab: 'ai-tools',
    studioSubTool: 'image-gen',
    badge: 'Nano Banana 2',
    titleEn: 'AI Image Generator',
    titleVi: 'Tạo Ảnh AI Chân Dung & Sản Phẩm',
    descEn: 'Create studio portraits, virtual influencers, thumbnails, and product scenes from text prompts.',
    descVi: 'Tạo ảnh chân dung MC, influencer ảo, thumbnail và bối cảnh sản phẩm sắc nét từ câu lệnh.',
    category: 'image',
  },
  {
    slug: 'remove-background',
    studioTab: 'ai-tools',
    studioSubTool: 'bg-remove',
    badge: '1-Click Cutout',
    titleEn: 'Remove Background & Green Screen',
    titleVi: 'Tách Nền & Phông Xanh Green Screen',
    descEn: 'Cut out portraits or product shots onto transparent PNG or studio chroma-key green screen.',
    descVi: 'Tách nền ảnh chân dung hoặc sản phẩm sang PNG trong suốt hoặc phông xanh tách lớp tức thì.',
    category: 'image',
  },
  {
    slug: 'upscale-enhance',
    studioTab: 'ai-tools',
    studioSubTool: 'upscale',
    badge: '4× Super-Res',
    titleEn: 'Upscale & Noise Removal',
    titleVi: 'Nâng Cấp Độ Phân Giải & Lọc Ồn',
    descEn: 'Sharpen portraits/frames up to 2K/4K and clean background hum from voice recordings.',
    descVi: 'Tăng độ sắc nét hình ảnh lên 2K/4K và khử tạp âm phòng thu cho bản ghi giọng nói.',
    category: 'image',
  },
  {
    slug: 'ai-ugc-ads',
    studioTab: 'ai-agent',
    badge: 'Creator Ads',
    titleEn: 'AI UGC Video Ads',
    titleVi: 'Quảng Cáo AI UGC Đa Phiên Bản',
    descEn: 'Paste a product URL or benefit to spin up creator-style TikTok, Reels, and Shorts ad hooks.',
    descVi: 'Dán link sản phẩm để tạo hàng loạt video review kiểu creator cho TikTok, Reels và Shorts.',
    category: 'avatar',
  },
  {
    slug: 'pet-video',
    studioTab: 'ai-video',
    badge: 'Cat & Dog Skits',
    titleEn: 'AI Pet Video (Cat & Dog)',
    titleVi: 'Video Thú Cưng Biết Nói & Hát',
    descEn: 'Animate your dog or cat photo into a hilarious talking podcast host or singing star.',
    descVi: 'Biến ảnh chó mèo cưng thành MC podcast hài hước hoặc ca sĩ biểu diễn cực viral.',
    category: 'avatar',
  },
];

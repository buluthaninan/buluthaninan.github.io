/**
 * SITENIN TEK ICERIK KAYNAGI
 * ---------------------------
 * Tum metinler ve veriler burada. Bilesenlere dokunmadan siteyi guncellemek icin
 * sadece bu dosyayi duzenlemek yeterli.
 *
 * Her metin { tr, en } seklinde iki dillidir.
 *
 * ACIK KALAN TEK SEY:
 *   - Lisansin baslangic yili (asagida `— 2022` yaziyor, teyit bekliyor)
 */

export type Lang = "tr" | "en";
export type I18n = { tr: string; en: string };

const t = (tr: string, en: string): I18n => ({ tr, en });

/* -------------------------------------------------------------------------- */
/*  KIMLIK                                                                    */
/* -------------------------------------------------------------------------- */

export const profile = {
  name: "Buluthan İnan",
  /** Terminal temasindaki komut satirinda kullanilir */
  handle: "buluthan",
  role: t("Full Stack & Flutter Developer", "Full Stack & Flutter Developer"),

  /** Hero'da rol satirinin yaninda donen kelimeler */
  rotating: [
    t(".NET & C#", ".NET & C#"),
    t("React", "React"),
    t("Flutter & Dart", "Flutter & Dart"),
    t("ERP Sistemleri", "ERP Systems"),
  ],

  location: t("İzmir, Türkiye", "İzmir, Türkiye"),
  timezone: "Europe/Istanbul",

  /**
   * Is arayan gibi gorunmemesi icin "musait" rozeti yerine notr bir durum satiri.
   * Gizlemek istersen `showStatus: false` yap.
   */
  showStatus: true,
  statusLabel: t("ESBAŞ'ta Full Stack Developer", "Full Stack Developer at ESBAŞ"),

  tagline: t(
    "Serbest bölgede yüzlerce kişinin her gün kullandığı ERP sistemleri ve mobil uygulamalar geliştiriyorum.",
    "I build ERP systems and mobile apps that hundreds of people use every day inside a free zone.",
  ),

  intro: t(
    "Web tarafında C# ve React, mobilde Flutter. Ama iş sadece kod yazmakla bitmiyor: ihtiyacı analiz etmek, çözümü tasarlamak, test etmek ve kullanacak kişiyle konuşmak da aynı masada.",
    "C# and React on the web, Flutter on mobile. But the job doesn't end at writing code: analysing the need, designing the solution, testing it and talking to the people who'll use it all land on the same desk.",
  ),
};

/* -------------------------------------------------------------------------- */
/*  ILETISIM                                                                  */
/* -------------------------------------------------------------------------- */

export const contact = {
  email: "buluthaninan.dev@gmail.com",
  socials: [
    { label: "GitHub", handle: "@buluthaninan", href: "https://github.com/buluthaninan" },
    {
      label: "LinkedIn",
      handle: "/in/buluthaninan",
      href: "https://www.linkedin.com/in/buluthaninan/",
    },
    {
      label: "E-posta",
      handle: "buluthaninan.dev@gmail.com",
      href: "mailto:buluthaninan.dev@gmail.com",
    },
  ],

  /**
   * Dile gore degisen CV. Yayina almadan once ICINDEKI TELEFON NUMARASINA dikkat —
   * site herkese acik olacak. Kaldirmak icin null yap.
   */
  resume: {
    tr: "/buluthan-inan-cv-tr.pdf",
    en: "/buluthan-inan-cv-en.pdf",
  } as I18n | null,
};

/* -------------------------------------------------------------------------- */
/*  CEKIRDEK YIGIN                                                            */
/*  Hero'nun altindaki serit. Once uydurma istatistikler vardi, kaldirildi.   */
/* -------------------------------------------------------------------------- */

export const coreStack = ["C#", ".NET Core", "React", "Flutter", "SQL Server"];

/* -------------------------------------------------------------------------- */
/*  PROJELER                                                                  */
/* -------------------------------------------------------------------------- */

export type Project = {
  slug: string;
  /** Ozel isimlerde iki dil de ayni yazilir: t("Persisto", "Persisto") */
  title: I18n;
  year: string;
  summary: I18n;
  /** Kartin uzerine gelince alttan cikan tek satirlik sonuc */
  impact: I18n;
  tags: string[];
  links: { live?: string; repo?: string };
  /** Gorsel yoksa slug'a gore otomatik desen uretilir */
  image?: string;
  pattern: "grid" | "waves" | "orbit" | "noise" | "bars" | "mesh" | "scan";
  accent: string;
};

export const projects: Project[] = [
  {
    slug: "freezonemobile",
    title: t("FreeZoneMobile", "FreeZoneMobile"),
    year: "2022 —",
    summary: t(
      "ERP'de yapılan işlerin mobildeki karşılığı. Form onayı ve görüntüleme, form bildirimleri, bakiye ve harcama takibi — masabaşında yapılan işlemler telefona taşındı. Şirket içi kullanım için yayınlandı.",
      "The mobile counterpart of our ERP. Form approvals and lookups, form notifications, balance and spending tracking — desk-bound operations moved onto a phone. Published for internal company use.",
    ),
    impact: t(
      "2022'den beri 100+ çalışan aktif kullanıyor",
      "Actively used by 100+ employees since 2022",
    ),
    tags: ["Flutter", "Dart", "Firebase", "OneSignal", ".NET Core", "REST API"],
    links: {},
    pattern: "orbit",
    accent: "#2f7bd8",
  },
  {
    slug: "fis-okuma",
    title: t("Fiş Okuma & Harcama Takibi", "Receipt Reading & Expense Tracking"),
    year: "2026",
    summary: t(
      "Sıfırdan kurduğum tek modül. Çalışan fişin fotoğrafını çekiyor, OpenAI görüntüyü okuyup tutarı ve kalemleri çıkarıyor, kayıt ERP'ye düşüyor. Kredi kartı ve avans harcamaları böyle takip ediliyor — muhasebe ve mali işler için yazıldı.",
      "The one module I built from the ground up. An employee photographs a receipt, OpenAI reads the image and extracts the amount and line items, and the record lands in the ERP. This is how credit-card and cash-advance spending is tracked — built for accounting and finance.",
    ),
    impact: t("Elle veri girişi yerine bir fotoğraf", "One photo instead of manual data entry"),
    tags: ["OpenAI", "C#", ".NET Core", "React", "SQL Server"],
    links: {},
    pattern: "scan",
    accent: "#0f9488",
  },
  {
    slug: "depo-terminali",
    title: t("Depo Terminali", "Warehouse Terminal"),
    year: "2024",
    summary: t(
      "Zebra ve Honeywell el terminallerinde çalışan depo çözümü. Stok sayımı, nakil ve giriş-çıkış işlemleri cihazın kendi barkod/QR okuyucusuyla sahada tamamlanıyor. Mağazada değil — doğrudan cihazlara kuruluyor.",
      "A warehouse solution running on Zebra and Honeywell handhelds. Stock counts, transfers and check-in/out are completed on the floor with the device's own barcode/QR scanner. Not on any store — installed straight onto the devices.",
    ),
    impact: t(
      "Stok, sayım ve nakil tek cihazda toplandı",
      "Stock, counting and transfers on a single device",
    ),
    tags: ["Flutter", "Zebra", "Honeywell", "QR / Barkod", "SQL Server", "REST API"],
    links: {},
    pattern: "grid",
    accent: "#f59e0b",
  },
  {
    slug: "bolge-gecis",
    title: t("Bölge Geçiş", "Zone Transition"),
    year: "2024",
    summary: t(
      "Zebra ve Honeywell el terminallerinde çalışan geçiş kayıt uygulaması. Bölgeye giren ve çıkan araçların kaydı tutuluyor, faturalandırma da bu kayıtlar üzerinden yürüyor.",
      "A transit logging app running on Zebra and Honeywell handhelds. Vehicles entering and leaving the zone are recorded, and billing runs off those records.",
    ),
    impact: t(
      "Geçiş kaydı doğrudan faturalandırmayı besliyor",
      "Transit records feed billing directly",
    ),
    tags: ["Flutter", "Zebra", "Honeywell", "REST API", "C#", "SQL Server"],
    links: {},
    pattern: "mesh",
    accent: "#10b981",
  },
  {
    slug: "menu-planlama",
    title: t("Menü Planlama / Sipariş", "Menu Planning / Ordering"),
    year: "2024",
    summary: t(
      "Bölgedeki şirketlerin menü planlaması, menü oluşturma ve sipariş süreçlerini yürüttüğü platform. Her şirketin yetkilisi kendi menüsünü yönetiyor. Mobil ve web tarafı tek kod tabanından, Flutter ile yazıldı.",
      "The platform companies in the zone use for menu planning, menu creation and ordering — each company's admin manages their own menu. Mobile and web ship from one Flutter codebase.",
    ),
    impact: t("15+ şirket aktif kullanıyor", "15+ companies use it actively"),
    tags: ["Flutter", "Flutter Web", "Firebase", "Excel", "C# API"],
    links: {},
    pattern: "waves",
    accent: "#e11d48",
  },
  {
    slug: "erp-modulleri",
    title: t("ERP Modülleri", "ERP Modules"),
    year: "2022 —",
    summary: t(
      "Var olan ERP'ye eklediğim modüller: sözleşmeler, satın alma akışlarının bir kısmı ve izin formları. Servis katmanı C# ve .NET Core, arayüzlerin tamamı React — sistemin eski ASP.NET tarafında da arayüz geliştirdim.",
      "Modules I added to an existing ERP: contracts, parts of the purchasing flow, and leave request forms. Services in C# and .NET Core, every front-end in React — plus front-end work on the system's legacy ASP.NET side.",
    ),
    impact: t(
      "Eski ASP.NET tarafı ve yeni React ekranlar bir arada",
      "Legacy ASP.NET and new React screens, side by side",
    ),
    tags: ["C#", ".NET Core", "React", "ASP.NET", "SQL Server", "Entity Framework"],
    links: {},
    pattern: "bars",
    accent: "#7c3aed",
  },
  {
    slug: "persisto",
    title: t("Persisto", "Persisto"),
    year: "2025 — 2026",
    summary: t(
      "Alışkanlık ve seri takibi için yazdığım Flutter uygulaması. Kategoriler gün gün işaretleniyor, seriler kendiliğinden hesaplanıyor, haftalık jetonla bir gün dondurulabiliyor. Hatırlatmalar OneSignal üzerinden günde beş sabit saate planlanıyor — kategoriyi tamamladığın anda o günün kalan bildirimleri iptal oluyor. Mağaza için değil, tek bir kişi için yazıldı.",
      "A Flutter app I wrote for habit and streak tracking. Categories get checked off day by day, streaks compute themselves, and a weekly token can freeze a day. Reminders are scheduled through OneSignal at five fixed times — and the moment you complete a category, the rest of that day's notifications cancel themselves. Written for one person, never meant for a store.",
    ),
    impact: t(
      "Seri ve dondurma mantığı birim testlerle korunuyor",
      "Streak and freeze logic covered by unit tests",
    ),
    tags: ["Flutter", "Firebase Auth", "Firestore", "Supabase", "OneSignal", "Excel"],
    links: {},
    pattern: "noise",
    accent: "#06b6d4",
  },
  {
    slug: "samim",
    title: t("SAMIM — Yüksek Lisans Tezi", "SAMIM — Master's Thesis"),
    year: "2026",
    // Tez YOK'te yayinlandiginda linki buraya: links: { live: "https://tez.yok.gov.tr/..." }
    summary: t(
      "Scrum, devreye alım sonrası bakımın kesinti odaklı doğası için tasarlanmamıştı. Sistematik literatür taraması, 10 sektör profesyoneliyle mülakat ve 15 kişilik uzman paneliyle AHP analizi yürüttüm; sorunun %45'i acil işler ve teknik borçtan çıktı. Geliştirdiğim SAMIM modeli Scrum'ı baştan yazmıyor, dört müdahaleyle kısır döngüyü kırıyor: triyaj ve kurumsal hafızadan sorumlu dönüşümlü System Steward rolü, kapasite tamponları, takas politikası ve stabilizasyon penceresi.",
      "Scrum was never designed for the interrupt-driven nature of post-deployment maintenance. I ran a systematic literature review, interviews with 10 practitioners and an AHP study with a 15-expert panel; urgent work and technical debt accounted for 45% of the problem. The SAMIM model I developed doesn't rewrite Scrum — it breaks the loop with four interventions: a rotating System Steward role owning triage and organisational memory, capacity buffers, a swap policy, and a stabilisation window.",
    ),
    impact: t(
      "Grup tutarlılık oranı 0,0089 · jüri tarafından kabul edildi",
      "Group consistency ratio 0.0089 · accepted by the jury",
    ),
    tags: ["Scrum", "AHP", "Technical Debt", "Software Maintenance", "SLR"],
    links: {},
    pattern: "waves",
    accent: "#8b5cf6",
  },
];

/* -------------------------------------------------------------------------- */
/*  YETENEKLER                                                                */
/* -------------------------------------------------------------------------- */

export const skills: { group: I18n; items: string[] }[] = [
  {
    group: t("Diller", "Languages"),
    items: ["C#", "Dart", "JavaScript", "Java", "SQL", "HTML", "CSS"],
  },
  {
    group: t("Framework & Kütüphane", "Frameworks & Libraries"),
    items: [".NET Core", "ASP.NET", "React", "Flutter", "Entity Framework", "Material 3"],
  },
  {
    group: t("Veri & Servis", "Data & Services"),
    items: ["SQL Server", "RESTful API", "OpenAI API", "Firebase", "Firestore", "Supabase"],
  },
  {
    group: t("Araçlar & Süreç", "Tools & Process"),
    items: ["Git", "TFS", "Docker", "Jira", "Postman", "Agile / Scrum"],
  },
];

/* -------------------------------------------------------------------------- */
/*  SERTIFIKALAR                                                              */
/* -------------------------------------------------------------------------- */

export const certificates: { name: string; issuer: I18n }[] = [
  { name: "IBM Cybersecurity — Network Security", issuer: t("IBM", "IBM") },
  { name: "IBM Cybersecurity — System Administration", issuer: t("IBM", "IBM") },
  { name: "IBM Cybersecurity — Tools", issuer: t("IBM", "IBM") },
  { name: "IELTS 6.5", issuer: t("Upper-Intermediate", "Upper-Intermediate") },
];

/* -------------------------------------------------------------------------- */
/*  DENEYIM & EGITIM                                                          */
/* -------------------------------------------------------------------------- */

export type Experience = {
  org: string;
  role: I18n;
  period: I18n;
  current?: boolean;
  description: I18n;
  tags: string[];
};

export const experience: Experience[] = [
  {
    org: "ESBAŞ — Ege Serbest Bölgesi",
    role: t("Full Stack & Flutter Developer", "Full Stack & Flutter Developer"),
    period: t("Eki 2022 — Günümüz", "Oct 2022 — Present"),
    current: true,
    description: t(
      "Küçük bir ekipte işin tamamını üstleniyoruz: ihtiyacı kullanan şirketle konuşup analiz ediyor, ERP modülünü C#, .NET Core, React ve SQL Server ile yazıyor, testini kendimiz yapıyor ve devreye alıyoruz. Kurumun mobil tarafının tamamı bana ait: ERP ile entegre uygulamaları Flutter ile geliştirip yayınladım.",
      "In a small team we own the whole cycle: we talk to the company that will use the system, do the analysis, build the ERP module in C#, .NET Core, React and SQL Server, test it ourselves and ship it. The whole mobile side of the company is mine: I built and shipped the ERP-integrated apps in Flutter.",
    ),
    tags: ["C#", ".NET Core", "React", "Flutter", "SQL Server", "Analiz", "Test"],
  },
  {
    org: "ESBAŞ — Ege Serbest Bölgesi",
    role: t("Yazılım Geliştirme Stajyeri", "Software Developer Intern"),
    period: t("Tem 2022 — Ağu 2022", "Jul 2022 — Aug 2022"),
    description: t(
      "Flutter ve Firebase ile kurum içi yemek sipariş sistemini geliştirdim, C# API'lerine bağladım. ERP API testleri, web modülü geliştirme ve kod incelemelerine katkı verdim.",
      "Built the internal meal ordering system with Flutter and Firebase and wired it to the C# APIs. Contributed to ERP API testing, web module development and code reviews.",
    ),
    tags: ["Flutter", "Firebase", "C#"],
  },
  {
    org: "İzmir Ekonomi Üniversitesi",
    role: t("Bilgisayar Mühendisliği, Yüksek Lisans", "M.Sc. Computer Engineering"),
    period: t("Şub 2023 — Haz 2026", "Feb 2023 — Jun 2026"),
    description: t(
      "3,36 ortalamayla mezun oldum. Tezim, Scrum'ın devreye alım sonrası bakımla uyumsuzluğunu ele alıyor: sistematik literatür taraması, 10 sektör profesyoneliyle mülakat ve 15 kişilik uzman paneliyle AHP analizi sonucunda SAMIM modelini geliştirdim. Danışman: Dr. Öğr. Üyesi Kaan Kurtel.",
      "Graduated with a 3.36 GPA. My thesis tackles the mismatch between Scrum and post-deployment maintenance: through a systematic literature review, interviews with 10 practitioners and an AHP study with a 15-expert panel, I developed the SAMIM model. Advisor: Asst. Prof. Dr. Kaan Kurtel.",
    ),
    tags: ["Scrum", "AHP", "Software Maintenance"],
  },
  {
    // TODO: baslangic ve mezuniyet yillari teyit edilecek
    org: "İzmir Ekonomi Üniversitesi",
    role: t("Yazılım Mühendisliği, Lisans", "B.Sc. Software Engineering"),
    period: t("— 2022", "— 2022"),
    description: t(
      "3,01 ortalamayla mezun oldum. Tiyatro kulübünde başkan yardımcılığı yaptım — sahnede de, sahne arkasında da.",
      "Graduated with a 3.01 GPA. Served as vice president of the theatre club — on stage and behind it.",
    ),
    tags: [],
  },
];

/* -------------------------------------------------------------------------- */
/*  HAKKIMDA                                                                  */
/* -------------------------------------------------------------------------- */

export const about = {
  heading: t("Kısaca", "In short"),
  paragraphs: [
    t(
      "2022'de ESBAŞ'a stajyer olarak girdim, ilk işim bir yemek sipariş uygulamasıydı. O uygulama hâlâ kullanımda — ve o gün bu gün aynı yerde, aynı sistemin çok daha büyüğünü kuruyorum.",
      "I joined ESBAŞ as an intern in 2022; my first task was a meal ordering app. That app is still in use — and I've been in the same place ever since, building a much larger version of the same system.",
    ),
    t(
      "Küçük ekipte çalışmanın iyi tarafı, işin sadece kod kısmında kalmıyor olman. İhtiyacı anlatan şirketle ben konuşuyorum, çözümü ben tasarlıyorum, testini ben yapıyorum, hata gelirse yine bana geliyor. Yazdığım şeyin kime gittiğini biliyorum — çoğu aynı binada çalışıyor.",
      "The good part of a small team is that the work doesn't stop at code. I talk to the company that has the need, I design the solution, I test it, and when something breaks it comes back to me. I know exactly who my code goes to — most of them work in the same building.",
    ),
    t(
      "Mesai dışında gitar çalıp beste yapıyorum, tiyatroyla ilgileniyorum, basketbol ve futbol izliyorum. Kendi projelerimde ise genelde bir şeyi takip etmenin daha eğlenceli yolunu arıyorum.",
      "Off the clock I play guitar and write music, I'm into theatre, and I follow basketball and football. In my own projects I'm usually looking for a more enjoyable way to keep track of something.",
    ),
  ],

  /** Hakkimda bolumundeki kucuk bilgi kartlari */
  now: [
    { label: t("Şu an", "Currently"), value: t("ESBAŞ · ERP & mobil", "ESBAŞ · ERP & mobile") },
    {
      label: t("Eğitim", "Education"),
      value: t("Yüksek Lisans · İzmir Ekonomi Ü.", "M.Sc. · Izmir University of Economics"),
    },
    {
      label: t("Diller", "Spoken"),
      value: t("Türkçe · İngilizce · Almanca", "Turkish · English · German"),
    },
  ],
};

/* -------------------------------------------------------------------------- */
/*  ARAYUZ METINLERI                                                          */
/* -------------------------------------------------------------------------- */

export const ui = {
  nav: {
    work: t("Projeler", "Work"),
    about: t("Hakkımda", "About"),
    experience: t("Deneyim", "Experience"),
    contact: t("İletişim", "Contact"),
    menu: t("Menü", "Menu"),
    close: t("Kapat", "Close"),
  },
  hero: {
    scroll: t("kaydır", "scroll"),
    viewWork: t("İşlerime bak", "See my work"),
    getInTouch: t("İletişime geç", "Get in touch"),
    localTime: t("yerel saat", "local time"),
  },
  sections: {
    workTitle: t("Seçili İşler", "Selected Work"),
    workNote: t(
      "Çoğu ESBAŞ'ın iç sistemleri olduğu için kaynak kodu kapalı — ama ne yaptıklarını anlatabilirim.",
      "Most of these are ESBAŞ's internal systems, so the source is closed — but I can tell you what they do.",
    ),
    aboutTitle: t("Hakkımda", "About"),
    skillsTitle: t("Ne ile çalışıyorum", "What I work with"),
    certificatesTitle: t("Sertifikalar", "Certificates"),
    experienceTitle: t("Yol Haritası", "Trajectory"),
    contactTitle: t("Bir şey konuşalım", "Let's talk"),
    contactNote: t(
      "Soru, fikir ya da sadece merhaba — kutum açık.",
      "A question, an idea, or just hello — my inbox is open.",
    ),
  },
  actions: {
    copyEmail: t("E-postayı kopyala", "Copy email"),
    copied: t("Kopyalandı!", "Copied!"),
    liveSite: t("Canlı", "Live"),
    sourceCode: t("Kaynak", "Source"),
    downloadCv: t("CV indir", "Download CV"),
  },
  palette: {
    placeholder: t("Bir komut yaz veya ara…", "Type a command or search…"),
    navigate: t("Git", "Navigate"),
    theme: t("Tema", "Theme"),
    language: t("Dil", "Language"),
    links: t("Bağlantılar", "Links"),
    empty: t("Sonuç yok.", "No results."),
    hint: t("açmak için", "to open"),
  },
  themes: {
    editorial: t("Editöryel", "Editorial"),
    tech: t("Teknik", "Tech"),
    terminal: t("Terminal", "Terminal"),
  },
  footer: {
    built: t("Next.js ile yapıldı", "Built with Next.js"),
    rights: t("Tüm hakları saklıdır.", "All rights reserved."),
    secret: t(
      "İpucu: ⌘K dene. Ya da yukarı-yukarı-aşağı-aşağı…",
      "Hint: try ⌘K. Or up-up-down-down…",
    ),
  },
};

/* -------------------------------------------------------------------------- */
/*  TERMINAL TEMASI KOMUTLARI                                                 */
/* -------------------------------------------------------------------------- */

export const terminalHelp: { cmd: string; desc: I18n }[] = [
  { cmd: "help", desc: t("komutları listele", "list all commands") },
  { cmd: "whoami", desc: t("kısa tanıtım", "short bio") },
  { cmd: "ls projects", desc: t("projeleri listele", "list projects") },
  { cmd: "cat about", desc: t("hakkımda metnini oku", "read the about text") },
  { cmd: "skills", desc: t("teknoloji yığınım", "my tech stack") },
  { cmd: "contact", desc: t("iletişim bilgileri", "how to reach me") },
  { cmd: "theme <ad>", desc: t("temayı değiştir", "switch theme") },
  { cmd: "lang <tr|en>", desc: t("dili değiştir", "switch language") },
  { cmd: "clear", desc: t("ekranı temizle", "clear the screen") },
];

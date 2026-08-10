"""
CV URETICISI
------------
Siteyle ayni bilgilerden tek sayfalik, uluslararasi formatta CV uretir.
Cikti: public/buluthan-inan-cv-tr.pdf ve public/buluthan-inan-cv-en.pdf

Calistirmak icin:  python scripts/build_cv.py
Gereksinim:        pip install reportlab

Icerigi degistirmek istersen asagidaki CV sozlugunu duzenle. Sitedeki
src/content/content.ts ile ayni bilgileri tutmaya dikkat et.
"""

import os
import sys

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_JUSTIFY
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    HRFlowable,
    KeepTogether,
    PageTemplate,
    Paragraph,
    Spacer,
)

# --------------------------------------------------------------------------- #
#  Fontlar — Segoe UI Turkce karakterleri tam destekler                        #
# --------------------------------------------------------------------------- #

FONTS = {
    "UI": "C:/Windows/Fonts/segoeui.ttf",
    "UI-Bold": "C:/Windows/Fonts/segoeuib.ttf",
    "UI-Semi": "C:/Windows/Fonts/seguisb.ttf",
    "UI-Italic": "C:/Windows/Fonts/segoeuii.ttf",
}

for name, path in FONTS.items():
    if not os.path.exists(path):
        sys.exit(f"Font bulunamadi: {path}")
    pdfmetrics.registerFont(TTFont(name, path))

# Paragraf icindeki <b> ve <i> etiketlerinin calismasi icin aile tanimi sart
pdfmetrics.registerFontFamily(
    "UI", normal="UI", bold="UI-Bold", italic="UI-Italic", boldItalic="UI-Bold"
)

INK = HexColor("#15171a")
MUTED = HexColor("#5b6472")
ACCENT = HexColor("#1d5fa8")
RULE = HexColor("#d8dce2")

# --------------------------------------------------------------------------- #
#  ICERIK                                                                      #
# --------------------------------------------------------------------------- #

CONTACT = {
    "name": "Buluthan İnan",
    "phone": "+90 536 443 69 96",
    "email": "buluthaninan.dev@gmail.com",
    "github": "github.com/buluthaninan",
    "linkedin": "linkedin.com/in/buluthaninan",
    "location_tr": "İzmir, Türkiye",
    "location_en": "İzmir, Türkiye",
}

CV = {
    "tr": {
        "role": "Full Stack &amp; Flutter Developer",
        "summary": (
            "Kurumsal ERP sistemleri üzerine çalışan full stack geliştirici. Web tarafında C#, .NET Core ve "
            "React, mobilde Flutter. ESBAŞ'ta küçük bir ekipte işin tamamını üstleniyorum: ihtiyacı kullanan "
            "şirketle konuşup analiz etmek, geliştirmek, test etmek ve devreye almak. Kurumun mobil "
            "katmanının tamamı bana ait. Yazılım bakımında Scrum uyarlaması üzerine yüksek lisans tezi."
        ),
        "sections": {
            "exp": "Deneyim",
            "edu": "Eğitim",
            "skills": "Yetenekler",
            "projects": "Kişisel Proje",
            "certs": "Sertifikalar ve Diller",
        },
        "experience": [
            {
                "org": "ESBAŞ — Ege Serbest Bölgesi",
                "role": "Full Stack &amp; Flutter Developer",
                "period": "Ekim 2022 — Günümüz",
                "place": "İzmir",
                "bullets": [
                    "Kurumun mobil katmanının tamamını Flutter ile geliştirip yayına aldım: 100+ çalışanın her gün "
                    "kullandığı ERP mobil uygulaması, Zebra ve Honeywell el terminallerinde çalışan depo ve geçiş "
                    "kayıt uygulamaları, 15+ şirketin kullandığı menü planlama ve sipariş platformu.",
                    "Fiş fotoğrafını OpenAI ile okuyup kredi kartı ve avans harcamalarını ERP'ye işleyen modülü "
                    "sıfırdan tasarlayıp geliştirdim; muhasebe ve mali işler ekibinin elle veri girişini ortadan kaldırdı.",
                    "ERP modüllerini C# ve .NET Core ile geliştirdim, arayüzlerini React ile yazdım: sözleşmeler, "
                    "satın alma akışları ve izin formları. Sistemin eski ASP.NET tarafında da arayüz geliştirdim.",
                    "Geliştirmenin yanında analiz, test ve sistemi kullanan şirketlerle iletişim de sorumluluğumda.",
                ],
            },
            {
                "org": "ESBAŞ — Ege Serbest Bölgesi",
                "role": "Yazılım Geliştirme Stajyeri",
                "period": "Temmuz 2022 — Ağustos 2022",
                "place": "İzmir",
                "bullets": [
                    "Flutter ve Firebase ile kurum içi sipariş sistemini geliştirdim, C# API'lerine bağladım.",
                    "ERP API testleri, web modülü geliştirme ve kod incelemelerine katkı verdim.",
                ],
            },
        ],
        "education": [
            {
                "org": "İzmir Ekonomi Üniversitesi",
                "role": "Bilgisayar Mühendisliği, Yüksek Lisans",
                "period": "Şubat 2023 — Haziran 2026",
                "place": "Ortalama 3,36 / 4,00",
                "bullets": [
                    "Tez: <i>Adapting Scrum for Effective Software Maintenance: Understanding the Discrepancy and "
                    "Bridging the Gap</i>. Sistematik literatür taraması, 10 sektör profesyoneliyle mülakat ve "
                    "15 kişilik uzman paneliyle AHP analizi (grup tutarlılık oranı 0,0089). Bakım yükünü çevikliği "
                    "bozmadan yöneten SAMIM modelini geliştirdim. Danışman: Dr. Öğr. Üyesi Kaan Kurtel.",
                ],
            },
            {
                "org": "İzmir Ekonomi Üniversitesi",
                "role": "Yazılım Mühendisliği, Lisans",
                "period": "Eylül 2018 — Haziran 2022",
                "place": "Ortalama 3,01 / 4,00",
                "bullets": ["Tiyatro Kulübü Başkan Yardımcısı."],
            },
        ],
        "skills": [
            ("Diller", "C#, Dart, JavaScript, Java, SQL, HTML, CSS"),
            ("Framework", ".NET Core, ASP.NET, React, Flutter, Entity Framework"),
            ("Veri ve Servis", "SQL Server, RESTful API, OpenAI API, Firebase, Firestore, Supabase, OneSignal"),
            ("Araç ve Süreç", "Git, TFS, Docker, Jira, Postman, Agile / Scrum"),
        ],
        "projects": [
            (
                "Persisto",
                "Alışkanlık ve seri takibi için Flutter ile yazdığım mobil uygulama. Hatırlatmalar OneSignal "
                "üzerinden planlanıyor ve kategori tamamlandığında o günün kalan bildirimleri kendiliğinden "
                "iptal oluyor. Seri ve dondurma mantığı birim testlerle korunuyor.",
            ),
        ],
        "certs": [
            ("Sertifikalar", "IBM Cybersecurity — Network Security, System Administration, Tools"),
            ("Diller", "Türkçe (ana dil), İngilizce (IELTS 6.5 — Upper-Intermediate), Almanca (başlangıç)"),
        ],
    },
    "en": {
        "role": "Full Stack &amp; Flutter Developer",
        "summary": (
            "Full stack developer working on enterprise ERP systems. C#, .NET Core and React on the web, "
            "Flutter on mobile. In a small team at ESBAŞ I own the whole cycle: talking to the company that "
            "has the need, analysis, development, testing and release. The entire mobile layer of the "
            "organisation is mine. M.Sc. thesis on adapting Scrum for software maintenance."
        ),
        "sections": {
            "exp": "Experience",
            "edu": "Education",
            "skills": "Skills",
            "projects": "Personal Project",
            "certs": "Certificates and Languages",
        },
        "experience": [
            {
                "org": "ESBAŞ — Aegean Free Zone",
                "role": "Full Stack &amp; Flutter Developer",
                "period": "October 2022 — Present",
                "place": "İzmir, Türkiye",
                "bullets": [
                    "Built and shipped the organisation's entire mobile layer in Flutter: an ERP companion app used "
                    "daily by 100+ employees, warehouse and transit logging apps running on Zebra and Honeywell "
                    "handhelds, and a menu planning and ordering platform used by 15+ companies.",
                    "Designed and built from scratch a module that reads a photographed receipt with OpenAI and posts "
                    "credit-card and cash-advance expenses into the ERP, removing manual data entry for the accounting "
                    "and finance team.",
                    "Developed ERP modules in C# and .NET Core with React front-ends — contracts, purchasing flows and "
                    "leave request forms — and maintained screens on the system's legacy ASP.NET stack.",
                    "Alongside development, own the analysis, testing and communication with the companies using the system.",
                ],
            },
            {
                "org": "ESBAŞ — Aegean Free Zone",
                "role": "Software Developer Intern",
                "period": "July 2022 — August 2022",
                "place": "İzmir, Türkiye",
                "bullets": [
                    "Built an internal ordering system with Flutter and Firebase, integrated with C# APIs.",
                    "Contributed to ERP API testing, web module development and code reviews.",
                ],
            },
        ],
        "education": [
            {
                "org": "Izmir University of Economics",
                "role": "M.Sc. Computer Engineering",
                "period": "February 2023 — June 2026",
                "place": "GPA 3.36 / 4.00",
                "bullets": [
                    "Thesis: <i>Adapting Scrum for Effective Software Maintenance: Understanding the Discrepancy and "
                    "Bridging the Gap</i>. Systematic literature review, interviews with 10 industry practitioners and "
                    "an AHP study with a 15-expert panel (group consistency ratio 0.0089). Produced SAMIM, a model for "
                    "absorbing maintenance load without breaking Scrum's empirical principles. "
                    "Advisor: Asst. Prof. Dr. Kaan Kurtel.",
                ],
            },
            {
                "org": "Izmir University of Economics",
                "role": "B.Sc. Software Engineering",
                "period": "September 2018 — June 2022",
                "place": "GPA 3.01 / 4.00",
                "bullets": ["Vice President, Theatre Club."],
            },
        ],
        "skills": [
            ("Languages", "C#, Dart, JavaScript, Java, SQL, HTML, CSS"),
            ("Frameworks", ".NET Core, ASP.NET, React, Flutter, Entity Framework"),
            ("Data and Services", "SQL Server, RESTful APIs, OpenAI API, Firebase, Firestore, Supabase, OneSignal"),
            ("Tools and Practice", "Git, TFS, Docker, Jira, Postman, Agile / Scrum"),
        ],
        "projects": [
            (
                "Persisto",
                "A habit and streak tracking app I wrote in Flutter. Reminders are scheduled through OneSignal and "
                "the rest of the day's notifications cancel themselves once a category is completed. Streak and "
                "freeze logic is covered by unit tests.",
            ),
        ],
        "certs": [
            ("Certificates", "IBM Cybersecurity — Network Security, System Administration, Tools"),
            ("Languages", "Turkish (native), English (IELTS 6.5 — Upper-Intermediate), German (beginner)"),
        ],
    },
}

# --------------------------------------------------------------------------- #
#  STILLER                                                                     #
# --------------------------------------------------------------------------- #

S = {
    "name": ParagraphStyle(
        "name", fontName="UI-Bold", fontSize=21, leading=25, textColor=INK, spaceAfter=1
    ),
    "role": ParagraphStyle(
        "role", fontName="UI-Semi", fontSize=10.5, leading=14, textColor=ACCENT, spaceAfter=4
    ),
    "contact": ParagraphStyle(
        "contact", fontName="UI", fontSize=8.7, leading=12.8, textColor=MUTED
    ),
    "summary": ParagraphStyle(
        "summary",
        fontName="UI",
        fontSize=9.4,
        leading=13.9,
        textColor=INK,
        alignment=TA_JUSTIFY,
        spaceBefore=7,
    ),
    "h2": ParagraphStyle(
        "h2", fontName="UI-Bold", fontSize=9.4, leading=11.5, textColor=ACCENT, spaceBefore=13, spaceAfter=3
    ),
    "entryTitle": ParagraphStyle(
        "entryTitle", fontName="UI-Semi", fontSize=10.2, leading=13.2, textColor=INK
    ),
    "entryMeta": ParagraphStyle(
        "entryMeta", fontName="UI", fontSize=8.6, leading=11.8, textColor=MUTED, spaceAfter=2.5
    ),
    "bullet": ParagraphStyle(
        "bullet",
        fontName="UI",
        fontSize=9.2,
        leading=13.1,
        textColor=INK,
        leftIndent=8,
        bulletIndent=0,
        spaceAfter=1.6,
        alignment=TA_JUSTIFY,
    ),
    "skill": ParagraphStyle(
        "skill", fontName="UI", fontSize=9.2, leading=13.4, textColor=INK, leftIndent=80, firstLineIndent=-80
    ),
}


def rule():
    return HRFlowable(width="100%", thickness=0.6, color=RULE, spaceBefore=2, spaceAfter=5)


def upper(text, lang):
    """
    Python'in upper() metodu 'i' harfini 'I' yapar; Turkce'de dogrusu 'İ'.
    Ayni sekilde 'ı' harfi 'I' olmali. Bu esleme yalnizca Turkce icin gecerli —
    Ingilizce'de uygulanirsa "EXPERIENCE" yerine "EXPERİENCE" cikar.
    """
    if lang == "tr":
        text = text.replace("i", "İ").replace("ı", "I")
    return text.upper()


def heading(text, lang):
    return [Paragraph(upper(text, lang), S["h2"]), rule()]


def entry(item):
    """Bir deneyim/egitim girdisi — baslik, meta satiri ve maddeler."""
    parts = [
        Paragraph(f'{item["role"]} <font color="#5b6472">·</font> {item["org"]}', S["entryTitle"]),
        Paragraph(f'{item["period"]}  ·  {item["place"]}', S["entryMeta"]),
    ]
    for b in item["bullets"]:
        parts.append(Paragraph(b, S["bullet"], bulletText="—"))
    parts.append(Spacer(1, 5.5))
    return KeepTogether(parts)


def build(lang):
    d = CV[lang]
    out = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "public",
        f"buluthan-inan-cv-{lang}.pdf",
    )

    doc = BaseDocTemplate(
        out,
        pagesize=A4,
        leftMargin=17 * mm,
        rightMargin=17 * mm,
        topMargin=14 * mm,
        bottomMargin=12 * mm,
        title=f'{CONTACT["name"]} — CV',
        author=CONTACT["name"],
        subject="Curriculum Vitae",
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="f", showBoundary=0)
    doc.addPageTemplates([PageTemplate(id="cv", frames=[frame])])

    sep = '<font color="#c2c8d0">  |  </font>'
    contact_line = sep.join(
        [
            CONTACT["location_tr"] if lang == "tr" else CONTACT["location_en"],
            CONTACT["phone"],
            f'<a href="mailto:{CONTACT["email"]}"><font color="#1d5fa8">{CONTACT["email"]}</font></a>',
            f'<a href="https://{CONTACT["github"]}"><font color="#1d5fa8">{CONTACT["github"]}</font></a>',
            f'<a href="https://{CONTACT["linkedin"]}"><font color="#1d5fa8">{CONTACT["linkedin"]}</font></a>',
        ]
    )

    story = [
        Paragraph(CONTACT["name"], S["name"]),
        Paragraph(d["role"], S["role"]),
        Paragraph(contact_line, S["contact"]),
        Paragraph(d["summary"], S["summary"]),
    ]

    story += heading(d["sections"]["exp"], lang)
    for item in d["experience"]:
        story.append(entry(item))

    story += heading(d["sections"]["edu"], lang)
    for item in d["education"]:
        story.append(entry(item))

    story += heading(d["sections"]["skills"], lang)
    for label, items in d["skills"]:
        story.append(Paragraph(f'<font name="UI-Semi">{label}</font>&nbsp;&nbsp;{items}', S["skill"]))

    story += heading(d["sections"]["projects"], lang)
    for title, desc in d["projects"]:
        story.append(Paragraph(f'<font name="UI-Semi">{title}</font> — {desc}', S["bullet"]))

    story += heading(d["sections"]["certs"], lang)
    for label, items in d["certs"]:
        story.append(Paragraph(f'<font name="UI-Semi">{label}</font>&nbsp;&nbsp;{items}', S["skill"]))

    doc.build(story)
    return out, doc.page


if __name__ == "__main__":
    for lang in ("tr", "en"):
        path, pages = build(lang)
        print(f"{lang}: {path}  ({pages} sayfa)")

import { useState } from "react";

const PALETTES = {
  ink_gold: {
    name: "Mực & Vàng", desc: "Masculine luxury. Whiskey bar at midnight.",
    pageBg: "#0A0A08", cardBg: "#13120F", accent: "#C9A84C",
    accentSoft: "rgba(201,168,76,0.12)", text: "#E8E2D4", textSoft: "#9A9385",
    muted: "#5C5649", border: "#2A2720",
    gradientA: "#0A0A08", gradientB: "#1A1610", gradientC: "#0D0B07",
    glowColor: "rgba(201,168,76,0.06)", particleColor: "rgba(201,168,76,0.15)",
  },
  mystic_night: {
    name: "Đêm Huyền", desc: "Midnight secrets. Smoke and moonlight.",
    pageBg: "#080B14", cardBg: "#0E1220", accent: "#8B9FBF",
    accentSoft: "rgba(139,159,191,0.1)", text: "#D4DAE8", textSoft: "#7A839A",
    muted: "#454D63", border: "#1C2236",
    gradientA: "#080B14", gradientB: "#0F1528", gradientC: "#0A0E1A",
    glowColor: "rgba(100,140,200,0.05)", particleColor: "rgba(139,159,191,0.12)",
  },
  red_wine: {
    name: "Rượu Đỏ", desc: "Velvet warmth. The taste of temptation.",
    pageBg: "#0E0608", cardBg: "#170C10", accent: "#B5464A",
    accentSoft: "rgba(181,70,74,0.1)", text: "#E8DDD4", textSoft: "#9A8A82",
    muted: "#5C4A45", border: "#2E1E22",
    gradientA: "#0E0608", gradientB: "#1A0E14", gradientC: "#120810",
    glowColor: "rgba(181,70,74,0.05)", particleColor: "rgba(181,70,74,0.12)",
  },
  tram_huong: {
    name: "Trầm Hương", desc: "Ancient forest. Sacred smoke rising.",
    pageBg: "#070B08", cardBg: "#0D1410", accent: "#6B9B72",
    accentSoft: "rgba(107,155,114,0.1)", text: "#D8E2D4", textSoft: "#849A82",
    muted: "#4A5C47", border: "#1E2E20",
    gradientA: "#070B08", gradientB: "#101A12", gradientC: "#090E0A",
    glowColor: "rgba(107,155,114,0.05)", particleColor: "rgba(107,155,114,0.12)",
  },
  tim_mong: {
    name: "Tím Mộng", desc: "Velvet plum. Opium den haze.",
    pageBg: "#0B0810", cardBg: "#140F1C", accent: "#9B7BBF",
    accentSoft: "rgba(155,123,191,0.1)", text: "#DDD4E8", textSoft: "#8A7E9A",
    muted: "#544D63", border: "#261F36",
    gradientA: "#0B0810", gradientB: "#15102A", gradientC: "#0E0A18",
    glowColor: "rgba(155,123,191,0.05)", particleColor: "rgba(155,123,191,0.12)",
  },
  dong_co: {
    name: "Đồng Cổ", desc: "Burnt copper. Firelight on skin.",
    pageBg: "#0C0906", cardBg: "#16120D", accent: "#C08850",
    accentSoft: "rgba(192,136,80,0.1)", text: "#E8DDD0", textSoft: "#9A8E7A",
    muted: "#5C5340", border: "#2E2820",
    gradientA: "#0C0906", gradientB: "#1A150E", gradientC: "#100C08",
    glowColor: "rgba(192,136,80,0.05)", particleColor: "rgba(192,136,80,0.12)",
  },
  hong_tram: {
    name: "Hồng Trầm", desc: "Dusty rose. Silk on charcoal.",
    pageBg: "#0C090B", cardBg: "#161214", accent: "#B07080",
    accentSoft: "rgba(176,112,128,0.1)", text: "#E8D8DD", textSoft: "#9A858C",
    muted: "#5C4A52", border: "#2E2226",
    gradientA: "#0C090B", gradientB: "#1A1218", gradientC: "#100C0E",
    glowColor: "rgba(176,112,128,0.05)", particleColor: "rgba(176,112,128,0.12)",
  },
  dai_duong: {
    name: "Đại Dương", desc: "Abyssal teal. Sunken treasure.",
    pageBg: "#060B0C", cardBg: "#0C1516", accent: "#5AA0A0",
    accentSoft: "rgba(90,160,160,0.1)", text: "#D4E4E4", textSoft: "#7E9A9A",
    muted: "#455C5C", border: "#1C2E2E",
    gradientA: "#060B0C", gradientB: "#0E1A1C", gradientC: "#080E10",
    glowColor: "rgba(90,160,160,0.05)", particleColor: "rgba(90,160,160,0.12)",
  },
};

const FONTS = {
  bodoni: {
    name: "Thời Trang",
    vibe: "High-fashion editorial",
    heading: "'Bodoni Moda', serif",
    headingWeight: 400,
    headingStyle: "normal",
    headingSize: 48,
    body: "'Outfit', sans-serif",
    bodySize: 16,
    bodyWeight: 300,
    labelFont: "'Outfit', sans-serif",
    quoteSize: 28,
    quoteWeight: 400,
    quoteStyle: "normal",
    spacing: "0.02em",
    googleUrl: "https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,700;1,400&family=Outfit:wght@200;300;400;500;600&display=swap",
    sample: "Aa",
    sampleFont: "'Bodoni Moda', serif",
  },
  syne: {
    name: "Đương Đại",
    vibe: "Geometric. Architectural.",
    heading: "'Syne', sans-serif",
    headingWeight: 700,
    headingStyle: "normal",
    headingSize: 44,
    body: "'Crimson Pro', serif",
    bodySize: 17,
    bodyWeight: 400,
    labelFont: "'Syne', sans-serif",
    quoteSize: 26,
    quoteWeight: 700,
    quoteStyle: "normal",
    spacing: "-0.01em",
    googleUrl: "https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap",
    sample: "Aa",
    sampleFont: "'Syne', sans-serif",
  },
  lora: {
    name: "Văn Chương",
    vibe: "Warm literary. Old bookshop.",
    heading: "'Lora', serif",
    headingWeight: 400,
    headingStyle: "italic",
    headingSize: 46,
    body: "'Lora', serif",
    bodySize: 16.5,
    bodyWeight: 400,
    labelFont: "'Bricolage Grotesque', sans-serif",
    quoteSize: 27,
    quoteWeight: 400,
    quoteStyle: "italic",
    spacing: "0.01em",
    googleUrl: "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Bricolage+Grotesque:wght@400;500;600;700&display=swap",
    sample: "Aa",
    sampleFont: "'Lora', serif",
  },
  dm_serif: {
    name: "Tuyên Ngôn",
    vibe: "Bold statement. Confident.",
    heading: "'DM Serif Text', serif",
    headingWeight: 400,
    headingStyle: "normal",
    headingSize: 44,
    body: "'Hanken Grotesk', sans-serif",
    bodySize: 16,
    bodyWeight: 400,
    labelFont: "'Hanken Grotesk', sans-serif",
    quoteSize: 26,
    quoteWeight: 400,
    quoteStyle: "italic",
    spacing: "0.005em",
    googleUrl: "https://fonts.googleapis.com/css2?family=DM+Serif+Text:ital@0;1&family=Hanken+Grotesk:wght@300;400;500;600;700&display=swap",
    sample: "Aa",
    sampleFont: "'DM Serif Text', serif",
  },
  fraunces: {
    name: "Mềm Mại",
    vibe: "Soft power. Organic curves.",
    heading: "'Fraunces', serif",
    headingWeight: 400,
    headingStyle: "italic",
    headingSize: 46,
    body: "'Plus Jakarta Sans', sans-serif",
    bodySize: 16,
    bodyWeight: 400,
    labelFont: "'Plus Jakarta Sans', sans-serif",
    quoteSize: 28,
    quoteWeight: 400,
    quoteStyle: "italic",
    spacing: "0.01em",
    googleUrl: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,700;1,9..144,300;1,9..144,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap",
    sample: "Aa",
    sampleFont: "'Fraunces', serif",
  },
  instrument: {
    name: "Tinh Tế",
    vibe: "Quiet elegance. Razor thin.",
    heading: "'Instrument Serif', serif",
    headingWeight: 400,
    headingStyle: "italic",
    headingSize: 48,
    body: "'Karla', sans-serif",
    bodySize: 16,
    bodyWeight: 400,
    labelFont: "'Karla', sans-serif",
    quoteSize: 29,
    quoteWeight: 400,
    quoteStyle: "italic",
    spacing: "0.015em",
    googleUrl: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Karla:wght@300;400;500;600;700&display=swap",
    sample: "Aa",
    sampleFont: "'Instrument Serif', serif",
  },
  abril: {
    name: "Áp Phích",
    vibe: "Movie poster. Dramatic.",
    heading: "'Abril Fatface', serif",
    headingWeight: 400,
    headingStyle: "normal",
    headingSize: 42,
    body: "'Nunito Sans', sans-serif",
    bodySize: 16,
    bodyWeight: 400,
    labelFont: "'Nunito Sans', sans-serif",
    quoteSize: 26,
    quoteWeight: 400,
    quoteStyle: "normal",
    spacing: "0.005em",
    googleUrl: "https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Nunito+Sans:wght@300;400;500;600;700&display=swap",
    sample: "Aa",
    sampleFont: "'Abril Fatface', serif",
  },
  alegreya: {
    name: "Cổ Kính",
    vibe: "Old-world charm. Calligraphy.",
    heading: "'Alegreya', serif",
    headingWeight: 700,
    headingStyle: "italic",
    headingSize: 44,
    body: "'Source Sans 3', sans-serif",
    bodySize: 16.5,
    bodyWeight: 400,
    labelFont: "'Source Sans 3', sans-serif",
    quoteSize: 27,
    quoteWeight: 700,
    quoteStyle: "italic",
    spacing: "0.005em",
    googleUrl: "https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400;0,700;0,800;1,400;1,700&family=Source+Sans+3:wght@300;400;500;600;700&display=swap",
    sample: "Aa",
    sampleFont: "'Alegreya', serif",
  },
  playfair: {
    name: "Sang Trọng",
    vibe: "Classic editorial. Timeless.",
    heading: "'Playfair Display', serif",
    headingWeight: 900,
    headingStyle: "normal",
    headingSize: 44,
    body: "'Source Serif 4', serif",
    bodySize: 16.5,
    bodyWeight: 400,
    labelFont: "'DM Sans', sans-serif",
    quoteSize: 28,
    quoteWeight: 700,
    quoteStyle: "normal",
    spacing: "0.005em",
    googleUrl: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500;600;700&display=swap",
    sample: "Aa",
    sampleFont: "'Playfair Display', serif",
  },
};

const THEMES_META = {
  eye: { label: "Món Nước", icon: "◉" },
  hidden: { label: "Món Đường Phố", icon: "☽" },
  caution: { label: "Món Gia Đình", icon: "⚡" },
};

const POSTS = [
  {
    id: 1, theme: "eye",
    quote: "Phở bò Hà Nội",
    translation: "Northern beef noodle soup",
    teaser: "Một bát phở ngon bắt đầu từ nước dùng trong, thơm quế hồi, ngọt sâu từ xương bò và hành nướng.",
    body: `Phở bò Hà Nội là món ăn vừa giản dị vừa cầu kỳ. Sợi phở mềm, thịt bò thái mỏng, hành lá, rau thơm và nước dùng nóng tạo nên hương vị thanh mà đậm.\n\nĐiểm hay của phở nằm ở sự cân bằng. Nước dùng không cần quá béo, không cần quá nồng, nhưng phải có độ ngọt tự nhiên và mùi thơm ấm của gia vị rang.\n\nĂn phở ngon nhất là lúc bát còn bốc khói, thêm chút chanh, vài lát ớt, rồi thưởng thức chậm để cảm nhận vị Việt Nam rất tinh tế trong từng thìa nước.`,
    readTime: "4 phút",
  },
  {
    id: 2, theme: "hidden",
    quote: "Bánh mì Sài Gòn",
    translation: "Vietnamese baguette sandwich",
    teaser: "Ổ bánh giòn rụm, nhân đầy đặn, vị mặn ngọt chua cay hòa lại thành món ăn đường phố rất khó quên.",
    body: `Bánh mì Sài Gòn là hình ảnh quen thuộc của nhịp sống nhanh nhưng vẫn đầy hương vị. Vỏ bánh phải giòn, ruột nhẹ, đủ chắc để giữ pate, bơ, chả, thịt, đồ chua, dưa leo và rau thơm.\n\nCái ngon của bánh mì nằm ở nhiều lớp vị. Pate béo, thịt đậm, đồ chua làm sáng miệng, ớt cay nhẹ và rau thơm kéo mọi thứ lại với nhau.\n\nĐây là món ăn nhỏ gọn nhưng rất giàu tính cách: bình dân, linh hoạt, hào sảng, và luôn ngon nhất khi vừa được kẹp nóng trên tay.`,
    readTime: "5 phút",
  },
  {
    id: 3, theme: "caution",
    quote: "Cơm tấm sườn bì chả",
    translation: "Broken rice with grilled pork",
    teaser: "Món cơm bình dân miền Nam có đủ khói than, mỡ hành, nước mắm chua ngọt và miếng sườn nướng thơm lừng.",
    body: `Cơm tấm ngon phải có hạt cơm tơi, sườn nướng mềm, bì thơm, chả trứng béo và nước mắm pha vừa miệng. Khi chan lên, mọi thành phần hòa vào nhau rất tự nhiên.\n\nMiếng sườn là linh hồn của đĩa cơm. Thịt được ướp mặn ngọt, nướng trên than cho hơi xém cạnh, thơm mùi hành tỏi và nước mắm.\n\nCơm tấm không cầu kỳ theo kiểu sang trọng, nhưng lại có sức hấp dẫn rất đời thường: no bụng, đậm đà, dễ nhớ, và ăn hoài không chán.`,
    readTime: "4 phút",
  },
  {
    id: 4, theme: "eye",
    quote: "Bún bò Huế",
    translation: "Hue-style spicy beef noodle soup",
    teaser: "Tô bún miền Trung cay thơm, nước dùng đỏ nhẹ màu sa tế, nổi bật bởi sả, mắm ruốc và vị bò đậm đà.",
    body: `Bún bò Huế có cá tính mạnh hơn phở. Nước dùng thơm sả, có chiều sâu từ mắm ruốc, cay nhẹ từ sa tế và vị ngọt chắc của xương hầm.\n\nSợi bún to, thịt bò, giò heo, chả cua và rau sống làm tô bún đầy đặn. Khi ăn, thêm chanh và rau thơm sẽ làm vị cay béo trở nên sáng hơn.\n\nĐây là món ăn mang tinh thần miền Trung rõ rệt: đậm, thẳng, nhiều lớp hương, và để lại dư vị ấm lâu sau khi ăn xong.`,
    readTime: "5 phút",
  },
];

function GrainOverlay() {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      pointerEvents: "none", zIndex: 1, opacity: 0.3, mixBlendMode: "overlay",
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      backgroundSize: "150px 150px",
    }} />
  );
}

function FloatingOrbs({ p }) {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: "10%", right: "15%", width: 400, height: 400,
        borderRadius: "50%", background: p.glowColor, filter: "blur(100px)",
        animation: "float1 12s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", bottom: "20%", left: "10%", width: 300, height: 300,
        borderRadius: "50%", background: p.glowColor, filter: "blur(80px)",
        animation: "float2 15s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", top: "50%", left: "50%", width: 500, height: 500,
        borderRadius: "50%", background: p.glowColor, filter: "blur(120px)",
        animation: "float3 18s ease-in-out infinite",
      }} />
    </div>
  );
}

function InkWash({ p }) {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 0 }}>
      <svg width="100%" height="100%" style={{ position: "absolute", opacity: 0.4 }}>
        <defs>
          <radialGradient id="w1" cx="30%" cy="20%">
            <stop offset="0%" stopColor={p.accent} stopOpacity="0.04" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="w2" cx="70%" cy="80%">
            <stop offset="0%" stopColor={p.accent} stopOpacity="0.03" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#w1)" />
        <rect width="100%" height="100%" fill="url(#w2)" />
      </svg>
    </div>
  );
}

function PostCard({ post, p, f, isExpanded, onToggle }) {
  return (
    <article onClick={onToggle} style={{
      cursor: "pointer", position: "relative",
      background: isExpanded ? `linear-gradient(135deg, ${p.cardBg}, ${p.cardBg}F0)` : p.cardBg,
      borderRadius: 2, overflow: "hidden",
      border: `1px solid ${isExpanded ? p.accent + "40" : p.border}`,
      transition: "all 0.5s cubic-bezier(0.4,0,0.2,1)",
    }}>
      {isExpanded && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent, ${p.accent}, transparent)`,
        }} />
      )}
      <div style={{ padding: "32px 36px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <span style={{
            fontSize: 10, fontFamily: f.labelFont,
            letterSpacing: "0.2em", textTransform: "uppercase",
            color: p.accent, fontWeight: 600,
          }}>
            {THEMES_META[post.theme].icon}&ensp;{THEMES_META[post.theme].label}
          </span>
          <span style={{ fontSize: 11, color: p.muted, fontFamily: f.labelFont, letterSpacing: "0.05em" }}>
            {post.readTime}
          </span>
        </div>

        <h2 style={{
          fontFamily: f.heading, fontSize: f.quoteSize,
          fontWeight: f.quoteWeight, fontStyle: f.quoteStyle,
          color: p.text, lineHeight: 1.35, margin: 0, marginBottom: 10,
          letterSpacing: f.spacing,
          transition: "font-family 0.3s ease",
        }}>
          {post.quote}
        </h2>

        <p style={{
          fontFamily: f.labelFont, fontSize: 12,
          color: p.muted, fontStyle: "italic",
          margin: 0, marginBottom: 20, letterSpacing: "0.04em",
        }}>
          {post.translation}
        </p>

        <div style={{ width: 40, height: 1, background: p.accent + "50", marginBottom: 20 }} />

        <p style={{
          fontFamily: f.body, fontSize: f.bodySize,
          fontWeight: f.bodyWeight, lineHeight: 1.8,
          color: p.textSoft, margin: 0,
        }}>
          {post.teaser}
        </p>

        {isExpanded && (
          <div style={{ marginTop: 28, paddingTop: 28, borderTop: `1px solid ${p.border}` }}>
            {post.body.split("\n\n").map((para, i) => (
              <p key={i} style={{
                fontFamily: f.body, fontSize: f.bodySize,
                fontWeight: f.bodyWeight, lineHeight: 1.9,
                color: p.text, margin: 0, marginBottom: 20,
              }}>
                {para}
              </p>
            ))}
          </div>
        )}

        <div style={{
          display: "flex", alignItems: "center", gap: 10, marginTop: 24,
          color: p.accent, fontSize: 12,
          fontFamily: f.labelFont, fontWeight: 500,
          letterSpacing: "0.1em", textTransform: "uppercase",
        }}>
          <span>{isExpanded ? "Thu gọn" : "Đọc tiếp"}</span>
          <span style={{
            display: "inline-block", fontSize: 11,
            transition: "transform 0.4s ease",
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
          }}>▼</span>
        </div>
      </div>
    </article>
  );
}

function PaletteSwatch({ pKey, palette, isActive, onClick }) {
  return (
    <button onClick={onClick} style={{
      cursor: "pointer",
      border: isActive ? `2px solid ${palette.accent}` : "2px solid transparent",
      background: palette.pageBg, borderRadius: 6, padding: "10px 10px",
      display: "flex", flexDirection: "column", gap: 5,
      transition: "all 0.3s ease",
      opacity: isActive ? 1 : 0.5,
    }}>
      <div style={{ display: "flex", gap: 3 }}>
        {[palette.accent, palette.text, palette.textSoft, palette.cardBg].map((c, i) => (
          <div key={i} style={{
            width: 14, height: 14, borderRadius: "50%", background: c,
            border: i === 3 ? `1px solid ${palette.border}` : "none",
          }} />
        ))}
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: palette.text, textAlign: "left" }}>
        {palette.name}
      </div>
      <div style={{ fontSize: 9, color: palette.muted, textAlign: "left", lineHeight: 1.3 }}>
        {palette.desc}
      </div>
    </button>
  );
}

function FontSwatch({ fKey, font, accentColor, textColor, mutedColor, bgColor, borderColor, isActive, onClick }) {
  return (
    <button onClick={onClick} style={{
      cursor: "pointer",
      border: isActive ? `2px solid ${accentColor}` : `2px solid transparent`,
      background: bgColor, borderRadius: 6, padding: "10px 10px",
      display: "flex", flexDirection: "column", gap: 4,
      transition: "all 0.3s ease",
      opacity: isActive ? 1 : 0.5,
    }}>
      <div style={{
        fontFamily: font.sampleFont, fontSize: 28,
        fontWeight: font.headingWeight, fontStyle: font.headingStyle,
        color: textColor, lineHeight: 1,
      }}>
        {font.sample}
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color: textColor, textAlign: "left", fontFamily: font.labelFont }}>
        {font.name}
      </div>
      <div style={{ fontSize: 9, color: mutedColor, textAlign: "left", fontFamily: font.labelFont, letterSpacing: "0.03em" }}>
        {font.vibe}
      </div>
    </button>
  );
}

export default function Blog() {
  const [theme, setTheme] = useState("ink_gold");
  const [fontKey, setFontKey] = useState("bodoni");
  const [expandedId, setExpandedId] = useState(null);
  const p = PALETTES[theme];
  const f = FONTS[fontKey];

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(170deg, ${p.gradientA} 0%, ${p.gradientB} 50%, ${p.gradientC} 100%)`,
      position: "relative",
    }}>
      <style>{`
        @import url('${f.googleUrl}');
        @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,700;1,400&family=Outfit:wght@200;300;400;500;600&family=Syne:wght@400;500;600;700;800&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Bricolage+Grotesque:wght@400;500;600;700&family=DM+Serif+Text:ital@0;1&family=Hanken+Grotesk:wght@300;400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,700;1,9..144,300;1,9..144,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&family=Karla:wght@300;400;500;600;700&family=Abril+Fatface&family=Nunito+Sans:wght@300;400;500;600;700&family=Alegreya:ital,wght@0,400;0,700;0,800;1,400;1,700&family=Source+Sans+3:wght@300;400;500;600;700&family=Playfair+Display:wght@400;700;900&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes float1 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-30px, 20px); } }
        @keyframes float2 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(20px, -30px); } }
        @keyframes float3 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-15px, -20px); } }
      `}</style>

      <FloatingOrbs p={p} />
      <InkWash p={p} />
      <GrainOverlay />

      {/* Faint center line */}
      <div style={{
        position: "fixed", left: "50%", top: 0, bottom: 0, width: 1,
        background: `linear-gradient(to bottom, transparent, ${p.accent}12, transparent)`,
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* Selectors */}
      <div style={{ position: "relative", zIndex: 10, maxWidth: 720, margin: "0 auto", padding: "24px 24px 0" }}>
        {/* Color */}
        <div style={{
          fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase",
          color: p.muted, marginBottom: 8, fontFamily: f.labelFont, fontWeight: 600,
        }}>
          Màu sắc
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, paddingBottom: 16 }}>
          {Object.entries(PALETTES).map(([k, pal]) => (
            <PaletteSwatch key={k} pKey={k} palette={pal} isActive={theme === k} onClick={() => setTheme(k)} />
          ))}
        </div>

        {/* Font */}
        <div style={{
          fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase",
          color: p.muted, marginBottom: 8, fontFamily: f.labelFont, fontWeight: 600,
        }}>
          Phông chữ
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, paddingBottom: 8 }}>
          {Object.entries(FONTS).map(([k, ft]) => (
            <FontSwatch
              key={k} fKey={k} font={ft}
              accentColor={p.accent} textColor={p.text}
              mutedColor={p.muted} bgColor={p.cardBg} borderColor={p.border}
              isActive={fontKey === k} onClick={() => setFontKey(k)}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <header style={{
        position: "relative", zIndex: 10, maxWidth: 720, margin: "0 auto",
        padding: "48px 24px 8px", textAlign: "center",
      }}>
        <div style={{
          fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase",
          color: p.accent, marginBottom: 20, fontFamily: f.labelFont, fontWeight: 600,
        }}>
          &#9671;&ensp;Bộ sưu tập&ensp;&#9671;
        </div>
        <h1 style={{
          fontFamily: f.heading, fontSize: f.headingSize,
          fontWeight: f.headingWeight, fontStyle: f.headingStyle,
          color: p.text, lineHeight: 1.1, marginBottom: 16,
          letterSpacing: f.spacing,
          transition: "all 0.4s ease",
        }}>
          Món Ngon Việt Nam
        </h1>
        <div style={{
          width: 60, height: 1, margin: "0 auto 20px",
          background: `linear-gradient(90deg, transparent, ${p.accent}, transparent)`,
        }} />
        <p style={{
          fontFamily: f.body, fontSize: f.bodySize,
          fontWeight: f.bodyWeight, lineHeight: 1.7,
          color: p.textSoft, maxWidth: 480, margin: "0 auto", fontStyle: "italic",
        }}>
          Một vòng hương vị qua những món ăn quen thuộc trong ẩm thực Việt Nam.
          Mỗi món là một câu chuyện về vùng miền, nguyên liệu và cách người Việt ăn ngon mỗi ngày.
        </p>
      </header>

      {/* Posts */}
      <main style={{
        position: "relative", zIndex: 10, maxWidth: 720, margin: "0 auto",
        padding: "40px 24px 80px",
        display: "flex", flexDirection: "column", gap: 24,
      }}>
        {POSTS.map((post) => (
          <PostCard
            key={post.id} post={post} p={p} f={f}
            isExpanded={expandedId === post.id}
            onToggle={() => setExpandedId(expandedId === post.id ? null : post.id)}
          />
        ))}
      </main>

      {/* Footer */}
      <footer style={{
        position: "relative", zIndex: 10,
        textAlign: "center", padding: "32px 24px",
        borderTop: `1px solid ${p.border}`,
        maxWidth: 720, margin: "0 auto",
      }}>
        <p style={{
          fontFamily: f.body, fontSize: 13,
          color: p.muted, fontStyle: "italic", letterSpacing: "0.08em",
        }}>
          &copy; 2026 &ensp;&#9671;&ensp; Hương vị Việt Nam
        </p>
      </footer>
    </div>
  );
}

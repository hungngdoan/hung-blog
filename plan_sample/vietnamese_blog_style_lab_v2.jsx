import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

const posts = [
  {
    title: "Hai Mũi Tên",
    date: "12 tháng 5, 2026",
    type: "Chuyện mưu lược",
    seal: "Mưu",
    body:
      "Một chuyện nhỏ về thế yếu, đòn phủ đầu, và cách làm cho người mạnh hơn phải tự cân nhắc trước khi ra tay. Trong đời, không phải lúc nào mình cũng có nhiều lựa chọn. Có lúc chỉ cần một lựa chọn đủ sắc."
  },
  {
    title: "Lời Dặn Tuổi Ba Mươi",
    date: "10 tháng 5, 2026",
    type: "Tự rèn",
    seal: "Rèn",
    body:
      "Ngủ cho đàng hoàng. Tập cho đều. Đọc ít lại nếu đọc chỉ để né việc làm. Đừng mê những lời khuyên nghe hay mà không đổi nổi một ngày sống thật. Kỷ luật không cần màu mè."
  },
  {
    title: "Tin Vui Tháng Tư",
    date: "Tháng 4, 2026",
    type: "Đường học",
    seal: "Học",
    body:
      "Được nhận vào MSAI của UT Austin. Không phải bỏ nghề cũ để chạy theo AI. Đây là chuyện một kỹ sư hạ tầng học thêm trí tuệ máy để đi xa hơn trong mười năm tới."
  },
  {
    title: "Tạ Sắt Và Cơm Nhà",
    date: "24 tháng 2, 2026",
    type: "Thân thể",
    seal: "Lực",
    body:
      "Bench, squat, deadlift, cutting, fasting. Nghe rất Tây, nhưng gốc vẫn là chuyện rất đời: ăn, ngủ, tập, chịu khó. Thân không vững thì chí lớn cũng dễ thành lời nói suông."
  },
  {
    title: "Đêm Gõ Code",
    date: "20 tháng 2, 2026",
    type: "Nghề kỹ sư",
    seal: "Nghề",
    body:
      "Nửa đêm, đèn bàn còn sáng, nhạc chạy nhỏ, terminal mở im lìm. Có những lúc code giống như ngồi vá một tấm áo cũ: từng mũi nhỏ, lặng lẽ, nhưng sai một mũi là cả đường chỉ lệch."
  }
];

const styles = [
  {
    id: "hong_tram",
    name: "Hồng Trầm",
    subtitle: "Hồng bụi trên nền than. Như lụa cũ, mực đêm, và một căn phòng có đèn thấp.",
    pageBg: "#0C090B",
    cardBg: "#161214",
    cardSoft: "rgba(22,18,20,0.74)",
    accent: "#B07080",
    accentSoft: "rgba(176,112,128,0.1)",
    text: "#E8D8DD",
    textSoft: "#9A858C",
    muted: "#5C4A52",
    border: "#2E2226",
    gradientA: "#0C090B",
    gradientB: "#1A1218",
    gradientC: "#100C0E",
    glowColor: "rgba(176,112,128,0.05)",
    particleColor: "rgba(176,112,128,0.12)",
    motif: "lụa trầm · mực đêm · hương gỗ · chuyện khuya"
  },
  {
    id: "den_dau",
    name: "Đèn Dầu Phố Cũ",
    subtitle: "Tối, ấm, vàng cũ. Hợp với nhật ký đêm, nhạc, sách và chuyện đời.",
    pageBg: "#0D0906",
    cardBg: "#17100A",
    cardSoft: "rgba(23,16,10,0.72)",
    accent: "#D09A4E",
    accentSoft: "rgba(208,154,78,0.1)",
    text: "#F0DEC1",
    textSoft: "#A99575",
    muted: "#5D4A32",
    border: "#342617",
    gradientA: "#0D0906",
    gradientB: "#1E1309",
    gradientC: "#120D08",
    glowColor: "rgba(208,154,78,0.055)",
    particleColor: "rgba(208,154,78,0.12)",
    motif: "đèn dầu · gỗ cũ · phố khuya · tiếng xe xa"
  },
  {
    id: "muc_than",
    name: "Mực Than Giấy Đen",
    subtitle: "Rất tối, gọn, nặng chữ. Dành cho bài dài và suy nghĩ nghiêm túc.",
    pageBg: "#080808",
    cardBg: "#121212",
    cardSoft: "rgba(18,18,18,0.78)",
    accent: "#AFA084",
    accentSoft: "rgba(175,160,132,0.1)",
    text: "#E7DFD0",
    textSoft: "#9A907D",
    muted: "#555047",
    border: "#2A2722",
    gradientA: "#080808",
    gradientB: "#15120D",
    gradientC: "#0B0A09",
    glowColor: "rgba(175,160,132,0.045)",
    particleColor: "rgba(175,160,132,0.10)",
    motif: "mực than · giấy đen · dòng chậm · ý nặng"
  },
  {
    id: "sap_bao_dem",
    name: "Sạp Báo Đêm",
    subtitle: "Như tờ báo cũ đọc dưới đèn vàng: tiêu đề lớn, cột chữ chắc, không màu mè.",
    pageBg: "#0F0C09",
    cardBg: "#18130E",
    cardSoft: "rgba(24,19,14,0.74)",
    accent: "#BE6F5D",
    accentSoft: "rgba(190,111,93,0.1)",
    text: "#EAD8C2",
    textSoft: "#A48D76",
    muted: "#5A493A",
    border: "#33261C",
    gradientA: "#0F0C09",
    gradientB: "#1B120D",
    gradientC: "#100C09",
    glowColor: "rgba(190,111,93,0.05)",
    particleColor: "rgba(190,111,93,0.11)",
    motif: "tin khuya · cà phê đen · cột báo · ghi chép"
  },
  {
    id: "quan_coc_toi",
    name: "Quán Cóc Sau Mưa",
    subtitle: "Đen xanh, gần gũi, có mùi nền đất ướt và ly bạc xỉu cuối ngày.",
    pageBg: "#070D0A",
    cardBg: "#101915",
    cardSoft: "rgba(16,25,21,0.74)",
    accent: "#7AA083",
    accentSoft: "rgba(122,160,131,0.1)",
    text: "#DDE8DC",
    textSoft: "#8EA291",
    muted: "#485A4D",
    border: "#223329",
    gradientA: "#070D0A",
    gradientB: "#101B15",
    gradientC: "#080F0C",
    glowColor: "rgba(122,160,131,0.045)",
    particleColor: "rgba(122,160,131,0.11)",
    motif: "hẻm nhỏ · mưa đêm · bạc xỉu · chuyện dài"
  }
];

const navItems = ["Hiên Nhà", "Tôi Là Ai", "Đường Đi", "Câu Hay", "Ba Mươi Sáu Kế", "Sách", "Nhạc", "Game", "Lưu Bút"];
const quests = ["Bench 225lb", "Squat 315lb", "Deadlift 245lb", "UT Austin MSAI", "Toán cho ML", "Learn PyTorch"];

function Divider({ color }) {
  return (
    <div className="my-5 flex items-center gap-3 opacity-80">
      <div className="h-px flex-1" style={{ background: color }} />
      <div className="text-xs tracking-[0.28em]">• • •</div>
      <div className="h-px flex-1" style={{ background: color }} />
    </div>
  );
}

function WovenStat({ label, value, style }) {
  return (
    <div
      className="border p-3 shadow-[4px_4px_0_rgba(0,0,0,.24)]"
      style={{ background: style.accentSoft, borderColor: style.border }}
    >
      <div className="text-[11px] uppercase tracking-[0.18em]" style={{ color: style.textSoft }}>{label}</div>
      <div className="mt-1 text-lg font-bold" style={{ color: style.text }}>{value}</div>
    </div>
  );
}

export default function VietnameseBlogStyleLab() {
  const [styleId, setStyleId] = useState("hong_tram");
  const style = useMemo(() => styles.find((item) => item.id === styleId) || styles[0], [styleId]);

  const pagePattern = `
    radial-gradient(circle at 12% 8%, ${style.particleColor}, transparent 18%),
    radial-gradient(circle at 82% 18%, ${style.glowColor}, transparent 26%),
    radial-gradient(circle at 50% 92%, ${style.glowColor}, transparent 28%),
    repeating-linear-gradient(90deg, rgba(255,255,255,0.018) 0 1px, transparent 1px 34px),
    repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0 1px, transparent 1px 24px),
    linear-gradient(135deg, ${style.gradientA}, ${style.gradientB} 48%, ${style.gradientC})
  `;

  return (
    <main className="min-h-screen" style={{ color: style.text, backgroundColor: style.pageBg, backgroundImage: pagePattern }}>
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-7 lg:px-8">
        <div
          className="border-[3px] border-double p-2 shadow-[0_0_80px_rgba(0,0,0,.38)]"
          style={{ borderColor: style.border, background: "rgba(255,255,255,0.018)" }}
        >
          <div className="border p-4 sm:p-6 lg:p-8" style={{ borderColor: style.border }}>
            <header className="grid gap-6 lg:grid-cols-[1fr_260px] lg:items-start">
              <div>
                <div
                  className="inline-block border px-3 py-1 text-xs uppercase tracking-[0.26em] shadow-[3px_3px_0_rgba(0,0,0,.22)]"
                  style={{ borderColor: style.border, color: style.textSoft, background: style.cardSoft }}
                >
                  Nhật ký tiếng Việt của Hung
                </div>
                <h1 className="mt-5 max-w-4xl font-serif text-5xl font-black leading-[1.02] tracking-tight sm:text-7xl lg:text-8xl">
                  Chuyện ở hiên nhà của một người làm kỹ sư.
                </h1>
                <p className="mt-5 max-w-2xl font-serif text-lg leading-8" style={{ color: style.textSoft }}>
                  Code, AI, tạ sắt, sách cũ, nhạc khuya, vài câu chuyện mưu lược, và những dòng ghi lại để tự nhắc mình sống cho có gốc, có chí, có đường đi.
                </p>
              </div>

              <aside
                className="border p-4 shadow-[6px_6px_0_rgba(0,0,0,.26)]"
                style={{ background: style.cardSoft, borderColor: style.border }}
              >
                <div className="text-center font-serif text-2xl font-black">Hung</div>
                <div
                  className="mx-auto mt-2 grid h-20 w-20 place-items-center rounded-full border-4 border-double text-xl font-black tracking-tight"
                  style={{ borderColor: style.muted, background: style.accentSoft, color: style.accent }}
                >
                  H
                </div>
                <p className="mt-3 text-center text-sm leading-6" style={{ color: style.textSoft }}>
                  Kỹ sư dữ liệu. Học AI. Tập tạ. Ghi chép để khỏi sống lơ mơ.
                </p>
                <Divider color={style.accent} />
                <div className="grid grid-cols-2 gap-2">
                  <WovenStat label="Bài" value="42" style={style} />
                  <WovenStat label="Mood" value="Tỉnh" style={style} />
                  <WovenStat label="Bench" value="225" style={style} />
                  <WovenStat label="Quest" value="MSAI" style={style} />
                </div>
              </aside>
            </header>

            <nav
              className="mt-6 grid grid-cols-3 gap-2 border-y py-3 text-center text-sm font-semibold sm:grid-cols-9"
              style={{ borderColor: style.border }}
            >
              {navItems.map((item) => (
                <button
                  key={item}
                  className="border px-2 py-2 transition hover:translate-y-[-1px]"
                  style={{ borderColor: style.border, background: style.cardSoft, color: style.textSoft }}
                >
                  {item}
                </button>
              ))}
            </nav>

            <section className="mt-6 grid gap-5 lg:grid-cols-[310px_1fr]">
              <aside className="space-y-5">
                <section
                  className="border p-4 shadow-[6px_6px_0_rgba(0,0,0,.26)]"
                  style={{ background: style.cardSoft, borderColor: style.border }}
                >
                  <div className="font-serif text-xl font-black">Chọn chất tối</div>
                  <p className="mt-2 text-sm leading-6" style={{ color: style.textSoft }}>
                    Vẫn giữ chất Việt, nhưng bỏ nền sáng. Không khí bây giờ là phòng tối, lụa trầm, giấy đen và ánh đèn thấp.
                  </p>
                  <div className="mt-4 space-y-2">
                    {styles.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setStyleId(item.id)}
                        className={`w-full border px-3 py-3 text-left transition ${
                          item.id === style.id
                            ? "translate-x-1 shadow-[4px_4px_0_rgba(0,0,0,.35)]"
                            : "hover:translate-x-1"
                        }`}
                        style={{
                          borderColor: item.id === style.id ? style.accent : style.border,
                          background: item.id === style.id ? style.accentSoft : "rgba(255,255,255,0.02)",
                          color: item.id === style.id ? style.text : style.textSoft
                        }}
                      >
                        <div className="font-serif text-base font-black">{item.name}</div>
                        <div className="mt-1 text-xs leading-5 opacity-75">{item.subtitle}</div>
                      </button>
                    ))}
                  </div>
                </section>

                <section
                  className="border p-4 shadow-[6px_6px_0_rgba(0,0,0,.26)]"
                  style={{ background: style.cardSoft, borderColor: style.border }}
                >
                  <div className="font-serif text-xl font-black">Đang nghe</div>
                  <div className="mt-3 border-y py-3 text-2xl font-black" style={{ borderColor: style.border, color: style.accent }}>Mạnh Bà</div>
                  <p className="mt-2 text-sm" style={{ color: style.textSoft }}>Một bài để nhớ rằng có những thứ qua cầu là phải để lại.</p>
                </section>

                <section
                  className="border p-4 shadow-[6px_6px_0_rgba(0,0,0,.26)]"
                  style={{ background: style.cardSoft, borderColor: style.border }}
                >
                  <div className="font-serif text-xl font-black">Việc đang làm</div>
                  <div className="mt-3 space-y-2">
                    {quests.map((quest, index) => (
                      <div key={quest} className="flex items-center justify-between border-b pb-2 text-sm" style={{ borderColor: style.border }}>
                        <span style={{ color: style.textSoft }}>{quest}</span>
                        <span className="font-bold" style={{ color: index < 4 ? style.accent : style.muted }}>
                          {index < 4 ? "xong" : "mở"}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              </aside>

              <section>
                <motion.div
                  key={style.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="border p-5 shadow-[7px_7px_0_rgba(0,0,0,.30)] sm:p-6"
                  style={{ background: style.cardSoft, borderColor: style.border }}
                >
                  <div className="text-xs uppercase tracking-[0.3em]" style={{ color: style.textSoft }}>mẫu đang xem</div>
                  <h2 className="mt-2 font-serif text-4xl font-black sm:text-5xl" style={{ color: style.accent }}>{style.name}</h2>
                  <p className="mt-3 max-w-3xl font-serif text-lg leading-8" style={{ color: style.textSoft }}>{style.subtitle}</p>
                  <Divider color={style.accent} />
                  <div className="text-center text-xs uppercase tracking-[0.32em]" style={{ color: style.textSoft }}>{style.motif}</div>
                </motion.div>

                <div className="mt-5 space-y-4">
                  {posts.map((post, index) => (
                    <motion.article
                      key={post.title}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: index * 0.04 }}
                      className="grid gap-4 border p-4 shadow-[6px_6px_0_rgba(0,0,0,.26)] sm:grid-cols-[84px_1fr] sm:p-5"
                      style={{ background: style.cardSoft, borderColor: style.border }}
                    >
                      <div className="flex sm:block sm:text-center">
                        <div
                          className="grid h-16 w-16 shrink-0 place-items-center border-4 border-double font-serif text-sm font-black"
                          style={{ color: style.accent, borderColor: style.muted, background: style.accentSoft }}
                        >
                          {post.seal}
                        </div>
                        <div className="ml-3 sm:ml-0 sm:mt-3">
                          <div className="text-xs uppercase tracking-[0.2em]" style={{ color: style.textSoft }}>{post.type}</div>
                          <div className="mt-1 text-xs" style={{ color: style.muted }}>{post.date}</div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-serif text-2xl font-black sm:text-3xl">{post.title}</h3>
                        <p className="mt-3 max-w-3xl text-base leading-8" style={{ color: style.textSoft }}>{post.body}</p>
                        <button
                          className="mt-4 border px-4 py-2 text-sm font-bold shadow-[3px_3px_0_rgba(0,0,0,.25)] transition hover:translate-x-0.5"
                          style={{ borderColor: style.accent, color: style.accent, background: style.accentSoft }}
                        >
                          đọc tiếp →
                        </button>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </section>
            </section>

            <footer className="mt-7 border-t pt-5" style={{ borderColor: style.border }}>
              <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
                <div className="border p-4 shadow-[5px_5px_0_rgba(0,0,0,.26)]" style={{ background: style.cardSoft, borderColor: style.border }}>
                  <div className="font-serif text-xl font-black">Lưu bút</div>
                  <p className="mt-2 leading-7" style={{ color: style.textSoft }}>“Trang này giống một góc nhà hơn là một landing page. Vậy mới đúng.”</p>
                </div>
                <div className="border p-4 shadow-[5px_5px_0_rgba(0,0,0,.26)]" style={{ background: style.cardSoft, borderColor: style.border }}>
                  <div className="font-serif text-xl font-black">Ghi chú thiết kế</div>
                  <p className="mt-2 leading-7" style={{ color: style.textSoft }}>
                    Bỏ hết chữ Hán. Giữ chất Việt bằng chất liệu: lụa trầm, đèn thấp, giấy tối, báo cũ, hẻm sau mưa. Trang vẫn nói về code và AI, nhưng không cần mặc áo startup hiện đại.
                  </p>
                </div>
              </div>
              <div className="mt-5 text-center text-xs uppercase tracking-[0.35em]" style={{ color: style.textSoft }}>
                {style.motif}
              </div>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}

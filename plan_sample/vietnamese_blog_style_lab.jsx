import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

const posts = [
  {
    title: "Hai Mũi Tên",
    date: "12 tháng 5, 2026",
    type: "Chuyện mưu lược",
    seal: "計",
    body:
      "Một chuyện nhỏ về thế yếu, đòn phủ đầu, và cách làm cho người mạnh hơn phải tự cân nhắc trước khi ra tay. Trong đời, không phải lúc nào mình cũng có nhiều lựa chọn. Có lúc chỉ cần một lựa chọn đủ sắc."
  },
  {
    title: "Lời Dặn Tuổi Ba Mươi",
    date: "10 tháng 5, 2026",
    type: "Tự rèn",
    seal: "忍",
    body:
      "Ngủ cho đàng hoàng. Tập cho đều. Đọc ít lại nếu đọc chỉ để né việc làm. Đừng mê những lời khuyên nghe hay mà không đổi nổi một ngày sống thật. Kỷ luật không cần màu mè."
  },
  {
    title: "Tin Vui Tháng Tư",
    date: "Tháng 4, 2026",
    type: "Đường học",
    seal: "學",
    body:
      "Được nhận vào MSAI của UT Austin. Không phải bỏ nghề cũ để chạy theo AI. Đây là chuyện một kỹ sư hạ tầng học thêm trí tuệ máy để đi xa hơn trong mười năm tới."
  },
  {
    title: "Tạ Sắt Và Cơm Nhà",
    date: "24 tháng 2, 2026",
    type: "Thân thể",
    seal: "力",
    body:
      "Bench, squat, deadlift, cutting, fasting. Nghe rất Tây, nhưng gốc vẫn là chuyện rất đời: ăn, ngủ, tập, chịu khó. Thân không vững thì chí lớn cũng dễ thành lời nói suông."
  },
  {
    title: "Đêm Gõ Code",
    date: "20 tháng 2, 2026",
    type: "Nghề kỹ sư",
    seal: "工",
    body:
      "Nửa đêm, đèn bàn còn sáng, nhạc chạy nhỏ, terminal mở im lìm. Có những lúc code giống như ngồi vá một tấm áo cũ: từng mũi nhỏ, lặng lẽ, nhưng sai một mũi là cả đường chỉ lệch."
  }
];

const styles = [
  {
    id: "giaydo",
    name: "Giấy Dó Mực Nâu",
    subtitle: "Như một cuốn sổ tay đặt trên bàn gỗ, có vết trà, có chữ mực, có khoảng thở.",
    bg: "bg-[#efe1c3] text-[#2a1b10]",
    panel: "bg-[#f8edcf]/90 border-[#6b3f21]/30",
    panelSoft: "bg-[#fff6dc]/65 border-[#6b3f21]/20",
    accent: "#7b2d16",
    dark: "#2a1b10",
    pattern: "repeating-linear-gradient(0deg, rgba(42,27,16,.035) 0 1px, transparent 1px 26px), radial-gradient(circle at 12% 10%, rgba(123,45,22,.15), transparent 28%), radial-gradient(circle at 85% 20%, rgba(120,72,28,.12), transparent 25%)",
    motif: "✦  giấy dó  ✦  mực nâu  ✦  hiên nhà  ✦"
  },
  {
    id: "hoian",
    name: "Hội An Đèn Lồng",
    subtitle: "Ấm, vàng, cũ, hơi thơ. Hợp với nhật ký đêm, nhạc, sách, chuyện đời.",
    bg: "bg-[#28140d] text-[#ffe7b3]",
    panel: "bg-[#3a1d12]/88 border-[#f4b860]/35",
    panelSoft: "bg-[#512315]/55 border-[#f4b860]/25",
    accent: "#f4b860",
    dark: "#160905",
    pattern: "radial-gradient(circle at 18% 12%, rgba(244,184,96,.24), transparent 16%), radial-gradient(circle at 78% 8%, rgba(209,75,51,.18), transparent 18%), linear-gradient(90deg, rgba(244,184,96,.06) 1px, transparent 1px)",
    motif: "◆  phố cổ  ◆  đèn lồng  ◆  sông Hoài  ◆"
  },
  {
    id: "dongho",
    name: "Tranh Đông Hồ",
    subtitle: "Mộc mạc, dân gian, hơi nghịch. Dùng màu phẳng, viền mạnh, bố cục như tranh in tay.",
    bg: "bg-[#f3d68a] text-[#331d10]",
    panel: "bg-[#f7e2a2]/95 border-[#331d10]/55",
    panelSoft: "bg-[#fff0bd]/70 border-[#331d10]/35",
    accent: "#b21f13",
    dark: "#331d10",
    pattern: "repeating-linear-gradient(45deg, rgba(51,29,16,.045) 0 2px, transparent 2px 12px), radial-gradient(circle at 90% 15%, rgba(178,31,19,.18), transparent 22%)",
    motif: "◈  dân gian  ◈  mộc bản  ◈  nét đậm  ◈"
  },
  {
    id: "sapbao",
    name: "Sạp Báo Sài Gòn Cũ",
    subtitle: "Như tờ báo giấy cũ, có tiêu đề lớn, cột chữ hẹp, mùi cà phê đen và tiếng xe ngoài hẻm.",
    bg: "bg-[#ded2b2] text-[#201811]",
    panel: "bg-[#eee2bf]/92 border-[#201811]/35",
    panelSoft: "bg-[#f7eccf]/70 border-[#201811]/25",
    accent: "#8a1f16",
    dark: "#201811",
    pattern: "repeating-linear-gradient(90deg, rgba(32,24,17,.04) 0 1px, transparent 1px 38px), repeating-linear-gradient(0deg, rgba(32,24,17,.025) 0 1px, transparent 1px 18px)",
    motif: "TIN SÁNG · CHUYỆN NGHỀ · ĐỜI SỐNG · GHI CHÉP"
  },
  {
    id: "quancoc",
    name: "Quán Cóc Đầu Hẻm",
    subtitle: "Gần gũi, ít diễn. Một chỗ ngồi xuống, uống ly bạc xỉu, kể chuyện code và chuyện đời.",
    bg: "bg-[#d9c28f] text-[#24180e]",
    panel: "bg-[#ead6a2]/90 border-[#5d3b1f]/35",
    panelSoft: "bg-[#f5e4b2]/70 border-[#5d3b1f]/25",
    accent: "#2f6b3f",
    dark: "#24180e",
    pattern: "radial-gradient(circle at 20% 20%, rgba(47,107,63,.16), transparent 24%), repeating-linear-gradient(90deg, rgba(93,59,31,.05) 0 3px, transparent 3px 18px)",
    motif: "☕  bàn nhựa  •  hẻm nhỏ  •  chuyện dài  ☕"
  }
];

const navItems = ["Hiên Nhà", "Tôi Là Ai", "Đường Đi", "Câu Hay", "36 Kế", "Sách", "Nhạc", "Game", "Lưu Bút"];
const quests = ["Bench 225lb", "Squat 315lb", "Deadlift 245lb", "UT Austin MSAI", "Toán cho ML", "Learn PyTorch"];

function BambooDivider({ color }) {
  return (
    <div className="my-5 flex items-center gap-3 opacity-80">
      <div className="h-px flex-1" style={{ background: color }} />
      <div className="text-xs tracking-[0.35em]">◇ ◇ ◇</div>
      <div className="h-px flex-1" style={{ background: color }} />
    </div>
  );
}

function WovenStat({ label, value }) {
  return (
    <div className="border border-current/25 bg-black/[0.025] p-3 shadow-[4px_4px_0_rgba(0,0,0,.08)]">
      <div className="text-[11px] uppercase tracking-[0.18em] opacity-60">{label}</div>
      <div className="mt-1 text-lg font-bold">{value}</div>
    </div>
  );
}

export default function VietnameseBlogStyleLab() {
  const [styleId, setStyleId] = useState("giaydo");
  const style = useMemo(() => styles.find((item) => item.id === styleId) || styles[0], [styleId]);

  return (
    <main className={`min-h-screen ${style.bg}`} style={{ backgroundImage: style.pattern }}>
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-7 lg:px-8">
        <div className="border-[3px] border-double border-current/35 bg-current/[0.025] p-2">
          <div className="border border-current/20 p-4 sm:p-6 lg:p-8">
            <header className="grid gap-6 lg:grid-cols-[1fr_260px] lg:items-start">
              <div>
                <div className="inline-block border border-current/30 px-3 py-1 text-xs uppercase tracking-[0.26em] shadow-[3px_3px_0_rgba(0,0,0,.08)]">
                  Nhật ký tiếng Việt của Hung
                </div>
                <h1 className="mt-5 max-w-4xl font-serif text-5xl font-black leading-[1.02] tracking-tight sm:text-7xl lg:text-8xl">
                  Chuyện ở hiên nhà của một người làm kỹ sư.
                </h1>
                <p className="mt-5 max-w-2xl font-serif text-lg leading-8 opacity-85">
                  Code, AI, tạ sắt, sách cũ, nhạc khuya, vài câu chuyện mưu lược, và những dòng ghi lại để tự nhắc mình sống cho có gốc, có chí, có đường đi.
                </p>
              </div>

              <aside className={`border p-4 shadow-[6px_6px_0_rgba(0,0,0,.10)] ${style.panel}`}>
                <div className="text-center font-serif text-2xl font-black">Hung</div>
                <div className="mx-auto mt-2 h-20 w-20 rounded-full border-4 border-double border-current/40 bg-black/[0.04] text-center text-5xl leading-[4.6rem]">
                  安
                </div>
                <p className="mt-3 text-center text-sm leading-6 opacity-75">
                  Kỹ sư dữ liệu. Học AI. Tập tạ. Ghi chép để khỏi sống lơ mơ.
                </p>
                <BambooDivider color={style.accent} />
                <div className="grid grid-cols-2 gap-2">
                  <WovenStat label="Bài" value="42" />
                  <WovenStat label="Mood" value="Tỉnh" />
                  <WovenStat label="Bench" value="225" />
                  <WovenStat label="Quest" value="MSAI" />
                </div>
              </aside>
            </header>

            <nav className="mt-6 grid grid-cols-3 gap-2 border-y border-current/25 py-3 text-center text-sm font-semibold sm:grid-cols-9">
              {navItems.map((item) => (
                <button key={item} className="border border-current/20 bg-black/[0.02] px-2 py-2 hover:bg-black/[0.06]">
                  {item}
                </button>
              ))}
            </nav>

            <section className="mt-6 grid gap-5 lg:grid-cols-[310px_1fr]">
              <aside className="space-y-5">
                <section className={`border p-4 shadow-[6px_6px_0_rgba(0,0,0,.10)] ${style.panel}`}>
                  <div className="font-serif text-xl font-black">Chọn chất Việt</div>
                  <p className="mt-2 text-sm leading-6 opacity-75">
                    Không phải đổi mỗi màu. Mỗi bản dưới đây đổi cả không khí, nhịp đọc, và cảm giác của trang.
                  </p>
                  <div className="mt-4 space-y-2">
                    {styles.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setStyleId(item.id)}
                        className={`w-full border px-3 py-3 text-left transition ${
                          item.id === style.id
                            ? "translate-x-1 shadow-[4px_4px_0_rgba(0,0,0,.16)]"
                            : "bg-black/[0.02] hover:translate-x-1"
                        }`}
                        style={{
                          borderColor: item.id === style.id ? style.accent : "rgba(0,0,0,.18)",
                          background: item.id === style.id ? `${style.accent}22` : undefined
                        }}
                      >
                        <div className="font-serif text-base font-black">{item.name}</div>
                        <div className="mt-1 text-xs leading-5 opacity-70">{item.subtitle}</div>
                      </button>
                    ))}
                  </div>
                </section>

                <section className={`border p-4 shadow-[6px_6px_0_rgba(0,0,0,.10)] ${style.panelSoft}`}>
                  <div className="font-serif text-xl font-black">Đang nghe</div>
                  <div className="mt-3 border-y border-current/20 py-3 text-2xl font-black">Mạnh Bà</div>
                  <p className="mt-2 text-sm opacity-70">Một bài để nhớ rằng có những thứ qua cầu là phải để lại.</p>
                </section>

                <section className={`border p-4 shadow-[6px_6px_0_rgba(0,0,0,.10)] ${style.panelSoft}`}>
                  <div className="font-serif text-xl font-black">Việc đang làm</div>
                  <div className="mt-3 space-y-2">
                    {quests.map((quest, index) => (
                      <div key={quest} className="flex items-center justify-between border-b border-current/15 pb-2 text-sm">
                        <span>{quest}</span>
                        <span className="font-bold" style={{ color: index < 4 ? style.accent : undefined }}>
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
                  className={`border p-5 shadow-[7px_7px_0_rgba(0,0,0,.12)] sm:p-6 ${style.panel}`}
                >
                  <div className="text-xs uppercase tracking-[0.3em] opacity-60">mẫu đang xem</div>
                  <h2 className="mt-2 font-serif text-4xl font-black sm:text-5xl">{style.name}</h2>
                  <p className="mt-3 max-w-3xl font-serif text-lg leading-8 opacity-80">{style.subtitle}</p>
                  <BambooDivider color={style.accent} />
                  <div className="text-center text-xs uppercase tracking-[0.32em] opacity-70">{style.motif}</div>
                </motion.div>

                <div className="mt-5 space-y-4">
                  {posts.map((post, index) => (
                    <motion.article
                      key={post.title}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: index * 0.04 }}
                      className={`grid gap-4 border p-4 shadow-[6px_6px_0_rgba(0,0,0,.10)] sm:grid-cols-[84px_1fr] sm:p-5 ${style.panelSoft}`}
                    >
                      <div className="flex sm:block sm:text-center">
                        <div
                          className="grid h-16 w-16 shrink-0 place-items-center border-4 border-double border-current/35 font-serif text-3xl font-black"
                          style={{ color: style.accent }}
                        >
                          {post.seal}
                        </div>
                        <div className="ml-3 sm:ml-0 sm:mt-3">
                          <div className="text-xs uppercase tracking-[0.2em] opacity-60">{post.type}</div>
                          <div className="mt-1 text-xs opacity-65">{post.date}</div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-serif text-2xl font-black sm:text-3xl">{post.title}</h3>
                        <p className="mt-3 max-w-3xl text-base leading-8 opacity-82">{post.body}</p>
                        <button
                          className="mt-4 border px-4 py-2 text-sm font-bold shadow-[3px_3px_0_rgba(0,0,0,.10)] hover:translate-x-0.5"
                          style={{ borderColor: style.accent, color: style.accent }}
                        >
                          đọc tiếp →
                        </button>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </section>
            </section>

            <footer className="mt-7 border-t border-current/25 pt-5">
              <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
                <div className={`border p-4 shadow-[5px_5px_0_rgba(0,0,0,.10)] ${style.panelSoft}`}>
                  <div className="font-serif text-xl font-black">Lưu bút</div>
                  <p className="mt-2 leading-7 opacity-75">“Trang này giống một góc nhà hơn là một landing page. Vậy mới đúng.”</p>
                </div>
                <div className={`border p-4 shadow-[5px_5px_0_rgba(0,0,0,.10)] ${style.panelSoft}`}>
                  <div className="font-serif text-xl font-black">Ghi chú thiết kế</div>
                  <p className="mt-2 leading-7 opacity-75">
                    Bỏ bớt chất startup. Giữ lại chất người Việt: giấy, gỗ, quán, báo cũ, đèn lồng, tranh dân gian. Trang vẫn nói về code và AI, nhưng giọng kể không cần giả Tây.
                  </p>
                </div>
              </div>
              <div className="mt-5 text-center text-xs uppercase tracking-[0.35em] opacity-60">
                {style.motif}
              </div>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}

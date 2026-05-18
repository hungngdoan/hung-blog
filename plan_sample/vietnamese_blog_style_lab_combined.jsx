import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

const posts = [
  {
    title: "Hai Mũi Tên",
    date: "12 tháng 5, 2026",
    type: "Chuyện mưu lược",
    seal: "Mưu",
    body: "Một chuyện nhỏ về thế yếu, đòn phủ đầu, và cách làm cho người mạnh hơn phải tự cân nhắc trước khi ra tay. Trong đời, không phải lúc nào mình cũng có nhiều lựa chọn. Có lúc chỉ cần một lựa chọn đủ sắc."
  },
  {
    title: "Lời Dặn Tuổi Ba Mươi",
    date: "10 tháng 5, 2026",
    type: "Tự rèn",
    seal: "Rèn",
    body: "Ngủ cho đàng hoàng. Tập cho đều. Đọc ít lại nếu đọc chỉ để né việc làm. Đừng mê những lời khuyên nghe hay mà không đổi nổi một ngày sống thật. Kỷ luật không cần màu mè."
  },
  {
    title: "Tin Vui Tháng Tư",
    date: "Tháng 4, 2026",
    type: "Đường học",
    seal: "Học",
    body: "Được nhận vào MSAI của UT Austin. Không phải bỏ nghề cũ để chạy theo AI. Đây là chuyện một kỹ sư hạ tầng học thêm trí tuệ máy để đi xa hơn trong mười năm tới."
  },
  {
    title: "Tạ Sắt Và Cơm Nhà",
    date: "24 tháng 2, 2026",
    type: "Thân thể",
    seal: "Lực",
    body: "Bench, squat, deadlift, cutting, fasting. Nghe rất Tây, nhưng gốc vẫn là chuyện rất đời: ăn, ngủ, tập, chịu khó. Thân không vững thì chí lớn cũng dễ thành lời nói suông."
  },
  {
    title: "Đêm Gõ Code",
    date: "20 tháng 2, 2026",
    type: "Nghề kỹ sư",
    seal: "Nghề",
    body: "Nửa đêm, đèn bàn còn sáng, nhạc chạy nhỏ, terminal mở im lìm. Có những lúc code giống như ngồi vá một tấm áo cũ: từng mũi nhỏ, lặng lẽ, nhưng sai một mũi là cả đường chỉ lệch."
  }
];

const styles = [
  {
    id: "giaydo",
    name: "Giấy Dó Mực Nâu",
    subtitle: "Như một cuốn sổ tay đặt trên bàn gỗ, có vết trà, có chữ mực, có khoảng thở.",
    pageBg: "#efe1c3",
    text: "#2a1b10",
    textSoft: "rgba(42,27,16,0.75)",
    textMuted: "rgba(42,27,16,0.60)",
    accent: "#7b2d16",
    accentSoft: "rgba(123,45,22,0.133)",
    borderOuter: "rgba(42,27,16,0.35)",
    borderInner: "rgba(42,27,16,0.20)",
    borderSection: "rgba(42,27,16,0.25)",
    contentBorder: "rgba(42,27,16,0.15)",
    questColor: "#2a1b10",
    questMuted: "#2a1b10",
    frameBg: "rgba(42,27,16,0.025)",
    frameShadow: "none",
    panelBg: "rgba(248,237,207,0.90)",
    panelBorder: "rgba(107,63,33,0.30)",
    panelShadow: "6px 6px 0 rgba(0,0,0,.10)",
    panelSoftBg: "rgba(255,246,220,0.65)",
    panelSoftBorder: "rgba(107,63,33,0.20)",
    panelSoftShadow: "6px 6px 0 rgba(0,0,0,.10)",
    previewShadow: "7px 7px 0 rgba(0,0,0,.12)",
    footerShadow: "5px 5px 0 rgba(0,0,0,.10)",
    navBg: "rgba(0,0,0,0.02)",
    navBorder: "rgba(42,27,16,0.20)",
    chooserBg: "rgba(0,0,0,0.02)",
    chooserBorder: "rgba(0,0,0,0.18)",
    chooserShadow: "4px 4px 0 rgba(0,0,0,.16)",
    chooserTextInactive: "#2a1b10",
    musicHighlight: "#2a1b10",
    statBg: "rgba(0,0,0,0.025)",
    statBorder: "rgba(42,27,16,0.25)",
    statShadow: "4px 4px 0 rgba(0,0,0,.08)",
    btnBg: "transparent",
    btnShadow: "3px 3px 0 rgba(0,0,0,.10)",
    tagBg: "transparent",
    tagBorder: "rgba(42,27,16,0.30)",
    tagShadow: "3px 3px 0 rgba(0,0,0,.08)",
    sealBg: "transparent",
    sealBorder: "rgba(42,27,16,0.35)",
    avatarBorder: "rgba(42,27,16,0.40)",
    avatarBg: "rgba(0,0,0,0.04)",
    dividerSymbol: "◇ ◇ ◇",
    dividerTracking: "0.35em",
    pattern: "repeating-linear-gradient(0deg, rgba(42,27,16,.035) 0 1px, transparent 1px 26px), radial-gradient(circle at 12% 10%, rgba(123,45,22,.15), transparent 28%), radial-gradient(circle at 85% 20%, rgba(120,72,28,.12), transparent 25%)",
    motif: "✦  giấy dó  ✦  mực nâu  ✦  hiên nhà  ✦"
  },
  {
    id: "hoian",
    name: "Hội An Đèn Lồng",
    subtitle: "Ấm, vàng, cũ, hơi thơ. Hợp với nhật ký đêm, nhạc, sách, chuyện đời.",
    pageBg: "#28140d",
    text: "#ffe7b3",
    textSoft: "rgba(255,231,179,0.75)",
    textMuted: "rgba(255,231,179,0.60)",
    accent: "#f4b860",
    accentSoft: "rgba(244,184,96,0.133)",
    borderOuter: "rgba(255,231,179,0.35)",
    borderInner: "rgba(255,231,179,0.20)",
    borderSection: "rgba(255,231,179,0.25)",
    contentBorder: "rgba(255,231,179,0.15)",
    questColor: "#ffe7b3",
    questMuted: "#ffe7b3",
    frameBg: "rgba(255,231,179,0.025)",
    frameShadow: "none",
    panelBg: "rgba(58,29,18,0.88)",
    panelBorder: "rgba(244,184,96,0.35)",
    panelShadow: "6px 6px 0 rgba(0,0,0,.10)",
    panelSoftBg: "rgba(81,35,21,0.55)",
    panelSoftBorder: "rgba(244,184,96,0.25)",
    panelSoftShadow: "6px 6px 0 rgba(0,0,0,.10)",
    previewShadow: "7px 7px 0 rgba(0,0,0,.12)",
    footerShadow: "5px 5px 0 rgba(0,0,0,.10)",
    navBg: "rgba(0,0,0,0.02)",
    navBorder: "rgba(255,231,179,0.20)",
    chooserBg: "rgba(0,0,0,0.02)",
    chooserBorder: "rgba(0,0,0,0.18)",
    chooserShadow: "4px 4px 0 rgba(0,0,0,.16)",
    chooserTextInactive: "#ffe7b3",
    musicHighlight: "#ffe7b3",
    statBg: "rgba(0,0,0,0.025)",
    statBorder: "rgba(255,231,179,0.25)",
    statShadow: "4px 4px 0 rgba(0,0,0,.08)",
    btnBg: "transparent",
    btnShadow: "3px 3px 0 rgba(0,0,0,.10)",
    tagBg: "transparent",
    tagBorder: "rgba(255,231,179,0.30)",
    tagShadow: "3px 3px 0 rgba(0,0,0,.08)",
    sealBg: "transparent",
    sealBorder: "rgba(255,231,179,0.35)",
    avatarBorder: "rgba(255,231,179,0.40)",
    avatarBg: "rgba(0,0,0,0.04)",
    dividerSymbol: "◇ ◇ ◇",
    dividerTracking: "0.35em",
    pattern: "radial-gradient(circle at 18% 12%, rgba(244,184,96,.24), transparent 16%), radial-gradient(circle at 78% 8%, rgba(209,75,51,.18), transparent 18%), linear-gradient(90deg, rgba(244,184,96,.06) 1px, transparent 1px)",
    motif: "◆  phố cổ  ◆  đèn lồng  ◆  sông Hoài  ◆"
  },
  {
    id: "dongho",
    name: "Tranh Đông Hồ",
    subtitle: "Mộc mạc, dân gian, hơi nghịch. Dùng màu phẳng, viền mạnh, bố cục như tranh in tay.",
    pageBg: "#f3d68a",
    text: "#331d10",
    textSoft: "rgba(51,29,16,0.70)",
    textMuted: "rgba(51,29,16,0.60)",
    accent: "#b21f13",
    accentSoft: "rgba(178,31,19,0.133)",
    borderOuter: "rgba(51,29,16,0.35)",
    borderInner: "rgba(51,29,16,0.20)",
    borderSection: "rgba(51,29,16,0.25)",
    contentBorder: "rgba(51,29,16,0.15)",
    questColor: "#331d10",
    questMuted: "#331d10",
    frameBg: "rgba(51,29,16,0.025)",
    frameShadow: "none",
    panelBg: "rgba(247,226,162,0.95)",
    panelBorder: "rgba(51,29,16,0.55)",
    panelShadow: "6px 6px 0 rgba(0,0,0,.10)",
    panelSoftBg: "rgba(255,240,189,0.70)",
    panelSoftBorder: "rgba(51,29,16,0.35)",
    panelSoftShadow: "6px 6px 0 rgba(0,0,0,.10)",
    previewShadow: "7px 7px 0 rgba(0,0,0,.12)",
    footerShadow: "5px 5px 0 rgba(0,0,0,.10)",
    navBg: "rgba(0,0,0,0.02)",
    navBorder: "rgba(51,29,16,0.20)",
    chooserBg: "rgba(0,0,0,0.02)",
    chooserBorder: "rgba(0,0,0,0.18)",
    chooserShadow: "4px 4px 0 rgba(0,0,0,.16)",
    chooserTextInactive: "#331d10",
    musicHighlight: "#331d10",
    statBg: "rgba(0,0,0,0.025)",
    statBorder: "rgba(51,29,16,0.25)",
    statShadow: "4px 4px 0 rgba(0,0,0,.08)",
    btnBg: "transparent",
    btnShadow: "3px 3px 0 rgba(0,0,0,.10)",
    tagBg: "transparent",
    tagBorder: "rgba(51,29,16,0.30)",
    tagShadow: "3px 3px 0 rgba(0,0,0,.08)",
    sealBg: "transparent",
    sealBorder: "rgba(51,29,16,0.35)",
    avatarBorder: "rgba(51,29,16,0.40)",
    avatarBg: "rgba(0,0,0,0.04)",
    dividerSymbol: "◇ ◇ ◇",
    dividerTracking: "0.35em",
    pattern: "repeating-linear-gradient(45deg, rgba(51,29,16,.045) 0 2px, transparent 2px 12px), radial-gradient(circle at 90% 15%, rgba(178,31,19,.18), transparent 22%)",
    motif: "◈  dân gian  ◈  mộc bản  ◈  nét đậm  ◈"
  },
  {
    id: "sapbao_sang",
    name: "Sạp Báo Sài Gòn Cũ",
    subtitle: "Như tờ báo giấy cũ, có tiêu đề lớn, cột chữ hẹp, mùi cà phê đen và tiếng xe ngoài hẻm.",
    pageBg: "#ded2b2",
    text: "#201811",
    textSoft: "rgba(32,24,17,0.75)",
    textMuted: "rgba(32,24,17,0.60)",
    accent: "#8a1f16",
    accentSoft: "rgba(138,31,22,0.133)",
    borderOuter: "rgba(32,24,17,0.35)",
    borderInner: "rgba(32,24,17,0.20)",
    borderSection: "rgba(32,24,17,0.25)",
    contentBorder: "rgba(32,24,17,0.15)",
    questColor: "#201811",
    questMuted: "#201811",
    frameBg: "rgba(32,24,17,0.025)",
    frameShadow: "none",
    panelBg: "rgba(238,226,191,0.92)",
    panelBorder: "rgba(32,24,17,0.35)",
    panelShadow: "6px 6px 0 rgba(0,0,0,.10)",
    panelSoftBg: "rgba(247,236,207,0.70)",
    panelSoftBorder: "rgba(32,24,17,0.25)",
    panelSoftShadow: "6px 6px 0 rgba(0,0,0,.10)",
    previewShadow: "7px 7px 0 rgba(0,0,0,.12)",
    footerShadow: "5px 5px 0 rgba(0,0,0,.10)",
    navBg: "rgba(0,0,0,0.02)",
    navBorder: "rgba(32,24,17,0.20)",
    chooserBg: "rgba(0,0,0,0.02)",
    chooserBorder: "rgba(0,0,0,0.18)",
    chooserShadow: "4px 4px 0 rgba(0,0,0,.16)",
    chooserTextInactive: "#201811",
    musicHighlight: "#201811",
    statBg: "rgba(0,0,0,0.025)",
    statBorder: "rgba(32,24,17,0.25)",
    statShadow: "4px 4px 0 rgba(0,0,0,.08)",
    btnBg: "transparent",
    btnShadow: "3px 3px 0 rgba(0,0,0,.10)",
    tagBg: "transparent",
    tagBorder: "rgba(32,24,17,0.30)",
    tagShadow: "3px 3px 0 rgba(0,0,0,.08)",
    sealBg: "transparent",
    sealBorder: "rgba(32,24,17,0.35)",
    avatarBorder: "rgba(32,24,17,0.40)",
    avatarBg: "rgba(0,0,0,0.04)",
    dividerSymbol: "◇ ◇ ◇",
    dividerTracking: "0.35em",
    pattern: "repeating-linear-gradient(90deg, rgba(32,24,17,.04) 0 1px, transparent 1px 38px), repeating-linear-gradient(0deg, rgba(32,24,17,.025) 0 1px, transparent 1px 18px)",
    motif: "TIN SÁNG · CHUYỆN NGHỀ · ĐỜI SỐNG · GHI CHÉP"
  },
  {
    id: "quancoc_sang",
    name: "Quán Cóc Đầu Hẻm",
    subtitle: "Gần gũi, ít diễn. Một chỗ ngồi xuống, uống ly bạc xỉu, kể chuyện code và chuyện đời.",
    pageBg: "#d9c28f",
    text: "#24180e",
    textSoft: "rgba(36,24,14,0.72)",
    textMuted: "rgba(36,24,14,0.60)",
    accent: "#2f6b3f",
    accentSoft: "rgba(47,107,63,0.133)",
    borderOuter: "rgba(36,24,14,0.35)",
    borderInner: "rgba(36,24,14,0.20)",
    borderSection: "rgba(36,24,14,0.25)",
    contentBorder: "rgba(36,24,14,0.15)",
    questColor: "#24180e",
    questMuted: "#24180e",
    frameBg: "rgba(36,24,14,0.025)",
    frameShadow: "none",
    panelBg: "rgba(234,214,162,0.90)",
    panelBorder: "rgba(93,59,31,0.35)",
    panelShadow: "6px 6px 0 rgba(0,0,0,.10)",
    panelSoftBg: "rgba(245,228,178,0.70)",
    panelSoftBorder: "rgba(93,59,31,0.25)",
    panelSoftShadow: "6px 6px 0 rgba(0,0,0,.10)",
    previewShadow: "7px 7px 0 rgba(0,0,0,.12)",
    footerShadow: "5px 5px 0 rgba(0,0,0,.10)",
    navBg: "rgba(0,0,0,0.02)",
    navBorder: "rgba(36,24,14,0.20)",
    chooserBg: "rgba(0,0,0,0.02)",
    chooserBorder: "rgba(0,0,0,0.18)",
    chooserShadow: "4px 4px 0 rgba(0,0,0,.16)",
    chooserTextInactive: "#24180e",
    musicHighlight: "#24180e",
    statBg: "rgba(0,0,0,0.025)",
    statBorder: "rgba(36,24,14,0.25)",
    statShadow: "4px 4px 0 rgba(0,0,0,.08)",
    btnBg: "transparent",
    btnShadow: "3px 3px 0 rgba(0,0,0,.10)",
    tagBg: "transparent",
    tagBorder: "rgba(36,24,14,0.30)",
    tagShadow: "3px 3px 0 rgba(0,0,0,.08)",
    sealBg: "transparent",
    sealBorder: "rgba(36,24,14,0.35)",
    avatarBorder: "rgba(36,24,14,0.40)",
    avatarBg: "rgba(0,0,0,0.04)",
    dividerSymbol: "◇ ◇ ◇",
    dividerTracking: "0.35em",
    pattern: "radial-gradient(circle at 20% 20%, rgba(47,107,63,.16), transparent 24%), repeating-linear-gradient(90deg, rgba(93,59,31,.05) 0 3px, transparent 3px 18px)",
    motif: "☕  bàn nhựa  •  hẻm nhỏ  •  chuyện dài  ☕"
  },
  {
    id: "hong_tram",
    name: "Hồng Trầm",
    subtitle: "Hồng bụi trên nền than. Như lụa cũ, mực đêm, và một căn phòng có đèn thấp.",
    pageBg: "#0C090B",
    text: "#E8D8DD",
    textSoft: "#9A858C",
    textMuted: "#5C4A52",
    accent: "#B07080",
    accentSoft: "rgba(176,112,128,0.1)",
    borderOuter: "#2E2226",
    borderInner: "#2E2226",
    borderSection: "#2E2226",
    contentBorder: "#2E2226",
    questColor: "#9A858C",
    questMuted: "#5C4A52",
    frameBg: "rgba(255,255,255,0.018)",
    frameShadow: "0 0 80px rgba(0,0,0,.38)",
    panelBg: "rgba(22,18,20,0.74)",
    panelBorder: "#2E2226",
    panelShadow: "6px 6px 0 rgba(0,0,0,.26)",
    panelSoftBg: "rgba(22,18,20,0.74)",
    panelSoftBorder: "#2E2226",
    panelSoftShadow: "6px 6px 0 rgba(0,0,0,.26)",
    previewShadow: "7px 7px 0 rgba(0,0,0,.30)",
    footerShadow: "5px 5px 0 rgba(0,0,0,.26)",
    navBg: "rgba(22,18,20,0.74)",
    navBorder: "#2E2226",
    chooserBg: "rgba(255,255,255,0.02)",
    chooserBorder: "#2E2226",
    chooserShadow: "4px 4px 0 rgba(0,0,0,.35)",
    chooserTextInactive: "#9A858C",
    musicHighlight: "#B07080",
    statBg: "rgba(176,112,128,0.1)",
    statBorder: "#2E2226",
    statShadow: "4px 4px 0 rgba(0,0,0,.24)",
    btnBg: "rgba(176,112,128,0.1)",
    btnShadow: "3px 3px 0 rgba(0,0,0,.25)",
    tagBg: "rgba(22,18,20,0.74)",
    tagBorder: "#2E2226",
    tagShadow: "3px 3px 0 rgba(0,0,0,.22)",
    sealBg: "rgba(176,112,128,0.1)",
    sealBorder: "#5C4A52",
    avatarBorder: "#5C4A52",
    avatarBg: "rgba(176,112,128,0.1)",
    dividerSymbol: "• • •",
    dividerTracking: "0.28em",
    pattern: "radial-gradient(circle at 12% 8%, rgba(176,112,128,0.12), transparent 18%), radial-gradient(circle at 82% 18%, rgba(176,112,128,0.05), transparent 26%), radial-gradient(circle at 50% 92%, rgba(176,112,128,0.05), transparent 28%), repeating-linear-gradient(90deg, rgba(255,255,255,0.018) 0 1px, transparent 1px 34px), repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0 1px, transparent 1px 24px), linear-gradient(135deg, #0C090B, #1A1218 48%, #100C0E)",
    motif: "lụa trầm · mực đêm · hương gỗ · chuyện khuya"
  },
  {
    id: "den_dau",
    name: "Đèn Dầu Phố Cũ",
    subtitle: "Tối, ấm, vàng cũ. Hợp với nhật ký đêm, nhạc, sách và chuyện đời.",
    pageBg: "#0D0906",
    text: "#F0DEC1",
    textSoft: "#A99575",
    textMuted: "#5D4A32",
    accent: "#D09A4E",
    accentSoft: "rgba(208,154,78,0.1)",
    borderOuter: "#342617",
    borderInner: "#342617",
    borderSection: "#342617",
    contentBorder: "#342617",
    questColor: "#A99575",
    questMuted: "#5D4A32",
    frameBg: "rgba(255,255,255,0.018)",
    frameShadow: "0 0 80px rgba(0,0,0,.38)",
    panelBg: "rgba(23,16,10,0.72)",
    panelBorder: "#342617",
    panelShadow: "6px 6px 0 rgba(0,0,0,.26)",
    panelSoftBg: "rgba(23,16,10,0.72)",
    panelSoftBorder: "#342617",
    panelSoftShadow: "6px 6px 0 rgba(0,0,0,.26)",
    previewShadow: "7px 7px 0 rgba(0,0,0,.30)",
    footerShadow: "5px 5px 0 rgba(0,0,0,.26)",
    navBg: "rgba(23,16,10,0.72)",
    navBorder: "#342617",
    chooserBg: "rgba(255,255,255,0.02)",
    chooserBorder: "#342617",
    chooserShadow: "4px 4px 0 rgba(0,0,0,.35)",
    chooserTextInactive: "#A99575",
    musicHighlight: "#D09A4E",
    statBg: "rgba(208,154,78,0.1)",
    statBorder: "#342617",
    statShadow: "4px 4px 0 rgba(0,0,0,.24)",
    btnBg: "rgba(208,154,78,0.1)",
    btnShadow: "3px 3px 0 rgba(0,0,0,.25)",
    tagBg: "rgba(23,16,10,0.72)",
    tagBorder: "#342617",
    tagShadow: "3px 3px 0 rgba(0,0,0,.22)",
    sealBg: "rgba(208,154,78,0.1)",
    sealBorder: "#5D4A32",
    avatarBorder: "#5D4A32",
    avatarBg: "rgba(208,154,78,0.1)",
    dividerSymbol: "• • •",
    dividerTracking: "0.28em",
    pattern: "radial-gradient(circle at 12% 8%, rgba(208,154,78,0.12), transparent 18%), radial-gradient(circle at 82% 18%, rgba(208,154,78,0.055), transparent 26%), radial-gradient(circle at 50% 92%, rgba(208,154,78,0.055), transparent 28%), repeating-linear-gradient(90deg, rgba(255,255,255,0.018) 0 1px, transparent 1px 34px), repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0 1px, transparent 1px 24px), linear-gradient(135deg, #0D0906, #1E1309 48%, #120D08)",
    motif: "đèn dầu · gỗ cũ · phố khuya · tiếng xe xa"
  },
  {
    id: "muc_than",
    name: "Mực Than Giấy Đen",
    subtitle: "Rất tối, gọn, nặng chữ. Dành cho bài dài và suy nghĩ nghiêm túc.",
    pageBg: "#080808",
    text: "#E7DFD0",
    textSoft: "#9A907D",
    textMuted: "#555047",
    accent: "#AFA084",
    accentSoft: "rgba(175,160,132,0.1)",
    borderOuter: "#2A2722",
    borderInner: "#2A2722",
    borderSection: "#2A2722",
    contentBorder: "#2A2722",
    questColor: "#9A907D",
    questMuted: "#555047",
    frameBg: "rgba(255,255,255,0.018)",
    frameShadow: "0 0 80px rgba(0,0,0,.38)",
    panelBg: "rgba(18,18,18,0.78)",
    panelBorder: "#2A2722",
    panelShadow: "6px 6px 0 rgba(0,0,0,.26)",
    panelSoftBg: "rgba(18,18,18,0.78)",
    panelSoftBorder: "#2A2722",
    panelSoftShadow: "6px 6px 0 rgba(0,0,0,.26)",
    previewShadow: "7px 7px 0 rgba(0,0,0,.30)",
    footerShadow: "5px 5px 0 rgba(0,0,0,.26)",
    navBg: "rgba(18,18,18,0.78)",
    navBorder: "#2A2722",
    chooserBg: "rgba(255,255,255,0.02)",
    chooserBorder: "#2A2722",
    chooserShadow: "4px 4px 0 rgba(0,0,0,.35)",
    chooserTextInactive: "#9A907D",
    musicHighlight: "#AFA084",
    statBg: "rgba(175,160,132,0.1)",
    statBorder: "#2A2722",
    statShadow: "4px 4px 0 rgba(0,0,0,.24)",
    btnBg: "rgba(175,160,132,0.1)",
    btnShadow: "3px 3px 0 rgba(0,0,0,.25)",
    tagBg: "rgba(18,18,18,0.78)",
    tagBorder: "#2A2722",
    tagShadow: "3px 3px 0 rgba(0,0,0,.22)",
    sealBg: "rgba(175,160,132,0.1)",
    sealBorder: "#555047",
    avatarBorder: "#555047",
    avatarBg: "rgba(175,160,132,0.1)",
    dividerSymbol: "• • •",
    dividerTracking: "0.28em",
    pattern: "radial-gradient(circle at 12% 8%, rgba(175,160,132,0.10), transparent 18%), radial-gradient(circle at 82% 18%, rgba(175,160,132,0.045), transparent 26%), radial-gradient(circle at 50% 92%, rgba(175,160,132,0.045), transparent 28%), repeating-linear-gradient(90deg, rgba(255,255,255,0.018) 0 1px, transparent 1px 34px), repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0 1px, transparent 1px 24px), linear-gradient(135deg, #080808, #15120D 48%, #0B0A09)",
    motif: "mực than · giấy đen · dòng chậm · ý nặng"
  },
  {
    id: "sap_bao_dem",
    name: "Sạp Báo Đêm",
    subtitle: "Như tờ báo cũ đọc dưới đèn vàng: tiêu đề lớn, cột chữ chắc, không màu mè.",
    pageBg: "#0F0C09",
    text: "#EAD8C2",
    textSoft: "#A48D76",
    textMuted: "#5A493A",
    accent: "#BE6F5D",
    accentSoft: "rgba(190,111,93,0.1)",
    borderOuter: "#33261C",
    borderInner: "#33261C",
    borderSection: "#33261C",
    contentBorder: "#33261C",
    questColor: "#A48D76",
    questMuted: "#5A493A",
    frameBg: "rgba(255,255,255,0.018)",
    frameShadow: "0 0 80px rgba(0,0,0,.38)",
    panelBg: "rgba(24,19,14,0.74)",
    panelBorder: "#33261C",
    panelShadow: "6px 6px 0 rgba(0,0,0,.26)",
    panelSoftBg: "rgba(24,19,14,0.74)",
    panelSoftBorder: "#33261C",
    panelSoftShadow: "6px 6px 0 rgba(0,0,0,.26)",
    previewShadow: "7px 7px 0 rgba(0,0,0,.30)",
    footerShadow: "5px 5px 0 rgba(0,0,0,.26)",
    navBg: "rgba(24,19,14,0.74)",
    navBorder: "#33261C",
    chooserBg: "rgba(255,255,255,0.02)",
    chooserBorder: "#33261C",
    chooserShadow: "4px 4px 0 rgba(0,0,0,.35)",
    chooserTextInactive: "#A48D76",
    musicHighlight: "#BE6F5D",
    statBg: "rgba(190,111,93,0.1)",
    statBorder: "#33261C",
    statShadow: "4px 4px 0 rgba(0,0,0,.24)",
    btnBg: "rgba(190,111,93,0.1)",
    btnShadow: "3px 3px 0 rgba(0,0,0,.25)",
    tagBg: "rgba(24,19,14,0.74)",
    tagBorder: "#33261C",
    tagShadow: "3px 3px 0 rgba(0,0,0,.22)",
    sealBg: "rgba(190,111,93,0.1)",
    sealBorder: "#5A493A",
    avatarBorder: "#5A493A",
    avatarBg: "rgba(190,111,93,0.1)",
    dividerSymbol: "• • •",
    dividerTracking: "0.28em",
    pattern: "radial-gradient(circle at 12% 8%, rgba(190,111,93,0.11), transparent 18%), radial-gradient(circle at 82% 18%, rgba(190,111,93,0.05), transparent 26%), radial-gradient(circle at 50% 92%, rgba(190,111,93,0.05), transparent 28%), repeating-linear-gradient(90deg, rgba(255,255,255,0.018) 0 1px, transparent 1px 34px), repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0 1px, transparent 1px 24px), linear-gradient(135deg, #0F0C09, #1B120D 48%, #100C09)",
    motif: "tin khuya · cà phê đen · cột báo · ghi chép"
  },
  {
    id: "quan_coc_toi",
    name: "Quán Cóc Sau Mưa",
    subtitle: "Đen xanh, gần gũi, có mùi nền đất ướt và ly bạc xỉu cuối ngày.",
    pageBg: "#070D0A",
    text: "#DDE8DC",
    textSoft: "#8EA291",
    textMuted: "#485A4D",
    accent: "#7AA083",
    accentSoft: "rgba(122,160,131,0.1)",
    borderOuter: "#223329",
    borderInner: "#223329",
    borderSection: "#223329",
    contentBorder: "#223329",
    questColor: "#8EA291",
    questMuted: "#485A4D",
    frameBg: "rgba(255,255,255,0.018)",
    frameShadow: "0 0 80px rgba(0,0,0,.38)",
    panelBg: "rgba(16,25,21,0.74)",
    panelBorder: "#223329",
    panelShadow: "6px 6px 0 rgba(0,0,0,.26)",
    panelSoftBg: "rgba(16,25,21,0.74)",
    panelSoftBorder: "#223329",
    panelSoftShadow: "6px 6px 0 rgba(0,0,0,.26)",
    previewShadow: "7px 7px 0 rgba(0,0,0,.30)",
    footerShadow: "5px 5px 0 rgba(0,0,0,.26)",
    navBg: "rgba(16,25,21,0.74)",
    navBorder: "#223329",
    chooserBg: "rgba(255,255,255,0.02)",
    chooserBorder: "#223329",
    chooserShadow: "4px 4px 0 rgba(0,0,0,.35)",
    chooserTextInactive: "#8EA291",
    musicHighlight: "#7AA083",
    statBg: "rgba(122,160,131,0.1)",
    statBorder: "#223329",
    statShadow: "4px 4px 0 rgba(0,0,0,.24)",
    btnBg: "rgba(122,160,131,0.1)",
    btnShadow: "3px 3px 0 rgba(0,0,0,.25)",
    tagBg: "rgba(16,25,21,0.74)",
    tagBorder: "#223329",
    tagShadow: "3px 3px 0 rgba(0,0,0,.22)",
    sealBg: "rgba(122,160,131,0.1)",
    sealBorder: "#485A4D",
    avatarBorder: "#485A4D",
    avatarBg: "rgba(122,160,131,0.1)",
    dividerSymbol: "• • •",
    dividerTracking: "0.28em",
    pattern: "radial-gradient(circle at 12% 8%, rgba(122,160,131,0.11), transparent 18%), radial-gradient(circle at 82% 18%, rgba(122,160,131,0.045), transparent 26%), radial-gradient(circle at 50% 92%, rgba(122,160,131,0.045), transparent 28%), repeating-linear-gradient(90deg, rgba(255,255,255,0.018) 0 1px, transparent 1px 34px), repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0 1px, transparent 1px 24px), linear-gradient(135deg, #070D0A, #101B15 48%, #080F0C)",
    motif: "hẻm nhỏ · mưa đêm · bạc xỉu · chuyện dài"
  }
];

const navItems = ["Hiên Nhà", "Tôi Là Ai", "Đường Đi", "Câu Hay", "Ba Mươi Sáu Kế", "Sách", "Nhạc", "Game", "Lưu Bút"];
const quests = ["Bench 225lb", "Squat 315lb", "Deadlift 245lb", "UT Austin MSAI", "Toán cho ML", "Learn PyTorch"];

function Divider({ style }) {
  return (
    <div className="my-5 flex items-center gap-3 opacity-80">
      <div className="h-px flex-1" style={{ background: style.accent }} />
      <div style={{ color: style.accent, letterSpacing: style.dividerTracking }} className="text-xs">{style.dividerSymbol}</div>
      <div className="h-px flex-1" style={{ background: style.accent }} />
    </div>
  );
}

function WovenStat({ label, value, style }) {
  return (
    <div
      className="border p-3"
      style={{
        background: style.statBg,
        borderColor: style.statBorder,
        boxShadow: style.statShadow
      }}
    >
      <div className="text-[11px] uppercase tracking-[0.18em]" style={{ color: style.textMuted }}>{label}</div>
      <div className="mt-1 text-lg font-bold" style={{ color: style.text }}>{value}</div>
    </div>
  );
}

export default function VietnameseBlogStyleLab() {
  const [styleId, setStyleId] = useState("giaydo");
  const style = useMemo(() => styles.find((item) => item.id === styleId) || styles[0], [styleId]);

  return (
    <main
      className="min-h-screen"
      style={{ color: style.text, backgroundColor: style.pageBg, backgroundImage: style.pattern }}
    >
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-7 lg:px-8">
        <div
          className="border-[3px] border-double p-2"
          style={{
            borderColor: style.borderOuter,
            background: style.frameBg,
            boxShadow: style.frameShadow
          }}
        >
          <div className="border p-4 sm:p-6 lg:p-8" style={{ borderColor: style.borderInner }}>
            <header className="grid gap-6 lg:grid-cols-[1fr_260px] lg:items-start">
              <div>
                <div
                  className="inline-block border px-3 py-1 text-xs uppercase tracking-[0.26em]"
                  style={{
                    borderColor: style.tagBorder,
                    color: style.textSoft,
                    background: style.tagBg,
                    boxShadow: style.tagShadow
                  }}
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
                className="border p-4"
                style={{
                  background: style.panelBg,
                  borderColor: style.panelBorder,
                  boxShadow: style.panelShadow
                }}
              >
                <div className="text-center font-serif text-2xl font-black">Hung</div>
                <div
                  className="mx-auto mt-2 grid h-20 w-20 place-items-center rounded-full border-4 border-double text-xl font-black tracking-tight"
                  style={{ borderColor: style.avatarBorder, background: style.avatarBg, color: style.accent }}
                >
                  H
                </div>
                <p className="mt-3 text-center text-sm leading-6" style={{ color: style.textSoft }}>
                  Kỹ sư dữ liệu. Học AI. Tập tạ. Ghi chép để khỏi sống lơ mơ.
                </p>
                <Divider style={style} />
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
              style={{ borderColor: style.borderSection }}
            >
              {navItems.map((item) => (
                <button
                  key={item}
                  className="border px-2 py-2 transition hover:translate-y-[-1px]"
                  style={{ borderColor: style.navBorder, background: style.navBg, color: style.textSoft }}
                >
                  {item}
                </button>
              ))}
            </nav>

            <section className="mt-6 grid gap-5 lg:grid-cols-[310px_1fr]">
              <aside className="space-y-5">
                <section
                  className="border p-4"
                  style={{
                    background: style.panelBg,
                    borderColor: style.panelBorder,
                    boxShadow: style.panelShadow
                  }}
                >
                  <div className="font-serif text-xl font-black">Chọn chất trang</div>
                  <p className="mt-2 text-sm leading-6" style={{ color: style.textSoft }}>
                    Không phải đổi mỗi màu. Mỗi bản dưới đây đổi cả không khí, nhịp đọc, và cảm giác của trang.
                  </p>
                  <div className="mt-4 space-y-2">
                    {styles.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setStyleId(item.id)}
                        className={`w-full border px-3 py-3 text-left transition ${
                          item.id === style.id
                            ? "translate-x-1"
                            : "hover:translate-x-1"
                        }`}
                        style={{
                          borderColor: item.id === style.id ? style.accent : style.chooserBorder,
                          background: item.id === style.id ? style.accentSoft : style.chooserBg,
                          color: item.id === style.id ? style.text : style.chooserTextInactive,
                          boxShadow: item.id === style.id ? style.chooserShadow : "none"
                        }}
                      >
                        <div className="font-serif text-base font-black">{item.name}</div>
                        <div className="mt-1 text-xs leading-5 opacity-70">{item.subtitle}</div>
                      </button>
                    ))}
                  </div>
                </section>

                <section
                  className="border p-4"
                  style={{
                    background: style.panelSoftBg,
                    borderColor: style.panelSoftBorder,
                    boxShadow: style.panelSoftShadow
                  }}
                >
                  <div className="font-serif text-xl font-black">Đang nghe</div>
                  <div
                    className="mt-3 border-y py-3 text-2xl font-black"
                    style={{ borderColor: style.contentBorder, color: style.musicHighlight }}
                  >
                    Mạnh Bà
                  </div>
                  <p className="mt-2 text-sm" style={{ color: style.textSoft }}>
                    Một bài để nhớ rằng có những thứ qua cầu là phải để lại.
                  </p>
                </section>

                <section
                  className="border p-4"
                  style={{
                    background: style.panelSoftBg,
                    borderColor: style.panelSoftBorder,
                    boxShadow: style.panelSoftShadow
                  }}
                >
                  <div className="font-serif text-xl font-black">Việc đang làm</div>
                  <div className="mt-3 space-y-2">
                    {quests.map((quest, index) => (
                      <div
                        key={quest}
                        className="flex items-center justify-between border-b pb-2 text-sm"
                        style={{ borderColor: style.contentBorder }}
                      >
                        <span style={{ color: style.questColor }}>{quest}</span>
                        <span className="font-bold" style={{ color: index < 4 ? style.accent : style.questMuted }}>
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
                  className="border p-5 sm:p-6"
                  style={{
                    background: style.panelBg,
                    borderColor: style.panelBorder,
                    boxShadow: style.previewShadow
                  }}
                >
                  <div className="text-xs uppercase tracking-[0.3em]" style={{ color: style.textMuted }}>mẫu đang xem</div>
                  <h2 className="mt-2 font-serif text-4xl font-black sm:text-5xl" style={{ color: style.accent }}>
                    {style.name}
                  </h2>
                  <p className="mt-3 max-w-3xl font-serif text-lg leading-8" style={{ color: style.textSoft }}>
                    {style.subtitle}
                  </p>
                  <Divider style={style} />
                  <div className="text-center text-xs uppercase tracking-[0.32em]" style={{ color: style.textMuted }}>
                    {style.motif}
                  </div>
                </motion.div>

                <div className="mt-5 space-y-4">
                  {posts.map((post, index) => (
                    <motion.article
                      key={post.title}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: index * 0.04 }}
                      className="grid gap-4 border p-4 sm:grid-cols-[84px_1fr] sm:p-5"
                      style={{
                        background: style.panelSoftBg,
                        borderColor: style.panelSoftBorder,
                        boxShadow: style.panelSoftShadow
                      }}
                    >
                      <div className="flex sm:block sm:text-center">
                        <div
                          className="grid h-16 w-16 shrink-0 place-items-center border-4 border-double font-serif text-sm font-black"
                          style={{ color: style.accent, borderColor: style.sealBorder, background: style.sealBg }}
                        >
                          {post.seal}
                        </div>
                        <div className="ml-3 sm:ml-0 sm:mt-3">
                          <div className="text-xs uppercase tracking-[0.2em]" style={{ color: style.textMuted }}>
                            {post.type}
                          </div>
                          <div className="mt-1 text-xs" style={{ color: style.textMuted }}>{post.date}</div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-serif text-2xl font-black sm:text-3xl">{post.title}</h3>
                        <p className="mt-3 max-w-3xl text-base leading-8" style={{ color: style.textSoft }}>
                          {post.body}
                        </p>
                        <button
                          className="mt-4 border px-4 py-2 text-sm font-bold transition hover:translate-x-0.5"
                          style={{
                            borderColor: style.accent,
                            color: style.accent,
                            background: style.btnBg,
                            boxShadow: style.btnShadow
                          }}
                        >
                          đọc tiếp →
                        </button>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </section>
            </section>

            <footer className="mt-7 border-t pt-5" style={{ borderColor: style.borderSection }}>
              <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
                <div
                  className="border p-4"
                  style={{
                    background: style.panelSoftBg,
                    borderColor: style.panelSoftBorder,
                    boxShadow: style.footerShadow
                  }}
                >
                  <div className="font-serif text-xl font-black">Lưu bút</div>
                  <p className="mt-2 leading-7" style={{ color: style.textSoft }}>
                    "Trang này giống một góc nhà hơn là một landing page. Vậy mới đúng."
                  </p>
                </div>
                <div
                  className="border p-4"
                  style={{
                    background: style.panelSoftBg,
                    borderColor: style.panelSoftBorder,
                    boxShadow: style.footerShadow
                  }}
                >
                  <div className="font-serif text-xl font-black">Ghi chú thiết kế</div>
                  <p className="mt-2 leading-7" style={{ color: style.textSoft }}>
                    Giữ chất Việt bằng chất liệu: lụa trầm, đèn thấp, giấy tối, báo cũ, hẻm sau mưa. Trang vẫn nói về code và AI, nhưng không cần mặc áo startup hiện đại.
                  </p>
                </div>
              </div>
              <div className="mt-5 text-center text-xs uppercase tracking-[0.35em]" style={{ color: style.textMuted }}>
                {style.motif}
              </div>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}

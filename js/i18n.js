(function () {
  var STORAGE_KEY = "lang";
  var SUPPORTED_LANGS = { en: true, vi: true };
  var originalTitle = document.title;
  var originals = {
    text: new Map(),
    html: new Map(),
    placeholder: new Map(),
    alt: new Map(),
  };

  var I18N_TRANSLATIONS = {
    vi: {
      "title.index": "~*~ Nhật ký của Hưng ~*~",
      "title.about": "Giới thiệu ~ Nhật ký của Hưng",
      "title.roadmap": "Lộ trình ~ Nhật ký của Hưng",
      "title.books": "Sách ~ Nhật ký của Hưng",
      "title.music": "Nhạc ~ Nhật ký của Hưng",
      "title.games": "Game ~ Nhật ký của Hưng",
      "title.links": "Liên kết ~ Nhật ký của Hưng",
      "title.guestbook": "Sổ lưu bút ~ Nhật ký của Hưng",
      "title.entries": "Bài viết ~ Nhật ký của Hưng",

      "marquee.welcome":
        "★ ★ ★ Chào mừng đến góc nhỏ của tôi trên Internet! cứ tự nhiên ghé xem nhé 🌸 ♡ nhớ ký sổ lưu bút trước khi đi! ★ ★ ★ cập nhật 05.04.2026 ★ ★ ★ xem tốt nhất ở 1024x768 ★ ★ ★",
      "shell.subtitle": "suy nghĩ ・ code ・ cuộc sống",

      "nav.home": "Trang chủ",
      "nav.about": "Giới thiệu",
      "nav.roadmap": "Lộ trình",
      "nav.books": "Sách",
      "nav.music": "Nhạc",
      "nav.games": "Game",
      "nav.links": "Liên kết",
      "nav.guestbook": "Sổ lưu bút",
      "nav.entries": "Bài viết",

      "sidebar.online": '<span class="status-dot">&#9679;</span>trực tuyến',
      "sidebar.stats": "Thống kê",
      "sidebar.posts": 'Bài viết: <span>42</span>',
      "sidebar.mood": 'Tâm trạng: <span>&#9749; Caffeinated</span>',
      "sidebar.listening": 'Đang nghe: <span>Lo-fi beats</span>',
      "sidebar.reading": 'Đang đọc: <span>CLRS</span>',
      "sidebar.hangouts": "Kết nối",
      "sidebar.quests": "Thử thách",

      "footer.made_with": "làm bằng &#9829; và quá nhiều caffeine",
      "footer.best_viewed": "xem tốt nhất ở 1024x768",
      "footer.visitors": "lượt ghé:",

      "music_player.now_playing":
        '<span class="blink">&#9835;</span> Đang phát',

      "gb.heading": "&#128221; Sổ lưu bút",
      "gb.note":
        "Sổ lưu bút này chỉ để trang trí -- tin nhắn chưa được lưu. Một sổ lưu bút thật là nhiệm vụ tương lai.",
      "gb.name_placeholder": "Tên của bạn...",
      "gb.message_placeholder": "Để lại lời nhắn~ (chỉ trang trí thôi)",
      "gb.sign_button": "&#9998; Ký sổ lưu bút",
      "gb.view_all": "&gt;&gt; xem tất cả &amp; ký sổ lưu bút",

      "page.about.heading_about": "Về tôi",
      "page.about.heading_arc": "Chặng hiện tại",
      "page.about.heading_interests": "Sở thích",
      "page.about.heading_philosophy": "Triết lý",

      "page.roadmap.heading_main": "Lộ trình Kỹ sư AI",
      "page.roadmap.heading_phase1": "Giai đoạn 1: Nền tảng",
      "page.roadmap.heading_phase2": "Giai đoạn 2: Đào sâu và chứng minh",
      "page.roadmap.heading_phase3": "Giai đoạn 3: Áp dụng và phát triển",
      "page.roadmap.heading_accountable": "Cách giữ tôi có trách nhiệm",

      "page.books.heading_reading": "Đang đọc",
      "page.books.heading_completed": "Đã đọc xong",
      "page.books.heading_want": "Muốn đọc",

      "page.music.heading_rotation": "Đang nghe gần đây",
      "page.music.heading_artists": "Nghệ sĩ yêu thích",
      "page.music.heading_albums": "Album yêu thích",
      "page.music.heading_songs": "Bài hát yêu thích",

      "page.games.heading_playing": "Đang chơi",
      "page.games.heading_favorites": "Yêu thích mọi thời đại",
      "page.games.heading_completed": "Đã hoàn thành",
      "page.games.heading_want": "Muốn chơi",

      "page.links.heading_my_links": "Liên kết của tôi",
      "page.links.heading_cool_sites": "Trang hay",
      "page.links.heading_tools": "Công cụ tôi dùng",
      "page.links.heading_link_me": "Kết nối với tôi",

      "page.entries.heading": "Bài viết",
      "page.entries.description":
        "Kho lưu trữ đầy đủ các bài nhật ký, sắp xếp theo ngày.",
      "page.entries.under_construction":
        'Trang này đang được xây dựng. Hiện tại, tất cả bài viết nằm ở <a href="index.html">trang chủ</a>.',
    },
  };

  function normalizeLang(lang) {
    return SUPPORTED_LANGS[lang] ? lang : "en";
  }

  function getStoredLang() {
    try {
      return normalizeLang(localStorage.getItem(STORAGE_KEY) || "en");
    } catch (e) {
      return "en";
    }
  }

  function setStoredLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      // localStorage can be unavailable in some privacy modes.
    }
  }

  function getPageName() {
    var file = window.location.pathname.split("/").pop() || "index.html";
    return file.replace(/\.html$/i, "") || "index";
  }

  function cacheOriginals() {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      if (!originals.text.has(el)) {
        originals.text.set(el, el.textContent);
      }
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      if (!originals.html.has(el)) {
        originals.html.set(el, el.innerHTML);
      }
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      if (!originals.placeholder.has(el)) {
        originals.placeholder.set(el, el.placeholder || "");
      }
    });
    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
      if (!originals.alt.has(el)) {
        originals.alt.set(el, el.alt || "");
      }
    });
  }

  function translate(key, lang) {
    return I18N_TRANSLATIONS[lang] && I18N_TRANSLATIONS[lang][key];
  }

  function updateRoot(lang) {
    var root = document.documentElement;
    Array.prototype.slice.call(root.classList).forEach(function (className) {
      if (/^lang-/.test(className)) {
        root.classList.remove(className);
      }
    });
    root.lang = lang;
    root.classList.add("lang-" + lang);
  }

  function applyToElements(lang) {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var value = translate(key, lang);
      el.textContent = lang === "en" || value == null ? originals.text.get(el) : value;
    });

    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-html");
      var value = translate(key, lang);
      el.innerHTML = lang === "en" || value == null ? originals.html.get(el) : value;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-placeholder");
      var value = translate(key, lang);
      el.placeholder =
        lang === "en" || value == null ? originals.placeholder.get(el) : value;
    });

    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-alt");
      var value = translate(key, lang);
      el.alt = lang === "en" || value == null ? originals.alt.get(el) : value;
    });
  }

  function updateTitle(lang) {
    var key = "title." + getPageName();
    var value = translate(key, lang);
    document.title = lang === "en" || value == null ? originalTitle : value;
  }

  function updateToggle(lang) {
    var toggle = document.getElementById("langToggle");
    if (!toggle) {
      return;
    }
    if (!toggle.querySelector(".lang-choice")) {
      toggle.innerHTML =
        '<span class="lang-choice lang-choice-en">EN</span> | ' +
        '<span class="lang-choice lang-choice-vi">VI</span>';
    }
    toggle.setAttribute(
      "aria-label",
      lang === "vi" ? "Switch language to English" : "Switch language to Vietnamese"
    );
  }

  function apply(lang) {
    lang = normalizeLang(lang);
    cacheOriginals();
    updateRoot(lang);
    applyToElements(lang);
    updateTitle(lang);
    updateToggle(lang);
    document.documentElement.classList.add("i18n-ready");
  }

  function toggle() {
    var nextLang = getStoredLang() === "vi" ? "en" : "vi";
    setStoredLang(nextLang);
    apply(nextLang);
  }

  function init() {
    var lang = getStoredLang();
    var toggleButton = document.getElementById("langToggle");
    if (toggleButton) {
      toggleButton.addEventListener("click", toggle);
    }
    apply(lang);
  }

  window.I18N = {
    apply: apply,
    toggle: toggle,
    translations: I18N_TRANSLATIONS,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

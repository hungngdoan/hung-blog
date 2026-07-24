(function () {
  var FADE_MS = 180;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var navToken = 0;
  window.pageTeardowns = window.pageTeardowns || [];

  function runPageTeardowns() {
    var teardowns = window.pageTeardowns.splice(0);
    teardowns.forEach(function (teardown) {
      try {
        teardown();
      } catch (error) {
        // A failed cleanup must not strand navigation on the current page.
      }
    });
  }

  function activateScripts(container) {
    container.querySelectorAll("script").forEach(function (old) {
      if (old.type && old.type !== "text/javascript") return;
      var fresh = document.createElement("script");
      Array.from(old.attributes).forEach(function (attr) {
        fresh.setAttribute(attr.name, attr.value);
      });
      fresh.textContent = old.textContent;
      old.parentNode.replaceChild(fresh, old);
    });
  }

  function normalizePathname(pathname) {
    return pathname.endsWith("/") ? pathname + "index.html" : pathname;
  }

  function setActiveNav(url) {
    var current = normalizePathname(new URL(url, location.href).pathname);

    document.querySelectorAll(".nav-bar a").forEach(function (a) {
      a.classList.toggle(
        "active",
        normalizePathname(new URL(a.href, location.href).pathname) === current
      );
    });

    document.querySelectorAll(".nav-dropdown").forEach(function (dropdown) {
      var childActive = Array.prototype.some.call(
        dropdown.querySelectorAll(".nav-dropdown-menu a"),
        function (a) {
          return normalizePathname(new URL(a.href, location.href).pathname) === current;
        }
      );

      dropdown.classList.toggle("active", childActive);
    });
  }

  function completePjax() {
    document.dispatchEvent(new CustomEvent("hung:pjax-complete"));
  }

  function syncPageFonts(doc) {
    var incoming = doc.querySelector("link[data-page-fonts]");
    var current = document.querySelector("link[data-page-fonts]");

    if (incoming && current && incoming.href !== current.href) {
      current.href = incoming.href;
    }
  }

  function syncHead(doc) {
    [
      'meta[name="description"]',
      'meta[property="og:title"]',
      'meta[property="og:description"]',
      'meta[property="og:type"]',
      'meta[property="og:url"]'
    ].forEach(function (selector) {
      var incoming = doc.querySelector(selector);
      var current = document.querySelector(selector);
      if (incoming && current) current.setAttribute("content", incoming.content);
    });

    var incomingCanonical = doc.querySelector('link[rel="canonical"]');
    var currentCanonical = document.querySelector('link[rel="canonical"]');
    if (incomingCanonical && currentCanonical) {
      currentCanonical.href = incomingCanonical.href;
    }
  }

  function readPage(response) {
    if (!response.ok) {
      throw new Error("PJAX request failed");
    }

    return response.text();
  }

  function fadeOutMain() {
    var main = document.querySelector(".main-content");
    if (!main || reduceMotion) return Promise.resolve();

    main.classList.add("pjax-hidden");
    return new Promise(function (resolve) {
      setTimeout(resolve, FADE_MS);
    });
  }

  function swapMain(html) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, "text/html");
    var newMain = doc.querySelector(".main-content");
    var currentMain = document.querySelector(".main-content");

    if (!newMain || !currentMain) {
      throw new Error("PJAX page content missing");
    }

    runPageTeardowns();
    if (!reduceMotion) newMain.classList.add("pjax-hidden");
    currentMain.replaceWith(newMain);
    syncPageFonts(doc);
    syncHead(doc);
    activateScripts(newMain);
    document.title = doc.title;
    document.body.className = doc.body.className;

    if (!reduceMotion) {
      // double rAF so the hidden state is painted before the fade-in starts
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          newMain.classList.remove("pjax-hidden");
        });
      });
    }

    return doc;
  }

  function navigate(url, pushHistory) {
    var token = ++navToken;

    Promise.all([fetch(url).then(readPage), fadeOutMain()])
      .then(function (results) {
        if (token !== navToken) return;

        swapMain(results[0]);
        if (pushHistory) window.scrollTo(0, 0);
        var newMain = document.querySelector(".main-content");
        var announcer = document.getElementById("pjax-announcer");
        newMain.focus({ preventScroll: true });
        announcer.textContent = document.title;
        setActiveNav(url);
        if (pushHistory) history.pushState(null, "", url);
        completePjax();
      })
      .catch(function () {
        if (token !== navToken) return;
        window.location.href = url;
      });
  }

  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }

    var link = e.target.closest(".page-wrapper a[href]");
    if (!link || link.origin !== location.origin) return;
    if (link.target || link.hasAttribute("download") || link.closest("#musicList")) return;

    var target = new URL(link.href, location.href);
    if (target.hash && target.pathname === location.pathname) return;
    if (!target.pathname.endsWith("/") && !target.pathname.endsWith(".html")) return;

    e.preventDefault();
    navigate(target.href, true);
  });

  window.addEventListener("popstate", function () {
    navigate(location.href, false);
  });
})();

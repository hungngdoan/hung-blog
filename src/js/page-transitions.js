(function () {
  var FADE_MS = 180;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var navToken = 0;

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

  function getPageName(url) {
    var parsed = new URL(url, location.href);
    return parsed.pathname.split("/").pop() || "index.html";
  }

  function setActiveNav(url) {
    var current = getPageName(url);

    document.querySelectorAll(".nav-bar a").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === current);
    });

    document.querySelectorAll(".nav-dropdown").forEach(function (dropdown) {
      var childActive = Array.prototype.some.call(
        dropdown.querySelectorAll(".nav-dropdown-menu a"),
        function (a) {
          return a.getAttribute("href") === current;
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

    if (!reduceMotion) newMain.classList.add("pjax-hidden");
    currentMain.replaceWith(newMain);
    syncPageFonts(doc);
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
        setActiveNav(url);
        if (pushHistory) history.pushState(null, "", url);
        completePjax();
      })
      .catch(function () {
        window.location.href = url;
      });
  }

  document.addEventListener("click", function (e) {
    var link = e.target.closest(".nav-bar a");
    if (!link || link.origin !== location.origin) return;
    e.preventDefault();

    navigate(link.href, true);
  });

  window.addEventListener("popstate", function () {
    navigate(location.href, false);
  });
})();

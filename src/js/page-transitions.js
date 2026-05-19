(function () {
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

  function swapMain(html) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, "text/html");
    var newMain = doc.querySelector(".main-content");
    var currentMain = document.querySelector(".main-content");

    if (!newMain || !currentMain) {
      throw new Error("PJAX page content missing");
    }

    currentMain.replaceWith(newMain);
    syncPageFonts(doc);
    activateScripts(newMain);
    document.title = doc.title;

    return doc;
  }

  document.addEventListener("click", function (e) {
    var link = e.target.closest(".nav-bar a");
    if (!link || link.origin !== location.origin) return;
    e.preventDefault();

    fetch(link.href)
      .then(readPage)
      .then(function (html) {
        swapMain(html);

        setActiveNav(link.href);

        history.pushState(null, "", link.href);
        completePjax();
      })
      .catch(function () {
        window.location.href = link.href;
      });
  });

  window.addEventListener("popstate", function () {
    fetch(location.href)
      .then(readPage)
      .then(function (html) {
        swapMain(html);

        setActiveNav(location.href);
        completePjax();
      })
      .catch(function () {
        window.location.href = location.href;
      });
  });
})();

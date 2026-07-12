/* Random encounter modal.
   Feature pages can provide a local [data-rp-source]. Everywhere else the
   post index and selected post HTML are fetched only when the die is used. */
(function () {
  var overlay = document.getElementById("rp-overlay");
  var fab = document.getElementById("rp-fab");

  if (!overlay || !fab) {
    return;
  }

  var modal = overlay.querySelector("[data-rp-modal]");
  var stage = overlay.querySelector("[data-rp-stage]");
  var counter = overlay.querySelector("[data-rp-counter]");
  var titleEl = overlay.querySelector("#rp-title");
  var indexUrl = fab.getAttribute("data-rp-index");

  if (!modal || !stage || !indexUrl) {
    fab.remove();
    return;
  }

  var DEFAULT_TITLE = "A WILD POST APPEARED!";
  var EXIT_MS = 250;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var indexPromise = null;
  var lastSource = null;
  var lastIndex = -1;
  var drawCount = 0;
  var drawToken = 0;
  var fallbackFocus = null;
  var closeTimer = null;

  function readEntries(node) {
    var root = "content" in node ? node.content : node;
    return Array.prototype.slice.call(root.children);
  }

  function localSource() {
    var main = document.querySelector(".main-content");
    var source = main && main.querySelector("[data-rp-source]");
    if (!source) return null;

    var selector = source.getAttribute("data-rp-entries");
    var entries = selector
      ? Array.prototype.slice.call(main.querySelectorAll(selector))
      : readEntries(source);

    if (!entries.length) return null;
    return {
      key: source,
      entries: entries,
      title: source.getAttribute("data-rp-title") || DEFAULT_TITLE,
    };
  }

  function loadIndex() {
    if (!indexPromise) {
      indexPromise = fetch(indexUrl)
        .then(function (response) {
          if (!response.ok) throw new Error("Random index request failed");
          return response.json();
        })
        .then(function (entries) {
          if (!Array.isArray(entries) || !entries.length) {
            throw new Error("Random index is empty");
          }
          return entries.filter(function (entry) {
            return entry && typeof entry.url === "string";
          });
        })
        .catch(function (error) {
          indexPromise = null;
          throw error;
        });
    }
    return indexPromise;
  }

  function pick(count, sourceKey) {
    if (sourceKey !== lastSource) {
      lastSource = sourceKey;
      lastIndex = -1;
    }
    if (count === 1) {
      lastIndex = 0;
      return 0;
    }

    var index;
    do {
      index = Math.floor(Math.random() * count);
    } while (index === lastIndex);
    lastIndex = index;
    return index;
  }

  function prepareCard(card) {
    card.removeAttribute("hidden");
    card.classList.remove("hidden", "quotes-search-hidden");
    Array.prototype.forEach.call(card.querySelectorAll("a[href]"), function (link) {
      if ((link.getAttribute("href") || "").charAt(0) === "#") return;
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });
    return card;
  }

  function renderCard(card, title, animate) {
    if (titleEl) titleEl.textContent = title;
    stage.innerHTML = "";
    stage.appendChild(prepareCard(card));
    stage.scrollTop = 0;

    drawCount += 1;
    if (counter) counter.textContent = "DRAW #" + drawCount;

    if (animate && !reduceMotion.matches) {
      stage.classList.remove("rp-dealing");
      void stage.offsetWidth;
      stage.classList.add("rp-dealing");
    }
  }

  function showLoading() {
    if (titleEl) titleEl.textContent = DEFAULT_TITLE;
    stage.innerHTML = '<p class="rp-status">Searching the archive...</p>';
  }

  function showError() {
    stage.innerHTML =
      '<p class="rp-status rp-status-error">The archive signal was lost. Try again.</p>';
  }

  function fetchPost(entry) {
    return fetch(entry.url)
      .then(function (response) {
        if (!response.ok) throw new Error("Random post request failed");
        return response.text();
      })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, "text/html");
        var article = doc.querySelector(".main-content .blog-post");
        if (!article) throw new Error("Random post article missing");
        return article;
      });
  }

  function draw(animate) {
    var token = ++drawToken;
    var local = localSource();

    if (local) {
      var localCard = local.entries[pick(local.entries.length, local.key)].cloneNode(true);
      renderCard(localCard, local.title, animate);
      return;
    }

    showLoading();
    var selected = null;
    loadIndex()
      .then(function (entries) {
        if (token !== drawToken) return null;
        selected = entries[pick(entries.length, "posts")];
        return fetchPost(selected);
      })
      .then(function (article) {
        if (!article || token !== drawToken) return;
        renderCard(article, DEFAULT_TITLE, animate);
      })
      .catch(function () {
        if (token !== drawToken) return;
        if (selected) {
          window.location.href = selected.url;
          return;
        }
        showError();
      });
  }

  function focusables() {
    return Array.prototype.slice
      .call(
        modal.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      )
      .filter(function (element) {
        return element.offsetParent !== null;
      });
  }

  function reveal() {
    document.body.classList.add("rp-noscroll");
    requestAnimationFrame(function () {
      overlay.classList.add("is-open");
    });
    modal.focus();
  }

  function open() {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
    if (!overlay.hidden && overlay.classList.contains("is-open")) return;

    fallbackFocus = document.activeElement;
    overlay.hidden = false;
    reveal();
    draw(true);
  }

  function close() {
    if (overlay.hidden || closeTimer) return;

    drawToken += 1;
    overlay.classList.remove("is-open");
    document.body.classList.remove("rp-noscroll");

    var finish = function () {
      closeTimer = null;
      overlay.hidden = true;
      stage.innerHTML = "";
    };

    if (reduceMotion.matches) finish();
    else closeTimer = setTimeout(finish, EXIT_MS);

    if (fallbackFocus && fallbackFocus.focus) fallbackFocus.focus();
    else fab.focus();
  }

  fab.addEventListener("click", open);

  overlay.addEventListener("click", function (event) {
    if (event.target === overlay || event.target.closest("[data-rp-close]")) {
      close();
    } else if (event.target.closest("[data-rp-reroll]")) {
      draw(true);
    }
  });

  document.addEventListener("keydown", function (event) {
    if (overlay.hidden) return;
    var anotherDialogIsOpen = Array.prototype.some.call(
      document.querySelectorAll('[role="dialog"]:not([hidden])'),
      function (dialog) {
        return dialog !== overlay;
      },
    );
    if (anotherDialogIsOpen) return;
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== "Tab") return;

    var items = focusables();
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    var active = document.activeElement;

    if (event.shiftKey && (active === first || active === modal)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  });

  document.addEventListener("hung:pjax-complete", function () {
    if (!overlay.hidden) close();
  });
})();

/* Random Post — "A WILD POST APPEARED!"
   A floating die deals a random journal entry into a CRT encounter modal.
   Reads from a hidden <template> rendered once in the base shell, so it works
   on every page and survives PJAX navigation (the shell is never swapped). */
(function () {
  var overlay = document.getElementById("rp-overlay");
  var fab = document.getElementById("rp-fab");
  var pool = document.getElementById("rp-pool");

  if (!overlay || !fab || !pool || !("content" in pool)) {
    return;
  }

  var modal = overlay.querySelector("[data-rp-modal]");
  var stage = overlay.querySelector("[data-rp-stage]");
  var counter = overlay.querySelector("[data-rp-counter]");

  var entries = Array.prototype.slice.call(
    pool.content.querySelectorAll(".blog-post")
  );

  if (!entries.length || !modal || !stage) {
    fab.remove();
    return;
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var EXIT_MS = 250; // keep in sync with .rp-overlay opacity transition
  var lastIndex = -1;
  var drawCount = 0;
  var fallbackFocus = null;
  var closeTimer = null;

  function pick() {
    if (entries.length === 1) {
      return 0;
    }

    var index;
    do {
      index = Math.floor(Math.random() * entries.length);
    } while (index === lastIndex);

    lastIndex = index;
    return index;
  }

  function draw(animate) {
    var card = entries[pick()].cloneNode(true);

    // open any links inside the drawn post in a new tab so clicking one does
    // not navigate away and dismiss the popup (in-page anchors are left alone)
    Array.prototype.forEach.call(card.querySelectorAll("a[href]"), function (link) {
      if ((link.getAttribute("href") || "").charAt(0) === "#") {
        return;
      }
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });

    stage.innerHTML = "";
    stage.appendChild(card);
    stage.scrollTop = 0;

    drawCount += 1;
    if (counter) {
      counter.textContent = "DRAW #" + drawCount;
    }

    if (animate && !reduceMotion.matches) {
      stage.classList.remove("rp-dealing");
      // force reflow so the deal animation restarts on every fresh draw
      void stage.offsetWidth;
      stage.classList.add("rp-dealing");
    }
  }

  function focusables() {
    return Array.prototype.slice
      .call(
        modal.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      )
      .filter(function (el) {
        return el.offsetParent !== null;
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
    // cancel a pending hide so a quick close-then-reopen is not swallowed
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }

    if (overlay.hidden) {
      fallbackFocus = document.activeElement;
      draw(true);
      overlay.hidden = false;
    } else if (overlay.classList.contains("is-open")) {
      return; // already fully open
    }

    // covers both a fresh open and re-showing while mid-close
    reveal();
  }

  function close() {
    if (overlay.hidden || closeTimer) {
      return;
    }

    overlay.classList.remove("is-open");
    document.body.classList.remove("rp-noscroll");

    var finish = function () {
      closeTimer = null;
      overlay.hidden = true;
      stage.innerHTML = "";
    };

    if (reduceMotion.matches) {
      finish();
    } else {
      closeTimer = setTimeout(finish, EXIT_MS);
    }

    if (fab) {
      fab.focus();
    } else if (fallbackFocus && fallbackFocus.focus) {
      fallbackFocus.focus();
    }
  }

  fab.addEventListener("click", open);

  overlay.addEventListener("click", function (event) {
    if (event.target === overlay || event.target.closest("[data-rp-close]")) {
      close();
      return;
    }

    if (event.target.closest("[data-rp-reroll]")) {
      draw(true);
    }
  });

  document.addEventListener("keydown", function (event) {
    if (overlay.hidden) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    var items = focusables();
    if (!items.length) {
      return;
    }

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

  // browser Back/Forward swaps the page behind the modal; dismiss it so the
  // overlay and scroll lock never linger over fresh content
  document.addEventListener("hung:pjax-complete", function () {
    if (!overlay.hidden) {
      close();
    }
  });
})();

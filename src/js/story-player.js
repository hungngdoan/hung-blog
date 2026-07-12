/* Reusable cinematic story player.
   A post supplies inert [data-story-source] beats; this persistent shell owns
   modal behavior so stories also work after PJAX and inside random encounters. */
(function () {
  var overlay = document.getElementById("story-overlay");
  if (!overlay) return;

  var shell = overlay.querySelector("[data-story-shell]");
  var title = overlay.querySelector("#story-title");
  var stage = overlay.querySelector("[data-story-stage]");
  var progress = overlay.querySelector("[data-story-progress]");
  var progressTrack = overlay.querySelector("[data-story-progress-track]");
  var count = overlay.querySelector("[data-story-count]");
  var previousButton = overlay.querySelector("[data-story-prev]");
  var nextButton = overlay.querySelector("[data-story-next]");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!shell || !stage || !progress || !previousButton || !nextButton) return;

  var beats = [];
  var currentIndex = 0;
  var trigger = null;
  var closeTimer = null;

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function focusables() {
    return Array.prototype.slice
      .call(
        shell.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      )
      .filter(function (element) {
        return element.offsetParent !== null;
      });
  }

  function render(direction) {
    var beat = beats[currentIndex].cloneNode(true);
    var tone = beat.getAttribute("data-tone") || "origin";
    var percent = ((currentIndex + 1) / beats.length) * 100;

    shell.setAttribute("data-tone", tone);
    stage.classList.remove("is-forward", "is-back");
    stage.innerHTML = "";
    stage.appendChild(beat);
    stage.scrollTop = 0;

    progress.style.width = percent + "%";
    progressTrack.setAttribute("aria-valuemax", String(beats.length));
    progressTrack.setAttribute("aria-valuenow", String(currentIndex + 1));
    count.textContent = pad(currentIndex + 1) + " / " + pad(beats.length);
    previousButton.disabled = currentIndex === 0;
    nextButton.innerHTML =
      currentIndex === beats.length - 1
        ? 'Return to journal <span aria-hidden="true">&#10022;</span>'
        : 'Next <span aria-hidden="true">&#9654;</span>';

    if (!reducedMotion.matches) {
      void stage.offsetWidth;
      stage.classList.add(direction === "back" ? "is-back" : "is-forward");
    }
  }

  function sourceFor(sourceTrigger) {
    var article = sourceTrigger.closest(".blog-post");
    return article && article.querySelector("template[data-story-source]");
  }

  function open(sourceTrigger) {
    var source = sourceFor(sourceTrigger);
    if (!source || !("content" in source)) return;

    var sourceBeats = Array.prototype.slice.call(
      source.content.querySelectorAll("[data-story-beat]"),
    );
    if (!sourceBeats.length) return;

    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }

    beats = sourceBeats;
    currentIndex = 0;
    trigger = sourceTrigger;
    title.textContent = source.getAttribute("data-story-title") || "Story Mode";
    trigger.setAttribute("aria-expanded", "true");
    overlay.hidden = false;
    document.body.classList.add("story-noscroll");
    render("forward");

    requestAnimationFrame(function () {
      overlay.classList.add("is-open");
    });
    shell.focus();
  }

  function close() {
    if (overlay.hidden || closeTimer) return;

    overlay.classList.remove("is-open");
    document.body.classList.remove("story-noscroll");
    if (trigger) trigger.setAttribute("aria-expanded", "false");

    var finish = function () {
      closeTimer = null;
      overlay.hidden = true;
      stage.innerHTML = "";
      beats = [];
    };

    if (reducedMotion.matches) finish();
    else closeTimer = setTimeout(finish, 220);

    if (trigger && document.contains(trigger)) trigger.focus();
  }

  function next() {
    if (currentIndex >= beats.length - 1) {
      close();
      return;
    }
    currentIndex += 1;
    render("forward");
  }

  function previous() {
    if (currentIndex === 0) return;
    currentIndex -= 1;
    render("back");
  }

  document.addEventListener("click", function (event) {
    var openButton = event.target.closest("[data-story-open]");
    if (openButton) {
      open(openButton);
      return;
    }
    if (overlay.hidden) return;
    if (event.target === overlay || event.target.closest("[data-story-close]")) close();
    else if (event.target.closest("[data-story-next]")) next();
    else if (event.target.closest("[data-story-prev]")) previous();
  });

  document.addEventListener("keydown", function (event) {
    if (overlay.hidden) return;

    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    var targetIsControl = event.target.closest &&
      event.target.closest("button, a, input, textarea, select");
    if (
      event.key === "ArrowRight" ||
      event.key === "PageDown" ||
      (event.key === " " && !targetIsControl)
    ) {
      event.preventDefault();
      next();
      return;
    }
    if (event.key === "ArrowLeft" || event.key === "PageUp") {
      event.preventDefault();
      previous();
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      currentIndex = 0;
      render("back");
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      currentIndex = beats.length - 1;
      render("forward");
      return;
    }
    if (event.key !== "Tab") return;

    var items = focusables();
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === shell)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  document.addEventListener("hung:pjax-complete", function () {
    if (!overlay.hidden) close();
  });
})();

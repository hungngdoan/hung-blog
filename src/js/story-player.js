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
  var loadToken = 0;

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

  function localSourceFor(sourceTrigger) {
    var article = sourceTrigger.closest(".blog-post");
    var articleSource =
      article && article.querySelector("template[data-story-source]");
    if (articleSource) return articleSource;

    var storyKey = sourceTrigger.getAttribute("data-story-key");
    if (!storyKey) return null;

    return Array.prototype.find.call(
      document.querySelectorAll("template[data-story-source][data-story-key]"),
      function (source) {
        return source.getAttribute("data-story-key") === storyKey;
      },
    ) || null;
  }

  function beginStory(source, sourceTrigger) {
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

  function fetchedSource(html) {
    var doc = new DOMParser().parseFromString(html, "text/html");
    return doc.querySelector("template[data-story-source]");
  }

  function open(sourceTrigger) {
    var localSource = localSourceFor(sourceTrigger);
    if (localSource && "content" in localSource) {
      beginStory(localSource, sourceTrigger);
      return;
    }

    var sourceUrl = sourceTrigger.getAttribute("data-story-url");
    if (!sourceUrl) return;

    var token = ++loadToken;
    trigger = sourceTrigger;
    sourceTrigger.setAttribute("aria-busy", "true");

    fetch(sourceUrl)
      .then(function (response) {
        if (!response.ok) throw new Error("Story request failed");
        return response.text();
      })
      .then(function (html) {
        if (token !== loadToken) return;
        var source = fetchedSource(html);
        if (!source || !("content" in source)) {
          throw new Error("Story source missing");
        }
        sourceTrigger.removeAttribute("aria-busy");
        beginStory(source, sourceTrigger);
      })
      .catch(function () {
        if (token !== loadToken) return;
        sourceTrigger.removeAttribute("aria-busy");
        window.location.href = sourceUrl;
      });
  }

  function close() {
    if (overlay.hidden || closeTimer) return;

    loadToken += 1;
    overlay.classList.remove("is-open");
    document.body.classList.remove("story-noscroll");
    if (trigger) {
      trigger.setAttribute("aria-expanded", "false");
      trigger.removeAttribute("aria-busy");
    }

    var finish = function () {
      closeTimer = null;
      overlay.hidden = true;
      stage.innerHTML = "";
      beats = [];
    };

    if (reducedMotion.matches) finish();
    else closeTimer = setTimeout(finish, 220);

    if (trigger && document.contains(trigger)) {
      var focusTarget = trigger;
      var dropdown = trigger.closest(".nav-dropdown");
      if (dropdown && !dropdown.classList.contains("open")) {
        focusTarget = dropdown.querySelector(".nav-dropdown-toggle") || trigger;
      }
      focusTarget.focus();
    }
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

  /* Touch swipe on the stage. The stage owns vertical scrolling
     (touch-action: pan-y), so only a clearly horizontal gesture turns
     the page; anything else scrolls or taps as normal. */
  var swipeStart = null;

  stage.addEventListener("pointerdown", function (event) {
    if (event.pointerType !== "touch" || !event.isPrimary) return;
    swipeStart = { x: event.clientX, y: event.clientY };
  });

  stage.addEventListener("pointerup", function (event) {
    if (event.pointerType !== "touch" || !swipeStart) return;
    var deltaX = event.clientX - swipeStart.x;
    var deltaY = event.clientY - swipeStart.y;
    swipeStart = null;
    if (Math.abs(deltaX) < 48 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
    if (deltaX < 0) next();
    else previous();
  });

  stage.addEventListener("pointercancel", function () {
    swipeStart = null;
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
    loadToken += 1;
    if (trigger) trigger.removeAttribute("aria-busy");
    if (!overlay.hidden) close();
  });
})();

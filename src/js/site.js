(function () {
  var dropdownSelector = ".nav-dropdown";
  var toggleSelector = ".nav-dropdown-toggle";

  function closeDropdown(dropdown) {
    var toggle = dropdown.querySelector(toggleSelector);
    dropdown.classList.remove("open");

    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
    }
  }

  function closeDropdowns(except) {
    document.querySelectorAll(dropdownSelector).forEach(function (dropdown) {
      if (dropdown !== except) {
        closeDropdown(dropdown);
      }
    });
  }

  document.addEventListener("click", function (event) {
    if (event.target.closest(".nav-dropdown-menu a")) {
      closeDropdowns();
      return;
    }

    var toggle = event.target.closest(toggleSelector);

    if (toggle) {
      var dropdown = toggle.closest(dropdownSelector);
      var isOpen = dropdown.classList.contains("open");

      closeDropdowns(dropdown);
      dropdown.classList.toggle("open", !isOpen);
      toggle.setAttribute("aria-expanded", String(!isOpen));
      return;
    }

    if (!event.target.closest(dropdownSelector)) {
      closeDropdowns();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeDropdowns();
    }
  });

  document.addEventListener("hung:pjax-complete", function () {
    closeDropdowns();
  });
})();

(function () {
  var topButton = document.querySelector("[data-to-top]");
  var bottomButton = document.querySelector("[data-to-bottom]");
  var edgeOffset = 32;
  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  if (!topButton || !bottomButton) {
    return;
  }

  function getScrollMax() {
    return Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight
    );
  }

  function setEnabled(button, isEnabled) {
    button.disabled = !isEnabled;
    button.setAttribute("aria-disabled", String(!isEnabled));
  }

  function updateVisibility() {
    var scrollMax = getScrollMax();
    var activeEdgeOffset = Math.min(
      edgeOffset,
      Math.max(1, Math.floor(scrollMax / 2))
    );

    setEnabled(topButton, scrollMax > 0 && window.scrollY > activeEdgeOffset);
    setEnabled(
      bottomButton,
      scrollMax > 0 && window.scrollY < scrollMax - activeEdgeOffset
    );
  }

  topButton.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    });
  });

  bottomButton.addEventListener("click", function () {
    window.scrollTo({
      top: getScrollMax(),
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    });
  });

  window.addEventListener("scroll", updateVisibility, { passive: true });
  window.addEventListener("resize", updateVisibility);
  document.addEventListener("hung:pjax-complete", updateVisibility);

  updateVisibility();
})();

(function () {
  var dateNodes = document.querySelectorAll("[data-last-updated]");
  var latestCommitUrl =
    "https://api.github.com/repos/hungngdoan/hung-blog/commits/main";

  if (!dateNodes.length) {
    return;
  }

  var pad = function (value) {
    return ("0" + value).slice(-2);
  };

  var formatDate = function (date) {
    return {
      isoDate:
        date.getFullYear() +
        "-" +
        pad(date.getMonth() + 1) +
        "-" +
        pad(date.getDate()),
      displayDate:
        pad(date.getMonth() + 1) +
        "." +
        pad(date.getDate()) +
        "." +
        date.getFullYear(),
    };
  };

  var renderDate = function (date) {
    var formatted = formatDate(date);

    dateNodes.forEach(function (node) {
      node.textContent = formatted.displayDate;

      if (node.tagName.toLowerCase() === "time") {
        node.setAttribute("datetime", formatted.isoDate);
      }
    });
  };

  fetch(latestCommitUrl)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Could not load latest commit");
      }

      return response.json();
    })
    .then(function (data) {
      var commitDate =
        data &&
        data.commit &&
        ((data.commit.committer && data.commit.committer.date) ||
          (data.commit.author && data.commit.author.date));

      if (commitDate) {
        renderDate(new Date(commitDate));
      }
    })
    .catch(function () {
      // Keep the fallback date that is already in the HTML.
    });
})();

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

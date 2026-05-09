(function () {
  document.addEventListener("click", function (e) {
    var link = e.target.closest(".nav-bar a");
    if (!link || link.origin !== location.origin) return;
    e.preventDefault();

    fetch(link.href)
      .then(function (res) { return res.text(); })
      .then(function (html) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, "text/html");

        var newMain = doc.querySelector(".main-content");
        document.querySelector(".main-content").replaceWith(newMain);

        document.querySelectorAll(".nav-bar a").forEach(function (a) {
          a.classList.remove("active");
        });
        link.classList.add("active");

        document.title = doc.title;

        history.pushState(null, "", link.href);
      });
  });

  window.addEventListener("popstate", function () {
    fetch(location.href)
      .then(function (res) { return res.text(); })
      .then(function (html) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, "text/html");
        document.querySelector(".main-content").replaceWith(
          doc.querySelector(".main-content")
        );
        document.title = doc.title;

        var current = location.pathname.split("/").pop() || "index.html";
        document.querySelectorAll(".nav-bar a").forEach(function (a) {
          a.classList.toggle("active", a.getAttribute("href") === current);
        });
      });
  });
})();

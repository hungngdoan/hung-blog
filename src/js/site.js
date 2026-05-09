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

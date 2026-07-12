const now = new Date();

module.exports = {
  isoDate: now.toISOString().slice(0, 10),
  displayDate: [
    String(now.getUTCMonth() + 1).padStart(2, "0"),
    String(now.getUTCDate()).padStart(2, "0"),
    now.getUTCFullYear(),
  ].join("."),
};


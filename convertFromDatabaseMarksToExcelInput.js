const { readFileSync } = require("fs");
const data = readFileSync(
  "twilight-frost-14198043_production_neondb_2025-07-28_15-47-05.json",
  "utf-8"
);

const marks = JSON.parse(data);
const inputs = marks.map((student) => `${student.AUID}|${student.marks}`);

import { readFileSync, writeFileSync } from "fs";

const studentsText = readFileSync("./students 3.csv", "utf-8");

const students = studentsText
  .split("\n")
  .slice(1)
  .map((studentText) => {
    const [, name, UPI, AUID, ...rest] = studentText
      .replace(/\r/g, "")
      .split(",");
    const email = rest[6];

    if (!name | !UPI | !AUID | !email) return undefined;
    return { name, UPI, AUID, email };
  })
  .filter((student) => student);

console.log({ students });

writeFileSync(
  "../UI/src/lib/server/students 3.json",
  JSON.stringify(students),
  "utf-8"
);

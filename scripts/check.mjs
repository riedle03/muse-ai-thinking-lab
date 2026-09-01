import { ITEMS, scorePick } from "../js/games/calculate.js";
import { typeFromAnswers } from "../js/games/types.js";

let fail = 0;
function ok(name, cond) {
  if (!cond) {
    fail += 1;
    console.error("FAIL", name);
  } else console.log("PASS", name);
}

ok("6 items", ITEMS.length === 6);
ok("calc match", scorePick(ITEMS[1], "계산한다").match === true);
ok("calc split", scorePick(ITEMS[3], "생각하기 때문이다").match === false);
ok("type TCPO", typeFromAnswers(["T", "C", "P", "O"]).name === "자유로운 창작자");
ok("type SWPI", typeFromAnswers(["S", "W", "P", "I"]).id === "SWPI");

if (fail) {
  process.exit(1);
}
console.log("ok", 5 - fail);

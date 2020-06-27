
const QDB = require("../QDB");

const CM = new QDB.Cache();

console.time("foo");

CM.set("foo", 0);
console.log(CM.increment("foo"));

console.timeEnd("foo");

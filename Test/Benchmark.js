
const QDB = require("../QDB");

console.time("foo");

const MyCache = new QDB.Cache({
    0: 235698,
    1: 235897,
    2: 325879,
    3: 573891
});

console.timeEnd("foo");
console.log(MyCache);

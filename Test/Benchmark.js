
const QDB = require("../QDB");

const Con = new QDB.Connection("./Test/Database.json");

// console.time("foo");

Con.Set({
    "foo": {type: "bar"},
    "ree": {type: "roo"}
});

const DS = Con.ToDataStore();
// console.timeEnd("foo");

console.log(DS);

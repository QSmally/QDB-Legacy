
const QDB = require("../QDB");

const MyDataStore = new QDB.DataStore({
    "foo": {name: "Piggyy"},
    "bar": {name: "Dragus"},
    "roo": {name: "Cassie"},
    "boo": {name: "Smally"}
});

MyDataStore.set("loo", {name: "Mochi"});

for (let i = 0; i < 1000; i++) {
    console.time("foo");
    MyDataStore.resolve("boo");
    console.timeEnd("foo");
}

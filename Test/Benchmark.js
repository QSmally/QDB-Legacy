
const QDB = require("../QDB");
const DM  = new QDB.Manager({
    "Foo": {Name: "Foo", Addr: "Bar"},
    "Roo": {Name: "Roo", Addr: "Doo"},
});

console.time("foo");

const Objlike = DM.ToObject();

console.timeEnd("foo");

console.log({
    DM,
    Objlike
});

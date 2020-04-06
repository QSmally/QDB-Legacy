
const QDB = require("../QDB");


// Test: Connection#Exists(Key, Path)

const DB = new QDB.Connection("./Test/Database.json");
DB.Set({
    Smally: [],
    Dragus: [],
    Cassie: []
});

DB.Push({name: "foo"}, "Smally");
DB.Push({name: "bar"}, "Smally");
DB.Push({name: "roo"}, "Smally");

console.log(DB.Exists("Smally", "0"));
console.log(DB.Find("Smally", u => u.name == "roo"));

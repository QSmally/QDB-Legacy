
const QDB = require("../QDB");

// Test: Connection#Find
// ------------------------------- Find

const DB = new QDB.Connection("./Test/Database.json");
DB.Set("foo", "bar");
DB.Set("bar", "roo");
DB.Set("roo", "foo");

console.log( DB.Get() );
// console.log("---------------------");

const Found = DB.Find((Val, Key, Self) => {
    console.log([Val, Key, Self]);

    // return Val == "foo";
    // return Val == "foo" && Key == "roo";
    return Val == "foo" && Key == "foo";
});

// console.log("---------------------");
console.log(Found);

// ------------------------------- Upcoming . . .


const QDB = require("../QDB");

// Test: Connection#Invert

const DB = new QDB.Connection("./Test/Database.json");

DB.Set({
    foo: {
        bar: false,
        roo: true
    },
    roo: true,
    a: {b: {c: "Hello World!"}}
});

console.log( DB.Get() );


DB.Invert("foo.bar"); // true
DB.Invert("foo.roo"); // false
DB.Invert("roo");     // false
DB.Invert("a.b.c");   // null
DB.Invert("bar");     // undefined

console.log( DB.Get() );

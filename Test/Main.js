
const QDB = require("../QDB");
const DB = new QDB.Connection("./Test/Database.json");


// Test: Connection#Invert

DB.Set({
    foo: {
        bar: false,
        roo: true
    },
    roo: true,
    a: {b: {c: "Hello World!"}}
});

// console.log( DB.Get() );


// DB.Invert("foo.bar"); // true
// DB.Invert("foo.roo"); // false
// DB.Invert("roo");     // false
// DB.Invert("a.b.c");   // null
// DB.Invert("bar");     // undefined

// console.log( DB.Get() );


// Test: Connection#Fetch

console.log( DB.Fetch("roo") );
console.log( DB.Fetch("foo", "bar") );
console.log( DB.Fetch("a", "b.c.length") );

console.log( DB.Get("roo") );
console.log( DB.Get("foo", "bar") );
console.log( DB.Get("a", "b.c.length") );

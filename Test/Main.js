
const QDB = require("../QDB");
// const DB = new QDB.Connection("./Test/Database.json");


// Test: Queue

const Q = new QDB.Queue();

console.log( Q.Size );
console.log( Q.Add("Foo") );
console.log( Q.Add("Bar") );
console.log( Q.Add("Foo") );
console.log( Q.Size );

console.log( Q.Next() );
console.log( Q.Next() );
console.log( Q.Next() );

console.log( Q.Next() );
console.log( Q.Next() );
console.log( Q.Next() );

console.log("-----------------");

console.log( Q.Size );
console.log( Q.Add("Foo") );
console.log( Q.Add("Bar") );
console.log( Q.Add("Foo") );
console.log( Q.Size );

console.log("-----------------");

console.log( Q.Add("Roo") );
console.log( Q.Add("A") );
console.log( Q.Add("B") );
console.log( Q.Add("C") );
console.log( Q.Add("D") );
console.log( Q.Size );

console.log("-----------------");

Q.Iterate(QueueVal => {
    console.log(QueueVal);
});

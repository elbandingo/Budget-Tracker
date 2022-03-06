//establish a variable to hold the database connection
var db;

//connect to indexdDB  database, named budgeting-tracker, set to V1
const request = indexedDB.open('budgeting-tracker', 1);

//if version changes, emit it
request.onupgradeneeded = function(e) {

    //save the references to the database
    const db = e.target.result;

    //create table (object store), called new_tx, auto increment
    db.createObjectStore('new_tx', {autoIncrement: true});
};

//on success
request.onsuccess = function(e) {
    //when its connected, save the references to db in the global variable
    db = e.target.result;

    //if statement to determine if we are online, if so, upload new_tx

};

//on error
request.onerror = function (e) {
    console.log(e.target.errorCode);
};

//function for submitting a transaction, but no connection is established (offline)
function saveTransaction(record) {
    //open a new_tx, and give it read and write permission
    const tx = db.transaction(['new_tx'], 'readwrite');
    const budgetTable = tx.objectStore('new_tx');
    //add the record to the budget table
    budgetTable.add(record);
}
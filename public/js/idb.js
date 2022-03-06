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

    if(navigator.onLine) {
        uploadTx();
    }

};

//on error
request.onerror = function (e) {
    console.log(e.target.errorCode);
};

//function for submitting a transaction, but no connection is established (offline)
function saveRecord(record) {
    //open a new_tx, and give it read and write permission
    const tx = db.transaction(['new_tx'], 'readwrite');
    const budgetTable = tx.objectStore('new_tx');
    //add the record to the budget table
    budgetTable.add(record);
}

//function for uploading the transaction once back online

function uploadTx() {
    //open tx on your database
    const tx = db.transaction(['new_tx'], 'readwrite');
    //access the table (object store)
    const budgetTable = tx.objectStore('new_tx');
    //get all the records from the table, and set it to a variable
    const getAllTx = budgetTable.getAll();

    //on success of getting all records
    getAllTx.onsuccess = function() {
        //if there was data, send it to the API server
        if(getAllTx.result.length > 0) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAllTx.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if(serverResponse.message) {
                    throw new Error(serverResponse);
                }

                //open another transactions
                const tx = db.transaction(['new_tx'], 'readwrite');
                 //access the table (object store)
                const budgetTable = tx.objectStore('new_tx');
                //clear the items in the table/store
                budgetTable.clear();
                //alert the user that the offline transactions have been submitted
                alert('All offline transactions have been submitted');
            }).catch(err => {
                console.log(err);
            })
        }
    }
}

//listen for the application to come back online, when it does, run uploadTx function
window.addEventListener('online', uploadTx);
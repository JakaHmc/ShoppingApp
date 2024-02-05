// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyC9lmAi17Y-T0BieVVpe0YVZErGnqH5a5I",
  authDomain: "skladisce-ac677.firebaseapp.com",
  databaseURL: "https://skladisce-ac677-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "skladisce-ac677",
  storageBucket: "skladisce-ac677.appspot.com",
  messagingSenderId: "751112893962",
  appId: "1:751112893962:web:f62851a523fc5bd60c91f3",
  measurementId: "G-QV1LQCXDW1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")


//Non firebase STUFF

const inputFieldEl = document.getElementById('input-field');
const addButtonEl = document.getElementById('add-button');
const shoppingListEl = document.getElementById("shopping-list");

console.log(app)

inputFieldEl.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        addButtonEl.click();
    }
})

addButtonEl.addEventListener("click", function(){
    let inputValue = inputFieldEl.value;
    if (inputValue !== ""){
    push(shoppingListInDB, inputValue);
    clearInputFieldEl()
    }
    // appendItemToShoppingListEl(inputValue)
})

onValue(shoppingListInDB, function(snapshot) {

    if (snapshot.exists()){
        let itemsArray = Object.entries(snapshot.val());
        clearShoppingListEl();
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemValue = currentItem[1];
            let currentItemId = currentItem[0];
            appendItemToShoppingListEl(currentItem);
        }
    } else {
        shoppingListEl.innerHTML = "No items here ... yet"
    }
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}
function clearInputFieldEl () {
    inputFieldEl.value = "";
}

function appendItemToShoppingListEl (item) {
    let newEl = document.createElement("li");

    newEl.textContent = `${item[1]}`;

    shoppingListEl.append(newEl);

    newEl.addEventListener("click", function(){
        let exactLocationOfItemInDB = ref(database, `shoppingList/${item[0]}`);
        remove(exactLocationOfItemInDB);
    })
}

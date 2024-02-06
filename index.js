// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDKOkNjZ0qIGR1HPF4ZNKigSxg_jFXX99s",
    authDomain: "druzinski-nakupovalni-listek.firebaseapp.com",
    databaseURL: "https://druzinski-nakupovalni-listek-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "druzinski-nakupovalni-listek",
    storageBucket: "druzinski-nakupovalni-listek.appspot.com",
    messagingSenderId: "792516960091",
    appId: "1:792516960091:web:0bbe98941ea74ec9fa047e",
    measurementId: "G-4HWPY4R9V8"
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
        shoppingListEl.innerHTML = "Nič ne rabimo!"
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

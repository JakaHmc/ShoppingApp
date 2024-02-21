import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, setDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

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

const db = getFirestore(app);
const shoppingListRef = collection(db, "shoppingList");

//Non firebase STUFF

const inputFieldEl = document.getElementById('input-field');
const addButtonEl = document.getElementById('add-button');
const uncheckedListEl = document.getElementById("unchecked-list");
const checkedListEl = document.getElementById("checked-list");
const removeButtonEl = document.getElementById("remove-button");

inputFieldEl.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
      addButtonEl.click();
    }
  });
  
addButtonEl.addEventListener("click", function(){
let inputValue = inputFieldEl.value;
if (inputValue !== ""){
    addDoc(shoppingListRef, {
    checked: false,
    name: inputValue
    });
    clearInputFieldEl();
}
});

onSnapshot(shoppingListRef, (snapshot) => {
snapshot.docChanges().forEach((change) => {
    const item = change.doc.data();
    const itemId = change.doc.id;
    if (change.type === "added") {
    appendItemToShoppingListEl(item, itemId);
    } else if (change.type === "removed") {
    removeItemFromShoppingListEl(itemId);
    } else if (change.type === "modified") {
    updateItemInShoppingListEl(item, itemId);
    }
});
});


function clearShoppingListEl() {
    uncheckedListEl.innerHTML = "";
    checkedListEl.innerHTML = "";
    }

function clearInputFieldEl () {
    inputFieldEl.value = "";
    }

function appendItemToShoppingListEl(item, itemId) {
    let newEl = document.createElement("li");
    newEl.textContent = item.name;
    newEl.setAttribute('data-item-id', itemId);
    newEl.classList.add('shopping-list-item');

    newEl.addEventListener("click", function(){
        const itemRef = doc(db, "shoppingList", itemId);
        setDoc(itemRef, { ...item, checked: !item.checked });
    });

    if (item.checked) {
        checkedListEl.appendChild(newEl);
        newEl.classList.add('checked');
    } else {
        uncheckedListEl.appendChild(newEl);
    }
}

function removeItemFromShoppingListEl(itemId) {
    const itemToRemove = document.querySelector(`[data-item-id="${itemId}"]`);
    if (itemToRemove) {
        itemToRemove.remove();
    }
}

function updateItemInShoppingListEl(item, itemId) {
    const itemToUpdate = document.querySelector(`[data-item-id="${itemId}"]`);
    if (itemToUpdate) {
        if (item.checked) {
            checkedListEl.appendChild(itemToUpdate);
        } else {
            uncheckedListEl.appendChild(itemToUpdate);
        }
        itemToUpdate.classList.toggle('checked', item.checked);
        const itemRef = doc(db, "shoppingList", itemId);
        setDoc(itemRef, { ...item, checked: item.checked });
    }
}


removeButtonEl.addEventListener("click", async function(){
    const querySnapshot = await getDocs(shoppingListRef);
    querySnapshot.forEach((doc) => {
        const item = doc.data();
        const itemId = doc.id;
        if (item.checked) {
            const docRef = doc.ref; // Get a reference to the document
            deleteDoc(docRef); // Delete the document using its reference
        }
    });
});

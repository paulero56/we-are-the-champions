// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

// Firebase app settings
const appSettings = {
    databaseURL: "https://we-are-the-champions-18fc3-default-rtdb.firebaseio.com/"
}

// Initialize Firebase app and database
const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementsInDB = ref(database, "endorsementList")

// DOM element references
const endorsementInputFieldEl = document.getElementById("endorsement-input")
const endorsementFromInputEl = document.getElementById("from-field")
const endorsementToInputEl = document.getElementById("to-field")
const publishButtonEl = document.getElementById("publish-btn")
const endorsementsListEl = document.getElementById("endorsements")

// Event listener for the publish button
publishButtonEl.addEventListener("click", () => {
    const newEndorsement = getEndorsementInputValues()
    push(endorsementsInDB, newEndorsement)
    clearInputFields()
})

// Retrieve input values
function getEndorsementInputValues() {
    const fromVal = endorsementFromInputEl.value
    const toVal = endorsementToInputEl.value
    const messageVal = endorsementInputFieldEl.value
    
    return {
        from: fromVal,
        to: toVal,
        message: messageVal
    }
}

// Clear input fields
function clearInputFields() {
    endorsementFromInputEl.value = ""
    endorsementToInputEl.value = ""
    endorsementInputFieldEl.value = ""
}

// Clear endorsements list element
function clearEndorsementListEl() {
    endorsementsListEl.innerHTML = ""
}

// Populate endorsements list
function populateEndorsementsList(itemsArray) {
    itemsArray.forEach(item => {
        const articleEl = document.createElement("article")
        const headerEl = document.createElement("header")
        const messageEl = document.createElement("p")
        const footerEl = document.createElement("footer")

        headerEl.textContent = `To ${item.to}`
        messageEl.textContent = item.message
        footerEl.textContent = `From ${item.from}`

        articleEl.appendChild(headerEl)
        articleEl.appendChild(messageEl)
        articleEl.appendChild(footerEl)

        endorsementsListEl.appendChild(articleEl)
    })
}

// Firebase onValue listener
onValue(endorsementsInDB, snapshot => {
    clearEndorsementListEl()

    if (snapshot.exists()) {
        const itemsArray = Object.values(snapshot.val())
        populateEndorsementsList(itemsArray)
    } else {
        endorsementsListEl.innerHTML = "Be the first to cheer another on!"
    }
})

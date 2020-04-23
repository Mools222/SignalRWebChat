"use strict";

let connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();
let connected = false;

connection.start().then(function () {
    connected = true;
    document.getElementById("con").classList.remove('d-none');
    document.getElementById("noCon").classList.add('d-none');
}).catch(function (err) {
    return console.error(err.toString());
});

connection.onclose(error => {
    connected = false;
    document.getElementById("con").classList.add('d-none');
    document.getElementById("noCon").classList.remove('d-none');
});

// ********************************************
// Receiving messages
// ********************************************

connection.on("ReceiveMessage", function (user, message) {
    displayMessage(user, message);
});

let messageDiv = document.getElementById("messageDiv");
let userInput = document.getElementById("userInput");

function displayMessage(user, message) {
    let divOuter = document.createElement("div");

    let nodeUser = document.createTextNode(user);
    divOuter.appendChild(nodeUser);

    let divAlert = document.createElement("div");
    let username = userInput.value;
    if (user === username) {
        divOuter.classList.add("col-11");
        divAlert.classList.add("alert", "alert-secondary", "rounded-pill");
    } else {
        divOuter.classList.add("col-11", "offset-1", "text-right");
        divAlert.classList.add("alert", "alert-primary", "rounded-pill");
    }
        
    let nodeMessage = document.createTextNode(message);
    divAlert.appendChild(nodeMessage);
    divOuter.appendChild(divAlert);

    messageDiv.appendChild(divOuter);
    messageDiv.scrollTop = messageDiv.scrollHeight;
}

// ********************************************
// Sending messages
// ********************************************

document.getElementById("myForm").addEventListener("submit", sendMessage);
let myInput = document.getElementById("myInput");

function sendMessage(event) {
    event.preventDefault();

    let formData = new FormData(this);
    let message = formData.get("msg");
    let user = userInput.value;

    if (connected)
        connection.invoke("SendMessage", user, message).catch(function (err) {
            return console.error(err.toString());
        });

    myInput.value = "";
}
//UI FILE
import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

//PAGE NAVIGATION -> FROM MAIN PAGE TO THE DEPOSITS PAGE

document.getElementById("pay-btn").onclick = function(){
    window.location.href = "payment.html";

}

//FORM BUTTON INTERACTIVITY

const form = document.getElementById("booking-form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
        await addDoc(collection(db, "appointments"), {
            name: "Test Client",
            service: "Hair Appointment",
            date: "2026-07-01",
            time: "10:00",
            depositPaid: false
        });

        console.log("Booking saved!");
        alert("Appointment booked successfully!");
    } catch (error) {
        console.error("Error saving booking:", error);
    }
});



//Firebase testing

async function saveBooking() {
    try {
        await addDoc(collection(db, "appointments"), {
            name: "Test Client",
            service: "Hair Appointment",
            date: "2026-07-01",
            time: "10:00",
            depositPaid: false
        });

        console.log("Booking saved successfully!");
    } catch (error) {
        console.error("Error saving booking:", error);
    }
}


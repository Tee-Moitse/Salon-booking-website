//UI FILE
import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

//PAGE NAVIGATION -> FROM MAIN PAGE TO THE DEPOSITS PAGE

document.getElementById("pay-btn").onclick = function(){
    window.location.href = "payment.html";

}

//FORM BUTTON INTERACTIVITY

console.log("index.js is running");

const form = document.getElementById("booking-form");

if (!form) {
    console.error("Form not found! Check ID = booking-form");
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    console.log("Form submitted successfully!");

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;

    const services = [];

    document.querySelectorAll('input[name="services"]:checked').forEach(service => {
        services.push(service.value);
    });

    try {
        // For it to save to firebase
            const docRef = await addDoc(collection(db, "appointments"), {
                name,
                email,
                phone,
                date,
                time,
                services,
                depositPaid: false,
                status: "pending",
                createdAt: new Date().toISOString()
            });

            console.log("Booking saved with ID:", docRef.id);

            alert("Booking successful!");

            form.reset();

    } catch (error) {
        console.error("Error saving booking:", error);
        alert("Something went wrong. Please try again.");
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


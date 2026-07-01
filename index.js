//UI FILE
import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

//PAGE NAVIGATION -> FROM MAIN PAGE TO THE DEPOSITS PAGE

document.getElementById("pay-btn").onclick = function(){
    window.location.href = "payment.html";

}

//FORM BUTTON INTERACTIVITY

// we will use EmailJS function from main.js (global access)
const form = document.getElementById("booking-form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;

    try {
        // 1. SAVE TO FIREBASE
        const docRef = await addDoc(collection(db, "appointments"), {
            name,
            email,
            phone,
            date,
            time,
            created_at: new Date().toISOString()
        });

        console.log("Saved to Firebase:", docRef.id);

        // 2. SEND EMAIL (from main.js)
        if (window.sendConfirmationEmail) {
            await window.sendConfirmationEmail({
                name,
                email,
                phone,
                appointment_time: new Date(`${date}T${time}:00`).toISOString(),
                bookingId: docRef.id
            });
        }

        alert("Booking successful!");

        form.reset();

    } catch (error) {
        console.error("Booking failed:", error);
        alert("Something went wrong");
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


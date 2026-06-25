const userInput = document.getElementById("username");
const userPassword = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");

function myFunction() {
    const password = document.getElementById("password");

    if (password.type === "password") {
        password.type = "text";
    } else {
        password.type = "password";
    }
}
loginBtn.addEventListener("click", async () => {

const response = await fetch(
    "https://quiz-fullstack-app-8hr6.onrender.com/login",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: userInput.value,
            password: userPassword.value
        })
    }
);
    const data = await response.json();

   if (data.success) {

    document.getElementById("error-message").textContent = "";

  window.location.href = "quiz/index.html";

} else {

    document.getElementById("error-message").textContent =
        "Invalid username or password";

}

}
);
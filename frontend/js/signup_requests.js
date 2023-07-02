const errorContainer = document.querySelector("#error-display");

document.getElementById("submit").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default form submission

    //* Get form data
    const displayName = document.getElementsByName("displayname")[0].value;
    const username = document.getElementsByName("username")[0].value;
    const email = document.getElementsByName("email")[0].value;
    const password = document.getElementsByName("password")[0].value;
    const password2 = document.getElementsByName("password2")[0].value;

    //* Validate password
    if (password !== password2) {
        //* Display an error message if passwords do not match
        errorContainer.innerHTML = "Passwords do not match.";
        return;
    }

    //* Create user object
    const user = {
        displayName,
        username,
        email,
        password,
    };

    //* Send the signup request
    fetch("http://localhost:4000/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        })
        .then(response => {
            if (response.ok) {
                //* Account created successfully
                console.log("Account created successfully.");
                window.location.href = "/activate/";
            } else {
                //* Handle error response
                console.error("Failed to create account.");
                errorContainer.innerHTML = response.error;
            }
        })
        .catch(error => {
            //* Handle network or other errors
            console.error("Error creating account:", error);
            errorContainer.innerHTML = error.message;
        });
});
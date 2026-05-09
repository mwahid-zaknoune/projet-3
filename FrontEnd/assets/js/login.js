const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    // récupération des valeurs
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // objet envoyé à l'API
    const user = {
        email: email,
        password: password
    };

    try {

        const response = await fetch("http://localhost:5678/api/users/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(user)

        });

        // erreur connexion
        if (!response.ok) {

            document.getElementById("error-message").textContent =
                "Erreur dans l’identifiant ou le mot de passe";

            return;
        }

        // récupération token
        const data = await response.json();

        // stockage token
        localStorage.setItem("token", data.token);

        // redirection accueil
        window.location.href = "./index.html";

    }

    catch (error) {

        console.log(error);

    }

});
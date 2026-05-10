console.log("JS chargé !");

let allWorks = [];
let allCategories = [];

// =====================
// WORKS
// =====================

fetch("http://localhost:5678/api/works")

  .then(res => res.json())

  .then(data => {

    allWorks = data;

    displayWorks(data);

  })

  .catch(err => console.log("Erreur works :", err));

// =====================
// CATEGORIES
// =====================

fetch("http://localhost:5678/api/categories")

  .then(res => res.json())

  .then(categories => {

    allCategories = categories;

    createFilters(categories);

  })

  .catch(err => console.log("Erreur categories :", err));

// =====================
// AFFICHAGE GALERIE
// =====================

function displayWorks(works) {

  const gallery = document.getElementById("gallery");

  gallery.innerHTML = "";

  works.forEach(work => {

    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const caption = document.createElement("figcaption");
    caption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(caption);

    gallery.appendChild(figure);

  });

}

// =====================
// FILTRES
// =====================

function createFilters(categories) {

  const filters = document.getElementById("filters");

  // bouton tous

  const allBtn = document.createElement("button");

  allBtn.textContent = "Tous";

  allBtn.classList.add("active");

  allBtn.addEventListener("click", () => {

    displayWorks(allWorks);

    setActive(allBtn);

  });

  filters.appendChild(allBtn);

  // catégories API

  categories.forEach(cat => {

    const btn = document.createElement("button");

    btn.textContent = cat.name;

    btn.addEventListener("click", () => {

      const filtered = allWorks.filter(work => work.categoryId === cat.id);

      displayWorks(filtered);

      setActive(btn);

    });

    filters.appendChild(btn);

  });

}

// =====================
// ACTIVE BUTTON
// =====================

function setActive(btnActive) {

  document.querySelectorAll("#filters button").forEach(btn => {

    btn.classList.remove("active");

  });

  btnActive.classList.add("active");

}

// =====================
// MODE ADMIN
// =====================

function checkAdminMode() {

  const token = localStorage.getItem("token");

  if (token) {

    const body = document.querySelector("body");

    const editBar = document.createElement("div");

    editBar.classList.add("edit-bar");

    editBar.textContent = "Mode édition";

    body.prepend(editBar);

    const loginLink = document.getElementById("login-link");

    loginLink.innerHTML = "logout";

    loginLink.addEventListener("click", () => {

      localStorage.removeItem("token");

      window.location.href = "index.html";

    });

    const filters = document.getElementById("filters");

    filters.style.display = "none";

    const editButton = document.getElementById("edit-button");

    editButton.style.display = "block";

  }

  else {

    const editButton = document.getElementById("edit-button");

    editButton.style.display = "none";

  }

}

checkAdminMode();
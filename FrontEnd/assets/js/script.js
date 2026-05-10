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

  const allBtn = document.createElement("button");
  allBtn.textContent = "Tous";
  allBtn.classList.add("active");

  allBtn.addEventListener("click", () => {
    displayWorks(allWorks);
    setActive(allBtn);
  });

  filters.appendChild(allBtn);

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

  const editButton = document.getElementById("edit-button");

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

    editButton.style.display = "block";
  } else {
    editButton.style.display = "none";
  }
}

checkAdminMode();

// =====================
// MODALE
// =====================

const modal = document.getElementById("modal");
const editButton = document.getElementById("edit-button");
const closeModal = document.getElementById("close-modal");
const backModal = document.getElementById("back-modal");
const addPhotoButton = document.getElementById("add-photo-button");

const modalGalleryView = document.getElementById("modal-gallery-view");
const modalAddView = document.getElementById("modal-add-view");

editButton.addEventListener("click", () => {
  modal.classList.remove("hidden");

  modalGalleryView.classList.remove("hidden");
  modalAddView.classList.add("hidden");
  backModal.classList.add("hidden");

  displayModalGallery(allWorks);
});

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.classList.add("hidden");
  }
});

addPhotoButton.addEventListener("click", () => {
  modalGalleryView.classList.add("hidden");
  modalAddView.classList.remove("hidden");
  backModal.classList.remove("hidden");
});

backModal.addEventListener("click", () => {
  modalAddView.classList.add("hidden");
  modalGalleryView.classList.remove("hidden");
  backModal.classList.add("hidden");
});

function displayModalGallery(works) {
  const modalGallery = document.getElementById("modal-gallery");

  modalGallery.innerHTML = "";

  works.forEach(work => {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    figure.appendChild(img);
    modalGallery.appendChild(figure);
  });
}
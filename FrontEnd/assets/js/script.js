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
    displayCategoriesInForm(categories);
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

    document.getElementById("filters").style.display = "none";

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

// =====================
// GALERIE MODALE + SUPPRESSION
// =====================

function displayModalGallery(works) {

  const modalGallery = document.getElementById("modal-gallery");

  modalGallery.innerHTML = "";

  works.forEach(work => {

    const figure = document.createElement("figure");
    figure.classList.add("modal-work");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-work");
    deleteButton.textContent = "🗑";

    deleteButton.addEventListener("click", () => {
      deleteWork(work.id);
    });

    figure.appendChild(img);
    figure.appendChild(deleteButton);

    modalGallery.appendChild(figure);
  });
}

async function deleteWork(id) {

  const token = localStorage.getItem("token");

  const response = await fetch(`http://localhost:5678/api/works/${id}`, {

    method: "DELETE",

    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (response.ok) {

    allWorks = allWorks.filter(work => work.id !== id);

    displayWorks(allWorks);
    displayModalGallery(allWorks);

  } else {

    console.log("Erreur suppression");
  }
}

// =====================
// AJOUT PHOTO
// =====================

const photoInput = document.getElementById("photo");
const imagePreview = document.getElementById("image-preview");
const categorySelect = document.getElementById("category");
const addPhotoForm = document.getElementById("add-photo-form");

// PREVIEW IMAGE

photoInput.addEventListener("change", () => {

  const file = photoInput.files[0];

  if (file) {

    imagePreview.src = URL.createObjectURL(file);
    imagePreview.classList.remove("hidden");
  }
});

// CATEGORIES DYNAMIQUES

function displayCategoriesInForm(categories) {

  categorySelect.innerHTML = "";

  categories.forEach(category => {

    const option = document.createElement("option");

    option.value = category.id;
    option.textContent = category.name;

    categorySelect.appendChild(option);
  });
}

// ENVOI FORMULAIRE

addPhotoForm.addEventListener("submit", async (event) => {

  event.preventDefault();

  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;
  const image = photoInput.files[0];

  const token = localStorage.getItem("token");

  if (!title || !category || !image) {

    alert("Veuillez remplir tous les champs");
    return;
  }

  const formData = new FormData();

  formData.append("image", image);
  formData.append("title", title);
  formData.append("category", category);

  const response = await fetch("http://localhost:5678/api/works", {

    method: "POST",

    headers: {
      "Authorization": `Bearer ${token}`
    },

    body: formData
  });

  if (response.ok) {

    const newWork = await response.json();

    allWorks.push(newWork);

    displayWorks(allWorks);
    displayModalGallery(allWorks);

    addPhotoForm.reset();

    imagePreview.classList.add("hidden");

    modalAddView.classList.add("hidden");
    modalGalleryView.classList.remove("hidden");
    backModal.classList.add("hidden");

  } else {

    alert("Erreur lors de l’ajout du projet");
  }
});
fetch("http://localhost:5678/api/works")
  .then(res => res.json())
  .then(data => {
    const gallery = document.getElementById("gallery");

    data.forEach(work => {
      const figure = document.createElement("figure");

      figure.innerHTML = `
        <img src="${work.imageUrl}" alt="${work.title}">
        <figcaption>${work.title}</figcaption>
      `;

      gallery.appendChild(figure);
    });
  })
  .catch(err => console.log("Erreur API :", err));
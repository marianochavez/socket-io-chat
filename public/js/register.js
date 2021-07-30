const miFormulario = document.querySelector("form");

const url = window.location.hostname.includes("localhost")
  ? "http://localhost:8000/api/users/"
  : "https://restserver-node21.herokuapp.com/api/users/";

miFormulario.addEventListener("submit", (ev) => {
  ev.preventDefault();
  const formData = {};

  for (let el of miFormulario.elements) {
    if (el.name.length > 0) {
      formData[el.name] = el.value;
    }
  }

  fetch(url, {
    method: "POST",
    body: JSON.stringify(formData),
    headers: { "Content-Type": "application/json" },
  })
    .then((resp) => resp.json())
    .then((formData) => {
      console.log(formData);

      // redireccion hacia el chat
      window.location = "index.html";
    })
    .catch((err) => {
      console.log(err);
    });
});

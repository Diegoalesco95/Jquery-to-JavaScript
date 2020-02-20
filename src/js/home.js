// Ajax en jQuery y JavaScript

/* $.ajax("https://randomuser.me/api/adfs", {
  method: "GET",
  success: function(data) {
    console.log(data);
  },
  error: function(error) {
    console.log(error);
  }
}); */

// XMLHttpRequest
fetch("https://randomuser.me/api/") // Retorna una promesa
  .then(function(response) {
    // console.log(response);
    return response.json();
  })
  .then(function(user) {
    console.log("user", user.results[0].name.first);
  })
  .catch(function() {
    console.log("Algo Falló");
  });

// Funciones Asíncronas

(async function load() {
  // await
  // action
  // drama
  // animation
  async function getData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
  const actionList = await getData(
    "https://yts.mx/api/v2/list_movies.json?genre=action"
  );
  const dramaList = await getData(
    "https://yts.mx/api/v2/list_movies.json?genre=drama"
  );
  const animationList = await getData(
    "https://yts.mx/api/v2/list_movies.json?genre=animation"
  );
  console.log(actionList);
  console.log(dramaList);
  console.log(animationList);
})();

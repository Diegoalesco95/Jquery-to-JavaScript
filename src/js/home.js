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

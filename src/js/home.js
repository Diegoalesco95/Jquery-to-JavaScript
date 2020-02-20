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
  console.log(actionList, dramaList, animationList);

  const $actionContainer = document.querySelector("#action");
  const $dramaContainer = document.getElementById("drama");
  const $animationContainer = document.getElementById("animation");

  function videoItemTemplate(movie) {
    return `<div class="primaryPlaylistItem">
				<div class="primaryPlaylistItem-image">
					<img src="${movie.medium_cover_image}" />
				</div>
				<h4 class="primaryPlaylistItem-title">
					${movie.title}
				</h4>
			</div>`;
  }
  // console.log(videoItemTemplate("src/images/cover/bictoin.jpg", "Bitcoin"));

  actionList.data.movies.forEach(movie => {
    // debugger;
    const HTMLString = videoItemTemplate(movie);
    console.log(HTMLString);
  });

  const $featuringContainer = document.getElementById("feauring");
  const $form = document.getElementById("form");
  const $home = document.getElementById("home");

  const $modal = document.getElementById("modal");
  const $overlay = document.getElementById("overlay");
  const $hideModal = document.getElementById("hide-modal");

  const $modalTitle = $modal.querySelector("h1");
  const $modalImage = $modal.querySelector("img");
  const $modalDescription = $modal.querySelector("p");
})();

/* Selectores
En jQuery
const $home = $(".home .list #item");

En JavaScript
const $home = document.getElementById("modal"); */

/*  Creacion de Templates
En jQuery
	
	'<div class="primaryPlaylistItem">' +
			'<div class="primaryPlaylistItem-image">' +
				'<img src='+imageSRC+' />' +
			'</div>'
			'<h4 class="primaryPlaylistItem-title">'
				'Titulo de la peli'
			'</h4>'
		'</div'

En JS (ver linea 53)
*/

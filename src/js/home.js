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
    // console.log("user", user.results[0].name.first);
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
  const $form = document.getElementById("form");
  const $home = document.getElementById("home");
  const $featuringContainer = document.getElementById("featuring");

  function setAttributes($element, attributes) {
    for (const attribute in attributes) {
      $element.setAttribute(attribute, attributes[attribute]);
    }
  }

  const BASE_API = "https://yts.mx/api/v2/";

  function featuringTemplate(movie) {
    return `
      <div class="featuring">
      <div class="featuring-image">
        <img
          src="${movie.medium_cover_image}"
          width="70"
          height="100"
          alt=""
        />
      </div>
      <div class="featuring-content">
        <p class="featuring-title">Pelicula encontrada</p>
        <p class="featuring-album">${movie.title}</p>
      </div>
    </div>
      `;
  }

  $form.addEventListener("submit", async event => {
    event.preventDefault();
    $home.classList.add("search-active");
    $featuringContainer.style.display = "grid";
    const $loader = document.createElement("img");
    setAttributes($loader, {
      src: "src/images/loader.gif",
      height: 50,
      width: 50
    });
    $featuringContainer.append($loader);

    const data = new FormData($form);
    const {
      data: { movies: pelis }
    } = await getData(
      `${BASE_API}list_movies.json?limit=1&query_term=${data.get("name")}`
    );
    const HTMLString = featuringTemplate(pelis[0]);
    $featuringContainer.innerHTML = HTMLString;
  });

  const {
    data: { movies: actionList }
  } = await getData(`${BASE_API}list_movies.json?genre=action`);
  const {
    data: { movies: dramaList }
  } = await getData(`${BASE_API}list_movies.json?genre=drama`);
  const {
    data: { movies: animationList }
  } = await getData(`${BASE_API}list_movies.json?genre=animation`);
  // console.log(actionList, dramaList, animationList);

  function videoItemTemplate(movie, category) {
    return `<div class="primaryPlaylistItem" data-id="${movie.id}" data-category="${category}">
				<div class="primaryPlaylistItem-image">
					<img src="${movie.medium_cover_image}" />
				</div>
				<h4 class="primaryPlaylistItem-title">
					${movie.title}
				</h4>
			</div>`;
  }

  function creatTeamplate(HTMLString) {
    const html = document.implementation.createHTMLDocument();
    html.body.innerHTML = HTMLString;
    return html.body.children[0];
  }

  function addEventClick($element) {
    $element.addEventListener("click", () => {
      // alert("click");
      showModal($element);
    });
  }

  function renderMovieList(list, $container, category) {
    // actionList.data.movies
    $container.children[0].remove();
    list.forEach(movie => {
      const HTMLString = videoItemTemplate(movie, category);
      const movieElement = creatTeamplate(HTMLString);
      $container.append(movieElement);
      addEventClick(movieElement);
    });
  }

  const $actionContainer = document.querySelector("#action");
  renderMovieList(actionList, $actionContainer, "action");
  const $dramaContainer = document.getElementById("drama");
  renderMovieList(dramaList, $dramaContainer, "drama");
  const $animationContainer = document.getElementById("animation");
  renderMovieList(animationList, $animationContainer, "animation");

  const $modal = document.getElementById("modal");
  const $overlay = document.getElementById("overlay");
  const $hideModal = document.getElementById("hide-modal");

  const $modalTitle = $modal.querySelector("h1");
  const $modalImage = $modal.querySelector("img");
  const $modalDescription = $modal.querySelector("p");

  function findById(list, id) {
    return list.find(movie => movie.id === parseInt(id, 10));
  }

  function findMovie(id, category) {
    switch (category) {
      case "action": {
        return findById(actionList, id);
      }
      case "drama": {
        return findById(dramaList, id);
      }
      default: {
        return findById(animationList, id);
      }
    }
  }

  function showModal($element) {
    $overlay.classList.add("active");
    $modal.style.animation = "modalIn .8s forwards";
    const id = $element.dataset.id;
    const category = $element.dataset.category;
    const data = findMovie(id, category);

    $modalTitle.textContent = data.title;
    $modalImage.setAttribute("src", data.medium_cover_image);
    $modalDescription.textContent = data.description_full;
  }

  $hideModal.addEventListener("click", hideModal);

  function hideModal() {
    $overlay.classList.remove("active");
    $modal.style.animation = "modalOut .8s forwards";
  }
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

En JS (ver linea 49)
*/

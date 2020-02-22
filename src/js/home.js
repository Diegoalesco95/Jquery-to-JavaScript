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
/* fetch("https://randomuser.me/api/") // Retorna una promesa
  .then(function(response) {
    // console.log(response);
    return response.json();
  })
  .then(function(user) {
    // console.log("user", user.results[0].name.first);
  })
  .catch(function() {
    console.log("Algo Falló");
  }); */

// Funciones Asíncronas

(async function load() {
  async function getData(url) {
    const response = await fetch(url);
    const data = await response.json();
    if (data.data.movie_count > 0) {
      return data;
    }
    throw new Error("No se encontró ningun resultado");
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
    try {
      const {
        data: { movies: pelis }
      } = await getData(
        `${BASE_API}list_movies.json?limit=1&query_term=${data.get("name")}`
      );
      const HTMLString = featuringTemplate(pelis[0]);
      $featuringContainer.innerHTML = HTMLString;
    } catch (error) {
      alert(error.message);
      $loader.remove();
      $home.classList.remove("search-active");
    }
  });

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

  // *********************Seccion MyPlaylist+++++++++++++++++++
  $containerMyPlaylist = document.getElementById("myPlaylist");

  function myPlaylistTemplate(url, title) {
    return `<li class="myPlaylist-item">
    <a href= ${url} >
      <span>
        ${title}
      </span>
    </a>
  </li>`;
  }

  let url = `${BASE_API}list_movies.json?sort_by=seeds&limit=9`;

  let getDataMovie = async url => {
    const response = await fetch(url);
    if (response.status != 404) {
      const data = await response.json();
      return data;
    }
    throw new Error("No se pueden traer peliculas");
  };
  async function cacheExistPlayList(name) {
    const cachePlayList = window.localStorage.getItem(`${name}`);
    if (cachePlayList) {
      return JSON.parse(cachePlayList);
    }
    const {
      data: { movies: myPlaylists }
    } = await getDataMovie(url);
    window.localStorage.setItem(`${name}`, JSON.stringify(myPlaylists));
    return myPlaylists;
  }

  try {
    const myPlaylist = await cacheExistPlayList("playlist");
    renderPlayList(myPlaylist, $containerMyPlaylist);
    $containerMyPlaylist.classList.add("fadeIn");
  } catch (error) {
    console.log(error.message);
  }

  function renderPlayList(list, $container) {
    list.forEach(element => {
      const HTMLString = myPlaylistTemplate(element.url, element.title);
      const createElement = creatTeamplate(HTMLString);
      $container.append(createElement);
    });
  }

  // *********************Seccion Friends Playlist+++++++++++++++++++
  const $userContainer = document.getElementById("friends");

  function userTemplate(firstName, lastName, picture) {
    return `<li class="playlistFriends-item">
                  <a href="#">
                  <img src="${picture}" alt="echame la culpa" />
                  <span>
                      ${firstName} ${lastName}
                  </span>
                  </a>
              </li>`;
  }

  async function getDataUsers(url) {
    const response = await fetch(url);
    if (response.status != 404) {
      const data = await response.json();
      return data;
    }
    throw new Error("No se pueden traer usuarios");
  }

  async function cacheFriends(name) {
    const cacheFriends = window.localStorage.getItem(`${name}`);
    if (cacheFriends) {
      return JSON.parse(cacheFriends);
    }
    const { results: userList } = await getDataUsers(
      "https://randomuser.me/api/?results=8"
    );
    window.localStorage.setItem(`${name}`, JSON.stringify(userList));
    return userList;
  }

  try {
    const friends = await cacheFriends("friend");
    renderUserList(friends, $userContainer);
    $userContainer.classList.add("fadeIn");
  } catch (error) {
    console.log(error.message);
  }

  function renderUserList(list, $container) {
    list.forEach(element => {
      const HTMLString = userTemplate(
        element.name.first,
        element.name.last,
        element.picture.thumbnail
      );
      const userElement = creatTeamplate(HTMLString);
      $container.append(userElement);
    });
  }
  // *********************Seccion Movies+++++++++++++++++++

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

  function renderMovieList(list, $container, category) {
    // actionList.data.movies
    $container.children[0].remove();
    list.forEach(movie => {
      const HTMLString = videoItemTemplate(movie, category);
      const movieElement = creatTeamplate(HTMLString);
      $container.append(movieElement);
      const image = movieElement.querySelector("img");
      image.addEventListener("load", () => {
        event.srcElement.classList.add("fadeIn");
      });
      addEventClick(movieElement);
    });
  }

  async function cacheExist(category) {
    const listName = `${category}List`;
    const cacheList = window.localStorage.getItem(listName);
    if (cacheList) {
      return JSON.parse(cacheList);
    }
    const {
      data: { movies: data }
    } = await getData(`${BASE_API}list_movies.json?genre=${category}`);
    window.localStorage.setItem(listName, JSON.stringify(data));
    return data;
  }

  const actionList = await cacheExist("action");
  const $actionContainer = document.querySelector("#action");
  renderMovieList(actionList, $actionContainer, "action");

  const dramaList = await cacheExist("drama");
  const $dramaContainer = document.getElementById("drama");
  renderMovieList(dramaList, $dramaContainer, "drama");

  const animationList = await cacheExist("animation");
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

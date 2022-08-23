const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

// NASA API
const count = 10;
const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;
// const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=W6GxdJkSu4QgKD9ty39rNLEha4CHzmGIopg77peO`;

let resultsArray = [];
let favorites = {};

// Scroll To Top, Remove Loader, Show Content
function showContent(page) {
  window.scrollTo({ top: 0, behavior: 'instant' });
  loader.classList.add('hidden');
  if (page === 'results') {
    resultsNav.classList.remove('hidden');
    favoritesNav.classList.add('hidden');
  } else {
    resultsNav.classList.add('hidden');
    favoritesNav.classList.remove('hidden');
  }
}

function createDOMNodes(page) {
  // Load ResultsArray or Favorites
  const currentArray = page === 'results' ? resultsArray : Object.values(favorites);
//  console.log(currentArray);
  currentArray.forEach((result) => {
    console.log(result)
    // Card Container
    const card = document.createElement('div');
    card.classList.add('card');
    // Link
    const link = document.createElement('a');
    link.href = result.hdurl;
    link.title = 'View Full Image';
    link.target = '_blank';
    // Image
    const image = document.createElement('img');
    image.src = result.url;
    image.alt = 'NASA Picture of the Day';
    image.loading = 'lazy';
    image.classList.add('card-img-top');
    // Card Body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    // Card Title
    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = result.title;
    // Save Text
    const saveText = document.createElement('p');
    saveText.classList.add('clickable');
    if (page === 'results') {
      saveText.textContent = 'Add To Favorites';
      saveText.setAttribute('onclick', `saveFavorite('${result.url}')`);
    } else {
      saveText.textContent = 'Remove Favorite';
      saveText.setAttribute('onclick', `removeFavorite('${result.url}')`);
    }
    // Card Text
    const cardText = document.createElement('p');
    cardText.textContent = result.explanation;
    // Footer Container
    const footer = document.createElement('small');
    footer.classList.add('text-muted');
    // Date
    const date = document.createElement('strong');
    date.textContent = result.date;
    // Copyright
    const copyrightResult = result.copyright === undefined ? '' : result.copyright;
    const copyright = document.createElement('span');
    copyright.textContent = ` ${copyrightResult}`;
    // Append
    footer.append(date, copyright);
    cardBody.append(cardTitle, saveText, cardText, footer);
    link.appendChild(image);
    card.append(link, cardBody);
    imagesContainer.appendChild(card);

    // ----------------------------- Create Element Start -------------------------------

// Yukarıda DOM ağacı oluşturduğumuz gibi bunu aşağıda yaptığım şekilde card divini DOM'Da oluşturup diğerlerini HTML formatında bu divin içine yazdıktan sonra en son insert de edebilirdik aynı şey.

    // const copyrightResult = result.copyright === undefined ? '' : result.copyright;
    
    //  card.innerHTML = `
    //  <a href="${result.hdurl}" title="View Full Image" target = '_blank'> 
    //      <img class="card-img-top" src="${result.url}" alt = "NASA Picture of the Day" loading="lazy" >
    //  </a>
    //  <div class="card-body">
    //    <h5 class="card-title">${result.title}</h5>
    //    <p class="clickable" onclick = "saveFavorite("${result.url}")">Add to Favorites</p>
    //    <p class="clickable" onclick = "removeFavorite("${result.url}")">Remove to Favorites</p>
    //    <p>${ result.explanation} </p>
    //    <small class="text-muted">
    //      <strong>${result.date}</strong>
    //      <span>${copyrightResult}</span>
    //    </small>   
       
    //  </div>
     
    //  `
    //  imagesContainer.insertAdjacentElement("beforeend",card)

     // ----------------------------- Create Element End -------------------------------


  });
}

function updateDOM(page) {
  // Get Favorites from localStorage
  if (localStorage.getItem('nasaFavorites')) {
    favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
  }
  // Reset DOM, Create DOM Nodes, Show Content
  imagesContainer.textContent = '';
  // console.log(imagesContainer);
  createDOMNodes(page);
  showContent(page);
}

// Get 10 images from NASA API
async function getNasaPictures() {
  // Show Loader
  loader.classList.remove('hidden');
  try {
    const response = await fetch(apiUrl);
    if(!response.ok) throw new Error("API'den veriler alınamıyor")
    resultsArray = await response.json();
    console.log(resultsArray);
    updateDOM('results');
  } catch (error) {
    // Catch Error Here
    console.log(error.message);
  
  }
}

// Add result to Favorites
function saveFavorite(itemUrl) {
  // Loop through Results Array to select Favorite
  resultsArray.forEach((item) => {
    if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
      favorites[itemUrl] = item;
      // Show Save Confirmation for 2 seconds
      saveConfirmed.hidden = false ;
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 2000);
      // Set Favorites in localStorage
      localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
    }
  });
}

// Remove item from Favorites
function removeFavorite(itemUrl) {
  if (favorites[itemUrl]) {
    delete favorites[itemUrl];
    // Set Favorites in localStorage
    localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
    updateDOM('favorites');
  }
}

// On Load
getNasaPictures();
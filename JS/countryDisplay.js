"use strict";

const btnShowNeighbours = document.querySelector(".btn-show-neighbours");
const btnStatus = document.querySelector(".btn-status");
const btnErase = document.querySelector(".btn-erase");
const searchCountryForm = document.querySelector(".search-bar");
const searchCountryInput = document.querySelector(".search-input");
const container = document.querySelector(".container");
const neighbourContainer = document.querySelector(".neighbour-container");
const countryContainer = document.querySelector(".country-container");
const body = document.querySelector(".body");
const neighbourWrapper = document.querySelector(".neighbour-wrapper");
const countryDot = document.querySelector(".country-dot");
const neighbourDotCounter = document.querySelector(".neighbour-counter");

///////////////////////////////////////
////////////////////////////////////////////////////////////////////////
/////////////////////// FUNCTIONS ///////////////////////////////

const renderError = function (msg) {
  body.insertAdjacentText("beforeend", msg);
};

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const hideContainer = function () {
  container.style.opacity = 0;
  container.style.display = "none";
};
const showContainer = function () {
  container.style.opacity = 1;
  container.style.display = "flex";
};

const renderCountry = function (data) {
  const html = `
      <article class="country">
      <img class="country__img" src="${data.flag}" />
      <div class="country__data">
        <h3 class="country__name">${data.name}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(
          +data.population / 1000000
        ).toFixed(1)}M people</p>
        <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
        <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
      </div>
    </article>
  `;
  countryContainer.insertAdjacentHTML("afterbegin", html);
  container.style.opacity = 1;
};

const renderNeighbour = function (data) {
  const html = `
      <article class="neighbour">
      <img class="country__img" src="${data.flag}" />
      <div class="country__data">
        <h3 class="country__name">${data.name}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(
          +data.population / 1000000
        ).toFixed(1)}M people</p>
        <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
        <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
      </div>
    </article>
  `;
  neighbourContainer.insertAdjacentHTML("afterbegin", html);
};

const getJSON = function (url, errorMsg = "Something went wrong") {
  return fetch(url).then((response) => {
    if (!response.ok) throw new Error(`${errorMsg} ${response.status}`);
    return response.json();
  });
};

const whereAmI = async function () {
  try {
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;
    const resGeo = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
    if (!resGeo.ok) throw new Error("Problem getting location data");
    const dataGeo = await resGeo.json();
    const res = await fetch(
      `https://restcountries.com/v2/name/${dataGeo.country}`
    );
    if (!res.ok) btnStatus.style.background = "#a91d1d";
    if (!res.ok) btnStatus.textContent = "Error";
    if (res.ok) btnStatus.style.background = "#29a91d";
    if (res.ok) btnStatus.textContent = "Good";
    if (!res.ok) throw new Error("Problem getting country");

    const data = await res.json();

    renderCountry(data[0]);
    const [...border] = data[0].borders;
    if (!border) throw new Error("Neighbouring Country not found");
    neighbourDotCounter.textContent = border.length;
    border.forEach(async (borders) => {
      const res2 = await fetch(`https://restcountries.com/v2/alpha/${borders}`);
      if (!res2.ok) throw new Error("Problem getting neighbour");
      const data2 = await res2.json();

      renderNeighbour(data2);
    });
  } catch (err) {
    console.error(`${err}⛔`);
    // renderError(`${err.message}⛔ Try reloading!`);
  }
};
whereAmI();

const searchCountry = async function (country) {
  try {
    const res = await fetch(`https://restcountries.com/v2/name/${country}`);
    if (!res.ok) throw new Error("Problem getting searched country");
    const data = await res.json();
    renderCountry(data[0]);
    const [...border] = data[0].borders;
    if (!border) throw new Error("Neighbouring Country not found");
    neighbourDotCounter.textContent = border.length;
    border.forEach(async (borders) => {
      const res2 = await fetch(`https://restcountries.com/v2/alpha/${borders}`);
      if (!res2.ok) throw new Error("Problem getting neighbour");
      const data2 = await res2.json();
      renderNeighbour(data2);
    });
  } catch (err) {
    console.error(`${err}⛔`);
    // renderError(`${err.message}⛔ Try reloading!`);
  }
};
////////////////////////////////////////////////////////////////////////
/////////////////////// EVENT LISTENERS ///////////////////////////////
btnShowNeighbours.addEventListener("click", function () {
  neighbourWrapper.style.height = Number.parseInt("48rem", 10);
  neighbourContainer.classList.toggle("show");
});

searchCountryForm.addEventListener("submit", function (e) {
  countryContainer.innerHTML = "";
  neighbourContainer.innerHTML = "";
  showContainer();
  e.preventDefault();
  searchCountry(searchCountryInput.value);
  searchCountryInput.value = "";
});

// btnErase.addEventListener("click", function () {
//   countryContainer.innerHTML = "";
//   neighbourContainer.innerHTML = "";
// });

/*
ATTENTION
1. display error message seperately.
2. neighbours button to display number of neighbours ontop of it.
3. my country button to display green dot at top of it if country is ready and red if not.
4. seperate the code that gets myCountry data so you can always click on it to see current user's country any time.
5. show country after searching then toggle display when country button is clicked.
6. if no neighbour, error message to be displayed in neighbour space.
7. remove previous error message before displaying new one
*/

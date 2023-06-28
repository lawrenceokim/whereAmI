"use strict";

const btnShowNeighbours = document.querySelector(".btn-show-neighbours");
const btnFindMe = document.querySelector(".btn-findMe");
const btnErase = document.querySelector(".btn-erase");
const searchCountryForm = document.querySelector(".search-bar");
const searchCountryInput = document.querySelector(".search-input");
const container = document.querySelector(".container");
const neighbourContainer = document.querySelector(".neighbour-container");
const countryContainer = document.querySelector(".country-container");
const body = document.querySelector(".body");
const neighbourWrapper = document.querySelector(".neighbour-wrapper");

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
hideContainer();

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
    console.log(pos);
    const { latitude: lat, longitude: lng } = pos.coords;
    console.log(lat, lng);
    const resGeo = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
    if (!resGeo.ok) throw new Error("Problem getting location data");
    console.log(resGeo);
    const dataGeo = await resGeo.json();
    console.log(dataGeo);
    const res = await fetch(
      `https://restcountries.com/v2/name/${dataGeo.country}`
    );
    if (!res.ok) throw new Error("Problem getting country");
    console.log(res);
    const data = await res.json();
    console.log(data);

    renderCountry(data[0]);
    countryContainer.classList.toggle("show");
    const [...border] = data[0].borders;
    if (!border) throw new Error("Neighbouring Country not found");
    console.log(border);
    border.forEach(async (borders) => {
      const res2 = await fetch(`https://restcountries.com/v2/alpha/${borders}`);
      if (!res.ok) throw new Error("Problem getting neighbour");
      const data2 = await res2.json();
      console.log(data2);

      renderNeighbour(data2);
    });
  } catch (err) {
    console.error(`${err}⛔`);
    renderError(`${err.message}⛔ Try reloading!`);
  }
};
whereAmI();

const searchCountry = async function (country) {
  try {
    const res = await fetch(`https://restcountries.com/v2/name/${country}`);
    if (!res.ok) throw new Error("Problem getting searched country");
    console.log(res);
    const data = await res.json();
    console.log(data);
    renderCountry(data[0]);
    const [...border] = data[0].borders;
    if (!border) throw new Error("Neighbouring Country not found");
    console.log(border);
    border.forEach(async (borders) => {
      const res2 = await fetch(`https://restcountries.com/v2/alpha/${borders}`);
      if (!res.ok) throw new Error("Problem getting neighbour");
      const data2 = await res2.json();
      console.log(data2);
      renderNeighbour(data2);
    });
  } catch (err) {
    console.error(`${err}⛔`);
    renderError(`${err.message}⛔ Try reloading!`);
  }
};
////////////////////////////////////////////////////////////////////////
/////////////////////// EVENT LISTENERS ///////////////////////////////
btnFindMe.addEventListener("click", function () {
  showContainer();
  countryContainer.classList.toggle("show");
});

btnShowNeighbours.addEventListener("click", function () {
  neighbourWrapper.style.height = Number.parseInt("48rem", 10);
  neighbourContainer.classList.toggle("show");
});

searchCountryForm.addEventListener("submit", function (e) {
  countryContainer.innerHTML = "";
  neighbourContainer.innerHTML = "";
  showContainer();
  e.preventDefault();
  console.log(searchCountryInput.value);
  searchCountry(searchCountryInput.value);
  searchCountryInput.value = "";
});

// btnErase.addEventListener("click", function () {
//   countryContainer.innerHTML = "";
//   neighbourContainer.innerHTML = "";
// });

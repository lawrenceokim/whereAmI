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
const errorMsg = document.querySelector(".error-message");

if (window.screen.width >= 630) {
  ///////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////
  /////////////////////// FUNCTIONS ///////////////////////////////

  const renderError = function (msg) {
    errorMsg.style.display = "flex";
    errorMsg.insertAdjacentText("beforeend", msg);
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

  const displayCountryConditions = function (e) {
    if (e.ok) {
      btnStatus.style.background = "#29a91d";
      btnStatus.textContent = "Success";
      errorMsg.style.display = "none";
      errorMsg.textContent = "";
    } else {
      btnStatus.style.background = "#a91d1d";
      btnStatus.textContent = "Error";
      neighbourDotCounter.textContent = "?";
    }
  };
  const displayNeighbourErrorConditions = function (e) {
    if (
      e.message ===
      "undefined is not iterable (cannot read property Symbol(Symbol.iterator))"
    ) {
      countryContainer.style.paddingLeft = "20%";
      countryContainer.style.paddingRight = "20%";
      countryContainer.style.background = "#f7f7f7";
      neighbourWrapper.style.width = 0;
      errorMsg.innerHTML = "";
    }
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
    countryContainer.style.zIndex = 2;
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

  /*
  // Option of displaying user's country data first after loading
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
      const resGeo = await fetch(
        `https://geocode.xyz/${lat},${lng}?geoit=json`
      );
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
        const res2 = await fetch(
          `https://restcountries.com/v2/alpha/${borders}`
        );
        if (!res2.ok) throw new Error("Problem getting neighbour");
        const data2 = await res2.json();

        renderNeighbour(data2);
      });
    } catch (err) {
      console.error(`${err}⛔`);
      renderError(`${err.message}😰 Try reloading!`);
    }
  };
  whereAmI();
  */

  const searchCountry = async function (country) {
    try {
      const res = await fetch(`https://restcountries.com/v2/name/${country}`);
      displayCountryConditions(res);
      if (!res.ok) throw new Error("Problem getting searched country");
      const data = await res.json();
      renderCountry(data[0]);
      const [...border] = data[0].borders;
      if (!border) throw new Error("Neighbouring Country not found");
      neighbourDotCounter.textContent = border.length;
      if (border) {
        neighbourWrapper.style.width = "100%";
        border.forEach(async (borders) => {
          const res2 = await fetch(
            `https://restcountries.com/v2/alpha/${borders}`
          );
          if (!res2.ok) throw new Error("Problem getting neighbour");
          const data2 = await res2.json();
          renderNeighbour(data2);
        });
      }
    } catch (err) {
      console.error(`${err}`);
      renderError(`${err.message}😰 Try reloading!`);
      displayNeighbourErrorConditions(err);
      if (
        !err.message ===
        "undefined is not iterable (cannot read property Symbol(Symbol.iterator))"
      )
        neighbourWrapper.style.width = "100%";
    }
  };
  ////////////////////////////////////////////////////////////////////////
  /////////////////////// EVENT LISTENERS ///////////////////////////////
  btnShowNeighbours.addEventListener("click", function () {
    neighbourWrapper.classList.toggle("expand");
    container.classList.toggle("gap");
  });

  searchCountryForm.addEventListener("submit", function (e) {
    neighbourDotCounter.textContent = "?";
    countryContainer.innerHTML = "";
    neighbourContainer.innerHTML = "";
    showContainer();
    e.preventDefault();
    searchCountry(searchCountryInput.value);
    searchCountryInput.value = "";
  });
} else {
  body.style.justifyContent = "center";
  body.style.textAlign = "center";
  body.innerHTML = "Sorry, available only on wider screen sizes🥲";
}

ATTENTION;
TODO;
BUG;
/*
1. display error message seperately.✅
2. neighbours button to display number of neighbours ontop of it.✅
3. my country button to display green dot at top of it if country is ready and red if not.✅
4. seperate the code that gets myCountry data so you can always click on it to see current user's country any time.
5. show country after searching then toggle display when country button is clicked.✅
6. if no neighbour, error message to be displayed in info space.
7. remove previous error message before displaying new one✅
8. Display info div on mouseon; showing error message, what the different colours mean.
*/

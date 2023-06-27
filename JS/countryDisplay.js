"use strict";

const btn = document.querySelector(".btn-country");
const container = document.querySelector(".container");
const neighbourContainer = document.querySelector(".neighbour-container");
const countryContainer = document.querySelector(".country-container");

///////////////////////////////////////

const renderError = function (msg) {
  container.insertAdjacentText("beforeend", msg);
  container.style.opacity = 1;
};

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
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

/*
const getCountryData = function (country) {
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v2/name/${country}`);
  request.send();
  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);
    console.log(data);
    renderCountry(data);

    const [...border] = data.borders;
    if (!border) return;

    border.forEach(borders => {
      const request2 = new XMLHttpRequest();
      request2.open('GET', `https://restcountries.com/v2/alpha/${borders}`);
      request2.send();
      request2.addEventListener('load', function () {
        const data2 = JSON.parse(this.responseText);
        console.log(data2);
        renderCountry(data2, 'neighbour');
      });
    });
  });
};

const myLocation = navigator.geolocation.getCurrentPosition(
  function (position) {
    console.log(position);
  },
  function () {
    alert('couldnt get your location');
  }
);

const getCountryData = function (country) {
  getJSON(`https://restcountries.com/v2/name/${country}`, 'country not found')
    .then(data => {
      renderCountry(data[0]);
      console.log(data);
      const neighbour = data[0].borders?.[0];
      if (!neighbour) throw new Error('No neighbour found!');

      return getJSON(
        `https://restcountries.com/v2/alpha/${neighbour}`,
        'country not found'
      );
    })
    .then(data => renderCountry(data, 'neighbour'))
    .catch(err => {
      console.error(`${err}⛔⛔⛔`);
      renderError(
        `Something went wrong. ${err.message}⛔⛔⛔ Try again later!`
      );
    });
};

btn.addEventListener('click', function () {
  getCountryData('ukraine');
});

//coding challenge #1
*/

const whereAmI = async function (country) {
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
    const [...border] = data[0].borders;
    if (!border) throw new Error("Neighbouring Country not found");
    console.log(border);
    border.forEach(async (borders) => {
      const res2 = await fetch(`https://restcountries.com/v2/alpha/${borders}`);
      if (!res.ok) throw new Error("Problem getting neighbour");
      const data2 = await res2.json();
      console.log(data2);
      return renderNeighbour(data2);
    });
  } catch (err) {
    console.error(`${err}⛔`);
    renderError(`${err.message}⛔ Try reloading!`);
  }
};
whereAmI();

Promise.any([
  Promise.resolve("success"),
  Promise.reject("ERROR"),
  Promise.resolve("another success"),
]).then((res) => console.log(res));

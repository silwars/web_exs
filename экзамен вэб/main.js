let apiKey = "ae7f3c8f-5832-4c80-9684-2900e1f4b247";
let apiUrl = "http://exam-2022-1-api.std-900.ist.mospolytech.ru/api/restaurants";
let restaurantsJson;
let prices = [];


async function getRestaurants() {
  let url = new URL(apiUrl);
  url.searchParams.set("api_key", apiKey);
  let response = await fetch(url);

  let json = await response.json();
  restaurantsJson = json;
  return json;
}
async function getSets() {
  let response = await fetch("http://161.97.92.112:30006/api/sets");
  let json = await response.json();
  return json;
}

async function getRestaurantByID(id) {
  let url = new URL(apiUrl + `/${id}`);
  url.searchParams.set('api_key', apiKey);
  let response = await fetch(url);

  let json = await response.json();
  if (!json.error) {
      selectedRestaurant = json;
      return Promise.resolve(json);
  } else {
      return Promise.reject(json.error);
  }
}



function createSetItem(record) {
  let item = document.querySelector(".set-card").cloneNode(true);
  item.classList.remove("d-none");
  item.classList.add("set-item");
  item.querySelector(".set-name").innerHTML = record.Name;
  item.querySelector(".set-description").innerHTML = record.description;
  item.querySelector(".card-image").src = record.img;
  item.querySelector(".btn-pls").onclick = plusBtnHandler;
  item.querySelector(".btn-mns").onclick = minusBtnHandler;

  return item

}

function plusBtnHandler(event) {
  let counter = event.target.closest("div").querySelector("span");
  counter.innerHTML = Number(counter.innerHTML) + 1;
  calculate();
}

function minusBtnHandler(event) {
  let counter = event.target.closest("div").querySelector("span");
  if (Number(counter.innerHTML) - 1 < 0) return;
  counter.innerHTML = Number(counter.innerHTML) - 1;
  calculate();
}

function calculate() {
  let total = 0;
  let counters = document.querySelectorAll(".counter");
  for (let i = 1; i < counters.length; i++) {
      total += Number(counters[i].innerHTML) * Math.floor(prices[i]);
  }

  document.querySelector(".total").innerHTML = total;
  // console.log(total);
}

function clearSets() {
  let items = document.querySelectorAll(".set-item");
  for (let i = 10; i < items.length; i++) {
      items[i].remove();
  }
}

function renderSets(records) {
  let menu = document.querySelector(".menu");
  for (let i = 0; i < records.length; i++) {
      menu.append(createSetItem(records[i]));
  }
}

function enableCheckBoxes() {
  for (let box of document.querySelectorAll(".form-check-input")) {
      box.removeAttribute("disabled", "");
  }
}

function disableCheckBoxes() {
  for (let box of document.querySelectorAll(".form-check-input")) {
      box.setAttribute("disabled", "");
  }
}


function checkMods(){
  calculate();
  let FastDelivery = document.getElementById("fast-delivery");
  let Hots = document.getElementById("hotter");
  let TotalPrice = document.querySelector(".total");
  if (FastDelivery.checked) {TotalPrice.innerHTML*=1.2}
  if (Hots.checked) {TotalPrice.innerHTML*=0.7}
  else if ((FastDelivery.checked && Hots.checked)) calculate();
}



function pagination(newPage) {
  let elems = document.querySelectorAll(".elem");
  for (let i = 0; i < elems.length; i++) {
      elems[i].classList.add("d-none");
  }

  let end = Math.min(((newPage - 1) * 20 + 20), document.querySelectorAll(".elem").length)
  for (let i = (newPage - 1) * 20; i < end; i++) {
      elems[i].classList.remove("d-none");
  }
}



function createRestaurantTableItem(record) {
  let item = document.querySelector("#tr-template").cloneNode(true);
  item.classList.remove("d-none");
  item.querySelector(".restaurant-name").innerHTML = record.name;
  item.querySelector(".restaurant-type").innerHTML = record.typeObject;
  item.querySelector(".restaurant-addr").innerHTML = record.address;
  item.querySelector(".restaurant-id").value = record.id;
  item.querySelector(".select-rest-btn").onclick = selectRestBtnHandler;

  return item;
}



function renderRecords(records) {
  let restaurantTable = document.querySelector("tbody");
  for (let i = 0; i < records.length; i++) {
    restaurantTable.append(createRestaurantTableItem(records[i]));
  }
  getFilter();
}

//фильтр

function filterRecords() {
  let selectedAdm = document.getElementById("area").value;
  let selectedDistrict = document.getElementById("district").value;
  let selectedType = document.getElementById("type").value;
  let selectedDiscount = document.getElementById("discount").value;
  let selected
  let restaurantTable = document.querySelector("tbody");
  while (restaurantTable.children.length > 1) {
    restaurantTable.removeChild(restaurantTable.lastChild);
  }

  for (let i = 0; i < restaurantsJson.length; i++) {
    if (
      (selectedAdm == "Не выбрано" ||
        selectedAdm == restaurantsJson[i].admArea) &&
      (selectedDistrict == "Не выбрано" ||
        selectedDistrict == restaurantsJson[i].district) &&
      (selectedDiscount == "Не выбрано" ||
        selectedDiscount == restaurantsJson[i].socialPrivileges) &&
      (selectedType == "Не выбрано" ||
        selectedType == restaurantsJson[i].typeObject)
    ) {
      restaurantTable.append(createRestaurantTableItem(restaurantsJson[i]));
    }
  }
}

function getFilter() {
  var arrType = [];
  for (let i = 0; i < restaurantsJson.length; i++) {
    arrType.push(restaurantsJson[i].typeObject);
  }
  var unarr = new Set(arrType);

  for (let value of unarr) {
    let qwe = document.createElement("option");
    qwe.innerHTML = value;
    document.querySelector("#type").appendChild(qwe);
  }

  var arrAdm = [];
  for (let i = 0; i < restaurantsJson.length; i++) {
    arrAdm.push(restaurantsJson[i].admArea);
  }
  var unarr = new Set(arrAdm);

  for (let value of unarr) {
    let qwe = document.createElement("option");
    qwe.innerHTML = value;
    document.querySelector("#area").appendChild(qwe);
  }

  var arrDistrict = [];
  for (let i = 0; i < restaurantsJson.length; i++) {
    arrDistrict.push(restaurantsJson[i].district);
  }
  var unarr = new Set(arrDistrict);

  for (let value of unarr) {
    let qwe = document.createElement("option");
    qwe.innerHTML = value;
    document.querySelector("#district").appendChild(qwe);
  }
}

function countplus(event) {
  let qwe = event.target.closest("div");    
  let count = qwe.querySelector('span')
  count.innerHTML++;

}

function countmin(event) {
  let qwe = event.target.closest("div");    
  let count = qwe.querySelector('span')
  if (count.innerHTML>0)
      count.innerHTML--;

}


function setPrice(record) {
  let cards = document.querySelectorAll(".set-card");
  for (let i = 1; i < cards.length; i++) {
      cards[i].querySelector(".price").innerHTML = record["set_" + i];
      prices[i] = record["set_" + i];
  }
  return record;
}

function selectRestBtnHandler(event) {
  enableCheckBoxes();
  let restId = event.target.closest("form").querySelector(".restaurant-id").value;
  getSets()
      .then(renderSets)
      .then(clearSets)
      .then(function () {
          getRestaurantByID(restId)
              .then(setPrice)
              .then(checkMods)
              .then(calculate)  
      });
}

window.onload = function() {
  getRestaurants().then(renderRecords);
  document.querySelector("#find").onclick = filterRecords;
  document.querySelector("#fast-delivery").onclick = checkMods;
  document.querySelector("#hotter").onclick = checkMods;
};

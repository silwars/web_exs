let apiKey = "ae7f3c8f-5832-4c80-9684-2900e1f4b247";
let apiUrl = "http://exam-2022-1-api.std-900.ist.mospolytech.ru/api/restaurants";
let restaurantsJson;

window.onload = function () {
  getRestaurants().then(renderRecords);
  document.querySelector("#find").onclick = filterRecords;
};

async function getRestaurants() {
  let url = new URL(apiUrl);
  url.searchParams.set("api_key", apiKey);
  let response = await fetch(url);

  let json = await response.json();
  restaurantsJson = json;
  return json;
}

function createRestaurantTableItem(record) {
  let item = document.querySelector("#tr-template").cloneNode(true);
  item.classList.remove("d-none");
  item.querySelector(".restaurant-name").innerHTML = record.name;
  item.querySelector(".restaurant-type").innerHTML = record.typeObject;
  item.querySelector(".restaurant-addr").innerHTML = record.address;
  item.querySelector(".restaurant-id").value = record.id;

  return item;
}

function renderRecords(records) {
  let restaurantTable = document.querySelector("tbody");
  for (let i = 0; i < records.length; i++) {
    restaurantTable.append(createRestaurantTableItem(records[i]));
  }
  getFilter();
}



function filterRecords() {
  let selectedAdm = document.getElementById("area").value;
  let selectedDistrict = document.getElementById("district").value;
  let selectedType = document.getElementById("type").value;
  let selectedDiscount = document.getElementById("discount").value;

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
async function getRestaurants() {
  let url = new URL(apiUrl);
  url.searchParams.set('api_key', apiKey);
  let response = await fetch(url);

  let json = await response.json();
  if (!json.error) {
      restaurantsJson = json;
      return Promise.resolve(json);
  } else {
      return Promise.reject(json.error);
  }
}


window.onload = function() {
  getRestaurants().then(renderRecords);
  document.querySelector("#find").onclick = filterRecords;

  for (let btn of document.querySelectorAll(".btn-pls")) {
      btn.onclick = countplus;
  }
  for (let btn of document.querySelectorAll(".btn-mns")) {
      btn.onclick = countmin;
  }

};

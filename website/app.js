const key = "&appid=c63598992b2c50b708e73048c67af5ae";
const units = "&units=imperial";
const baseURL = `https://api.openweathermap.org/data/2.5/weather?zip=`;

const form = document.querySelector("form");
const zip = document.getElementById("zip");
const feelings = document.getElementById("feelings");

let zipText;
let feelingsText;

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + "." + d.getDate() + "." + d.getFullYear();

//on click generate grab text from zip and feelings
form.addEventListener("submit", (e) => {
  e.preventDefault();
  zipText = zip.value;
  feelingsText = feelings.value;
  zip.value = "";
  feelings.value = "";

  getWeather(baseURL, zipText, units, key)
    .then(function (data) {
      postData("/add", {
        temp: data.main.temp,
        desc: data.weather[0].description,
        cityName: data.name,
        windSpeed: data.wind.speed,
        feelings: feelingsText,
        date: newDate,
      });
    })
    .then(() => {
      updateUI();
    });
});

//Gets weather Data from the api
const getWeather = async (baseURL, zip, units, key) => {
  const res = await fetch(baseURL + zip + units + key);
  try {
    const data = await res.json();
    if (data.message) {
      alert("City not found please try another zip code.");
    }
    return data;
  } catch {
    console.log("did this get entered?");
  }
};
//client side post request
const postData = async (url, data) => {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  try {
    const newData = await response.json();
    return newData;
  } catch (error) {
    console.log("error", error);
  }
};

//get request that updates the ui
const updateUI = async () => {
  const request = await fetch("/all");
  try {
    const allData = await request.json();
    const entryContainer = document.querySelector("#entryContainer");
    const count = allData.length - 1;

    const div = document.createElement("div");
    div.id = `entryrHolder${allData.length}`;
    div.className = "entryBox";
    const cityName = document.createElement("h2");
    const date = document.createElement("h3");
    const desc = document.createElement("h4");
    const temp = document.createElement("h4");
    const windSpeed = document.createElement("h4");
    const content = document.createElement("p");

    cityName.innerHTML = allData[count].cityName;
    date.innerHTML = allData[count].date;
    desc.innerHTML = allData[count].desc;
    temp.innerHTML = allData[count].temp;
    windSpeed.innterHTML = allData[count].temp;
    content.innerHTML = allData[count].feelings;

    div.appendChild(cityName);
    div.appendChild(date);
    div.appendChild(desc);
    div.appendChild(temp);
    div.appendChild(windSpeed);
    div.appendChild(content);
    entryContainer.insertAdjacentElement("beforeend", div);
  } catch (error) {
    console.log("error", error);
  }
};

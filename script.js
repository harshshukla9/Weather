 const userTab=document.querySelector("[data-userWeather]");
 const searchTab=document.querySelector("[data-searchWeather]");
 const userContainer=document.querySelector("[weather-container]");
 const grantAccessContainer=document.querySelector(".grant-location-container");
 const searchForm=document.querySelector("[data-searchForm]");
 const userInfoContainer=document.querySelector(".user-info-container");
 const loadingScreen=document.querySelector(".loading-container");


 //intially

 let currentTab=userTab;
 const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
 currentTab.classList.add("current-tab");
 getFromSessionStorage();
 

 //pending 
function switchTab(clickedTab){
    if(clickedTab!=currentTab)
    {
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active"))

        {
            //2 chizo ko hide karo
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");

        }
        else
        {
            //mai pahle serch wale tab pe tha ab our whether visible karna hai
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab mai your weather tab me aa gay ho weather bhi display larna
            //hoga so let check localstorage forst for cordinate
            getFromSessionStorage();

        }
    }



}


 //fn call to change tab
 userTab.addEventListener("click",() => {
    //passsed clicked tab as input paramenter
    switchTab(userTab);
 });

  
 searchTab.addEventListener("click",() => {
    //passsed clicked tab as input paramenter
    switchTab(searchTab);
 });

 //check if cordinates are present in session storage

 function getFromSessionStorage() {
    //jis bhi naam se save karoge wo search kar sakte hai
    const localCoordinate=sessionStorage.getItem("user-coordinate");
    if(!localCoordinate)
    {
        grantAccessContainer.classList.add("active");
    }

    else {
        const coordinate=JSON.parse(localCoordinate);
        fetchUserWeatherInfo(coordinate);

    }

 }

 //api call

  async function fetchUserWeatherInfo(coordinate)
 {
    const {lat,lon}  = coordinate;
    //make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //API

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        const  data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

    }
    catch(e) {

        loadingScreen.classList.remove("active");
        console.log(e);

    }

 }

 function renderWeatherInfo(weatherInfo) {
    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-wheatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windSpeed=document.querySelector("[data-windSpeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");

    //value from weather info put in ui OPTIONAL CHAINING
    cityName.innerHTML = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;

 }

 function getLocation(){
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition)

    }
    else{
        alert("no support");

    }
 }


 function showPosition(position) {
    const userCoordinate = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinate",JSON.stringify(userCoordinate));
    fetchUserWeatherInfo(userCoordinate);
 }

 const grantAccessButton=document.querySelector("[data-grantAccess]");
 grantAccessButton.addEventListener("click",getLocation);

 const searchInput=document.querySelector("[data-searchInput]");
 searchForm.addEventListener("submit",(e) => {
    e.preventDefault();
    if(searchInput.value==="") return;
    fetchSearchWeatherInfo(searchInput.value);

 })

  async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        alert(err);
    }

 }




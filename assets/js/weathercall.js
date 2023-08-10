// Creation Date: 08/05/2023
// Created By: Sajith Aravindan

// Global Variables.
var userFormEl = document.querySelector('#frmUserSearch');
var strCityName = document.querySelector('#txtboxCityName');
var divWeatherContainerMain = document.querySelector('#divWeatherContainerMain');
var divWeatherContainer = document.querySelector('#divWeatherContainer');
var lblSubTitle = document.querySelector('#lblForecast');
var ulListedCities = document.querySelector("#lstHistorybtn"); //list that will hold the history list
var strAPIKey='4c45d1ef90c87229886b6fcd53da56df';

//Function on Startup of Application
function init() {
    //Event Handler for Button Click
    ulListedCities.addEventListener("click", fnDisplayHCitiesFC); //stored Cities- <li> tags used as buttons
    userFormEl.addEventListener('submit', SearchSubmitHandler);// Search Button
    fnStoredCities();//Display Stored cities

    //Empty Pre existing data
    divWeatherContainerMain.textContent = "";
    divWeatherContainer.textContent = "";
}

//Function called on History City Button click
function fnDisplayHCitiesFC(event) {    
    getUserRepos(event.target.getAttribute("data-cityname"));//funtion call to display forecast
}

//Function to Display Stored cities
function fnStoredCities(){
    var arrHistorytData = []; //initialize array
    ulListedCities.innerHTML='';
    if (localStorage.getItem('WeatherForecastCities') != null)//Local storage is not empty
    {
        arrHistorytData = JSON.parse(localStorage.getItem('WeatherForecastCities'));
        for (i = 0; i < arrHistorytData.length; i++) {// creare Li buttons
            var btnCities = document.createElement('li')
            btnCities.textContent = arrHistorytData[i];            
            btnCities.setAttribute("Data-cityname", arrHistorytData[i]);
            btnCities.setAttribute('class','text-capitalize');
            ulListedCities.appendChild(btnCities);
        }
    }
}

//Function to store searched cities to local storage.
function fnStoreCities(UsearchCity) {    
    var arrHistorytData = []; //initialize array
    if (localStorage.getItem('WeatherForecastCities') == null) arrHistorytData.push(UsearchCity);//if null            
    else 
    {//add to begining of Array
        arrHistorytData = JSON.parse(localStorage.getItem('WeatherForecastCities'));
        arrHistorytData.unshift(UsearchCity); 
    }
    localStorage.setItem('WeatherForecastCities', JSON.stringify(arrHistorytData));
    return;
}

//Function called when search button is clicked
var SearchSubmitHandler = function (event) {
    event.preventDefault();
    //Empty existing data
    divWeatherContainerMain.textContent = "";
    divWeatherContainer.textContent = "";

    var strUserSearch = strCityName.value.trim();//get User input
    if (strUserSearch) {
        fnStoreCities(strUserSearch);//store the city
        getUserRepos(strUserSearch);//get weather data
        fnStoredCities();//Display Stored cities        
        strCityName.textContent = '';
    } else {
        alert('Please enter a City Name');
    }
};

//function to get weather data using the Openweather API.
var getUserRepos = function (USearch) {
    //Empty existing data
    divWeatherContainerMain.textContent = "";
    divWeatherContainer.textContent = "";
    //API call
    var urlWeatherAPI = 'https://api.openweathermap.org/data/2.5/forecast?q=' + USearch + '&units=imperial&appid=' + strAPIKey;

    fetch(urlWeatherAPI)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);                    
                    getWeatherData(data);
                });
            } else {
                alert('Error: ' + response.statusText);//if response not OK
            }
        })
        .catch(function (error) {//Exception Handling
            alert('Unable to connect to Weather API');
        });
};

//Function to display Main & 5 Day forcast Weather data of the searched city 
function getWeatherData(objWeatherJson) {
    var txt = "";
    var dtdate = "";//store the date Json obj - helps to compare dates while looping

    //loop through the JSON
    for (i = 0; i < objWeatherJson.list.length; i++) {
        if (dtdate != "") { //second time in loop
            //stored date is compared to date in each loop so that only one per date is picked.
            //This is done because '5 Day Weather Forecast' API return 3 Hours Interval data per day 
            if (dtdate != dayjs('' + objWeatherJson.list[i].dt_txt + '').format('YYYY-MM-DD')) { //Display 5 day Forecast Section
                lblSubTitle.setAttribute('style', 'Display: block;')//Display Sub Title

                var divCardBlock = document.createElement('div');//Card
                divCardBlock.setAttribute('class', 'card text-white mb-3 ml-3');
                divCardBlock.setAttribute('style', 'max-width: 18rem; margin: 5px; background-color: #323D4F');

                var divCardBlockHeader = document.createElement('div');//card Header
                divCardBlockHeader.setAttribute('class', 'card-header');
                divCardBlockHeader.textContent = dayjs('' + objWeatherJson.list[i].dt_txt + '').format('YYYY-MM-DD');

                var divCardBlockBody = document.createElement('div');//card body
                divCardBlockBody.setAttribute('class', 'card-body');
                var imgWeatherIcon = document.createElement('img');//weather icon
                imgWeatherIcon.setAttribute('src', 'http://openweathermap.org/img/wn/' + objWeatherJson.list[i].weather[0].icon + '.png');
                imgWeatherIcon.setAttribute('alt', 'Weather Icon');                
                //weather data - Temp , Wind & Humidity
                var divCardBlockContentTemp = document.createElement('p');
                divCardBlockContentTemp.setAttribute('class', 'card-text');
                divCardBlockContentTemp.textContent = 'Temp: ' + objWeatherJson.list[i].main.temp +' F';
                var divCardBlockContentWind = document.createElement('p');
                divCardBlockContentWind.setAttribute('class', 'card-text');
                divCardBlockContentWind.textContent = 'Wind: ' + objWeatherJson.list[i].wind.speed + ' MPH';
                var divCardBlockContentHumidity = document.createElement('p');
                divCardBlockContentHumidity.setAttribute('class', 'card-text');
                divCardBlockContentHumidity.textContent = 'Humidity: ' + objWeatherJson.list[i].main.humidity;
                //Append all items to card
                divCardBlockBody.append(imgWeatherIcon);
                divCardBlockBody.append(divCardBlockContentTemp);
                divCardBlockBody.append(divCardBlockContentWind);
                divCardBlockBody.append(divCardBlockContentHumidity);
                divCardBlock.append(divCardBlockHeader);
                divCardBlock.append(divCardBlockBody);
                divWeatherContainer.append(divCardBlock);//add card to container
            }
        }
        else {
            //Main Card display
            var divCardBlock = document.createElement('div');//Card
            divCardBlock.setAttribute('class', 'card text-black');
            divCardBlock.setAttribute('style', 'max-width: 92rem; margin: 5px; background-color:#FFFFFF;');

            var divCardBlockHeader = document.createElement('div');//card Header
            divCardBlockHeader.setAttribute('class', 'card-header text-black fw-bold');
            divCardBlockHeader.setAttribute('style', 'background-color: #FFFFFF')
            var hTitle = document.createElement('h2')//header title
            hTitle.textContent = objWeatherJson.city.name + '( ' +
                dayjs('' + objWeatherJson.list[i].dt_txt + '').format('YYYY-MM-DD') + ')';//header date
            var imgWeatherIcon = document.createElement('img');//header weather icon
            imgWeatherIcon.setAttribute('src', 'http://openweathermap.org/img/wn/' + objWeatherJson.list[i].weather[0].icon + '.png');
            imgWeatherIcon.setAttribute('alt', 'Weather Icon');
            //add icon to title
            hTitle.append(imgWeatherIcon);
            divCardBlockHeader.append(hTitle);//add title to header
            //card body
            var divCardBlockBody = document.createElement('div');
            divCardBlockBody.setAttribute('class', 'card-body text-black');
            divCardBlockBody.setAttribute('style', 'background-color: #FFFFFF;')
            //weather data - Temp , Wind & Humidity
            var divCardBlockContentTemp = document.createElement('p');
            divCardBlockContentTemp.setAttribute('class', 'card-text');
            divCardBlockContentTemp.textContent = 'Temp: ' + objWeatherJson.list[i].main.temp +' F';
            var divCardBlockContentWind = document.createElement('p');
            divCardBlockContentWind.setAttribute('class', 'card-text');
            divCardBlockContentWind.textContent = 'Wind: ' + objWeatherJson.list[i].wind.speed + ' MPH';
            var divCardBlockContentHumidity = document.createElement('p');
            divCardBlockContentHumidity.setAttribute('class', 'card-text');
            divCardBlockContentHumidity.textContent = 'Humidity: ' + objWeatherJson.list[i].main.humidity;
            //Append all items to card
            divCardBlockBody.append(divCardBlockContentTemp);
            divCardBlockBody.append(divCardBlockContentWind);
            divCardBlockBody.append(divCardBlockContentHumidity);
            divCardBlock.append(divCardBlockHeader);
            divCardBlock.append(divCardBlockBody);
            divWeatherContainerMain.append(divCardBlock);//add card to container
        }
        dtdate = dayjs('' + objWeatherJson.list[i].dt_txt + '').format('YYYY-MM-DD')
    }
}
init();//Initiate the Application
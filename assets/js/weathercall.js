// Creation Date: 08/05/2023
// Created By: Sajith Aravindan

// Global Variables.
var userFormEl = document.querySelector('#frmUserSearch');
var strCityName = document.querySelector('#txtboxCityName');
var divWeatherContainerMain = document.querySelector('#divWeatherContainerMain');
var divWeatherContainer = document.querySelector('#divWeatherContainer');
var lblForecastTitle = document.querySelector('#lblForecast');
var ulListedCities = document.querySelector("#lstHistorybtn"); //list that will hold the history list

//Function on Startup of Application
function init() {
    //Event Handler for Button Click
    ulListedCities.addEventListener("click", fnDisplayHCitiesFC); //answer <li> tags which are used as buttons
    userFormEl.addEventListener('submit', SearchSubmitHandler);
    fnStoredCities();
    divWeatherContainerMain.textContent = "";
    divWeatherContainer.textContent = "";
}

function fnDisplayHCitiesFC(event) {    
    getUserRepos(event.target.getAttribute("data-cityname"));
}

function fnStoredCities(){
    var arrHistorytData = []; //initialize array
    if (localStorage.getItem('WeatherForecastCities') != null)
    {
        arrHistorytData = JSON.parse(localStorage.getItem('WeatherForecastCities'));
        for (i = 0; i < arrHistorytData.length; i++) {
            var bthCities = document.createElement('li')
            bthCities.textContent = arrHistorytData[i];
            //bthCities.setAttribute('class','btn')
            bthCities.setAttribute("Data-cityname", arrHistorytData[i]);
            ulListedCities.appendChild(bthCities);
        }
    }
}

function fnStoreCities(UsearchCity) {
    //
    var arrHistorytData = []; //initialize array
    if (localStorage.getItem('WeatherForecastCities') == null)
    {
        arrHistorytData.push(UsearchCity); alert(1);
    }         
    else 
    {
        arrHistorytData = JSON.parse(localStorage.getItem('WeatherForecastCities'));
        arrHistorytData.unshift(UsearchCity); alert(2);
    }
    localStorage.setItem('WeatherForecastCities', JSON.stringify(arrHistorytData));
    return;
}

var SearchSubmitHandler = function (event) {
    event.preventDefault();
    divWeatherContainerMain.textContent = "";
    divWeatherContainer.textContent = "";

    var strUserSearch = strCityName.value.trim();
    if (strUserSearch) {
        fnStoreCities(strUserSearch);
        getUserRepos(strUserSearch);        
        strCityName.textContent = '';
    } else {
        alert('Please enter a City Name');
    }
};

var getUserRepos = function (USearch) {
    //
    divWeatherContainerMain.textContent = "";
    divWeatherContainer.textContent = "";
    
    var urlWeatherAPI = 'https://api.openweathermap.org/data/2.5/forecast?q=' + USearch + '&units=imperial&appid=4c45d1ef90c87229886b6fcd53da56df';

    fetch(urlWeatherAPI)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);                    
                    getWeatherData(data);
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to Weather API');
        });
};

function getWeatherData(objWeatherJson) {
    var txt = "";
    var dtdate = "";

    for (i = 0; i < objWeatherJson.list.length; i++) {

        if (dtdate != "") {
            if (dtdate != dayjs('' + objWeatherJson.list[i].dt_txt + '').format('YYYY-MM-DD')) {
                lblForecastTitle.setAttribute('style', 'Display: block;')

                var divCardBlock = document.createElement('div');
                divCardBlock.setAttribute('class', 'card text-white mb-3 ml-3');
                divCardBlock.setAttribute('style', 'max-width: 18rem; margin: 5px; background-color: #323D4F');

                var divCardBlockHeader = document.createElement('div');
                divCardBlockHeader.setAttribute('class', 'card-header');
                divCardBlockHeader.textContent = dayjs('' + objWeatherJson.list[i].dt_txt + '').format('YYYY-MM-DD');

                var divCardBlockBody = document.createElement('div');
                divCardBlockBody.setAttribute('class', 'card-body');

                var imgWeatherIcon = document.createElement('img');
                imgWeatherIcon.setAttribute('src', 'http://openweathermap.org/img/wn/' + objWeatherJson.list[i].weather[0].icon + '.png');
                imgWeatherIcon.setAttribute('alt', 'Weather Icon');

                var divCardBlockContentTemp = document.createElement('p');
                divCardBlockContentTemp.setAttribute('class', 'card-text');
                divCardBlockContentTemp.textContent = 'Temp: ' + objWeatherJson.list[i].main.temp;

                var divCardBlockContentWind = document.createElement('p');
                divCardBlockContentWind.setAttribute('class', 'card-text');
                divCardBlockContentWind.textContent = 'Wind: ' + objWeatherJson.list[i].wind.speed + ' MPH';

                var divCardBlockContentHumidity = document.createElement('p');
                divCardBlockContentHumidity.setAttribute('class', 'card-text');
                divCardBlockContentHumidity.textContent = 'Humidity: ' + objWeatherJson.list[i].main.humidity;

                divCardBlockBody.append(imgWeatherIcon);
                divCardBlockBody.append(divCardBlockContentTemp);
                divCardBlockBody.append(divCardBlockContentWind);
                divCardBlockBody.append(divCardBlockContentHumidity);

                divCardBlock.append(divCardBlockHeader);
                divCardBlock.append(divCardBlockBody);

                divWeatherContainer.append(divCardBlock);
            }
        }
        else {

            var divCardBlock = document.createElement('div');
            divCardBlock.setAttribute('class', 'card text-black');
            divCardBlock.setAttribute('style', 'width: 97%; background-color: #FFFFFF;');

            var divCardBlockHeader = document.createElement('div');
            divCardBlockHeader.setAttribute('class', 'card-header text-black fw-bold');
            divCardBlockHeader.setAttribute('style', 'background-color: #FFFFFF')

            var hTitle = document.createElement('h2')
            hTitle.textContent = objWeatherJson.city.name + '( ' +
                dayjs('' + objWeatherJson.list[i].dt_txt + '').format('YYYY-MM-DD') + ')';

            var imgWeatherIcon = document.createElement('img');
            imgWeatherIcon.setAttribute('src', 'http://openweathermap.org/img/wn/' + objWeatherJson.list[i].weather[0].icon + '.png');
            imgWeatherIcon.setAttribute('alt', 'Weather Icon');

            hTitle.append(imgWeatherIcon);
            divCardBlockHeader.append(hTitle);

            var divCardBlockBody = document.createElement('div');
            divCardBlockBody.setAttribute('class', 'card-body text-black');
            divCardBlockBody.setAttribute('style', 'background-color: #FFFFFF;')

            var divCardBlockContentTemp = document.createElement('p');
            divCardBlockContentTemp.setAttribute('class', 'card-text');
            divCardBlockContentTemp.textContent = 'Temp: ' + objWeatherJson.list[i].main.temp;

            var divCardBlockContentWind = document.createElement('p');
            divCardBlockContentWind.setAttribute('class', 'card-text');
            divCardBlockContentWind.textContent = 'Wind: ' + objWeatherJson.list[i].wind.speed + ' MPH';

            var divCardBlockContentHumidity = document.createElement('p');
            divCardBlockContentHumidity.setAttribute('class', 'card-text');
            divCardBlockContentHumidity.textContent = 'Humidity: ' + objWeatherJson.list[i].main.humidity;

            divCardBlockBody.append(divCardBlockContentTemp);
            divCardBlockBody.append(divCardBlockContentWind);
            divCardBlockBody.append(divCardBlockContentHumidity);

            divCardBlock.append(divCardBlockHeader);
            divCardBlock.append(divCardBlockBody);

            divWeatherContainerMain.append(divCardBlock);
        }



        dtdate = dayjs('' + objWeatherJson.list[i].dt_txt + '').format('YYYY-MM-DD')
    }

}




init();
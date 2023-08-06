var userFormEl = document.querySelector('#frmUserSearch');
var strCityName = document.querySelector('#txtboxCityName');
var divWeatherContainerMain = document.querySelector('#divWeatherContainerMain');
var divWeatherContainer = document.querySelector('#divWeatherContainer');


//

var SearchSubmitHandler = function (event) {
    event.preventDefault();
    var strUserSearch = strCityName.value.trim();
    if (strUserSearch) {
        getUserRepos(strUserSearch);
        strCityName.textContent = '';
    } else {
        alert('Please enter a City Name');
    }
};

var getUserRepos = function (USearch) {
    //
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

        if (dtdate != dayjs('' + objWeatherJson.list[i].dt_txt + '').format('YYYY-MM-DD') || i == 0) {
           
            var divCardBlock = document.createElement('div');
            divCardBlock.setAttribute('class', 'card text-white bg-secondary mb-3 ml-3');

            if (dtdate !="")  divCardBlock.setAttribute('style', 'max-width: 18rem; margin: 5px;');
            else  divCardBlock.setAttribute('style', 'max-width: 58rem; margin: 5px;'); 
           

            var divCardBlockHeader = document.createElement('div');
            divCardBlockHeader.setAttribute('class', 'card-header');
            divCardBlockHeader.textContent = dayjs('' + objWeatherJson.list[i].dt_txt + '').format('YYYY-MM-DD');

            var divCardBlockBody = document.createElement('div');
            divCardBlockBody.setAttribute('class', 'card-body');

            var imgWeatherIcon = document.createElement('img');
            imgWeatherIcon.setAttribute('src', 'http://openweathermap.org/img/wn/' + objWeatherJson.list[i].weather[0].icon + '.png');
            imgWeatherIcon.setAttribute('alt','Weather Icon');
           
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

            if (dtdate !="") divWeatherContainer.append(divCardBlock);
            else divWeatherContainerMain.append(divCardBlock);  

        }
       

        dtdate = dayjs('' + objWeatherJson.list[i].dt_txt + '').format('YYYY-MM-DD')
    }

}


userFormEl.addEventListener('submit', SearchSubmitHandler);
/*=============================*
 * COVID-19 - Coronavirus Page
 *=============================*/

//[1st] Fetch will display dropdown country list and once you select one, it will print down.
const selectElement = document.querySelector('#listCountry');
const countryURL = 'https://disease.sh/v3/covid-19/countries/';

function setMap() { //Get your free API Key from mapbox.com
    mapboxgl.accessToken = `${API_KEY}`;
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-25, 30], // Starting position [lng, lat]
        zoom: 2 // Starting zoom
    });
    return map;
}

window.addEventListener('load', () => {
    setMap(); //Map will function onload

    fetch(countryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //Create a new array and assign data and sort them in an alphabet order
            arrCountry = [data.length];
            data.forEach(element => {
                arrCountry.push(element.country);
            });
            arrCountry.sort(); //Finished new array sort

            arrCountry.forEach(element => {
                // Create new option element
                var countryOption = document.createElement('option');

                // Create text node to add to option element (option)
                countryOption.appendChild(document.createTextNode(element));

                // Set value property of option
                countryOption.value = element;

                // Add option to end of select box (selectElement)
                selectElement.appendChild(countryOption);
            });
        })
        .catch(function (error) {
            console.log(error);
        })
});

//[2nd] Fetch - Data Country, such as cases, active, population etc.
selectElement.addEventListener('change', (event) => {
    let selectedVal = event.target.value;

    fetch(countryURL + selectedVal)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            //Map Settings API from mapbox.com [Start]
            let map = setMap(),
                long = data.countryInfo.long,
                lat = data.countryInfo.lat;

            map.flyTo({
                center: [long, lat],
                bearing: 0,
                essential: true,
                speed: 0.8,
                curve: 1,
                zoom: 4.0
            });

            //Get longitude and latitude from [1st] fetch above
            var marker = new mapboxgl.Marker()
                .setLngLat([long, lat])
                .addTo(map);
            // Adds zoom and rotation controls to the map in top left corner.
            map.addControl(new mapboxgl.NavigationControl());

            //Map Settings API from mapbox.com [End]

            let statistic = `
        <table class="tableStatistic">
        <tr>
            <th>Flag</th>
            <th>Continent</th>
            <th>Country</th>
            <th>Cases</th>
            <th>New Cases</th>
            <th>Recovered</th>
            <th>New Recovered</th>
            <th>Death</th>
            <th>New Death</th>
            <th>Active</th>
            <th>Population</th>
        </tr>
        `;
            //console.log(data); //This'll log full data list for (debug purpose)

            statistic += `
            <tr>
                <td><img class="flag" src="${data.countryInfo.flag}"></td>
                <td>${data.continent.toLocaleString()}</td>
                <td>${data.country}</td>
                <td>${data.cases.toLocaleString()}</td>
                <td class="newCases">${data.todayCases.toLocaleString()}</td>
                <td>${data.recovered.toLocaleString()}</td>
                <td class="newRecovered">${data.todayRecovered.toLocaleString()}</td>
                <td>${data.deaths.toLocaleString()}</td>
                <td class="newDeaths">${data.todayDeaths.toLocaleString()}</td>
                <td>${data.active.toLocaleString()}</td>
                <td class="population">${data.population.toLocaleString()}</td>
            </tr>
        </table>
        `;
            document.querySelector('main').innerHTML = statistic;
        })
        .catch(function (error) {
            console.log(error);
        })
});
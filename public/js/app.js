(async () => {

    if ("serviceWorker" in navigator) {

        // we register our service worker                             						
        const registration = await navigator.serviceWorker.register('./sw.js');

        // when our service worker is updated
        registration.onupdatefound = () => {

            // when our service worker is updated
            registration.installing.onstatechange = function () {
                console.log(`Service worker... ${this.state}`);
            };
        };

    }

})()
.catch(e => console.log(`😳 : ${e}`));



const cardTemplate = (name, price, time) => `
<div class="card">
<div class="row">

    <div class="col s4 img-container">
        <img src="./img/${name}.svg" alt="" srcset="" width="80">
    </div>

    <div class="col s8 card-content">
        <h3>${name}</h3>
        <p><span class="price">${price} €</span></p>
        <p><span class="time">${time}</span></p>
    </div>

</div>
</div>
`;

const getPrices = async (crypto) => {

    const data = await fetch(`https://api.nomics.com/v1/markets/interval?key=03a9cb810b88f55192cf39318b63d95c&currency=${crypto}`);

    if (!data.ok) {
        const errorText = await data.text();
        throw new Error(errorText);
    }
    const json = await data.json();

    return {
        price: Math.round(json[0]['open']),
        time: json[0]['close_timestamp']
    }

};


const cryptos = {
    "BTC": {
        title: "Bitcoin",
        name: "BTC"
    },
    "DASH": {
        title: "Dash",
        name: "DASH"
    },
    "ETH": {
        title: "Ethereum",
        name: "ETH"
    }
};



const displayPrices = async () => {

    for (let key of Object.keys(cryptos)) {

        const {
            price,
            time
            // await is slower but will keep the order 
        } = await getPrices(cryptos[key].name)

        let element = document.createElement('div')
        element.classList.add('card');
        element.innerHTML = cardTemplate(cryptos[key].title, price, time)
        document.querySelector('#cryptos-container').appendChild(element);

    }

};


displayPrices().then(r => {

        performance.mark('price-loaded');
        console.log("price loaded", [...performance.getEntriesByName('price-loaded')][0].startTime);
    })
    .catch(e => console.log(e));





document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelector('.sidenav');
    var instance = M.Sidenav.init(elems);
    
    

});

/*
| --------------------------------------------------------------------------
| Title
| --------------------------------------------------------------------------
|
*/

function injectOfflineBanner() {

    const elem = document.createElement('div');

    elem.style.cssText = `
    position: fixed;
    background-color: #6d6d6d;
    bottom: 0;
    left: 0;
    right: 0;
    height: 46px;
    line-height: 40px;
    text-align: center;
    color: #FFF;
    z-index: 9999999999;
    `;

    elem.id = "offline-banner";

    elem.innerText = "Heads up  : You are offline";

    document.body.appendChild(elem);

}


function removeOfflineBanner() {

    const offlineBanner = document.querySelector("#offline-banner");

    if (offlineBanner !== null) offlineBanner.parentNode.removeChild(offlineBanner);

}



if (!navigator.onLine) injectOfflineBanner();

if (navigator.onLine) removeOfflineBanner();


addEventListener("offline", injectOfflineBanner);


addEventListener("online", removeOfflineBanner);
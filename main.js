

const link = 'http://api.weatherstack.com/current?access_key=f2ac39841dcda4e3f3f0fe0db16fc610';

const root = document.getElementById('root');
const popup = document.getElementById('popup');
const textInput = document.getElementById('text-input');
const form = document.getElementById('form');
const close = document.getElementById('close');

let store = {
  city: 'Irkutsk',
  temperature: 0,
  observationTime: "00:00 AM",
  isDay: "yes",
  descriptions: "",
  properties: {
    humidity: {},
    cloudcover: {},
    windSpeed: {},
    visibility: {},
    pressure: {},
    uvIndex: {},
  }
}

const fetchData = async () => {
  try {
    const query = localStorage.getItem('query') || store.city;
    const result = await fetch(`${link}&query=${query}`);
    const data = await result.json();

    const {
      current: {
        cloudcover,
        temperature,
        pressure,
        humidity,
        observation_time: observationTime,
        uv_index: uvIndex,
        visibility,
        is_day: isDay,
        weather_descriptions: descriptions,
        wind_speed: windSpeed },
      location: {
        name
      }
    } = data;

    store = {
      ...store,
      isDay,
      city: name,
      temperature,
      observationTime,
      descriptions: descriptions[0],
      properties: {
        cloudcover: {
          title: 'Облачность',
          value: `${cloudcover} %`,
          icon: 'cloud .png'
        },
        humidity: {
          title: 'Влажность',
          value: `${humidity} %`,
          icon: 'humidity.png'
        },
        windSpeed: {
          title: 'Скорость ветра',
          value: `${windSpeed} км/ч`,
          icon: 'wind.png'
        },
        visibility: {
          title: 'Видимость',
          value: `${visibility} км`,
          icon: 'visibility.png'
        },
        pressure: {
          title: 'Давление',
          value: `${pressure} мм`,
          icon: 'gauge.png'
        },
        uvIndex: {
          title: 'Индекс УФ',
          value: `${uvIndex} / 100`,
          icon: 'uv-index.png'
        },
      },
    };

    renderComponent();
  } catch (err) {
    console.log(err);
  }
};

const getImage = (descriptions) => {
  const value = descriptions.toLowerCase();
  switch (value) {
    case 'overcast': return 'partly.png';
      break;
    case 'cloud': return 'cloud.png';
      break;
    case 'fog': return 'fog.png';
      break;
    case 'partly': return 'partly.png';
      break;
    case 'sunny': return 'sunny.png';
      break;
    case 'light rain shower': return 'fog.png';
      break;
    case 'light rain, rain': return 'fog.png';
      break;
    default: return 'the.png';
  }
};

const renderProperty = (properties) => {
  return Object.values(properties).map(({ title, value, icon }) => {

    return `<div class="property">
              <div class="property-icon">
                <img src="./images/icons/${icon}" alt="">
              </div>
              <div class="property-info">
                <div class="property-info__value">${value}</div>
                <div class="property-info__description">${title}</div>
              </div>
            </div>`
  })
    .join("");
};

const markup = () => {
  const { city, descriptions, observationTime, temperature, isDay, properties } = store;

  const containerClass = isDay === 'yes' ? 'is-day' : "";

  return `<div class="container ${containerClass}">
            <div class="top">
              <div class="city">
                <div class="city-subtitle">Погода сегодня в</div>
                <div class="city-title" id="city">
                  <span>${city}</span>
                </div>
              </div>
              <div class="city-info">
                <div class="top-left">
                  <img class="icon" src="./images/${getImage(descriptions)}" alt="" />
                  <div class="description">${descriptions}</div>
                </div>
                <div class="top-right">
                  <div class="city-info__subtitle">на ${observationTime}</div>
                  <div class="city-info__title">${temperature}°</div>
                </div>
              </div>
            </div>
            <div id="properties">${renderProperty(properties)}</div>
          </div>`;
};

const togglePopupClass = () => {
  popup.classList.toggle('active');
};

const closePopup = () => {
  popup.classList.remove('active');
}

const renderComponent = () => {
  root.innerHTML = markup();

  const city = document.getElementById('city');
  city.addEventListener('click', togglePopupClass);
};

const handleInput = (e) => {
  store = {
    ...store,
    city: e.target.value,
  };
};

const handleSubmit = (e) => {
  e.preventDefault();
  const value = store.city;

  if (!value) return null;

  localStorage.setItem('query', value);
  fetchData();
  togglePopupClass();
};

form.addEventListener('submit', handleSubmit);
textInput.addEventListener('input', handleInput);
close.addEventListener('click', closePopup);


fetchData();
# Weather App - Developer Guide

## Overview
This weather app is built using vanilla HTML, CSS, and JavaScript, integrating with the WeatherAPI.com service to provide real-time weather information for any location worldwide.

## Features
- 🔍 **Location Search**: Users can search for weather by city name
- 🌡️ **Current Weather**: Displays temperature, condition, and weather icon
- 📊 **Detailed Information**: Shows humidity, wind speed, feels-like temperature, and pressure
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- ⚡ **Real-time Updates**: Fetches live weather data from WeatherAPI.com
- 🎨 **Modern UI**: Clean, professional interface with smooth animations
- ⚠️ **Error Handling**: Graceful handling of network errors and invalid locations

## File Structure
```
weather-app/
├── index.html      # Main HTML structure
├── style.css       # CSS styling and responsive design
└── app.js          # JavaScript functionality and API integration
```

## API Integration
- **Service**: WeatherAPI.com
- **Endpoint**: `https://api.weatherapi.com/v1/current.json`
- **API Key**: `5512f379a12f4291a36175202253006`
- **Parameters**: 
  - `key`: Your API key
  - `q`: Location query (city name)
  - `aqi`: Air quality data (set to 'no')

## Key JavaScript Components

### WeatherApp Class
The main application class that handles all functionality:
- API integration with fetch()
- DOM manipulation
- Event handling
- Error management

### Main Methods
- `searchWeather(location)`: Fetches weather data from API
- `displayWeather(data)`: Updates UI with weather information
- `showLoading()`: Shows loading spinner
- `hideLoading()`: Hides loading spinner
- `showError(message)`: Displays error messages

## Customization Options

### Styling
- Colors can be modified in the CSS `:root` variables
- Font families and sizes can be adjusted
- Layout can be customized using CSS Grid and Flexbox

### API Features
You can extend the app by adding:
- 7-day forecast data
- Hourly forecasts
- Air quality information
- Astronomical data (sunrise/sunset)

### Additional Locations
The app supports various location formats:
- City names: "London", "New York"
- City with country: "London, UK"
- Coordinates: "40.7128,-74.0060"
- ZIP codes: "10001" (US only)

## Error Handling
The app handles various error scenarios:
- Network connectivity issues
- Invalid location names
- API rate limiting
- Server errors

## Browser Compatibility
- Modern browsers supporting ES6+
- Fetch API support required
- CSS Grid and Flexbox support required

## Future Enhancements
Consider adding:
- Geolocation API for automatic location detection
- Local storage for favorite locations
- Weather alerts and notifications
- Multiple unit systems (Imperial/Metric)
- Weather charts and graphs
- Dark/light theme toggle

## API Response Structure
```json
{
  "location": {
    "name": "London",
    "region": "City of London, Greater London",
    "country": "United Kingdom"
  },
  "current": {
    "temp_c": 7.0,
    "condition": {
      "text": "Overcast",
      "icon": "//cdn.weatherapi.com/weather/64x64/day/119.png"
    },
    "humidity": 81,
    "wind_kph": 25.9,
    "feelslike_c": 3.9,
    "pressure_mb": 1016.0
  }
}
```

## Usage Instructions
1. Open the weather app in a web browser
2. Enter a city name in the search field
3. Click "Search" or press Enter
4. View the current weather conditions
5. Search for different locations as needed

The app loads with London weather data by default and is ready to use immediately!

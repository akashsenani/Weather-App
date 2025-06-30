class WeatherApp {
    constructor() {
        this.apiKey = '5512f379a12f4291a36175202253006';
        // Use HTTPS instead of HTTP to avoid CORS issues
        this.apiUrl = 'https://api.weatherapi.com/v1/current.json';
        
        this.elements = {
            locationInput: document.getElementById('locationInput'),
            searchBtn: document.getElementById('searchBtn'),
            loadingIndicator: document.getElementById('loadingIndicator'),
            errorMessage: document.getElementById('errorMessage'),
            errorText: document.getElementById('errorText'),
            weatherDisplay: document.getElementById('weatherDisplay'),
            locationName: document.getElementById('locationName'),
            locationDetails: document.getElementById('locationDetails'),
            weatherIcon: document.getElementById('weatherIcon'),
            temperature: document.getElementById('temperature'),
            weatherCondition: document.getElementById('weatherCondition'),
            feelsLike: document.getElementById('feelsLike'),
            humidity: document.getElementById('humidity'),
            windSpeed: document.getElementById('windSpeed'),
            pressure: document.getElementById('pressure')
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        // Load London as default on page load
        this.searchWeather('London');
    }
    
    bindEvents() {
        // Search button click
        this.elements.searchBtn.addEventListener('click', () => {
            this.handleSearch();
        });
        
        // Enter key press on input
        this.elements.locationInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });
        
        // Clear error message when user starts typing
        this.elements.locationInput.addEventListener('input', () => {
            this.hideError();
        });
    }
    
    handleSearch() {
        const location = this.elements.locationInput.value.trim();
        
        if (!location) {
            this.showError('Please enter a city name');
            return;
        }
        
        this.searchWeather(location);
    }
    
    async searchWeather(location) {
        try {
            this.showLoading();
            this.hideError();
            this.hideWeatherDisplay();
            
            // Add timeout to fetch request
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            const response = await fetch(
                `${this.apiUrl}?key=${this.apiKey}&q=${encodeURIComponent(location)}&aqi=no`,
                {
                    method: 'GET',
                    signal: controller.signal,
                    headers: {
                        'Accept': 'application/json',
                    }
                }
            );
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                
                if (response.status === 400) {
                    throw new Error('Location not found. Please check the spelling and try again.');
                } else if (response.status === 401) {
                    throw new Error('API authentication failed. Please contact support.');
                } else if (response.status === 403) {
                    throw new Error('API access denied. Please contact support.');
                } else if (response.status >= 500) {
                    throw new Error('Weather service is temporarily unavailable. Please try again later.');
                } else {
                    throw new Error(errorData.error?.message || `HTTP ${response.status}: Unable to fetch weather data`);
                }
            }
            
            const data = await response.json();
            
            if (!data || !data.location || !data.current) {
                throw new Error('Invalid weather data received. Please try again.');
            }
            
            this.displayWeatherData(data);
            
        } catch (error) {
            this.handleError(error);
        } finally {
            this.hideLoading();
        }
    }
    
    displayWeatherData(data) {
        try {
            const { location, current } = data;
            
            // Update location information
            this.elements.locationName.textContent = location.name || 'Unknown Location';
            
            // Build location details string
            const locationParts = [];
            if (location.region && location.region !== location.name) {
                locationParts.push(location.region);
            }
            if (location.country) {
                locationParts.push(location.country);
            }
            this.elements.locationDetails.textContent = locationParts.join(', ') || 'Unknown Region';
            
            // Update weather icon - ensure HTTPS protocol
            const iconUrl = current.condition.icon;
            this.elements.weatherIcon.src = iconUrl.startsWith('//') ? `https:${iconUrl}` : iconUrl;
            this.elements.weatherIcon.alt = current.condition.text || 'Weather condition';
            
            // Update temperature and condition
            this.elements.temperature.textContent = `${Math.round(current.temp_c || 0)}°C`;
            this.elements.weatherCondition.textContent = current.condition.text || 'Unknown condition';
            
            // Update weather details with fallback values
            this.elements.feelsLike.textContent = `${Math.round(current.feelslike_c || 0)}°C`;
            this.elements.humidity.textContent = `${current.humidity || 0}%`;
            this.elements.windSpeed.textContent = `${current.wind_kph || 0} km/h`;
            this.elements.pressure.textContent = `${current.pressure_mb || 0} mb`;
            
            // Show weather display
            this.showWeatherDisplay();
            
            // Clear the input field
            this.elements.locationInput.value = '';
            
        } catch (error) {
            console.error('Error displaying weather data:', error);
            this.showError('Error displaying weather information. Please try again.');
        }
    }
    
    showLoading() {
        this.elements.loadingIndicator.classList.remove('hidden');
        this.elements.searchBtn.disabled = true;
        
        // Store original button content
        this.originalButtonContent = this.elements.searchBtn.innerHTML;
        this.elements.searchBtn.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width: 16px; height: 16px; border: 2px solid transparent; border-top: 2px solid currentColor; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                Searching...
            </div>
        `;
    }
    
    hideLoading() {
        this.elements.loadingIndicator.classList.add('hidden');
        this.elements.searchBtn.disabled = false;
        
        // Restore original button content
        this.elements.searchBtn.innerHTML = this.originalButtonContent || `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
            </svg>
            Search
        `;
    }
    
    showError(message) {
        this.elements.errorText.textContent = message;
        this.elements.errorMessage.classList.remove('hidden');
        
        // Auto-hide error after 5 seconds
        setTimeout(() => {
            this.hideError();
        }, 5000);
    }
    
    hideError() {
        this.elements.errorMessage.classList.add('hidden');
    }
    
    showWeatherDisplay() {
        this.elements.weatherDisplay.classList.remove('hidden');
    }
    
    hideWeatherDisplay() {
        this.elements.weatherDisplay.classList.add('hidden');
    }
    
    handleError(error) {
        console.error('Weather App Error:', error);
        
        let errorMessage = 'Something went wrong. Please try again.';
        
        if (error.name === 'AbortError') {
            errorMessage = 'Request timed out. Please check your internet connection and try again.';
        } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
            errorMessage = 'Unable to connect to weather service. Please check your internet connection.';
        } else if (error.message && error.message.length > 0) {
            errorMessage = error.message;
        }
        
        this.showError(errorMessage);
    }
}

// Initialize the weather app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});

// Add some utility functions for better user experience
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optional: Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Focus search input when pressing '/' key
    if (e.key === '/' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        document.getElementById('locationInput').focus();
    }
});

// Add custom CSS for button loading animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
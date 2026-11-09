# Weather App

A responsive weather dashboard that shows current conditions for a searched city or your device location. Built with HTML, CSS, and vanilla JavaScript, with a Vercel serverless API route that keeps the WeatherAPI key out of client-side code.

**Live demo:** [weather-app-one-gamma-74.vercel.app](https://weather-app-one-gamma-74.vercel.app/)

## Features

- Search current weather by city or region
- Get weather for your device location (with browser permission)
- View temperature, feels-like temperature, condition, humidity, wind, pressure, visibility, and cloud cover
- Switch between Celsius and Fahrenheit
- Refresh the current location's weather
- Condition-based backgrounds and responsive glass-inspired interface
- Server-side WeatherAPI requests; the API key is stored as a Vercel environment variable

## Built with

- HTML5
- CSS3
- Vanilla JavaScript
- [WeatherAPI](https://www.weatherapi.com/) current weather endpoint
- [Vercel Functions](https://vercel.com/docs/functions) and Vercel hosting
- [Font Awesome](https://fontawesome.com/) icons

## Project structure

```text
weather-app/
├── api/
│   └── weather.js     # Serverless proxy for WeatherAPI
├── index.html         # App interface
├── script.js          # Search, location, rendering, and unit conversion
├── style.css          # Responsive styles and weather themes
├── .gitignore         # Excludes local environment files and Vercel metadata
└── README.md
```

## Run locally

The app needs the `/api/weather` serverless route, so opening `index.html` directly with a `file://` URL will not load weather data.

1. Install [Node.js](https://nodejs.org/) and the [Vercel CLI](https://vercel.com/docs/cli):

   ```bash
   npm install --global vercel
   ```

2. Clone the repository and enter the project directory:

   ```bash
   git clone https://github.com/bablucodes/weather-app.git
   cd weather-app
   ```

3. Sign in to Vercel and link the local folder to your Vercel project:

   ```bash
   vercel login
   vercel link
   ```

4. Add a WeatherAPI key to the local Vercel development environment. The value is secret; do not commit it:

   ```bash
   vercel env add WEATHERAPI_KEY development
   ```

5. Start the local app:

   ```bash
   vercel dev
   ```

Vercel CLI will print the local URL to open, usually `http://localhost:3000`.

## Deploy

The production site is hosted on Vercel. To deploy from a linked local project:

1. Add `WEATHERAPI_KEY` under your Vercel project's **Settings → Environment Variables**. Select the environments where the app should run.
2. Deploy the production build:

   ```bash
   vercel --prod
   ```

If you connect this GitHub repository to Vercel, you can also enable automatic deployments on pushes.

## Security

- The WeatherAPI key must only be configured as `WEATHERAPI_KEY` in Vercel or the local Vercel environment. Never place it in `script.js`, commit it, or publish it in an issue.
- `.env*` and `.vercel/` are excluded from Git. Check that your secret is not staged before committing.
- A WeatherAPI key that was previously placed in browser JavaScript should be rotated in the WeatherAPI account.
- Browser geolocation requires the user's permission and a secure context (HTTPS, or localhost during development).

## Troubleshooting

| Issue | What to check |
|---|---|
| Weather service is not configured | Add `WEATHERAPI_KEY` to the correct Vercel environment, then redeploy. |
| Location not found | Check the spelling or try a city and country name. |
| Device location does not work | Allow location access in the browser and use HTTPS or localhost. |
| Opening the HTML file shows no weather | Run with `vercel dev`; the app requires its `/api/weather` serverless route. |

## Author

Created by [BabluCodes](https://github.com/bablucodes).

## License

No license has been specified yet. All rights are reserved unless the repository owner adds a license.

const WEATHER_API_URL = 'https://api.weatherapi.com/v1/current.json';

module.exports = async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');

    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).json({ error: 'Method not allowed.' });
    }

    const query = typeof req.query.query === 'string' ? req.query.query.trim() : '';
    if (!query || query.length > 120) {
        return res.status(400).json({ error: 'Enter a location up to 120 characters long.' });
    }

    const apiKey = process.env.WEATHERAPI_KEY;
    if (!apiKey) {
        console.error('WEATHERAPI_KEY is not configured.');
        return res.status(500).json({ error: 'Weather service is not configured yet.' });
    }

    const weatherUrl = new URL(WEATHER_API_URL);
    weatherUrl.search = new URLSearchParams({
        key: apiKey,
        q: query,
        aqi: 'no'
    }).toString();

    let response;
    try {
        response = await fetch(weatherUrl);
    } catch (error) {
        console.error('Weather provider request failed:', error);
        return res.status(502).json({ error: 'Weather provider is unavailable. Try again shortly.' });
    }

    let data;
    try {
        data = await response.json();
    } catch (error) {
        console.error('Weather provider returned an invalid response:', error);
        return res.status(502).json({ error: 'Weather provider returned an invalid response.' });
    }

    if (!response.ok) {
        const message = response.status === 400
            ? 'Location not found. Try another city.'
            : 'Weather provider could not complete the request.';
        return res.status(response.status === 400 ? 404 : 502).json({ error: message });
    }

    return res.status(200).json(data);
};

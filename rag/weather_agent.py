"""
Australian weather agent using Claude function calling.
Fetches live data from the Open-Meteo API (no API key required).
"""

import json
import os

import anthropic
import requests

MODEL = "claude-opus-4-8"

# WMO weather code → human-readable description
WMO_CODES: dict[int, str] = {
    0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Foggy", 48: "Depositing rime fog",
    51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
    61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
    71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow",
    77: "Snow grains",
    80: "Slight showers", 81: "Moderate showers", 82: "Violent showers",
    85: "Slight snow showers", 86: "Heavy snow showers",
    95: "Thunderstorm", 96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
}

WIND_DIRECTION = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
                  "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]

TOOLS: list[dict] = [
    {
        "name": "get_current_weather",
        "description": (
            "Get the current weather conditions for an Australian city. "
            "Call this when the user asks about current weather, temperature, "
            "humidity, wind, or general conditions right now."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "city": {
                    "type": "string",
                    "description": "City name, e.g. Sydney, Melbourne, Brisbane, Perth, Adelaide",
                },
                "state": {
                    "type": "string",
                    "description": "Optional state abbreviation, e.g. NSW, VIC, QLD, WA, SA, TAS, ACT, NT",
                },
            },
            "required": ["city"],
        },
    },
    {
        "name": "get_weather_forecast",
        "description": (
            "Get a multi-day weather forecast for an Australian city. "
            "Call this when the user asks about the forecast, upcoming weather, "
            "or what the weather will be like over the next few days."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "city": {
                    "type": "string",
                    "description": "City name, e.g. Sydney, Melbourne, Brisbane, Perth, Adelaide",
                },
                "days": {
                    "type": "integer",
                    "description": "Number of forecast days (1–7). Defaults to 7.",
                    "minimum": 1,
                    "maximum": 7,
                },
            },
            "required": ["city"],
        },
    },
]

SYSTEM_PROMPT = """You are a friendly and knowledgeable Australian weather assistant. \
You use real-time weather data to answer questions about current conditions and forecasts \
across Australian cities.

Guidelines:
- Always call the appropriate weather tool before answering; never guess weather values.
- Present temperatures in Celsius (°C).
- Use Australian English and be conversational.
- Include practical advice when relevant (e.g. "great day for the beach", \
  "bring an umbrella").
- If a city is not in Australia, politely say you can only help with Australian locations.
"""


# ── Open-Meteo helpers ────────────────────────────────────────────────────────

def _geocode(city: str, state: str | None = None) -> dict | None:
    """Return {lat, lon, name, admin1, timezone} for an Australian city."""
    query = f"{city} {state}".strip() if state else city
    resp = requests.get(
        "https://geocoding-api.open-meteo.com/v1/search",
        params={"name": query, "count": 10, "language": "en", "format": "json"},
        timeout=8,
    )
    resp.raise_for_status()
    results = resp.json().get("results") or []
    # Prefer results in Australia (country_code == "AU")
    au_results = [r for r in results if r.get("country_code") == "AU"]
    if not au_results:
        return None
    return au_results[0]


def _wind_dir(degrees: float) -> str:
    return WIND_DIRECTION[round(degrees / 22.5) % 16]


# ── Tool implementations ──────────────────────────────────────────────────────

def get_current_weather(city: str, state: str | None = None) -> str:
    location = _geocode(city, state)
    if not location:
        return json.dumps({"error": f"Could not find '{city}' in Australia."})

    resp = requests.get(
        "https://api.open-meteo.com/v1/forecast",
        params={
            "latitude": location["latitude"],
            "longitude": location["longitude"],
            "current": ",".join([
                "temperature_2m", "apparent_temperature", "relative_humidity_2m",
                "is_day", "precipitation", "weather_code",
                "wind_speed_10m", "wind_direction_10m", "wind_gusts_10m",
                "surface_pressure", "visibility",
            ]),
            "wind_speed_unit": "kmh",
            "timezone": location.get("timezone", "auto"),
        },
        timeout=8,
    )
    resp.raise_for_status()
    cur = resp.json().get("current", {})
    units = resp.json().get("current_units", {})

    code = cur.get("weather_code", 0)
    return json.dumps({
        "city": location["name"],
        "state": location.get("admin1", ""),
        "condition": WMO_CODES.get(code, "Unknown"),
        "temperature_c": cur.get("temperature_2m"),
        "feels_like_c": cur.get("apparent_temperature"),
        "humidity_pct": cur.get("relative_humidity_2m"),
        "precipitation_mm": cur.get("precipitation"),
        "wind_speed_kmh": cur.get("wind_speed_10m"),
        "wind_direction": _wind_dir(cur.get("wind_direction_10m") or 0),
        "wind_gusts_kmh": cur.get("wind_gusts_10m"),
        "is_day": bool(cur.get("is_day")),
        "time": cur.get("time"),
    })


def get_weather_forecast(city: str, days: int = 7) -> str:
    location = _geocode(city)
    if not location:
        return json.dumps({"error": f"Could not find '{city}' in Australia."})

    days = max(1, min(7, days))
    resp = requests.get(
        "https://api.open-meteo.com/v1/forecast",
        params={
            "latitude": location["latitude"],
            "longitude": location["longitude"],
            "daily": ",".join([
                "weather_code", "temperature_2m_max", "temperature_2m_min",
                "precipitation_sum", "precipitation_probability_max",
                "wind_speed_10m_max", "wind_gusts_10m_max",
            ]),
            "wind_speed_unit": "kmh",
            "timezone": location.get("timezone", "auto"),
            "forecast_days": days,
        },
        timeout=8,
    )
    resp.raise_for_status()
    data = resp.json()
    daily = data.get("daily", {})

    dates = daily.get("time", [])
    forecast = []
    for i, date in enumerate(dates):
        code = (daily.get("weather_code") or [])[i] if i < len(daily.get("weather_code") or []) else 0
        forecast.append({
            "date": date,
            "condition": WMO_CODES.get(code, "Unknown"),
            "max_temp_c": (daily.get("temperature_2m_max") or [])[i] if i < len(daily.get("temperature_2m_max") or []) else None,
            "min_temp_c": (daily.get("temperature_2m_min") or [])[i] if i < len(daily.get("temperature_2m_min") or []) else None,
            "precipitation_mm": (daily.get("precipitation_sum") or [])[i] if i < len(daily.get("precipitation_sum") or []) else None,
            "rain_probability_pct": (daily.get("precipitation_probability_max") or [])[i] if i < len(daily.get("precipitation_probability_max") or []) else None,
            "max_wind_kmh": (daily.get("wind_speed_10m_max") or [])[i] if i < len(daily.get("wind_speed_10m_max") or []) else None,
        })

    return json.dumps({
        "city": location["name"],
        "state": location.get("admin1", ""),
        "forecast_days": len(forecast),
        "forecast": forecast,
    })


# ── Tool dispatcher ───────────────────────────────────────────────────────────

def _dispatch(tool_name: str, tool_input: dict) -> str:
    if tool_name == "get_current_weather":
        return get_current_weather(
            tool_input["city"],
            tool_input.get("state"),
        )
    if tool_name == "get_weather_forecast":
        return get_weather_forecast(
            tool_input["city"],
            tool_input.get("days", 7),
        )
    return json.dumps({"error": f"Unknown tool: {tool_name}"})


# ── Agent ─────────────────────────────────────────────────────────────────────

class WeatherAgent:
    def __init__(self):
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise EnvironmentError("ANTHROPIC_API_KEY not set")
        self._client = anthropic.Anthropic(api_key=api_key)
        self._history: list[dict] = []

    def chat(self, user_message: str) -> str:
        self._history.append({"role": "user", "content": user_message})

        messages = list(self._history)

        # Agentic tool-use loop
        while True:
            response = self._client.messages.create(
                model=MODEL,
                max_tokens=2048,
                thinking={"type": "adaptive"},
                system=SYSTEM_PROMPT,
                tools=TOOLS,
                messages=messages,
            )

            # Collect all content blocks
            messages.append({"role": "assistant", "content": response.content})

            if response.stop_reason == "end_turn":
                # Extract the final text answer
                text_blocks = [b for b in response.content if b.type == "text"]
                reply = text_blocks[-1].text if text_blocks else ""
                self._history = messages
                return reply

            if response.stop_reason == "tool_use":
                tool_results = []
                for block in response.content:
                    if block.type == "tool_use":
                        result = _dispatch(block.name, block.input)
                        tool_results.append({
                            "type": "tool_result",
                            "tool_use_id": block.id,
                            "content": result,
                        })
                messages.append({"role": "user", "content": tool_results})
                continue

            # Unexpected stop reason — bail out
            break

        self._history = messages
        return "Sorry, I couldn't get the weather information right now."

    def reset(self):
        self._history.clear()

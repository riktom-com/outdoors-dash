# outdoors-dash — South Georgia Outdoors Dashboard

**Subdomain:** https://dash.riktom.com  
**Stack:** Pure static HTML/CSS/JS — no backend  
**VPS path:** `/opt/dash/`  
**nginx config:** `/etc/nginx/sites-available/dash.riktom.com`  
**GitHub:** https://github.com/riktom-com/outdoors-dash

## What It Does
Single-screen trip planner for South Georgia outdoors. User picks a location (river, WMA, or lake) and sees:
- **Go/No Go score** (0–100) with contributing factors
- **River conditions** (USGS gauge height + discharge + 3-hr trend)
- **Weather** (NWS 7-day forecast — today's period)
- **Active alerts** (NWS Red Flag Warnings, flood warnings, severe weather)
- **Solunar activity** (real-time major/minor period detection)
- **3-day activity forecast** (dawn/dusk overlap with solunar periods)
- **Leaflet map** (collapsible, OpenStreetMap tiles)
- **Share Trip** (Web Share API or clipboard fallback)
- **Saved locations** (localStorage)

## Data Sources (all client-side, no proxying needed)
| Source | Endpoint | CORS |
|--------|----------|------|
| USGS Water Services | `https://waterservices.usgs.gov/nwis/iv/` | ✅ |
| NWS Points | `https://api.weather.gov/points/{lat},{lon}` | ✅ |
| NWS Forecast | returned URL from points response | ✅ |
| NWS Alerts | `https://api.weather.gov/alerts/active?zone={code}` | ✅ |
| Solunar | computed client-side (same algorithm as deer-radar) | — |
| Map tiles | OpenStreetMap via Leaflet CDN | ✅ |

## Locations (12 presets)
Rivers (with USGS gauge IDs):
- Withlacoochee River — Pinetta Area (02317500)
- Alapaha River — Statenville (02317796)
- Suwannee River — Fargo (02315000)
- Flint River — Newton (02353000)
- Flint River — Bainbridge (02357000)
- Satilla River — Waycross (02229000)

WMAs (weather/alerts/solunar only):
- Grand Bay WMA (Lowndes County)
- Bullard Creek WMA (Appling County)
- Alapaha WMA (Irwin County)

Lakes (weather/alerts/solunar only):
- Banks Lake NWR (Lanier County)
- Reed Bingham State Park (Cook County)
- Lake Seminole (Seminole County)

## Go/No Go Algorithm
Base: 70

| Condition | Impact |
|-----------|--------|
| River normal | +10 |
| River action stage | −15 |
| River flood stage | −40 |
| No active alerts | +5 |
| Red Flag Warning | −20 |
| Flash Flood Warning | −30 |
| Severe Thunderstorm Warning | −35 |
| Tornado Warning | −60 |
| Low wind (<15 mph) | — |
| High wind (>25 mph) | −10 |
| Rain likely (>70%) | −20 |
| Clear skies (<15% precip) | +5 |
| Solunar: Excellent | +20 |
| Solunar: Good | +10 |
| Solunar: Poor | −5 |

Score labels: 82+ = GO, 66–81 = GOOD, 50–65 = FAIR, 35–49 = CAUTION, <35 = NO GO

## Deploy
```bash
rsync -az --delete -e "ssh -i ~/.ssh/riktom_vps" /tmp/dash/ root@72.62.83.12:/opt/dash/
```

## nginx Config
```nginx
server {
    listen 80;
    server_name dash.riktom.com;
    return 301 https://$host$request_uri;
}
server {
    listen 443 ssl;
    server_name dash.riktom.com;
    ssl_certificate     /etc/letsencrypt/live/dash.riktom.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dash.riktom.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    root /opt/dash;
    index index.html;
    location / { try_files $uri $uri/ =404; }
}
```

## Future Enhancements
- Push notifications for river flood stage changes and Red Flag Warnings (requires service worker + backend notification server)
- Fire hotspot overlay on map (requires CORS proxy to fire.riktom.com API)
- Custom location input (GPS or address geocoding)
- Weekly email digest of conditions for saved locations
- AirNow smoke/AQI integration (requires free API key)


## Standardized Nav (rk-nav)

This app uses the shared riktom.com nav block (scoped `.rk-*` classes, self-contained CSS) that is identical across all 11 riktom.com properties. The block is enclosed by marker comments:

```
<!-- rk-nav:start -->
... nav HTML + scoped style ...
<!-- rk-nav:end -->
```

**To update the nav site-wide** (add a new app, change a link, restyle):
1. Edit `/tmp/patch_navs.py` on the VPS (or `/tmp/sync/patch_local.py` for local repos) with the new HTML.
2. Re-run the patcher — it finds the markers and replaces the block in place. The replace is idempotent.
3. For repos with React/Vite builds (e.g. fire-watcher), re-patch after rebuild since `dist/index.html` is regenerated.

Nav contents: Logo · About · Blog · Apps ▾ (11 apps) · 💡 Suggest · 🏠 Home (top-right white pill).

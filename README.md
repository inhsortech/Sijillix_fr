# DocuTrack Saudi

## Run with Docker

Requirements: Docker with the Compose plugin.

The frontend is built as a static Vite bundle and served by Nginx. Set `VITE_API_URL` to the API URL that users' browsers can reach; Vite embeds this value during the image build, so changing it requires rebuilding the image.

In PowerShell:

```powershell
$env:VITE_API_URL = "https://your-api.example.com"
docker compose up --build -d
```

Then open http://localhost:8080. To check container status and logs, run `docker compose ps` and `docker compose logs -f frontend`. Stop the app with `docker compose down`.

For an API running on the same development machine, set `VITE_API_URL` to an address reachable from the browser, such as `http://localhost:8000`. Do not use a Docker-only service name as the API URL: API requests are made by the browser, not by the frontend container.
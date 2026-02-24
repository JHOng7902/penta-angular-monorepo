# Penta Angular Monorepo

This repo hosts a shared, publishable UI library used by multiple apps inside the same monorepo.

## Requirements

- Node >= 20.19.0 (see `.nvmrc`)

## Quick Start

Install dependencies:

```sh
npm install
```

Run the demo app:

```sh
npx nx serve host
```

Open `http://localhost:4200`.

## Use the shared UI library

Import components from `@penta/shared-ui`:

```ts
import { Button, InputComponent, Table } from '@penta/shared-ui';
```

Example usage:

```html
<pt-ui-button buttonText="Save" (pressed)="onSave()"></pt-ui-button>
<pt-ui-input label="Email" type="email" [(value)]="email"></pt-ui-input>
<pt-ui-table [data]="rows" [displayPaginator]="true"></pt-ui-table>
```

Component prefix: `pt-ui-` (e.g. `<pt-ui-button>`).

## Add a new app (consumer project)

Create new apps inside `apps/`. Example:

```sh
npx nx g @nx/angular:app my-app
```

Then import shared components from `@penta/shared-ui` in that app.

## Available shared components

- `Button`
- `InputComponent`
- `Table`
- `Card`
- `SectionTitle`

## Common features

### Button
- Variants: `primary`, `outline`, `ghost`
- Sizes: `sm`, `md`, `lg`, `xl`, `xxl`
- Content modes: `text`, `icon`, `text-icon`
- Colors: `primary`, `accent`, `warn`, `success`, `info`, `neutral`, `danger`, `fail`
- Tooltip, blink, disabled, and click events

### Input
- Types: `text`, `email`, `password`, `number`, `tel`, `url`, `search`, `date`, `datetime-local`, `time`
- Label positions: `top`, `left`, `hidden`
- Required indicator, min/max length
- Clear button, optional password preview
- Leading icon (Material icon name or text fallback)
- Two-way binding: `[(value)]`

### Table
- Auto or custom columns
- Selection checkboxes
- Row actions (view/edit/delete)
- Status badges and date formatting
- Sorting, index column, sticky header
- Optional paginator and header tools slot

## Build the shared library

```sh
npx nx build shared-ui
```

## Add a new shared component

```sh
npx nx g @nx/angular:component shared-ui/src/lib/your-component --standalone --style=scss --export --prefix=pt-ui
```

## Deploy `host` with Docker + Nginx

This repo includes:

- `Dockerfile` (multi-stage build: Nx production build -> Nginx runtime)
- `nginx.conf` (SPA fallback + caching rules)
- `docker-compose.yml` (runs `host` on port `8080`)

### Prerequisites

- Docker Desktop running

### Build and run

```sh
docker compose up -d --build
```

Open:

- App: `http://localhost:8080`
- Health check: `http://localhost:8080/nginx-health`

### Share on same LAN (Option 1)

`localhost` only works on your own machine. To share with others on the same network:

1. Find your IPv4 address:

```sh
ipconfig
```

2. Share this URL format:

```text
http://<your-ipv4>:8080
```

Example:

```text
http://172.16.32.255:8080
```

3. Allow inbound port `8080` in Windows Firewall (run PowerShell as Administrator):

```powershell
netsh advfirewall firewall add rule name="Penta Host 8080" dir=in action=allow protocol=TCP localport=8080 profile=domain
```

### Useful commands

```sh
# View logs
docker compose logs -f host

# Stop and remove container/network
docker compose down

# Rebuild clean (remove local compose image)
docker compose down --rmi local --remove-orphans
docker compose up -d --build
```



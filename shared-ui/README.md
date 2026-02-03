# shared-ui

Publishable UI components for the Penta Angular monorepo.

## Install and use

```ts
import { Button, InputComponent, Table } from '@penta/shared-ui';
```

```html
<pt-ui-button buttonText="Save"></pt-ui-button>
<pt-ui-input label="Email" type="email" [(value)]="email"></pt-ui-input>
<pt-ui-table [data]="rows"></pt-ui-table>
```

Component prefix: `pt-ui-` (e.g. `<pt-ui-input>`).

## Components

- Button
- InputComponent
- Table
- Card
- SectionTitle

## Use in a new app

Create your new app under `apps/` and import from `@penta/shared-ui`:

```sh
npx nx g @nx/angular:app my-app
```

```ts
import { Button, InputComponent, Table } from '@penta/shared-ui';
```

## Build

```sh
npx nx build shared-ui
```


import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Button, InputComponent } from '@penta/shared-ui';

@Component({
  selector: 'app-button-page',
  standalone: true,
  imports: [CommonModule, Button, InputComponent],
  templateUrl: './button-page.html',
  styleUrl: './button-page.scss',
})
export class ButtonPage {
  disableName = '';
  customizeCodeSample = `<div class="button-page__custom-theme">
  <pt-ui-button buttonText="Brand Action" content="text-icon" icon="auto_awesome"></pt-ui-button>
  <pt-ui-button buttonText="Secondary" variant="outline"></pt-ui-button>
  <pt-ui-button buttonText="Ghost" variant="ghost"></pt-ui-button>
</div>

/* app/page styles (use ::ng-deep or global styles) */
:host ::ng-deep .button-page__custom-theme .pt-ui-button {
  --pt-ui-tone: #f97316;
  --pt-ui-tone-contrast: #fff7ed;
  --pt-ui-tone-soft: rgba(249, 115, 22, 0.28);
  border-radius: 14px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  box-shadow: 0 10px 20px rgba(249, 115, 22, 0.25);
}

 :host ::ng-deep .button-page__custom-theme .pt-ui-button.variant-outline {
  border-width: 2px;
  border-style: dashed;
}

 :host ::ng-deep .button-page__custom-theme .pt-ui-button.variant-ghost {
  text-decoration: underline;
  text-underline-offset: 4px;
}`;

  customizeCodeSampleAlt = `<div class="button-page__custom-theme-alt">
  <pt-ui-button buttonText="Night Action" content="text-icon" icon="nightlight"></pt-ui-button>
  <pt-ui-button buttonText="Outline" variant="outline"></pt-ui-button>
  <pt-ui-button buttonText="Ghost" variant="ghost"></pt-ui-button>
</div>

/* app/page styles (use ::ng-deep or global styles) */
:host ::ng-deep .button-page__custom-theme-alt .pt-ui-button {
  --pt-ui-tone: #0f172a;
  --pt-ui-tone-contrast: #e2e8f0;
  --pt-ui-tone-soft: rgba(15, 23, 42, 0.28);
  border-radius: 8px;
  font-weight: 600;
  letter-spacing: 0.02em;
  box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.35);
}

:host ::ng-deep .button-page__custom-theme-alt .pt-ui-button.variant-outline {
  border-width: 1px;
  border-style: solid;
  border-color: rgba(15, 23, 42, 0.4);
}

:host ::ng-deep .button-page__custom-theme-alt .pt-ui-button.variant-ghost {
  color: #0f172a;
  text-decoration: none;
}`;
}

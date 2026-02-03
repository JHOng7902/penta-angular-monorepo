import { Component, Input } from '@angular/core';

@Component({
  selector: 'pt-ui-section-title',
  standalone: true,
  imports: [],
  templateUrl: './section-title.html',
  styleUrl: './section-title.scss',
})
export class SectionTitle {
  @Input() title = '';
  @Input() subtitle = '';

  get hasTitle(): boolean {
    return this.title.trim().length > 0;
  }

  get hasSubtitle(): boolean {
    return this.subtitle.trim().length > 0;
  }
}


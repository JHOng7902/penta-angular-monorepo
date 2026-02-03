import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'pt-ui-card',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {}


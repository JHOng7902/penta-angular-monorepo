import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Button, Card, SectionTitle } from '@penta/shared-ui';

@Component({
  selector: 'app-shared-ui-demo',
  standalone: true,
  imports: [CommonModule, Button, Card, SectionTitle],
  templateUrl: './shared-ui-demo.html',
  styleUrl: './shared-ui-demo.scss',
})
export class SharedUiDemo {
  text = '';

  displayText(mouseEvent: MouseEvent):void{
    console.log(mouseEvent);
    this.text = 'Hello Click';
  }
}

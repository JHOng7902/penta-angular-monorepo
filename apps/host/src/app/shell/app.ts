import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeader } from '../core/header/app-header';
import { SideNav } from '../core/side-nav/side-nav';

@Component({
  standalone: true,
  imports: [RouterOutlet, AppHeader, SideNav],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  public title = 'host';
  public isSidebarCollapsed = false;

  public onToggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./shared/component/header/header.component";
import { CommonModule } from '@angular/common';
import { MenuComponent } from "./shared/component/menu/menu.component";
import { FooterComponent } from "./shared/component/footer/footer.component";

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, CommonModule, MenuComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ecommerce-ui';

  constructor() {

  }

  exibirHeader(): boolean {
    const url = window.location.href;
    return !url.includes('login') && !url.includes('register');
  }



}

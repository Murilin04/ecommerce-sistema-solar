import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarrosselComponent } from "../carrossel/carrossel.component";

@Component({
  selector: 'app-home',
  imports: [CommonModule, CarrosselComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}

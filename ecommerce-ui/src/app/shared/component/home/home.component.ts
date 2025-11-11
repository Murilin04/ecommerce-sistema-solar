import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarrosselComponent } from "../carrossel/carrossel.component";
import { FeaturedProductsComponent } from '../../../features/products/featured-products/featured-products.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, CarrosselComponent, FeaturedProductsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}

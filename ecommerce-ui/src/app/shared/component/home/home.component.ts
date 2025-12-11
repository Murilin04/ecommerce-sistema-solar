import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FeaturedProductsComponent } from '../../../features/products/featured-products/featured-products.component';
import { CarrosselComponent } from '../carrossel/carrossel.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, CarrosselComponent, FeaturedProductsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}

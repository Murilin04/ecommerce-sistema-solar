import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';

import { SearchService } from '../../service/search.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, RouterModule, MatIconModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  private router = inject(Router);
  private searchService = inject(SearchService);

  searchTerm: string = '';

  // Chamado quando o usuário submete o formulário (botão search ou Enter)
  onSearchSubmit(): void {
    const term = this.searchTerm && this.searchTerm.trim() !== '' ? this.searchTerm.trim() : null;

    // Atualiza o serviço para que componentes como featured escutem
    this.searchService.setSearch(term);

    // Navega para a página de produtos passando a query param 'q' quando houver termo
    if (term) {
      this.router.navigate(['/produtos'], { queryParams: { q: term } });
    } else {
      // sem termo: vai para /produtos sem query
      this.router.navigate(['/produtos']);
    }
  }

  // Limpa o campo de busca e notifica os listeners
  clearSearch(): void {
    this.searchTerm = '';
    this.searchService.setSearch(null);

    // Se estivermos na página de produtos, navegar sem query para resetar
    this.router.navigate(['/produtos']);
  }
}

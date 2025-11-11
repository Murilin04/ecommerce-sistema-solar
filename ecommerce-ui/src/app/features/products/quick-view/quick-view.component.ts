import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Produto } from '../../models/produto.model';
@Component({
  selector: 'app-quick-view',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './quick-view.component.html',
  styleUrl: './quick-view.component.scss'
})
export class QuickViewComponent {
  @Input() produto: Produto | null = null;
  @Input() isOpen = false;
  @Output() fechar = new EventEmitter<void>();

  imagemAtual = 0;

  get imagemPrincipal(): string {
    if (!this.produto) return '';

    if (this.produto.imagensAdicionais && this.produto.imagensAdicionais.length > 0) {
      return this.produto.imagensAdicionais[this.imagemAtual];
    }

    return this.produto.imagem;
  }

  get todasImagens(): string[] {
    if (!this.produto) return [];

    const imagens = [this.produto.imagem];

    if (this.produto.imagensAdicionais) {
      imagens.push(...this.produto.imagensAdicionais);
    }

    return imagens;
  }

  selecionarImagem(index: number) {
    this.imagemAtual = index;
  }

  fecharModal() {
    this.fechar.emit();
    this.imagemAtual = 0;
  }

  consultarPreco() {
    console.log('Consultar preço do produto:', this.produto);
    // implementar a lógica de consulta de preço
  }

  // Impede que o clique no conteúdo do modal feche o modal
  pararPropagacao(event: Event) {
    event.stopPropagation();
  }

  getCodigoValor(produto: Produto | null): string {
    if (!produto?.codigoCategoria) {
      return '';
    }

    const parts = produto.codigoCategoria.split(':');
    const valor = parts.length > 1 ? parts[1] : parts[0];
    return (valor ?? '').trim();
  }
}

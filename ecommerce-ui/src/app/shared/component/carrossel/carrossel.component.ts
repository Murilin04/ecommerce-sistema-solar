import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";

interface Banner {
  imagem: string;
  titulo: string;
  descricao: string;
  botao: string;
  link?: string;
}

@Component({
  selector: 'app-carrossel',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './carrossel.component.html',
  styleUrl: './carrossel.component.scss'
})
export class CarrosselComponent implements OnInit, OnDestroy {

  // CARROSSEL 1: BANNER PRINCIPAL (TOPO)
  bannerPrincipal = [
    {
      id: 1,
      titulo: 'Geradores MUST',
      subtitulo: 'COM AS MELHORES CONDIÇÕES',
      descricao: 'do mercado',
      imagem: 'assets/img/banners/banner-must-geradores.png', // Imagem 2
      link: '/produtos/geradores-must'
    },
    {
      id: 2,
      titulo: 'Pronta Entrega Garantida',
      subtitulo: 'GERADORES RONMA 610W',
      descricao: 'Comprou → Pagou → Enviamos em 24h!',
      imagem: 'assets/img/banners/banner-ronma-azul.png', // Imagem 3
      link: '/produtos/geradores-ronma'
    },
    {
      id: 3,
      titulo: 'Pronta Entrega',
      subtitulo: 'RONMA 610W BIFACIAL',
      descricao: 'Comprou → Pagou → Enviamos em 24h!',
      imagem: 'assets/img/banners/banner-ronma-claro.png', // Imagem 4
      link: '/produtos/ronma-610w'
    },
    {
      id: 4,
      titulo: 'Geradores MUST',
      subtitulo: 'ALTA PERFORMANCE',
      descricao: 'Economia para Sistemas On-Grid e Off-Grid',
      imagem: 'assets/img/banners/banner-must-escuro.png', // Imagem 7
      link: '/produtos/must-performance'
    }
  ];

  // CARROSSEL 2: MARCAS/LOGOS
  marcas = [
    { nome: 'Sungrow', logo: 'assets/img/logos/sungrow.png' },
    { nome: 'Longi', logo: 'assets/img/logos/longi.png' },
    { nome: 'LuxPowerTek', logo: 'assets/img/logos/luxpower.png' },
    { nome: 'Trinasolar', logo: 'assets/img/logos/trina-solar.png' },
    { nome: 'ERA Solar', logo: 'assets/img/logos/era-solar.png' },
    { nome: 'DEYE', logo: 'assets/img/logos/deye.png' },
    { nome: 'Sunova Solar', logo: 'assets/img/logos/sunova-solar.png' },
    { nome: 'Growatt', logo: 'assets/img/logos/growatt.png' }
  ];

  // CARROSSEL 3: BANNER INFERIOR
  bannersInferiores = [
    {
      id: 1,
      titulo: 'Pagamento Facilitado',
      texto: 'até 24x no cartão de crédito',
      beneficios: ['✓ Sem entrada', '✓ Aprovação rápida'],
      imagem: 'assets/img/banners/banner-pagamento.png', // Imagem 5
      link: '/financiamento',
      btnTexto: 'SIMULE SEU CRÉDITO'
    },
    {
      id: 2,
      titulo: 'Pronta Entrega Garantida',
      texto: 'Ronma 610W - Estoque disponível',
      beneficios: ['✓ entrega 24h', '✓ melhor preço'],
      imagem: 'assets/img/banners/banner-pronta-entrega.png', // Imagem 6
      link: '/pronta-entrega',
      btnTexto: 'CONSULTE AGORA'
    }
  ];

  // Índices atuais de cada carrossel
  indiceBannerPrincipal = 0;
  indiceBannerInferior = 0;

  // Intervalos para auto-play
  private intervalBannerPrincipal: any;
  private intervalBannerInferior: any;

  ngOnInit() {
    this.iniciarAutoPlay();
  }

  ngOnDestroy() {
    this.pararAutoPlay();
  }

  // ========== CARROSSEL 1: BANNER PRINCIPAL ==========

  proximoBannerPrincipal() {
    this.indiceBannerPrincipal = (this.indiceBannerPrincipal + 1) % this.bannerPrincipal.length;
  }

  anteriorBannerPrincipal() {
    this.indiceBannerPrincipal = this.indiceBannerPrincipal === 0
      ? this.bannerPrincipal.length - 1
      : this.indiceBannerPrincipal - 1;
  }

  irParaBannerPrincipal(indice: number) {
    this.indiceBannerPrincipal = indice;
  }

  // ========== CARROSSEL 3: BANNER INFERIOR ==========

  proximoBannerInferior() {
    this.indiceBannerInferior = (this.indiceBannerInferior + 1) % this.bannersInferiores.length;
  }

  anteriorBannerInferior() {
    this.indiceBannerInferior = this.indiceBannerInferior === 0
      ? this.bannersInferiores.length - 1
      : this.indiceBannerInferior - 1;
  }

  irParaBannerInferior(indice: number) {
    this.indiceBannerInferior = indice;
  }

  // ========== AUTO-PLAY ==========

  iniciarAutoPlay() {
    // Banner principal muda a cada 5 segundos
    this.intervalBannerPrincipal = setInterval(() => {
      this.proximoBannerPrincipal();
    }, 7000);

    // Banner inferior muda a cada 8 segundos
    this.intervalBannerInferior = setInterval(() => {
      this.proximoBannerInferior();
    }, 8000);
  }

  pararAutoPlay() {
    if (this.intervalBannerPrincipal) clearInterval(this.intervalBannerPrincipal);
    if (this.intervalBannerInferior) clearInterval(this.intervalBannerInferior);
  }

}

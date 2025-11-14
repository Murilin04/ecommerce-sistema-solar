import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, MatIconModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  // Informações de contato
  contato = {
    telefone: '(61) 99989-7286',
    telefoneLink: '5561999897286',
    email: 'contato@wm.com.br',
    horario: 'Seg-Sex 08:00h - 18:00h'
  };

  // Endereço
  endereco = {
    rua: 'Quadra 04 MR 4, Lote 20',
    bairro: '',
    cidade: 'Planaltina/GO - Brazil'
  };

  // Links de informações
  linksInformacoes = [
    { nome: 'Sobre a WM Energia Solar', url: '/sobre' },
    { nome: 'Política Comercial', url: '/politica-comercial' },
    { nome: 'Manual do Cliente', url: '/manual-cliente' },
    { nome: 'Aviso de Privacidade', url: '/privacidade' },
    { nome: 'Condições de Uso', url: '/condicoes-uso' },
    { nome: 'Aviso de Cookies', url: '/cookies' }
  ];

  // Redes sociais
  redesSociais = [
    {
      nome: 'Instagram',
      icone: 'instagram',
      url: 'https://www.instagram.com/wm_energiasolarr/',
      cor: '#E4405F'
    },
    {
      nome: 'LinkedIn',
      icone: 'linkedin',
      url: 'https://www.linkedin.com/company/in/wm-energia-solar',
      cor: '#0077B5'
    },
    {
      nome: 'Facebook',
      icone: 'facebook',
      url: 'https://www.facebook.com/share/184zLDE1Lo/',
      cor: '#1877F2'
    }
  ];

  // Informações legais
  cnpj = '12.347.678/0001-88';
  emailDados = 'dadospessoais@wm.com.br';

  anoAtual = new Date().getFullYear();

  // Métodos
  abrirRedeSocial(url: string) {
    window.open(url, '_blank');
  }

  enviarEmail(email: string) {
    window.location.href = `mailto:${email}`;
  }

  ligar(telefone: string) {
    const telLimpo = telefone.replace(/\D/g, '');
    window.location.href = `tel:+55${telLimpo}`;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

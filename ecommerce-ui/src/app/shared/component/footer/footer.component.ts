import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
    telefone: '(61) 99973-8084',
    telefoneLink: '5561999738084',
    email: 'vrenergialtda@gmail.com',
    horario: 'Seg-Sex 08:00h - 18:00h'
  };

  // Endereço
  endereco = {
    rua: 'Quadra 4 MR 4, Lote 20',
    bairro: 'Setor Norte',
    cidade: 'Planaltina/GO - Brazil'
  };

  // Links de informações
  linksInformacoes = [
    { nome: 'Sobre a VR Energia', url: '/sobre' },
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
      url: '',
      cor: '#E4405F'
    },
    {
      nome: 'LinkedIn',
      icone: 'linkedin',
      url: '',
      cor: '#0077B5'
    },
    {
      nome: 'Facebook',
      icone: 'facebook',
      url: '',
      cor: '#1877F2'
    }
  ];

  // Informações legais
  cnpj = '59.929.683/0001-09';
  emailDados = 'vrenergialtda@gmail.com';

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

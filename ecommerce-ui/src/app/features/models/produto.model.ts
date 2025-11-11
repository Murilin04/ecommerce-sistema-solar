export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  categoria: string;
  codigoCategoria: string;
  imagem: string;
  imagensAdicionais?: string[];
  preco?: number;
  disponibilidade?: string;
  avaliacoes?: number;
  emDestaque: boolean;
}

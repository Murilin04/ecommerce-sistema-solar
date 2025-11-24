export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  categoria: string;
  subcategoria?: string;
  marca?: string;
  tipo?: string;
  codigoCategoria: string;
  imagem: string;
  imagensAdicionais?: string[];
  preco?: number;
  disponibilidade?: string;
  estoque?: number;
  avaliacoes?: number;
  emDestaque: boolean;
  ativo?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

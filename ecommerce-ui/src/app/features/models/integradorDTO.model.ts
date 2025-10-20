export interface IntegradorDTO {
  id: number;
  cnpj: string;
  email: string;
  password?: string;

  stateRegistration?: string;
  isMei?: boolean;
  companyName?: string;
  tradeName?: string;
  postalCode?: string;
  state?: string;
  city?: string;
  address?: string;
  addressNumber?: string;
  addressComplement?: string;
  neighborhood?: string;
  phone?: string;
  whatsapp?: string;
}

export interface IntegradorProfile {
  stateRegistration: string;
  isMei: boolean;
  companyName: string;
  tradeName: string;
  postalCode: string;
  state: string;
  city: string;
  address: string;
  addressNumber: string;
  addressComplement: string;
  neighborhood: string;
  phone: string;
  whatsapp: string;
}

export interface Integrador {
  id: number;
  cnpj: string;
  email: string;
  password: string;
  role: string;
  profile: IntegradorProfile;
}

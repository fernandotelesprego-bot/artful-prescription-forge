export interface DoctorInfo {
  name: string;
  crm: string;
  uf: string;
  specialty: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
}

export interface PatientInfo {
  name: string;
  address: string;
}

export interface PrescriptionData {
  patient: PatientInfo;
  prescription: string;
  date: string;
}

export interface BuyerInfo {
  name: string;
  rg: string;
  orgaoEmissor: string;
  address: string;
  city: string;
  uf: string;
  phone: string;
}

export interface SpecialPrescriptionData extends PrescriptionData {
  buyer: BuyerInfo;
}

export interface PrescriptionStyle {
  backgroundColor: string;
  texture: 'none' | 'linen' | 'paper' | 'grid' | 'dots' | 'lines' | 'crosshatch';
  fontFamily: 'prescription' | 'classic' | 'body' | 'display' | 'modern' | 'elegant';
  primaryColor: string;
  borderStyle: 'none' | 'simple' | 'double' | 'elegant' | 'rounded' | 'thick';
  logo?: string;
  logoSize?: number;
  logoOpacity?: number;
  logoPosition?: 'header' | 'watermark';
  headerPosition?: 'left' | 'center' | 'right';
}

export type PrescriptionType = 'simple' | 'special';

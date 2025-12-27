import { DoctorInfo, PrescriptionData, PrescriptionStyle, BuyerInfo } from '@/types/prescription';
import { forwardRef } from 'react';

interface SpecialPrescriptionPreviewProps {
  doctor: DoctorInfo;
  prescription: PrescriptionData;
  style: PrescriptionStyle;
  buyer: BuyerInfo;
}

const SinglePrescription = ({ 
  doctor, 
  prescription, 
  style, 
  buyer, 
  via 
}: SpecialPrescriptionPreviewProps & { via: '1ª Via - Farmácia' | '2ª Via - Paciente' }) => {
  const getFontClass = () => {
    switch (style.fontFamily) {
      case 'prescription': return 'font-prescription';
      case 'classic': return 'font-classic';
      case 'display': return 'font-display';
      default: return 'font-body';
    }
  };

  const getTextureClass = () => {
    switch (style.texture) {
      case 'linen': return 'texture-linen';
      case 'paper': return 'texture-paper';
      case 'grid': return 'texture-grid';
      default: return '';
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '___/___/______';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div
      className={`w-full h-full ${getTextureClass()} ${getFontClass()} relative`}
      style={{ 
        backgroundColor: style.backgroundColor,
        padding: '8mm',
        fontSize: '9pt',
      }}
    >
      {/* Header */}
      <div 
        className="text-center font-bold text-sm mb-2 py-1"
        style={{ backgroundColor: style.primaryColor, color: '#fff' }}
      >
        RECEITUÁRIO CONTROLE ESPECIAL
      </div>

      {/* Via indicator */}
      <div className="absolute top-2 right-2 text-xs font-medium" style={{ color: style.primaryColor }}>
        {via}
      </div>

      {/* Doctor Section */}
      <div className="border border-foreground/40 p-2 mb-2">
        <div className="font-bold text-xs mb-1" style={{ color: style.primaryColor }}>
          IDENTIFICAÇÃO DO EMITENTE
        </div>
        <div className="flex items-start gap-4">
          {style.logo && (
            <div 
              className="w-12 h-12 flex-shrink-0"
              dangerouslySetInnerHTML={{ __html: style.logo }}
            />
          )}
          <div className="flex-1 text-xs leading-tight">
            <p><span className="font-medium">Nome:</span> {doctor.name || '_________________'}</p>
            <div className="flex gap-4">
              <p><span className="font-medium">CRM:</span> {doctor.crm || '______'}</p>
              <p><span className="font-medium">UF:</span> {doctor.uf || '__'}</p>
            </div>
            <p><span className="font-medium">Endereço:</span> {doctor.address || '_________________'}</p>
            <div className="flex gap-4">
              <p><span className="font-medium">Cidade:</span> {doctor.city || '_________'}</p>
              <p><span className="font-medium">UF:</span> {doctor.state || '__'}</p>
            </div>
            <p><span className="font-medium">Fone:</span> {doctor.phone || '_____________'}</p>
          </div>
        </div>
      </div>

      {/* Patient */}
      <div className="mb-2 text-xs">
        <p className="mb-1">
          <span className="font-medium">Paciente:</span>{' '}
          <span className="border-b border-foreground/40 inline-block" style={{ minWidth: '250px' }}>
            {prescription.patient.name}
          </span>
        </p>
        <p>
          <span className="font-medium">Endereço:</span>{' '}
          <span className="border-b border-foreground/40 inline-block" style={{ minWidth: '250px' }}>
            {prescription.patient.address}
          </span>
        </p>
      </div>

      {/* Prescription */}
      <div className="border border-foreground/40 p-2 mb-2 min-h-[120px]">
        <div className="font-bold text-xs mb-1" style={{ color: style.primaryColor }}>
          Prescrição:
        </div>
        <div className="whitespace-pre-wrap text-xs leading-relaxed">
          {prescription.prescription}
        </div>
      </div>

      {/* Date and Signature */}
      <div className="flex justify-between items-end mb-2 text-xs">
        <p>Data: {formatDate(prescription.date)}</p>
        <div className="text-center">
          <div className="w-40 border-t border-foreground/50 pt-1">
            <p className="text-xs">Carimbo / Assinatura</p>
          </div>
        </div>
      </div>

      {/* Buyer and Supplier sections */}
      <div className="flex gap-2 text-xs">
        <div className="flex-1 border border-foreground/40 p-2">
          <div className="font-bold text-xs mb-1" style={{ color: style.primaryColor }}>
            IDENTIFICAÇÃO DO COMPRADOR
          </div>
          <div className="leading-tight">
            <p>Nome: {buyer.name || '________________'}</p>
            <div className="flex gap-2">
              <p>Ident.: {buyer.rg || '_______'}</p>
              <p>Órg. Emissor: {buyer.orgaoEmissor || '_____'}</p>
            </div>
            <p>Endereço: {buyer.address || '_______________'}</p>
            <div className="flex gap-2">
              <p>Cidade: {buyer.city || '_______'}</p>
              <p>UF: {buyer.uf || '__'}</p>
            </div>
            <p>Fone: {buyer.phone || '____________'}</p>
          </div>
        </div>

        <div className="flex-1 border border-foreground/40 p-2">
          <div className="font-bold text-xs mb-1" style={{ color: style.primaryColor }}>
            IDENTIFICAÇÃO DO FORNECEDOR
          </div>
          <div className="leading-tight text-muted-foreground">
            <p>Nome: ________________</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>Data: ___/___/______</p>
            <div className="mt-2 pt-1 border-t border-foreground/30 text-center">
              <p className="text-xs">Assinatura do Farmacêutico</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SpecialPrescriptionPreview = forwardRef<HTMLDivElement, SpecialPrescriptionPreviewProps>(
  ({ doctor, prescription, style, buyer }, ref) => {
    return (
      <div
        ref={ref}
        className="w-[297mm] h-[210mm] mx-auto flex border-2"
        style={{ 
          borderColor: style.primaryColor,
        }}
      >
        {/* 1ª Via - Farmácia */}
        <div className="w-1/2 border-r" style={{ borderColor: style.primaryColor }}>
          <SinglePrescription 
            doctor={doctor} 
            prescription={prescription} 
            style={style} 
            buyer={buyer}
            via="1ª Via - Farmácia"
          />
        </div>

        {/* Dotted cutting line */}
        <div 
          className="w-0 relative"
          style={{ borderRight: `2px dashed ${style.primaryColor}` }}
        >
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background px-1 text-xs rotate-90 whitespace-nowrap"
            style={{ color: style.primaryColor }}
          >
            ✂ Recortar aqui
          </div>
        </div>

        {/* 2ª Via - Paciente */}
        <div className="w-1/2">
          <SinglePrescription 
            doctor={doctor} 
            prescription={prescription} 
            style={style} 
            buyer={buyer}
            via="2ª Via - Paciente"
          />
        </div>
      </div>
    );
  }
);

SpecialPrescriptionPreview.displayName = 'SpecialPrescriptionPreview';

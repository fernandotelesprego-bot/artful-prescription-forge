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
      case 'modern': return 'font-modern';
      case 'elegant': return 'font-elegant';
      default: return 'font-body';
    }
  };

  const getTextureClass = () => {
    switch (style.texture) {
      case 'linen': return 'texture-linen';
      case 'paper': return 'texture-paper';
      case 'grid': return 'texture-grid';
      case 'dots': return 'texture-dots';
      case 'lines': return 'texture-lines';
      case 'crosshatch': return 'texture-crosshatch';
      default: return '';
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '___/___/______';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  };

  const logoSize = (style.logoSize || 60) * 0.5;
  const logoOpacity = style.logoOpacity ?? 15;
  const logoPosition = style.logoPosition || 'header';
  const watermarkSize = style.logoPosition === 'watermark' ? ((style.logoSize || 250) * 0.5) : 125;

  return (
    <div
      className={`w-full h-full ${getTextureClass()} ${getFontClass()} flex flex-col relative`}
      style={{ 
        backgroundColor: style.backgroundColor,
        padding: '6mm',
        fontSize: '8pt',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      {/* Watermark Logo */}
      {style.logo && logoPosition === 'watermark' && (
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 0 }}
        >
          <img 
            src={style.logo}
            alt="Logo watermark"
            className="object-contain"
            style={{ 
              width: watermarkSize, 
              height: watermarkSize,
              opacity: logoOpacity / 100,
            }}
          />
        </div>
      )}
      {/* Header */}
      <div 
        className="text-center font-bold text-xs py-1 mb-2"
        style={{ backgroundColor: style.primaryColor, color: '#fff' }}
      >
        RECEITUÁRIO DE CONTROLE ESPECIAL
      </div>

      {/* Via indicator */}
      <div className="text-right text-xs font-medium mb-1" style={{ color: style.primaryColor }}>
        {via}
      </div>

      {/* Doctor Section */}
      <div className="border border-foreground/40 p-2 mb-2 flex-shrink-0">
        <div className="font-bold text-xs mb-1 relative" style={{ color: style.primaryColor, zIndex: 1 }}>
          IDENTIFICAÇÃO DO EMITENTE
        </div>
        <div className="flex items-start gap-2 relative" style={{ zIndex: 1 }}>
          {style.logo && logoPosition === 'header' && (
            <img
              src={style.logo}
              alt="Logo"
              className="flex-shrink-0 object-contain"
              style={{ width: logoSize, height: logoSize }}
            />
          )}
          <div className="flex-1 leading-tight" style={{ fontSize: '7pt' }}>
            <p><span className="font-medium">Nome:</span> {doctor.name || '_________________'}</p>
            <div className="flex gap-3">
              <p><span className="font-medium">CRM:</span> {doctor.crm || '______'}</p>
              <p><span className="font-medium">UF:</span> {doctor.uf || '__'}</p>
            </div>
            <p><span className="font-medium">Endereço:</span> {doctor.address || '_________________'}</p>
            <div className="flex gap-3">
              <p><span className="font-medium">Cidade:</span> {doctor.city || '_________'}</p>
              <p><span className="font-medium">UF:</span> {doctor.state || '__'}</p>
            </div>
            <p><span className="font-medium">Fone:</span> {doctor.phone || '_____________'}</p>
          </div>
        </div>
      </div>

      {/* Patient */}
      <div className="mb-2 flex-shrink-0" style={{ fontSize: '8pt' }}>
        <p className="mb-0.5">
          <span className="font-medium">Paciente:</span>{' '}
          <span className="border-b border-foreground/40 inline-block" style={{ minWidth: '180px' }}>
            {prescription.patient.name}
          </span>
        </p>
        <p>
          <span className="font-medium">Endereço:</span>{' '}
          <span className="border-b border-foreground/40 inline-block" style={{ minWidth: '180px' }}>
            {prescription.patient.address}
          </span>
        </p>
      </div>

      {/* Prescription */}
      <div className="border border-foreground/40 p-2 mb-2 flex-1 min-h-0 overflow-hidden">
        <div className="font-bold text-xs mb-1" style={{ color: style.primaryColor }}>
          Prescrição:
        </div>
        <div className="whitespace-pre-wrap leading-snug overflow-hidden" style={{ fontSize: '8pt' }}>
          {prescription.prescription}
        </div>
      </div>

      {/* Date and Signature */}
      <div className="flex justify-between items-end mb-2 flex-shrink-0" style={{ fontSize: '8pt' }}>
        <p>Data: {formatDate(prescription.date)}</p>
        <div className="text-center">
          <div className="w-32 border-t border-foreground/50 pt-0.5">
            <p style={{ fontSize: '7pt' }}>Carimbo / Assinatura</p>
          </div>
        </div>
      </div>

      {/* Buyer and Supplier sections */}
      <div className="flex gap-1 flex-shrink-0" style={{ fontSize: '7pt' }}>
        <div className="flex-1 border border-foreground/40 p-1.5">
          <div className="font-bold mb-0.5" style={{ color: style.primaryColor, fontSize: '7pt' }}>
            IDENTIFICAÇÃO DO COMPRADOR
          </div>
          <div className="leading-tight">
            <p>Nome: {buyer.name || '________________'}</p>
            <div className="flex gap-1">
              <p>Ident.: {buyer.rg || '_______'}</p>
              <p>Órg. Emissor: {buyer.orgaoEmissor || '_____'}</p>
            </div>
            <p>Endereço: {buyer.address || '_______________'}</p>
            <div className="flex gap-1">
              <p>Cidade: {buyer.city || '_______'}</p>
              <p>UF: {buyer.uf || '__'}</p>
            </div>
            <p>Fone: {buyer.phone || '____________'}</p>
          </div>
        </div>

        <div className="flex-1 border border-foreground/40 p-1.5">
          <div className="font-bold mb-0.5" style={{ color: style.primaryColor, fontSize: '7pt' }}>
            IDENTIFICAÇÃO DO FORNECEDOR
          </div>
          <div className="leading-tight text-muted-foreground">
            <p>Nome: ________________</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>Data: ___/___/______</p>
            <div className="mt-1 pt-0.5 border-t border-foreground/30 text-center">
              <p style={{ fontSize: '6pt' }}>Assinatura do Farmacêutico</p>
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
        className="print-special flex"
        style={{ 
          width: '297mm',
          height: '210mm',
          boxSizing: 'border-box',
          border: `2px solid ${style.primaryColor}`,
          backgroundColor: style.backgroundColor,
        }}
      >
        {/* 1ª Via - Farmácia */}
        <div className="w-1/2 h-full" style={{ borderRight: `1px solid ${style.primaryColor}` }}>
          <SinglePrescription 
            doctor={doctor} 
            prescription={prescription} 
            style={style} 
            buyer={buyer}
            via="1ª Via - Farmácia"
          />
        </div>

        {/* Cutting line indicator */}
        <div 
          className="w-0 h-full relative"
          style={{ borderRight: `2px dashed ${style.primaryColor}` }}
        >
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-1 text-xs rotate-90 whitespace-nowrap"
            style={{ color: style.primaryColor, backgroundColor: style.backgroundColor, fontSize: '8pt' }}
          >
            ✂ Recortar
          </div>
        </div>

        {/* 2ª Via - Paciente */}
        <div className="w-1/2 h-full">
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

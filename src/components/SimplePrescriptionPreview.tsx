import { DoctorInfo, PrescriptionData, PrescriptionStyle } from '@/types/prescription';
import { forwardRef } from 'react';

interface SimplePrescriptionPreviewProps {
  doctor: DoctorInfo;
  prescription: PrescriptionData;
  style: PrescriptionStyle;
}

export const SimplePrescriptionPreview = forwardRef<HTMLDivElement, SimplePrescriptionPreviewProps>(
  ({ doctor, prescription, style }, ref) => {
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

    const getBorderStyle = (): React.CSSProperties => {
      const color = style.primaryColor;
      switch (style.borderStyle) {
        case 'none': return {};
        case 'double': return { border: `4px double ${color}` };
        case 'elegant': return { border: `2px solid ${color}`, boxShadow: `inset 0 0 0 4px ${style.backgroundColor}, inset 0 0 0 5px ${color}` };
        case 'rounded': return { border: `2px solid ${color}`, borderRadius: '12px' };
        case 'thick': return { border: `4px solid ${color}` };
        default: return { border: `1px solid ${color}` };
      }
    };

    const getHeaderAlign = () => {
      switch (style.headerPosition) {
        case 'left': return 'text-left';
        case 'right': return 'text-right';
        default: return 'text-center';
      }
    };

    const getHeaderFlexAlign = () => {
      switch (style.headerPosition) {
        case 'left': return 'items-start';
        case 'right': return 'items-end';
        default: return 'items-center';
      }
    };

    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleDateString('pt-BR');
    };

    const logoSize = style.logoSize || 60;
    const logoOpacity = style.logoOpacity ?? 15;
    const logoPosition = style.logoPosition || 'header';
    const watermarkSize = style.logoPosition === 'watermark' ? (style.logoSize || 250) : 250;

    return (
      <div
        ref={ref}
        className={`print-simple prescription-paper ${getTextureClass()} ${getFontClass()} relative`}
        style={{ 
          backgroundColor: style.backgroundColor,
          width: '210mm',
          height: '297mm',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          padding: '15mm',
          position: 'relative',
          ...getBorderStyle(),
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
                mixBlendMode: 'multiply',
              }}
            />
          </div>
        )}

        {/* Header */}
        <div 
          className={`mb-6 pb-4 flex flex-col ${getHeaderFlexAlign()} relative`}
          style={{ borderBottom: `2px solid ${style.primaryColor}`, zIndex: 1 }}
        >
          {style.logo && logoPosition === 'header' && (
            <img 
              src={style.logo}
              alt="Logo"
              className="mb-3 object-contain"
              style={{ width: logoSize, height: logoSize }}
            />
          )}
          <div className={getHeaderAlign()}>
            <h1 className="text-xl font-bold mb-1" style={{ color: style.primaryColor }}>
              {doctor.name || 'Nome do Médico'}
            </h1>
            {doctor.specialty && (
              <p className="text-sm text-muted-foreground mb-1">{doctor.specialty}</p>
            )}
            <div className="text-xs text-muted-foreground space-y-0.5">
              <p>CRM: {doctor.crm || '______'}/{doctor.uf || '__'}</p>
              {doctor.address && <p>{doctor.address}</p>}
              {doctor.city && <p>{doctor.city} - {doctor.state}</p>}
              {doctor.phone && <p>Tel: {doctor.phone}</p>}
            </div>
          </div>
        </div>

        {/* Patient */}
        <div className="mb-4 text-sm relative" style={{ zIndex: 1 }}>
          <p className="mb-1">
            <span className="font-semibold">Paciente:</span>{' '}
            <span className="border-b border-foreground/30 inline-block min-w-[200px]">
              {prescription.patient.name || ''}
            </span>
          </p>
          {prescription.patient.address && (
            <p>
              <span className="font-semibold">Endereço:</span>{' '}
              <span className="border-b border-foreground/30 inline-block min-w-[200px]">
                {prescription.patient.address}
              </span>
            </p>
          )}
        </div>

        {/* Prescription */}
        <div className="flex-1 relative" style={{ zIndex: 1 }}>
          <h2 className="text-base font-bold mb-3 text-center" style={{ color: style.primaryColor }}>
            RECEITUÁRIO
          </h2>
          <div className="whitespace-pre-wrap leading-relaxed text-sm">
            {prescription.prescription || 'Prescrição médica...'}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-8 relative" style={{ zIndex: 1 }}>
          <div className="text-right text-sm">
            <p className="mb-1">{doctor.city}, {formatDate(prescription.date)}</p>
            <div className="inline-block text-center mt-10">
              <div className="w-48 border-t border-foreground/50 pt-1">
                <p className="font-semibold text-sm">{doctor.name}</p>
                <p className="text-xs text-muted-foreground">CRM: {doctor.crm}/{doctor.uf}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

SimplePrescriptionPreview.displayName = 'SimplePrescriptionPreview';

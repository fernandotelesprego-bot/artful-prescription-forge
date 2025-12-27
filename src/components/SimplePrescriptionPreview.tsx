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

    const getBorderStyle = () => {
      switch (style.borderStyle) {
        case 'double': return 'border-4 border-double';
        case 'elegant': return 'border-2 shadow-lg';
        default: return 'border';
      }
    };

    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleDateString('pt-BR');
    };

    return (
      <div
        ref={ref}
        className={`w-[210mm] min-h-[297mm] mx-auto prescription-paper ${getTextureClass()} ${getBorderStyle()} ${getFontClass()}`}
        style={{ 
          backgroundColor: style.backgroundColor,
          borderColor: style.primaryColor,
          padding: '20mm',
        }}
      >
        {/* Header */}
        <div className="text-center mb-8 pb-6" style={{ borderBottom: `2px solid ${style.primaryColor}` }}>
          {style.logo && (
            <div 
              className="w-20 h-20 mx-auto mb-4"
              dangerouslySetInnerHTML={{ __html: style.logo }}
            />
          )}
          <h1 className="text-2xl font-bold mb-1" style={{ color: style.primaryColor }}>
            {doctor.name || 'Nome do Médico'}
          </h1>
          {doctor.specialty && (
            <p className="text-sm text-muted-foreground mb-2">{doctor.specialty}</p>
          )}
          <div className="text-sm text-muted-foreground">
            <p>CRM: {doctor.crm || '______'}/{doctor.uf || '__'}</p>
            {doctor.address && <p>{doctor.address}</p>}
            {doctor.city && <p>{doctor.city} - {doctor.state}</p>}
            {doctor.phone && <p>Tel: {doctor.phone}</p>}
          </div>
        </div>

        {/* Patient */}
        <div className="mb-6">
          <p className="mb-2">
            <span className="font-semibold">Paciente:</span>{' '}
            <span className="border-b border-foreground/30 inline-block min-w-[300px]">
              {prescription.patient.name || ''}
            </span>
          </p>
          {prescription.patient.address && (
            <p>
              <span className="font-semibold">Endereço:</span>{' '}
              <span className="border-b border-foreground/30 inline-block min-w-[300px]">
                {prescription.patient.address}
              </span>
            </p>
          )}
        </div>

        {/* Prescription */}
        <div className="flex-1 min-h-[400px]">
          <h2 className="text-lg font-bold mb-4 text-center" style={{ color: style.primaryColor }}>
            RECEITUÁRIO
          </h2>
          <div className="whitespace-pre-wrap leading-relaxed text-base">
            {prescription.prescription || 'Prescrição médica...'}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-16">
          <div className="text-right">
            <p className="mb-2">{doctor.city}, {formatDate(prescription.date)}</p>
            <div className="inline-block text-center">
              <div className="w-64 border-t border-foreground/50 pt-2 mt-16">
                <p className="font-semibold">{doctor.name}</p>
                <p className="text-sm text-muted-foreground">CRM: {doctor.crm}/{doctor.uf}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

SimplePrescriptionPreview.displayName = 'SimplePrescriptionPreview';

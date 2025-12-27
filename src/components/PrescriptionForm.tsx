import { PrescriptionData, BuyerInfo, PrescriptionType } from '@/types/prescription';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UserCheck, FileText, ShoppingBag } from 'lucide-react';

interface PrescriptionFormProps {
  prescription: PrescriptionData;
  onChange: (prescription: PrescriptionData) => void;
  type: PrescriptionType;
  buyer?: BuyerInfo;
  onBuyerChange?: (buyer: BuyerInfo) => void;
}

export const PrescriptionForm = ({ 
  prescription, 
  onChange, 
  type,
  buyer,
  onBuyerChange 
}: PrescriptionFormProps) => {
  const handleChange = (field: keyof PrescriptionData, value: string) => {
    if (field === 'patient') return;
    onChange({ ...prescription, [field]: value });
  };

  const handlePatientChange = (field: 'name' | 'address', value: string) => {
    onChange({ 
      ...prescription, 
      patient: { ...prescription.patient, [field]: value } 
    });
  };

  const handleBuyerChange = (field: keyof BuyerInfo, value: string) => {
    if (onBuyerChange && buyer) {
      onBuyerChange({ ...buyer, [field]: value });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Patient Info */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-secondary/10">
            <UserCheck className="w-5 h-5 text-secondary" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground">Dados do Paciente</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="patient-name" className="text-muted-foreground text-sm">Nome do Paciente</Label>
            <Input
              id="patient-name"
              value={prescription.patient.name}
              onChange={(e) => handlePatientChange('name', e.target.value)}
              placeholder="Maria da Silva"
              className="input-medical mt-1"
            />
          </div>

          <div>
            <Label htmlFor="patient-address" className="text-muted-foreground text-sm">Endereço</Label>
            <Input
              id="patient-address"
              value={prescription.patient.address}
              onChange={(e) => handlePatientChange('address', e.target.value)}
              placeholder="Rua das Palmeiras, 456 - Centro"
              className="input-medical mt-1"
            />
          </div>

          <div>
            <Label htmlFor="date" className="text-muted-foreground text-sm">Data</Label>
            <Input
              id="date"
              type="date"
              value={prescription.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className="input-medical mt-1"
            />
          </div>
        </div>
      </div>

      {/* Prescription */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-accent/20">
            <FileText className="w-5 h-5 text-accent-foreground" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground">Prescrição</h3>
        </div>

        <Textarea
          value={prescription.prescription}
          onChange={(e) => handleChange('prescription', e.target.value)}
          placeholder="1) Medicamento 500mg - Tomar 1 comprimido de 8/8h por 7 dias&#10;&#10;2) Medicamento 200mg - Tomar 1 comprimido ao dia por 30 dias"
          className="input-medical mt-1 min-h-[200px] font-prescription text-base leading-relaxed"
        />
      </div>

      {/* Buyer Info (only for special prescriptions) */}
      {type === 'special' && buyer && onBuyerChange && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-medical-teal/10">
              <ShoppingBag className="w-5 h-5 text-medical-teal" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground">Identificação do Comprador</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="buyer-name" className="text-muted-foreground text-sm">Nome</Label>
              <Input
                id="buyer-name"
                value={buyer.name}
                onChange={(e) => handleBuyerChange('name', e.target.value)}
                placeholder="Nome do comprador"
                className="input-medical mt-1"
              />
            </div>

            <div>
              <Label htmlFor="buyer-rg" className="text-muted-foreground text-sm">Ident.</Label>
              <Input
                id="buyer-rg"
                value={buyer.rg}
                onChange={(e) => handleBuyerChange('rg', e.target.value)}
                placeholder="RG/CPF"
                className="input-medical mt-1"
              />
            </div>

            <div>
              <Label htmlFor="buyer-orgao" className="text-muted-foreground text-sm">Órgão Emissor</Label>
              <Input
                id="buyer-orgao"
                value={buyer.orgaoEmissor}
                onChange={(e) => handleBuyerChange('orgaoEmissor', e.target.value)}
                placeholder="SSP/SP"
                className="input-medical mt-1"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="buyer-address" className="text-muted-foreground text-sm">Endereço</Label>
              <Input
                id="buyer-address"
                value={buyer.address}
                onChange={(e) => handleBuyerChange('address', e.target.value)}
                placeholder="Endereço completo"
                className="input-medical mt-1"
              />
            </div>

            <div>
              <Label htmlFor="buyer-city" className="text-muted-foreground text-sm">Cidade</Label>
              <Input
                id="buyer-city"
                value={buyer.city}
                onChange={(e) => handleBuyerChange('city', e.target.value)}
                placeholder="Cidade"
                className="input-medical mt-1"
              />
            </div>

            <div>
              <Label htmlFor="buyer-uf" className="text-muted-foreground text-sm">UF</Label>
              <Input
                id="buyer-uf"
                value={buyer.uf}
                onChange={(e) => handleBuyerChange('uf', e.target.value.toUpperCase())}
                placeholder="SP"
                maxLength={2}
                className="input-medical mt-1"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="buyer-phone" className="text-muted-foreground text-sm">Telefone</Label>
              <Input
                id="buyer-phone"
                value={buyer.phone}
                onChange={(e) => handleBuyerChange('phone', e.target.value)}
                placeholder="(11) 99999-9999"
                className="input-medical mt-1"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import { DoctorInfo } from '@/types/prescription';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, MapPin, Phone, Mail, Award } from 'lucide-react';

interface DoctorFormProps {
  doctor: DoctorInfo;
  onChange: (doctor: DoctorInfo) => void;
}

export const DoctorForm = ({ doctor, onChange }: DoctorFormProps) => {
  const handleChange = (field: keyof DoctorInfo, value: string) => {
    onChange({ ...doctor, [field]: value });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <User className="w-5 h-5 text-primary" />
        </div>
        <h3 className="font-display text-lg font-semibold text-foreground">Dados do Médico</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="doctor-name" className="text-muted-foreground text-sm">Nome Completo</Label>
          <Input
            id="doctor-name"
            value={doctor.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Dr. João da Silva"
            className="input-medical mt-1"
          />
        </div>

        <div>
          <Label htmlFor="crm" className="text-muted-foreground text-sm">CRM</Label>
          <Input
            id="crm"
            value={doctor.crm}
            onChange={(e) => handleChange('crm', e.target.value)}
            placeholder="123456"
            className="input-medical mt-1"
          />
        </div>

        <div>
          <Label htmlFor="uf" className="text-muted-foreground text-sm">UF</Label>
          <Input
            id="uf"
            value={doctor.uf}
            onChange={(e) => handleChange('uf', e.target.value.toUpperCase())}
            placeholder="SP"
            maxLength={2}
            className="input-medical mt-1"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="specialty" className="text-muted-foreground text-sm flex items-center gap-1">
            <Award className="w-3 h-3" /> Especialidade
          </Label>
          <Input
            id="specialty"
            value={doctor.specialty}
            onChange={(e) => handleChange('specialty', e.target.value)}
            placeholder="Clínico Geral"
            className="input-medical mt-1"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="address" className="text-muted-foreground text-sm flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Endereço
          </Label>
          <Input
            id="address"
            value={doctor.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Rua das Flores, 123 - Sala 45"
            className="input-medical mt-1"
          />
        </div>

        <div>
          <Label htmlFor="city" className="text-muted-foreground text-sm">Cidade</Label>
          <Input
            id="city"
            value={doctor.city}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="São Paulo"
            className="input-medical mt-1"
          />
        </div>

        <div>
          <Label htmlFor="state" className="text-muted-foreground text-sm">Estado</Label>
          <Input
            id="state"
            value={doctor.state}
            onChange={(e) => handleChange('state', e.target.value.toUpperCase())}
            placeholder="SP"
            maxLength={2}
            className="input-medical mt-1"
          />
        </div>

        <div>
          <Label htmlFor="phone" className="text-muted-foreground text-sm flex items-center gap-1">
            <Phone className="w-3 h-3" /> Telefone
          </Label>
          <Input
            id="phone"
            value={doctor.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="(11) 99999-9999"
            className="input-medical mt-1"
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-muted-foreground text-sm flex items-center gap-1">
            <Mail className="w-3 h-3" /> E-mail
          </Label>
          <Input
            id="email"
            value={doctor.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="dr.joao@email.com"
            className="input-medical mt-1"
          />
        </div>
      </div>
    </div>
  );
};

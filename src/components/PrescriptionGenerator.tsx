import { useState, useRef } from 'react';
import { DoctorInfo, PrescriptionData, PrescriptionStyle, PrescriptionType, BuyerInfo } from '@/types/prescription';
import { DoctorForm } from './DoctorForm';
import { PrescriptionForm } from './PrescriptionForm';
import { StyleEditor } from './StyleEditor';
import { SimplePrescriptionPreview } from './SimplePrescriptionPreview';
import { SpecialPrescriptionPreview } from './SpecialPrescriptionPreview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FileText, Printer, Settings, User, Pill, Eye, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const defaultDoctor: DoctorInfo = {
  name: '',
  crm: '',
  uf: '',
  specialty: '',
  address: '',
  city: '',
  state: '',
  phone: '',
  email: '',
};

const defaultPrescription: PrescriptionData = {
  patient: { name: '', address: '' },
  prescription: '',
  date: new Date().toISOString().split('T')[0],
};

const defaultBuyer: BuyerInfo = {
  name: '',
  rg: '',
  orgaoEmissor: '',
  address: '',
  city: '',
  uf: '',
  phone: '',
};

const defaultStyle: PrescriptionStyle = {
  backgroundColor: '#faf9f7',
  texture: 'paper',
  fontFamily: 'prescription',
  primaryColor: '#2563eb',
  borderStyle: 'elegant',
};

export const PrescriptionGenerator = () => {
  const [prescriptionType, setPrescriptionType] = useState<PrescriptionType>('simple');
  const [doctor, setDoctor] = useState<DoctorInfo>(defaultDoctor);
  const [prescription, setPrescription] = useState<PrescriptionData>(defaultPrescription);
  const [buyer, setBuyer] = useState<BuyerInfo>(defaultBuyer);
  const [style, setStyle] = useState<PrescriptionStyle>(defaultStyle);
  const [activeTab, setActiveTab] = useState('doctor');
  
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
    toast.success('Receita pronta para impressão!');
  };

  const generateSvgLogo = async (prompt: string) => {
    // Simple SVG logo generator - creates a basic medical-themed SVG
    const colors = [style.primaryColor, '#1e40af', '#059669', '#dc2626'];
    const selectedColor = colors[Math.floor(Math.random() * colors.length)];
    
    const svgLogos = [
      // Caduceus style
      `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="none" stroke="${selectedColor}" stroke-width="2"/>
        <path d="M50 15 L50 85 M35 30 Q50 40 65 30 M35 45 Q50 55 65 45 M35 60 Q50 70 65 60" 
              fill="none" stroke="${selectedColor}" stroke-width="2" stroke-linecap="round"/>
        <circle cx="50" cy="20" r="5" fill="${selectedColor}"/>
      </svg>`,
      // Cross style
      `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="5" width="90" height="90" rx="10" fill="none" stroke="${selectedColor}" stroke-width="2"/>
        <path d="M35 50 L65 50 M50 35 L50 65" stroke="${selectedColor}" stroke-width="8" stroke-linecap="round"/>
      </svg>`,
      // Heart pulse style
      `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="none" stroke="${selectedColor}" stroke-width="2"/>
        <path d="M20 50 L35 50 L40 35 L50 65 L60 35 L65 50 L80 50" 
              fill="none" stroke="${selectedColor}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
      // Pill style
      `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="50" cy="50" rx="30" ry="40" fill="none" stroke="${selectedColor}" stroke-width="2" transform="rotate(45 50 50)"/>
        <line x1="28" y1="28" x2="72" y2="72" stroke="${selectedColor}" stroke-width="2"/>
        <circle cx="38" cy="38" r="8" fill="${selectedColor}" opacity="0.3"/>
      </svg>`,
    ];

    const randomLogo = svgLogos[Math.floor(Math.random() * svgLogos.length)];
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setStyle(prev => ({ ...prev, logo: randomLogo }));
    toast.success('Logo gerado com sucesso!');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 no-print">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl gradient-medical">
                <Pill className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-foreground">MedReceita</h1>
                <p className="text-xs text-muted-foreground">Gerador de Receituário</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Prescription Type Toggle */}
              <div className="flex bg-muted rounded-lg p-1">
                <button
                  onClick={() => setPrescriptionType('simple')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    prescriptionType === 'simple' 
                      ? 'bg-card text-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <FileText className="w-4 h-4 inline mr-2" />
                  Simples
                </button>
                <button
                  onClick={() => setPrescriptionType('special')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-1 ${
                    prescriptionType === 'special' 
                      ? 'bg-card text-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  Controle Especial
                </button>
              </div>

              <Button onClick={handlePrint} className="btn-medical">
                <Printer className="w-4 h-4 mr-2" />
                Imprimir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Editor Panel */}
          <div className="lg:col-span-1 no-print">
            <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden sticky top-24">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full grid grid-cols-3 bg-muted/50 p-1 rounded-none">
                  <TabsTrigger value="doctor" className="data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-lg">
                    <User className="w-4 h-4 mr-2" />
                    Médico
                  </TabsTrigger>
                  <TabsTrigger value="prescription" className="data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-lg">
                    <FileText className="w-4 h-4 mr-2" />
                    Receita
                  </TabsTrigger>
                  <TabsTrigger value="style" className="data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-lg">
                    <Settings className="w-4 h-4 mr-2" />
                    Estilo
                  </TabsTrigger>
                </TabsList>

                <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                  <TabsContent value="doctor" className="mt-0">
                    <DoctorForm doctor={doctor} onChange={setDoctor} />
                  </TabsContent>

                  <TabsContent value="prescription" className="mt-0">
                    <PrescriptionForm
                      prescription={prescription}
                      onChange={setPrescription}
                      type={prescriptionType}
                      buyer={buyer}
                      onBuyerChange={setBuyer}
                    />
                  </TabsContent>

                  <TabsContent value="style" className="mt-0">
                    <StyleEditor 
                      style={style} 
                      onChange={setStyle} 
                      onGenerateLogo={generateSvgLogo}
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <div className="no-print mb-4 flex items-center gap-2 text-muted-foreground">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">Pré-visualização</span>
              <span className="text-xs bg-muted px-2 py-1 rounded">
                {prescriptionType === 'simple' ? 'A4 Retrato' : 'A4 Paisagem (2 vias)'}
              </span>
            </div>

            <div className={`overflow-auto bg-muted/30 rounded-2xl p-8 ${prescriptionType === 'special' ? 'max-w-full' : ''}`}>
              {prescriptionType === 'simple' ? (
                <SimplePrescriptionPreview
                  ref={printRef}
                  doctor={doctor}
                  prescription={prescription}
                  style={style}
                />
              ) : (
                <SpecialPrescriptionPreview
                  ref={printRef}
                  doctor={doctor}
                  prescription={prescription}
                  style={style}
                  buyer={buyer}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Print-only content */}
      <div className="hidden print:block">
        {prescriptionType === 'simple' ? (
          <SimplePrescriptionPreview
            doctor={doctor}
            prescription={prescription}
            style={style}
          />
        ) : (
          <SpecialPrescriptionPreview
            doctor={doctor}
            prescription={prescription}
            style={style}
            buyer={buyer}
          />
        )}
      </div>
    </div>
  );
};

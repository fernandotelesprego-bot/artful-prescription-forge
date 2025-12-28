import { useState, useRef } from 'react';
import { DoctorInfo, PrescriptionData, PrescriptionStyle, PrescriptionType, BuyerInfo } from '@/types/prescription';
import { DoctorForm } from './DoctorForm';
import { PrescriptionForm } from './PrescriptionForm';
import { StyleEditor } from './StyleEditor';
import { SimplePrescriptionPreview } from './SimplePrescriptionPreview';
import { SpecialPrescriptionPreview } from './SpecialPrescriptionPreview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FileText, Printer, Settings, User, Pill, Eye, AlertTriangle, ZoomIn, ZoomOut } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { removeWhiteBackground } from '@/lib/imageUtils';

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
  primaryColor: '#1e40af',
  borderStyle: 'elegant',
  logoSize: 60,
  headerPosition: 'center',
};

export const PrescriptionGenerator = () => {
  const [prescriptionType, setPrescriptionType] = useState<PrescriptionType>('simple');
  const [doctor, setDoctor] = useState<DoctorInfo>(defaultDoctor);
  const [prescription, setPrescription] = useState<PrescriptionData>(defaultPrescription);
  const [buyer, setBuyer] = useState<BuyerInfo>(defaultBuyer);
  const [style, setStyle] = useState<PrescriptionStyle>(defaultStyle);
  const [activeTab, setActiveTab] = useState('doctor');
  const [isGeneratingLogo, setIsGeneratingLogo] = useState(false);
  const [previewScale, setPreviewScale] = useState(0.5);
  
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    // Create a print-specific stylesheet with @page rules
    const printStyle = document.createElement('style');
    printStyle.id = 'print-override';
    printStyle.textContent = prescriptionType === 'special' 
      ? `
        @page { size: 297mm 210mm; margin: 0 !important; }
        @media print { 
          body { margin: 0 !important; padding: 0 !important; }
          .print-container { display: block !important; }
        }
      `
      : `
        @page { size: 210mm 297mm; margin: 0 !important; }
        @media print { 
          body { margin: 0 !important; padding: 0 !important; }
          .print-container { display: block !important; }
        }
      `;
    
    document.head.appendChild(printStyle);
    
    window.print();
    
    // Remove the style after printing
    setTimeout(() => {
      const styleEl = document.getElementById('print-override');
      if (styleEl) styleEl.remove();
    }, 1000);
    
    toast.success('Receita pronta para impressão!');
  };

  const generateSvgLogo = async (prompt: string) => {
    setIsGeneratingLogo(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-logo', {
        body: { prompt, primaryColor: style.primaryColor },
      });

      if (error) {
        console.error('Error generating logo:', error);
        toast.error('Erro ao gerar logo. Tente novamente.');
        return;
      }

      if (data?.imageUrl) {
        // Remove white background from the generated logo
        const transparentLogo = await removeWhiteBackground(data.imageUrl);
        setStyle(prev => ({ ...prev, logo: transparentLogo }));
        toast.success('Logo gerado com sucesso!');
      } else if (data?.error) {
        toast.error(data.error);
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Erro ao conectar com o servidor.');
    } finally {
      setIsGeneratingLogo(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 no-print">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl gradient-medical">
                <Pill className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-lg font-bold text-foreground">MedReceita</h1>
                <p className="text-xs text-muted-foreground">Gerador de Receituário</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Prescription Type Toggle */}
              <div className="flex bg-muted rounded-lg p-1">
                <button
                  onClick={() => setPrescriptionType('simple')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    prescriptionType === 'simple' 
                      ? 'bg-card text-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <FileText className="w-4 h-4 inline mr-1" />
                  Simples
                </button>
                <button
                  onClick={() => setPrescriptionType('special')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1 ${
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
                <Printer className="w-4 h-4 mr-1" />
                Imprimir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Editor Panel */}
          <div className="lg:col-span-1 no-print">
            <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden sticky top-20">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full grid grid-cols-3 bg-muted/50 p-1 rounded-none">
                  <TabsTrigger value="doctor" className="data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-lg text-xs">
                    <User className="w-3 h-3 mr-1" />
                    Médico
                  </TabsTrigger>
                  <TabsTrigger value="prescription" className="data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-lg text-xs">
                    <FileText className="w-3 h-3 mr-1" />
                    Receita
                  </TabsTrigger>
                  <TabsTrigger value="style" className="data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-lg text-xs">
                    <Settings className="w-3 h-3 mr-1" />
                    Estilo
                  </TabsTrigger>
                </TabsList>

                <div className="p-4 max-h-[calc(100vh-180px)] overflow-y-auto">
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
                      isGeneratingLogo={isGeneratingLogo}
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <div className="no-print mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">Pré-visualização</span>
                <span className="text-xs bg-muted px-2 py-1 rounded">
                  {prescriptionType === 'simple' ? 'A4 Retrato' : 'A4 Paisagem (2 vias)'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewScale(Math.max(0.3, previewScale - 0.1))}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-xs text-muted-foreground w-12 text-center">
                  {Math.round(previewScale * 100)}%
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewScale(Math.min(1, previewScale + 0.1))}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="overflow-auto bg-muted/30 rounded-2xl p-4">
              <div 
                className="print-preview-container"
                style={{ 
                  transform: `scale(${previewScale})`,
                  transformOrigin: 'top left',
                  width: prescriptionType === 'simple' ? '210mm' : '297mm',
                  height: prescriptionType === 'simple' ? '297mm' : '210mm',
                }}
              >
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

            <p className="text-xs text-muted-foreground mt-2 no-print text-center">
              💡 Dica: Configure sua impressora para "Sem Margem" e tamanho A4 {prescriptionType === 'special' ? 'Paisagem' : 'Retrato'}
            </p>
          </div>
        </div>
      </main>

      {/* Print-only content - rendered outside main flow */}
      <div className="print-container">
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

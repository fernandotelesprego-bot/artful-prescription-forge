import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2, Upload, Trash2, History, X } from 'lucide-react';
import { LogoHistoryItem } from '@/hooks/useLocalStorage';
import { removeWhiteBackground } from '@/lib/imageUtils';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface LogoManagerProps {
  currentLogo?: string;
  logoHistory: LogoHistoryItem[];
  onLogoChange: (logo: string | undefined) => void;
  onAddToHistory: (item: LogoHistoryItem) => void;
  onRemoveFromHistory: (id: string) => void;
  onGenerateLogo: (prompt: string) => Promise<void>;
  isGeneratingLogo: boolean;
}

export const LogoManager = ({
  currentLogo,
  logoHistory,
  onLogoChange,
  onAddToHistory,
  onRemoveFromHistory,
  onGenerateLogo,
  isGeneratingLogo,
}: LogoManagerProps) => {
  const [logoPrompt, setLogoPrompt] = useState('');
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerateLogo = async () => {
    if (!logoPrompt.trim()) return;
    await onGenerateLogo(logoPrompt);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem válida');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB');
      return;
    }

    setIsProcessingUpload(true);

    try {
      // Read file as base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        
        try {
          // Remove white background
          const transparentLogo = await removeWhiteBackground(base64);
          
          // Add to history
          const historyItem: LogoHistoryItem = {
            id: crypto.randomUUID(),
            url: transparentLogo,
            createdAt: new Date().toISOString(),
            isUploaded: true,
          };
          onAddToHistory(historyItem);
          
          // Set as current logo
          onLogoChange(transparentLogo);
          toast.success('Logo carregado com sucesso!');
        } catch (error) {
          console.error('Error processing logo:', error);
          toast.error('Erro ao processar a imagem');
        } finally {
          setIsProcessingUpload(false);
        }
      };
      reader.onerror = () => {
        toast.error('Erro ao ler o arquivo');
        setIsProcessingUpload(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Erro ao carregar a imagem');
      setIsProcessingUpload(false);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSelectFromHistory = (item: LogoHistoryItem) => {
    onLogoChange(item.url);
    setShowHistory(false);
    toast.success('Logo selecionado!');
  };

  return (
    <div className="space-y-4">
      {/* Logo Generator with AI */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-medical-gold/20">
            <Sparkles className="w-5 h-5 text-medical-gold" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground">Logo</h3>
        </div>

        <div className="space-y-3">
          {/* AI Generation */}
          <div>
            <Label className="text-muted-foreground text-sm">Gerar com IA</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={logoPrompt}
                onChange={(e) => setLogoPrompt(e.target.value)}
                placeholder="Ex: Caduceu minimalista"
                className="input-medical flex-1"
              />
              <Button
                onClick={handleGenerateLogo}
                disabled={isGeneratingLogo || !logoPrompt.trim()}
                className="btn-medical"
                size="icon"
              >
                {isGeneratingLogo ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Manual Upload */}
          <div>
            <Label className="text-muted-foreground text-sm">Ou faça upload</Label>
            <div className="flex gap-2 mt-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessingUpload}
                variant="outline"
                className="flex-1"
              >
                {isProcessingUpload ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Carregar Imagem
                  </>
                )}
              </Button>

              {/* History Button */}
              {logoHistory.length > 0 && (
                <Dialog open={showHistory} onOpenChange={setShowHistory}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" title="Histórico de logos">
                      <History className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Histórico de Logos</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-3 gap-3 max-h-[400px] overflow-y-auto p-2">
                      {logoHistory.map((item) => (
                        <div
                          key={item.id}
                          className="relative group rounded-lg border border-border p-2 hover:border-primary transition-colors cursor-pointer"
                          onClick={() => handleSelectFromHistory(item)}
                        >
                          <img
                            src={item.url}
                            alt="Logo"
                            className="w-full h-20 object-contain"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveFromHistory(item.id);
                            }}
                            className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <div className="text-xs text-muted-foreground mt-1 truncate text-center">
                            {item.isUploaded ? 'Upload' : item.prompt?.slice(0, 15) + '...'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          {/* Current Logo Preview */}
          {currentLogo && (
            <div className="mt-3 p-4 bg-card rounded-lg border border-border">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-muted-foreground">Logo atual:</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onLogoChange(undefined)}
                  className="text-xs text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Remover
                </Button>
              </div>
              <img
                src={currentLogo}
                alt="Logo atual"
                className="w-20 h-20 mx-auto object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

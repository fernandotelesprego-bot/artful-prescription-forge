import { PrescriptionStyle } from '@/types/prescription';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Palette, Type, Sparkles, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface StyleEditorProps {
  style: PrescriptionStyle;
  onChange: (style: PrescriptionStyle) => void;
  onGenerateLogo: (prompt: string) => Promise<void>;
}

const textures = [
  { id: 'none', label: 'Sem textura' },
  { id: 'linen', label: 'Linho' },
  { id: 'paper', label: 'Papel' },
  { id: 'grid', label: 'Grade' },
] as const;

const fonts = [
  { id: 'prescription', label: 'Elegante', preview: 'Crimson Pro' },
  { id: 'classic', label: 'Clássica', preview: 'Libre Baskerville' },
  { id: 'body', label: 'Moderna', preview: 'Source Sans 3' },
  { id: 'display', label: 'Sofisticada', preview: 'Playfair Display' },
] as const;

const borders = [
  { id: 'simple', label: 'Simples' },
  { id: 'double', label: 'Dupla' },
  { id: 'elegant', label: 'Elegante' },
] as const;

export const StyleEditor = ({ style, onChange, onGenerateLogo }: StyleEditorProps) => {
  const [logoPrompt, setLogoPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateLogo = async () => {
    if (!logoPrompt.trim()) return;
    setIsGenerating(true);
    try {
      await onGenerateLogo(logoPrompt);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Logo Generator */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-medical-gold/20">
            <Sparkles className="w-5 h-5 text-medical-gold" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground">Logo com IA</h3>
        </div>

        <div className="space-y-3">
          <div>
            <Label className="text-muted-foreground text-sm">Descreva o logo desejado</Label>
            <Input
              value={logoPrompt}
              onChange={(e) => setLogoPrompt(e.target.value)}
              placeholder="Ex: Símbolo médico minimalista com serpente azul"
              className="input-medical mt-1"
            />
          </div>
          <Button 
            onClick={handleGenerateLogo}
            disabled={isGenerating || !logoPrompt.trim()}
            className="btn-medical w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Gerar Logo
              </>
            )}
          </Button>

          {style.logo && (
            <div className="mt-3 p-4 bg-card rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-2">Logo atual:</p>
              <div 
                className="w-24 h-24 mx-auto"
                dangerouslySetInnerHTML={{ __html: style.logo }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Colors */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Palette className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground">Cores</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-muted-foreground text-sm">Cor de fundo</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="color"
                value={style.backgroundColor}
                onChange={(e) => onChange({ ...style, backgroundColor: e.target.value })}
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                value={style.backgroundColor}
                onChange={(e) => onChange({ ...style, backgroundColor: e.target.value })}
                className="input-medical flex-1"
              />
            </div>
          </div>

          <div>
            <Label className="text-muted-foreground text-sm">Cor primária</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="color"
                value={style.primaryColor}
                onChange={(e) => onChange({ ...style, primaryColor: e.target.value })}
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                value={style.primaryColor}
                onChange={(e) => onChange({ ...style, primaryColor: e.target.value })}
                className="input-medical flex-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Texture */}
      <div>
        <Label className="text-muted-foreground text-sm mb-2 block">Textura</Label>
        <div className="grid grid-cols-2 gap-2">
          {textures.map((tex) => (
            <button
              key={tex.id}
              onClick={() => onChange({ ...style, texture: tex.id })}
              className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium
                ${style.texture === tex.id 
                  ? 'border-primary bg-primary/5 text-primary' 
                  : 'border-border hover:border-primary/50 text-muted-foreground'
                }`}
            >
              {tex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Font */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Type className="w-4 h-4 text-muted-foreground" />
          <Label className="text-muted-foreground text-sm">Fonte</Label>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {fonts.map((font) => (
            <button
              key={font.id}
              onClick={() => onChange({ ...style, fontFamily: font.id })}
              className={`p-3 rounded-lg border-2 transition-all duration-200 text-left
                ${style.fontFamily === font.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
                }`}
            >
              <span className={`block text-sm font-medium ${style.fontFamily === font.id ? 'text-primary' : 'text-foreground'}`}>
                {font.label}
              </span>
              <span className="text-xs text-muted-foreground">{font.preview}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Border Style */}
      <div>
        <Label className="text-muted-foreground text-sm mb-2 block">Estilo da borda</Label>
        <div className="grid grid-cols-3 gap-2">
          {borders.map((border) => (
            <button
              key={border.id}
              onClick={() => onChange({ ...style, borderStyle: border.id })}
              className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium
                ${style.borderStyle === border.id 
                  ? 'border-primary bg-primary/5 text-primary' 
                  : 'border-border hover:border-primary/50 text-muted-foreground'
                }`}
            >
              {border.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

import { PrescriptionStyle } from '@/types/prescription';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Palette, Type, Sparkles, Loader2, Brush, Square } from 'lucide-react';
import { useState } from 'react';
import { Slider } from '@/components/ui/slider';

interface StyleEditorProps {
  style: PrescriptionStyle;
  onChange: (style: PrescriptionStyle) => void;
  onGenerateLogo: (prompt: string) => Promise<void>;
  isGeneratingLogo: boolean;
}

const textures = [
  { id: 'none', label: 'Sem textura', icon: '○' },
  { id: 'linen', label: 'Linho', icon: '▤' },
  { id: 'paper', label: 'Papel', icon: '▧' },
  { id: 'grid', label: 'Grade', icon: '▦' },
  { id: 'dots', label: 'Pontos', icon: '⠿' },
  { id: 'lines', label: 'Linhas', icon: '☰' },
  { id: 'crosshatch', label: 'Hachurado', icon: '╳' },
] as const;

const fonts = [
  { id: 'prescription', label: 'Elegante', preview: 'Crimson Pro' },
  { id: 'classic', label: 'Clássica', preview: 'Libre Baskerville' },
  { id: 'body', label: 'Moderna', preview: 'Source Sans 3' },
  { id: 'display', label: 'Sofisticada', preview: 'Playfair Display' },
  { id: 'modern', label: 'Clean', preview: 'Roboto' },
  { id: 'elegant', label: 'Premium', preview: 'Montserrat' },
] as const;

const borders = [
  { id: 'none', label: 'Nenhuma' },
  { id: 'simple', label: 'Simples' },
  { id: 'double', label: 'Dupla' },
  { id: 'elegant', label: 'Elegante' },
  { id: 'rounded', label: 'Arredondada' },
  { id: 'thick', label: 'Grossa' },
] as const;

const presetColors = [
  { bg: '#ffffff', primary: '#1e40af', label: 'Clássico Azul' },
  { bg: '#faf9f7', primary: '#047857', label: 'Verde Médico' },
  { bg: '#fffbeb', primary: '#b45309', label: 'Dourado Elegante' },
  { bg: '#f8fafc', primary: '#334155', label: 'Cinza Profissional' },
  { bg: '#fef2f2', primary: '#b91c1c', label: 'Vermelho Clássico' },
  { bg: '#f0fdf4', primary: '#166534', label: 'Verde Natural' },
  { bg: '#faf5ff', primary: '#7c3aed', label: 'Violeta Premium' },
  { bg: '#fff7ed', primary: '#c2410c', label: 'Terracota' },
];

export const StyleEditor = ({ style, onChange, onGenerateLogo, isGeneratingLogo }: StyleEditorProps) => {
  const [logoPrompt, setLogoPrompt] = useState('');

  const handleGenerateLogo = async () => {
    if (!logoPrompt.trim()) return;
    await onGenerateLogo(logoPrompt);
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
              placeholder="Ex: Caduceu minimalista com coração"
              className="input-medical mt-1"
            />
          </div>
          <Button 
            onClick={handleGenerateLogo}
            disabled={isGeneratingLogo || !logoPrompt.trim()}
            className="btn-medical w-full"
          >
            {isGeneratingLogo ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Gerando com IA...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Gerar Logo com IA
              </>
            )}
          </Button>

          {style.logo && (
            <div className="mt-3 p-4 bg-card rounded-lg border border-border">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-muted-foreground">Logo atual:</p>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onChange({ ...style, logo: undefined })}
                  className="text-xs text-destructive hover:text-destructive"
                >
                  Remover
                </Button>
              </div>
              <img 
                src={style.logo}
                alt="Logo gerado"
                className="w-20 h-20 mx-auto object-contain"
              />
            </div>
          )}
        </div>
      </div>

      {/* Preset Colors */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Brush className="w-4 h-4 text-muted-foreground" />
          <Label className="text-muted-foreground text-sm">Temas Prontos</Label>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {presetColors.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => onChange({ ...style, backgroundColor: preset.bg, primaryColor: preset.primary })}
              className="group relative p-2 rounded-lg border-2 transition-all duration-200 hover:border-primary/50"
              style={{ borderColor: style.backgroundColor === preset.bg && style.primaryColor === preset.primary ? preset.primary : 'transparent', backgroundColor: preset.bg }}
              title={preset.label}
            >
              <div className="w-full h-6 rounded" style={{ backgroundColor: preset.primary }} />
            </button>
          ))}
        </div>
      </div>

      {/* Custom Colors */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Palette className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground">Cores Personalizadas</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-muted-foreground text-sm">Cor de fundo</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="color"
                value={style.backgroundColor}
                onChange={(e) => onChange({ ...style, backgroundColor: e.target.value })}
                className="w-12 h-10 p-1 cursor-pointer rounded-lg"
              />
              <Input
                value={style.backgroundColor}
                onChange={(e) => onChange({ ...style, backgroundColor: e.target.value })}
                className="input-medical flex-1 text-xs"
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
                className="w-12 h-10 p-1 cursor-pointer rounded-lg"
              />
              <Input
                value={style.primaryColor}
                onChange={(e) => onChange({ ...style, primaryColor: e.target.value })}
                className="input-medical flex-1 text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Logo Settings */}
      {style.logo && (
        <div className="space-y-4">
          <div>
            <Label className="text-muted-foreground text-sm mb-2 block">Posição do Logo</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onChange({ ...style, logoPosition: 'header' })}
                className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium
                  ${(style.logoPosition || 'header') === 'header' 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-border hover:border-primary/50 text-muted-foreground'
                  }`}
              >
                Cabeçalho
              </button>
              <button
                onClick={() => onChange({ ...style, logoPosition: 'watermark' })}
                className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium
                  ${style.logoPosition === 'watermark' 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-border hover:border-primary/50 text-muted-foreground'
                  }`}
              >
                Marca d'água
              </button>
            </div>
          </div>

          <div>
            <Label className="text-muted-foreground text-sm mb-2 block">Tamanho do Logo</Label>
            <Slider
              value={[style.logoSize || (style.logoPosition === 'watermark' ? 250 : 60)]}
              onValueChange={([value]) => onChange({ ...style, logoSize: value })}
              min={style.logoPosition === 'watermark' ? 150 : 30}
              max={style.logoPosition === 'watermark' ? 500 : 120}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Pequeno</span>
              <span>{style.logoSize || (style.logoPosition === 'watermark' ? 250 : 60)}px</span>
              <span>Grande</span>
            </div>
          </div>

          {style.logoPosition === 'watermark' && (
            <div>
              <Label className="text-muted-foreground text-sm mb-2 block">Opacidade do Logo</Label>
              <Slider
                value={[style.logoOpacity ?? 15]}
                onValueChange={([value]) => onChange({ ...style, logoOpacity: value })}
                min={5}
                max={50}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Sutil</span>
                <span>{style.logoOpacity ?? 15}%</span>
                <span>Visível</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Texture */}
      <div>
        <Label className="text-muted-foreground text-sm mb-2 block">Textura de Fundo</Label>
        <div className="grid grid-cols-4 gap-2">
          {textures.map((tex) => (
            <button
              key={tex.id}
              onClick={() => onChange({ ...style, texture: tex.id })}
              className={`p-2 rounded-lg border-2 transition-all duration-200 text-center
                ${style.texture === tex.id 
                  ? 'border-primary bg-primary/5 text-primary' 
                  : 'border-border hover:border-primary/50 text-muted-foreground'
                }`}
            >
              <div className="text-lg mb-1">{tex.icon}</div>
              <div className="text-xs">{tex.label}</div>
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
        <div className="flex items-center gap-2 mb-3">
          <Square className="w-4 h-4 text-muted-foreground" />
          <Label className="text-muted-foreground text-sm">Estilo da Borda</Label>
        </div>
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

      {/* Header Position */}
      <div>
        <Label className="text-muted-foreground text-sm mb-2 block">Posição do Cabeçalho</Label>
        <div className="grid grid-cols-3 gap-2">
          {(['left', 'center', 'right'] as const).map((pos) => (
            <button
              key={pos}
              onClick={() => onChange({ ...style, headerPosition: pos })}
              className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium capitalize
                ${style.headerPosition === pos 
                  ? 'border-primary bg-primary/5 text-primary' 
                  : 'border-border hover:border-primary/50 text-muted-foreground'
                }`}
            >
              {pos === 'left' ? 'Esquerda' : pos === 'center' ? 'Centro' : 'Direita'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

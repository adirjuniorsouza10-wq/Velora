import React, { useState } from 'react';
import { useVelora } from '../../context/VeloraContext';
import { Palette, Check } from 'lucide-react';
import { ColorPalette } from '../../types/velora';

export const PaletteSelector: React.FC = () => {
  const { colorPalette, setColorPalette } = useVelora();
  const [isOpen, setIsOpen] = useState(false);

  const palettes: { id: ColorPalette; name: string; label: string; colorHex: string; desc: string }[] = [
    { 
      id: 'cobalt', 
      name: 'Azul Cobalto', 
      label: 'Mais fácil de visualizar',
      colorHex: '#2563EB', 
      desc: 'Máximo contraste e legibilidade' 
    },
    { 
      id: 'gold', 
      name: 'Dourado Solar', 
      label: 'Estilo Champanhe Clássico',
      colorHex: '#F59E0B', 
      desc: 'Preto profundo & Dourado' 
    },
    { 
      id: 'emerald', 
      name: 'Verde Esmeralda', 
      label: 'Alta Nitidez',
      colorHex: '#10B981', 
      desc: 'Equilíbrio visual suave e nítido' 
    }
  ];

  const currentOption = palettes.find(p => p.id === colorPalette) || palettes[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 transition-all hover:border-zinc-700 active:scale-95"
        title="Alterar cor de destaque para melhor visualização"
        aria-label="Seletor de cor para visualização"
      >
        <Palette className="w-3.5 h-3.5 text-zinc-400" />
        <span 
          className="w-2.5 h-2.5 rounded-full ring-1 ring-white/30"
          style={{ backgroundColor: currentOption.colorHex }}
        />
        <span className="hidden xl:inline text-[11px] font-medium text-zinc-200">
          {currentOption.name}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-2 z-50 text-xs">
          <div className="px-2.5 py-1.5 mb-1 border-b border-zinc-800">
            <div className="font-bold text-white text-[11px]">Cor de Visualização</div>
            <p className="text-[10px] text-zinc-400">Escolha a cor que melhor se adapta aos seus olhos:</p>
          </div>

          <div className="space-y-1">
            {palettes.map((item) => {
              const isSelected = colorPalette === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setColorPalette(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-all ${
                    isSelected 
                      ? 'bg-zinc-800/90 text-white font-semibold border border-zinc-700' 
                      : 'text-zinc-300 hover:bg-zinc-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span 
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm ring-2 ring-zinc-700"
                      style={{ backgroundColor: item.colorHex }}
                    />
                    <div>
                      <div className="text-xs font-semibold flex items-center gap-1.5">
                        <span>{item.name}</span>
                        {item.id === 'cobalt' && (
                          <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1 py-0.2 rounded font-bold">
                            Fácil de Ver
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-zinc-400">{item.desc}</div>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-white shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

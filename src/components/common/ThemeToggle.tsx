import React, { useState, useEffect, useRef } from 'react';
import { useVelora } from '../../context/VeloraContext';
import { Sun, Moon, Palette, Check, ChevronDown } from 'lucide-react';
import { ColorPalette } from '../../types/velora';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  showLabel = true 
}) => {
  const { 
    themeMode, 
    toggleTheme, 
    colorPalette, 
    setColorPalette 
  } = useVelora();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Ensure theme class and palette class are immediately reflected on document.body
  useEffect(() => {
    if (themeMode === 'light') {
      document.body.classList.add('theme-light');
      document.body.classList.remove('theme-dark');
    } else {
      document.body.classList.remove('theme-light');
      document.body.classList.add('theme-dark');
    }
  }, [themeMode]);

  useEffect(() => {
    document.body.classList.remove('palette-default', 'palette-gold', 'palette-cobalt', 'palette-emerald');
    const targetClass = colorPalette === 'default' ? 'palette-gold' : `palette-${colorPalette}`;
    document.body.classList.add(targetClass);
  }, [colorPalette]);

  const handlePaletteSelect = (paletteId: ColorPalette) => {
    setColorPalette(paletteId);
    setDropdownOpen(false);
    // Instant DOM synchronization
    document.body.classList.remove('palette-default', 'palette-gold', 'palette-cobalt', 'palette-emerald');
    const targetClass = paletteId === 'default' ? 'palette-gold' : `palette-${paletteId}`;
    document.body.classList.add(targetClass);
  };

  const palettes: { id: ColorPalette; name: string; tag: string; hex: string; desc: string }[] = [
    {
      id: 'default',
      name: 'Dourado Solar (Vellora)',
      tag: 'Identidade Clássica',
      hex: '#F59E0B',
      desc: 'Ouro champanhe e contraste luxuoso'
    },
    {
      id: 'cobalt',
      name: 'Azul Cobalto Real',
      tag: 'Mais Fácil de Ver',
      hex: '#2563EB',
      desc: 'Máxima legibilidade e alto contraste'
    },
    {
      id: 'emerald',
      name: 'Verde Esmeralda',
      tag: 'Alta Nitidez',
      hex: '#10B981',
      desc: 'Tons clínicos e visual limpo'
    }
  ];

  const currentOption = palettes.find(p => p.id === colorPalette || (colorPalette === 'gold' && p.id === 'default')) || palettes[0];
  const isLight = themeMode === 'light';

  return (
    <div className={`relative flex items-center gap-1.5 ${className}`} ref={containerRef}>
      {/* Light / Dark Mode Button */}
      <button
        type="button"
        onClick={toggleTheme}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all active:scale-95 ${
          isLight
            ? 'bg-amber-500/10 border-amber-500/40 text-amber-800 hover:bg-amber-500/20 shadow-sm'
            : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-amber-400'
        }`}
        title={isLight ? 'Mudar para Modo Escuro' : 'Mudar para Modo Claro'}
        aria-label="Alternar tema claro e escuro"
      >
        {isLight ? (
          <>
            <Moon className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            {showLabel && <span className="hidden sm:inline text-[11px]">Escuro</span>}
          </>
        ) : (
          <>
            <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            {showLabel && <span className="hidden sm:inline text-[11px]">Claro</span>}
          </>
        )}
      </button>

      {/* High-Contrast Palette Selector Dropdown */}
      <button
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-200 transition-all active:scale-95"
        title="Alterar cor de destaque para máxima visualização"
        aria-label="Selecionar paleta de alto contraste"
      >
        <span 
          className="w-2.5 h-2.5 rounded-full ring-2 ring-white/30 shrink-0 shadow-sm"
          style={{ backgroundColor: currentOption.hex }}
        />
        <span className="hidden md:inline text-[11px] font-semibold text-zinc-200">
          {currentOption.name.split(' ')[0]}
        </span>
        <ChevronDown className="w-3 h-3 text-zinc-400" />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95">
          <div className="px-2.5 py-1.5 mb-2 border-b border-zinc-800">
            <div className="font-bold text-white text-xs flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>Cor &amp; Alta Visibilidade</span>
            </div>
            <p className="text-[10px] text-zinc-400 mt-0.5">
              Escolha a cor que melhor se adapta aos seus olhos:
            </p>
          </div>

          <div className="space-y-1">
            {palettes.map(item => {
              const isSelected = colorPalette === item.id || (item.id === 'default' && colorPalette === 'gold');
              return (
                <button
                  key={item.id}
                  onClick={() => handlePaletteSelect(item.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                    isSelected 
                      ? 'bg-zinc-800 text-white font-semibold border border-zinc-700 shadow-md' 
                      : 'text-zinc-300 hover:bg-zinc-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span 
                      className="w-4 h-4 rounded-full shrink-0 ring-2 ring-white/20 shadow-md"
                      style={{ backgroundColor: item.hex }}
                    />
                    <div>
                      <div className="text-xs font-bold flex items-center gap-1.5">
                        <span>{item.name}</span>
                        {item.id === 'cobalt' && (
                          <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1 py-0.2 rounded font-extrabold">
                            Mais Fácil
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-zinc-400">{item.desc}</div>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 stroke-[3]" />
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

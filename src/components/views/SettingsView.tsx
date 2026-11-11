import React, { useState } from 'react';
import { useVelora } from '../../context/VeloraContext';
import { 
  Settings, 
  Building2, 
  ShieldCheck, 
  Globe, 
  Percent, 
  MapPin, 
  Palette, 
  Check, 
  Sparkles,
  Save,
  Lock
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { activeTenant, branches, colorPalette, setColorPalette } = useVelora();

  const [name, setName] = useState(activeTenant.name);
  const [slug, setSlug] = useState(activeTenant.slug);
  const [phone, setPhone] = useState(activeTenant.phone);
  const [address, setAddress] = useState(activeTenant.address);
  const [cancellationPolicy, setCancellationPolicy] = useState(activeTenant.cancellationPolicy);
  const [depositRequired, setDepositRequired] = useState(activeTenant.depositRequired);
  const [depositPercentage, setDepositPercentage] = useState(activeTenant.depositPercentage);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-zinc-950">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <Settings className="w-4 h-4" />
            <span>Configurações Gerais • {activeTenant.name}</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Empresa &amp; Regras de Reserva</h1>
          <p className="text-xs text-zinc-400">
            Políticas de agendamento online, cancelamentos, sinal e identidade visual.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>Configurações salvas com sucesso!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl text-xs">
        {/* Business Data Card */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>Dados Oficiais do Estabelecimento</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-zinc-300 font-semibold mb-1 block">Nome Comercial</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-semibold mb-1 block">Endereço do Link Público (Slug)</label>
              <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
                <span className="px-3 text-zinc-500 font-mono">velora.app/b/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  className="w-full py-2 pr-3 bg-transparent text-amber-400 font-mono outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-zinc-300 font-semibold mb-1 block">Telefone Comercial / WhatsApp</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-semibold mb-1 block">Endereço Completo</label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Booking Rules Card */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-amber-400" />
            <span>Regras de Agendamento Online &amp; Sinal</span>
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-xl border border-zinc-800">
              <div>
                <div className="font-bold text-white text-xs">Exigência de Sinal no Agendamento</div>
                <div className="text-zinc-400 text-[11px] mt-0.5">
                  Exige pagamento antecipado via Pix para assegurar a vaga e reduzir no-show a quase zero.
                </div>
              </div>

              <input
                type="checkbox"
                checked={depositRequired}
                onChange={e => setDepositRequired(e.target.checked)}
                className="w-5 h-5 rounded text-amber-500 bg-zinc-900 border-zinc-700"
              />
            </div>

            {depositRequired && (
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs">Percentual do Sinal Padrão (%)</div>
                  <div className="text-zinc-400 text-[11px] mt-0.5">
                    Calculado automaticamente sobre o valor total dos serviços reservados.
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={10}
                    max={100}
                    step={5}
                    value={depositPercentage}
                    onChange={e => setDepositPercentage(Number(e.target.value))}
                    className="w-20 px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-xl text-amber-400 font-mono font-bold text-center outline-none"
                  />
                  <span className="text-zinc-400">%</span>
                </div>
              </div>
            )}

            <div>
              <label className="text-zinc-300 font-semibold mb-1 block">Política de Cancelamento e Tolerância</label>
              <textarea
                rows={2}
                value={cancellationPolicy}
                onChange={e => setCancellationPolicy(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Visual Identity & Palette preview */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" />
              <span>Cor de Destaque &amp; Visualização da Interface</span>
            </h3>
            <p className="text-zinc-400 text-[11px] mt-0.5">
              Escolha a cor mais fácil de visualizar de acordo com o seu monitor e preferência:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Azul Cobalto */}
            <button
              type="button"
              onClick={() => setColorPalette('cobalt')}
              className={`p-4 rounded-xl text-left transition-all flex items-center justify-between ${
                colorPalette === 'cobalt'
                  ? 'bg-blue-950/40 border-2 border-blue-500 shadow-lg shadow-blue-500/20'
                  : 'bg-zinc-950 border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div>
                <div className="font-bold text-white text-xs flex items-center gap-1.5">
                  <span>Azul Cobalto Real</span>
                  <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1 py-0.2 rounded font-bold">
                    Mais fácil de ver
                  </span>
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Máximo contraste e legibilidade</div>
              </div>
              <div className="w-5 h-5 rounded-full bg-blue-500 shadow-md shadow-blue-500/50 flex items-center justify-center">
                {colorPalette === 'cobalt' && <Check className="w-3 h-3 text-white" />}
              </div>
            </button>

            {/* Dourado Solar */}
            <button
              type="button"
              onClick={() => setColorPalette('gold')}
              className={`p-4 rounded-xl text-left transition-all flex items-center justify-between ${
                colorPalette === 'gold'
                  ? 'bg-amber-950/40 border-2 border-amber-500 shadow-lg shadow-amber-500/20'
                  : 'bg-zinc-950 border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div>
                <div className="font-bold text-white text-xs">Dourado Solar</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Preto profundo + Champanhe</div>
              </div>
              <div className="w-5 h-5 rounded-full bg-amber-400 shadow-md shadow-amber-400/50 flex items-center justify-center">
                {colorPalette === 'gold' && <Check className="w-3 h-3 text-zinc-950" />}
              </div>
            </button>

            {/* Verde Esmeralda */}
            <button
              type="button"
              onClick={() => setColorPalette('emerald')}
              className={`p-4 rounded-xl text-left transition-all flex items-center justify-between ${
                colorPalette === 'emerald'
                  ? 'bg-emerald-950/40 border-2 border-emerald-500 shadow-lg shadow-emerald-500/20'
                  : 'bg-zinc-950 border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div>
                <div className="font-bold text-white text-xs">Verde Esmeralda</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Alta nitidez clínica e suave</div>
              </div>
              <div className="w-5 h-5 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/50 flex items-center justify-center">
                {colorPalette === 'emerald' && <Check className="w-3 h-3 text-white" />}
              </div>
            </button>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Alterações</span>
          </button>
        </div>
      </form>
    </div>
  );
};

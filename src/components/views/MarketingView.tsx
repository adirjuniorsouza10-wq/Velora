import React, { useState } from 'react';
import { useVelora } from '../../context/VeloraContext';
import { 
  Megaphone, 
  Sparkles, 
  Send, 
  Users, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Share2
} from 'lucide-react';

export const MarketingView: React.FC = () => {
  const { campaigns, triggerCampaign, activeTenant, customers } = useVelora();
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(campaigns[0]?.id || '');
  const [dispatchSuccess, setDispatchSuccess] = useState<string | null>(null);

  const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId) || campaigns[0];

  const handleDispatch = (id: string) => {
    triggerCampaign(id);
    setDispatchSuccess(`Campanha enviada com sucesso para ${selectedCampaign.estimatedReach} clientes via WhatsApp!`);
    setTimeout(() => setDispatchSuccess(null), 4000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-zinc-950">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <Megaphone className="w-4 h-4" />
            <span>Automação &amp; Crescimento • {activeTenant.name}</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Marketing &amp; WhatsApp</h1>
          <p className="text-xs text-zinc-400">
            Campanhas de reativação de clientes, promoções para horários ociosos e fidelização.
          </p>
        </div>

        {dispatchSuccess && (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{dispatchSuccess}</span>
          </div>
        )}
      </div>

      {/* Grid: 2 Columns - Campaign List & Template Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign List */}
        <div className="lg:col-span-1 space-y-3">
          <span className="text-xs font-bold text-white uppercase tracking-wider block mb-2">
            Campanhas Cadastradas ({campaigns.length})
          </span>

          {campaigns.map(camp => {
            const isSelected = selectedCampaign?.id === camp.id;

            return (
              <div
                key={camp.id}
                onClick={() => setSelectedCampaignId(camp.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500 shadow-md shadow-amber-500/10'
                    : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-white text-xs">{camp.title}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    camp.status === 'sent'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : camp.status === 'active'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}>
                    {camp.status === 'sent' ? 'Enviada' : camp.status === 'active' ? 'Ativa' : 'Rascunho'}
                  </span>
                </div>

                <p className="text-[11px] text-zinc-400 line-clamp-2">
                  {camp.targetAudience}
                </p>

                <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-2 border-t border-zinc-800/60">
                  <span className="flex items-center gap-1 text-zinc-300">
                    <Users className="w-3 h-3 text-amber-400" />
                    <span>~{camp.estimatedReach} clientes</span>
                  </span>
                  <span className="text-emerald-400 font-semibold">
                    ~{camp.conversionRate}% conversão
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Campaign Details & Action */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-6">
          {selectedCampaign ? (
            <>
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>Mensagem Oficial via WhatsApp Business</span>
                </div>
                <h3 className="text-lg font-bold text-white">{selectedCampaign.title}</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Público Alvo: <strong className="text-zinc-200">{selectedCampaign.targetAudience}</strong>
                </p>
              </div>

              {/* Message Simulator Box */}
              <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span>Prévia da Mensagem Personalizada</span>
                  <span className="text-emerald-400 font-medium">WhatsApp Cloud API</span>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-700/80 text-xs text-zinc-200 leading-relaxed font-sans shadow-inner">
                  {selectedCampaign.messageTemplate
                    .replace('{nome}', 'Renato')
                    .replace('{empresa}', activeTenant.name)
                    .replace('{link}', activeTenant.bookingUrl)}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                  <span>Tags dinâmicas:</span>
                  <span className="px-1.5 py-0.5 rounded bg-zinc-800 font-mono text-zinc-300">&#123;nome&#125;</span>
                  <span className="px-1.5 py-0.5 rounded bg-zinc-800 font-mono text-zinc-300">&#123;empresa&#125;</span>
                  <span className="px-1.5 py-0.5 rounded bg-zinc-800 font-mono text-zinc-300">&#123;link&#125;</span>
                </div>
              </div>

              {/* Stats & Trigger */}
              <div className="p-4 bg-zinc-950/70 rounded-2xl border border-zinc-800 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase">Alcance Estimado</div>
                  <div className="text-base font-bold text-white font-mono mt-0.5">
                    {selectedCampaign.estimatedReach} clientes
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-zinc-500 uppercase">Taxa de Conversão</div>
                  <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">
                    ~{selectedCampaign.conversionRate}%
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-zinc-500 uppercase">Canal</div>
                  <div className="text-base font-bold text-white mt-0.5 capitalize">
                    {selectedCampaign.channel}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  onClick={() => handleDispatch(selectedCampaign.id)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-zinc-950 font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Disparar Campanha para {selectedCampaign.estimatedReach} Clientes</span>
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-zinc-500 text-xs">
              Selecione uma campanha para visualizar os detalhes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

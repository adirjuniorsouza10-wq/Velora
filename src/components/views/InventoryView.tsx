import React, { useState } from 'react';
import { useVelora } from '../../context/VeloraContext';
import { 
  Package, 
  Plus, 
  AlertTriangle, 
  TrendingUp, 
  Search, 
  Filter, 
  ArrowUp, 
  ArrowDown, 
  Boxes,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { formatCurrency, formatDatePtBR } from '../../utils/formatters';

export const InventoryView: React.FC = () => {
  const { inventory, updateInventoryStock, addInventoryItem, activeTenant } = useVelora();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newModalOpen, setNewModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'styling' | 'care' | 'supplies' | 'beverage'>('styling');
  const [sku, setSku] = useState('');
  const [currentStock, setCurrentStock] = useState(10);
  const [minStock, setMinStock] = useState(5);
  const [costPriceReais, setCostPriceReais] = useState(25);
  const [salePriceReais, setSalePriceReais] = useState(60);
  const [unit, setUnit] = useState('unid');

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockCount = inventory.filter(i => i.currentStock <= i.minStock).length;
  const totalStockItems = inventory.reduce((acc, i) => acc + i.currentStock, 0);
  const totalStockValuation = inventory.reduce((acc, i) => acc + (i.currentStock * i.costPriceInCents), 0);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addInventoryItem({
      tenantId: activeTenant.id,
      name,
      category,
      sku: sku || `SKU-${Date.now().toString().slice(-6)}`,
      currentStock: Number(currentStock),
      minStock: Number(minStock),
      costPriceInCents: Math.round(Number(costPriceReais) * 100),
      salePriceInCents: Math.round(Number(salePriceReais) * 100),
      unit
    });

    setNewModalOpen(false);
    setName('');
    setSku('');
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'styling': return 'Finalização & Styling';
      case 'care': return 'Cuidados & Barba';
      case 'supplies': return 'Insumos & Lâminas';
      case 'beverage': return 'Bebidas & Bar';
      default: return cat;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-zinc-950">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <Package className="w-4 h-4" />
            <span>Controle de Estoque &amp; Insumos • {activeTenant.name}</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Estoque da Barbearia</h1>
          <p className="text-xs text-zinc-400">
            Pomadas, óleos, insumos descartáveis e bebidas comercializadas na bancada.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar item ou SKU..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 outline-none w-48 focus:border-amber-500"
            />
          </div>

          <button
            onClick={() => setNewModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Produto</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-[10px] uppercase font-bold text-zinc-400">Total de Unidades em Estoque</span>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {totalStockItems} unidades
          </div>
          <div className="text-xs text-zinc-400 mt-1">{inventory.length} produtos cadastrados</div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-[10px] uppercase font-bold text-amber-400">Patrimônio em Estoque (Custo)</span>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">
            {formatCurrency(totalStockValuation)}
          </div>
          <div className="text-xs text-zinc-400 mt-1">Valor investido em mercadorias</div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-[10px] uppercase font-bold text-zinc-400">Alerta de Reposição</span>
          <div className={`text-2xl font-black font-mono mt-1 ${lowStockCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {lowStockCount} {lowStockCount === 1 ? 'item crítico' : 'itens críticos'}
          </div>
          <div className="text-xs text-zinc-400 mt-1">Abaixo do estoque mínimo de segurança</div>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] uppercase font-bold text-zinc-500 bg-zinc-900/90 border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Item &amp; Categoria</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Preço Venda</th>
                <th className="py-3 px-4">Margem Bruta</th>
                <th className="py-3 px-4">Estoque Atual</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ajuste Rápido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {filteredInventory.map(item => {
                const isLow = item.currentStock <= item.minStock;
                const marginPercent = item.salePriceInCents > 0
                  ? Math.round(((item.salePriceInCents - item.costPriceInCents) / item.salePriceInCents) * 100)
                  : 0;

                return (
                  <tr key={item.id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white text-xs">{item.name}</div>
                      <div className="text-[10px] text-zinc-500">{getCategoryLabel(item.category)}</div>
                    </td>

                    <td className="py-3 px-4 font-mono text-zinc-400 text-[11px]">
                      {item.sku}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-white">
                      {item.salePriceInCents > 0 ? formatCurrency(item.salePriceInCents) : 'Insumo Interno'}
                    </td>

                    <td className="py-3 px-4">
                      {item.salePriceInCents > 0 ? (
                        <span className="text-emerald-400 font-mono font-bold text-xs">
                          {marginPercent}%
                        </span>
                      ) : (
                        <span className="text-zinc-500">—</span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-sm text-white">
                      {item.currentStock} {item.unit}
                    </td>

                    <td className="py-3 px-4">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Repor Estoque</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Normal</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => updateInventoryStock(item.id, -1)}
                        className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs"
                        title="Registrar Saída (-1)"
                      >
                        -1
                      </button>
                      <button
                        onClick={() => updateInventoryStock(item.id, 1)}
                        className="px-2 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-sm"
                        title="Registrar Entrada (+1)"
                      >
                        +1
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Product Modal */}
      {newModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-400" />
              <span>Cadastrar Novo Produto / Insumo</span>
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              Controle de quantidade, preço de custo e margem de revenda.
            </p>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-300 font-semibold mb-1 block">Nome do Produto *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Cera Matte Argila Modeladora"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-semibold mb-1 block">Categoria</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white outline-none focus:border-amber-500"
                  >
                    <option value="styling">Finalização &amp; Styling</option>
                    <option value="care">Cuidados &amp; Barba</option>
                    <option value="supplies">Insumos &amp; Lâminas</option>
                    <option value="beverage">Bebidas &amp; Bar</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-300 font-semibold mb-1 block">Código SKU / Ref</label>
                  <input
                    type="text"
                    placeholder="Ex: POM-001"
                    value={sku}
                    onChange={e => setSku(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-semibold mb-1 block">Estoque Inicial</label>
                  <input
                    type="number"
                    min={0}
                    value={currentStock}
                    onChange={e => setCurrentStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-zinc-300 font-semibold mb-1 block">Estoque Mínimo (Alerta)</label>
                  <input
                    type="number"
                    min={1}
                    value={minStock}
                    onChange={e => setMinStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-semibold mb-1 block">Preço de Custo (R$)</label>
                  <input
                    type="number"
                    min={0}
                    value={costPriceReais}
                    onChange={e => setCostPriceReais(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-zinc-300 font-semibold mb-1 block">Preço de Venda (R$)</label>
                  <input
                    type="number"
                    min={0}
                    value={salePriceReais}
                    onChange={e => setSalePriceReais(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setNewModalOpen(false)}
                  className="px-4 py-2 text-zinc-400 hover:bg-zinc-800 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold"
                >
                  Cadastrar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

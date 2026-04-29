'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Loader2, LayoutGrid, Plus, Trash2, Save, X, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

interface Seat   { number: string; status: 'available' | 'reserved'; }
interface Row    { label: string; seats: Seat[]; }
interface Section { name: string; color: string; rows: Row[]; }
interface SeatMap { id: number; name: string; eventId?: number; sections: Section[]; totalSeats: number; createdAt: string; }

const COLORS = ['#c89c6b','#112b38','#2a6b8a','#e8b87a','#7c3aed','#059669'];

function buildSection(name = 'Section A'): Section {
  return { name, color: COLORS[0], rows: [{ label: 'Row 1', seats: Array.from({ length: 10 }, (_, i) => ({ number: String(i + 1), status: 'available' })) }] };
}

export default function SeatsPage() {
  const [maps, setMaps] = useState<SeatMap[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editing, setEditing] = useState<SeatMap | null>(null);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  // Builder state
  const [mapName, setMapName] = useState('');
  const [sections, setSections] = useState<Section[]>([buildSection()]);

  const load = () => {
    api.get('/seats').then(res => setMaps(res.data.maps || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setMapName(''); setSections([buildSection()]); setShowBuilder(true); };
  const openEdit = (m: SeatMap) => { setEditing(m); setMapName(m.name); setSections(JSON.parse(JSON.stringify(m.sections))); setShowBuilder(true); };

  const addSection = () => setSections(s => [...s, buildSection(`Section ${String.fromCharCode(65 + s.length)}`)]);
  const removeSection = (i: number) => setSections(s => s.filter((_, idx) => idx !== i));

  const addRow = (si: number) => setSections(s => {
    const copy = [...s];
    copy[si] = { ...copy[si], rows: [...copy[si].rows, { label: `Row ${copy[si].rows.length + 1}`, seats: Array.from({ length: 10 }, (_, i) => ({ number: String(i + 1), status: 'available' })) }] };
    return copy;
  });
  const removeRow = (si: number, ri: number) => setSections(s => {
    const copy = [...s]; copy[si] = { ...copy[si], rows: copy[si].rows.filter((_, idx) => idx !== ri) }; return copy;
  });
  const updateRowSeats = (si: number, ri: number, count: number) => setSections(s => {
    const copy = [...s];
    copy[si].rows[ri].seats = Array.from({ length: Math.max(1, count) }, (_, i) => ({ number: String(i + 1), status: 'available' }));
    return copy;
  });
  const updateSectionField = (si: number, field: 'name' | 'color', val: string) => setSections(s => {
    const copy = [...s]; (copy[si] as any)[field] = val; return copy;
  });

  const handleSave = async () => {
    if (!mapName.trim()) return toast.error('Map name is required');
    setSaving(true);
    try {
      if (editing) {
        const { data } = await api.patch(`/seats/${editing.id}`, { name: mapName, sections });
        setMaps(prev => prev.map(m => m.id === editing.id ? data.map : m));
        toast.success('Seat map updated');
      } else {
        const { data } = await api.post('/seats', { name: mapName, sections });
        setMaps(prev => [data.map, ...prev]);
        toast.success('Seat map created');
      }
      setShowBuilder(false);
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/seats/${id}`).catch(() => {});
    setMaps(prev => prev.filter(m => m.id !== id));
    toast.success('Deleted');
  };

  const inp = 'px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]';

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#c89c6b] flex items-center justify-center"><LayoutGrid className="w-4 h-4 text-white" /></div>
          <div>
            <h1 className="text-2xl font-bold text-[#112b38]">Seats Maps</h1>
            <p className="text-sm text-gray-500">Design and manage event seating layouts — stored in database</p>
          </div>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#112b38] text-white rounded-xl text-sm font-semibold hover:bg-[#0d2030] border border-[#c89c6b]/30">
          <Plus className="w-4 h-4" /> New Seat Map
        </button>
      </div>

      {/* Builder modal */}
      {showBuilder && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-[#112b38]">{editing ? 'Edit' : 'New'} Seat Map</h2>
              <button onClick={() => setShowBuilder(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Map Name</label>
                <input value={mapName} onChange={e => setMapName(e.target.value)} className={inp + ' w-full'} placeholder="e.g. Main Hall" />
              </div>

              {sections.map((sec, si) => (
                <div key={si} className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <input value={sec.name} onChange={e => updateSectionField(si, 'name', e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-200 rounded text-sm font-semibold text-[#112b38]" />
                    <input type="color" value={sec.color} onChange={e => updateSectionField(si, 'color', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border border-gray-200" />
                    <button onClick={() => removeSection(si)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="p-4 space-y-3">
                    {sec.rows.map((row, ri) => (
                      <div key={ri} className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-12 flex-shrink-0">{row.label}</span>
                        <div className="flex gap-1 flex-wrap flex-1">
                          {row.seats.map((seat, seatIdx) => (
                            <div key={seatIdx} className="w-6 h-6 rounded text-xs flex items-center justify-center font-bold text-white"
                              style={{ backgroundColor: sec.color, fontSize: 9 }}>{seat.number}</div>
                          ))}
                        </div>
                        <input type="number" min={1} max={50} defaultValue={row.seats.length}
                          onBlur={e => updateRowSeats(si, ri, Number(e.target.value))}
                          className="w-16 px-2 py-1 border border-gray-200 rounded text-xs text-center" />
                        <button onClick={() => removeRow(si, ri)} className="text-gray-300 hover:text-red-400"><X className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                    <button onClick={() => addRow(si)}
                      className="text-xs text-[#c89c6b] font-semibold flex items-center gap-1 hover:underline">
                      <Plus className="w-3.5 h-3.5" /> Add Row
                    </button>
                  </div>
                </div>
              ))}

              <button onClick={addSection}
                className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-[#c89c6b] hover:text-[#c89c6b] transition-colors flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Section
              </button>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Total seats: <strong>{sections.reduce((s, sec) => s + sec.rows.reduce((rs, r) => rs + r.seats.length, 0), 0)}</strong>
                </p>
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#c89c6b] text-white font-semibold rounded-xl text-sm hover:bg-[#b8885a] disabled:opacity-60">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Map
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#c89c6b]" /></div>
      ) : maps.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center">
          <LayoutGrid className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No seat maps yet</p>
          <button onClick={openNew} className="mt-4 px-4 py-2 bg-[#c89c6b] text-white rounded-lg text-sm font-semibold">Create First Map</button>
        </div>
      ) : (
        <div className="space-y-3">
          {maps.map(m => (
            <div key={m.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <h3 className="font-bold text-[#112b38]">{m.name}</h3>
                  <p className="text-xs text-gray-500">{m.totalSeats} seats · {m.sections.length} sections · {new Date(m.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(m)}
                    className="px-3 py-1.5 border border-[#c89c6b] text-[#c89c6b] hover:bg-[#c89c6b] hover:text-white rounded-lg text-xs font-semibold transition-colors">Edit</button>
                  <button onClick={() => handleDelete(m.id)}
                    className="px-3 py-1.5 border border-red-200 text-red-400 hover:bg-red-50 rounded-lg text-xs font-semibold"><Trash2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setExpanded(expanded === m.id ? null : m.id)} className="text-gray-400">
                    {expanded === m.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {expanded === m.id && (
                <div className="px-5 pb-5 border-t border-gray-50 pt-4 space-y-4">
                  {m.sections.map((sec, si) => (
                    <div key={si}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sec.color }} />
                        <span className="text-sm font-semibold text-gray-700">{sec.name}</span>
                      </div>
                      {sec.rows.map((row, ri) => (
                        <div key={ri} className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-gray-400 w-12">{row.label}</span>
                          <div className="flex gap-0.5 flex-wrap">
                            {row.seats.map((seat, si2) => (
                              <div key={si2} className="w-5 h-5 rounded text-white flex items-center justify-center"
                                style={{ backgroundColor: sec.color, fontSize: 8 }}>{seat.number}</div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, RefreshCw, X, ShoppingBag, Search, Trash2, Tag } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    if (!supabase) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('id', { ascending: false });

    if (!error && data) {
      setServices(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchServices();
  }, [fetchServices]);

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (!supabase) return;
      
      const { error } = await supabase.from('services').insert([
        {
          id: crypto.randomUUID(),
          name: name,
          price: parseFloat(price) || 0,
          unit: unit,
        },
      ]);

      if (error) {
        alert('Lỗi thêm dịch vụ: ' + error.message);
      } else {
        setIsModalOpen(false);
        setName('');
        setPrice('');
        setUnit('');
        void fetchServices();
      }
    } catch (err: any) {
      alert('Lỗi: ' + (err.message || err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteService = async (service: any) => {
    if (!supabase) return;
    if (!window.confirm(`Bạn có chắc chắn muốn xóa dịch vụ "${service.name}" không?`)) return;

    setDeletingId(service.id);
    const { error } = await supabase.from('services').delete().eq('id', service.id);
    setDeletingId(null);

    if (!error) {
      setServices((current) => current.filter((s) => s.id !== service.id));
    } else {
      alert('Không xóa được dịch vụ: ' + error.message);
    }
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filtered = services.filter(
    (s) =>
      (s.name || '').toLowerCase().includes(normalizedSearch) ||
      (s.unit || '').toLowerCase().includes(normalizedSearch)
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
           Sân bóng Đế Vương
          </span>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '4px 0 8px 0', color: '#0f172a' }}>Dịch vụ đi kèm</h1>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Quản lý nước uống, cho thuê giày, áo đấu và các dịch vụ khác.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 16px', fontWeight: 600, cursor: 'pointer' }}
          >
            <Plus size={16} /> Thêm dịch vụ
          </button>
          <button
            onClick={() => void fetchServices()}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fff', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 16px', cursor: 'pointer', fontWeight: 500 }}
          >
            <RefreshCw size={16} /> Làm mới
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#0f172a' }}>
            <ShoppingBag size={20} color="#0284c7" /> Danh sách dịch vụ ({filtered.length})
          </div>
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Tìm kiếm dịch vụ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', width: '100%', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Tên dịch vụ</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Đơn giá (VNĐ)</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Đơn vị tính</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'center' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>Đang tải danh sách dịch vụ...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>Chưa có dịch vụ nào trong hệ thống.</td>
                </tr>
              ) : (
                filtered.map((s, i) => (
                  <tr key={s.id || i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 500, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Tag size={16} color="#0284c7" /> {s.name}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#059669', fontWeight: 600 }}>
                      {Number(s.price).toLocaleString('vi-VN')} đ
                    </td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{s.unit || '—'}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <button
                        onClick={() => void handleDeleteService(s)}
                        disabled={deletingId === s.id}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          backgroundColor: '#fff',
                          color: '#ef4444',
                          border: '1px solid #fca5a5',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          fontWeight: 500
                        }}
                      >
                        <Trash2 size={14} />
                        <span>{deletingId === s.id ? 'Đang xóa...' : 'Xóa'}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', width: '100%', maxWidth: '420px', padding: '24px', position: 'relative', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}>
              <X size={20} />
            </button>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>Thêm dịch vụ mới</h2>
            <form onSubmit={handleAddService} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Tên dịch vụ *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Nước suối Aquafina, Thuê giày..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Đơn giá (VNĐ) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="VD: 10000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Đơn vị tính</label>
                <input
                  type="text"
                  placeholder="VD: Chai, Đôi, Bộ, Giờ..."
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', color: '#334155', cursor: 'pointer' }}>Hủy</button>
                <button type="submit" disabled={submitting} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#0284c7', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
                  {submitting ? 'Đang lưu...' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
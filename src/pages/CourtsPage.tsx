import React, { useState } from 'react';
import { Layers, Plus, Edit, Trash2, CheckCircle2, Clock, Wrench, X } from 'lucide-react';

type Court = {
  id: string;
  name: string;
  type: '5' | '7';
  pricePerHour: number;
  status: 'available' | 'occupied' | 'maintenance';
};

export default function CourtsPage() {
  const [courts, setCourts] = useState<Court[]>([
    { id: '1', name: 'Sân 1 (Sân 5 người)', type: '5', pricePerHour: 200000, status: 'available' },
    { id: '2', name: 'Sân 2 (Sân 5 người)', type: '5', pricePerHour: 200000, status: 'occupied' },
    { id: '3', name: 'Sân 3 (Sân 5 người)', type: '5', pricePerHour: 200000, status: 'available' },
    { id: '4', name: 'Sân Lớn 1 (Sân 7 người)', type: '7', pricePerHour: 350000, status: 'available' },
    { id: '5', name: 'Sân Lớn 2 (Sân 7 người)', type: '7', pricePerHour: 350000, status: 'maintenance' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courtName, setCourtName] = useState('');
  const [courtType, setCourtType] = useState<'5' | '7'>('5');
  const [price, setPrice] = useState(200000);

  const handleAddCourt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courtName) return;

    const newCourt: Court = {
      id: Date.now().toString(),
      name: courtName,
      type: courtType,
      pricePerHour: Number(price),
      status: 'available',
    };

    setCourts([...courts, newCourt]);
    setIsModalOpen(false);
    setCourtName('');
  };

  const deleteCourt = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa sân này?')) {
      setCourts(courts.filter(c => c.id !== id));
    }
  };

  const getStatusBadge = (status: Court['status']) => {
    switch (status) {
      case 'available':
        return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, backgroundColor: '#dcfce7', color: '#16a34a' }}><CheckCircle2 size={14} /> Sân trống</span>;
      case 'occupied':
        return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, backgroundColor: '#fee2e2', color: '#dc2626' }}><Clock size={14} /> Đang đá</span>;
      case 'maintenance':
        return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, backgroundColor: '#fef9c3', color: '#ca8a04' }}><Wrench size={14} /> Bảo trì</span>;
    }
  };

  return (
    <div>
      {/* Header trang */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
           Sân bóng Đế Vương
          </span>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '4px 0 8px 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Layers size={28} color="#0284c7" /> Danh sách sân bóng
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
            Quản lý thông tin sân 5 người & 7 người và cập nhật trạng thái sân[cite: 10].
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#0284c7',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 18px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(2, 132, 199, 0.2)'
          }}
        >
          <Plus size={18} />
          <span>Thêm sân mới</span>
        </button>
      </div>

      {/* DANH SÁCH THẺ SÂN BÓNG */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {courts.map((court) => (
          <div key={court.id} style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>{court.name}</h3>
                {getStatusBadge(court.status)}
              </div>

              <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
                <div>Loại sân: <strong style={{ color: '#334155' }}>Sân {court.type} người</strong></div>
                <div>Giá thuê: <strong style={{ color: '#0284c7', fontSize: '16px' }}>{court.pricePerHour.toLocaleString('vi-VN')} đ/giờ</strong></div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: '12px' }}>
              <button
                onClick={() => deleteCourt(court.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#fff', color: '#ef4444', border: '1px solid #fca5a5', borderRadius: '6px', padding: '6px 12px', fontSize: '13px', cursor: 'pointer', flex: 1, justifyContent: 'center' }}
              >
                <Trash2 size={14} /> Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL THÊM SÂN MỚI */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', width: '100%', maxWidth: '420px', padding: '24px', position: 'relative' }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}>
              <X size={20} />
            </button>

            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#0f172a' }}>Thêm sân bóng mới</h2>

            <form onSubmit={handleAddCourt} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Tên sân *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Sân 4 (Sân 5 người)"
                  value={courtName}
                  onChange={(e) => setCourtName(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Loại sân</label>
                <select
                  value={courtType}
                  onChange={(e) => {
                    const type = e.target.value as '5' | '7';
                    setCourtType(type);
                    setPrice(type === '7' ? 350000 : 200000);
                  }}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                >
                  <option value="5">Sân 5 người</option>
                  <option value="7">Sân 7 người</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Giá thuê (VNĐ / giờ)</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#334155', cursor: 'pointer' }}>Hủy</button>
                <button type="submit" style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#0284c7', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Tạo sân mới</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
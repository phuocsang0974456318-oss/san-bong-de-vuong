import React, { useState } from 'react';
import { Settings, Save, Shield, Database, Phone, MapPin, Building, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [stadiumName, setStadiumName] = useState('Sân bóng Đế Vương');
  const [hotline, setHotline] = useState('0901234567');
  const [address, setAddress] = useState('Số 123, Đường Thể Thao, TP.HCM');
  const [openTime, setOpenTime] = useState('06:00 - 23:00');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ padding: '0 8px' }}>
      {/* Tiêu đề trang */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#d4af37', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Hệ Thống Quản Trị
          </span>
          <h1 style={{ fontSize: '26px', fontWeight: 'normal', margin: '4px 0 6px 0', color: '#0f172a', fontFamily: '"Georgia", serif' }}>
            Cài đặt hệ thống
          </h1>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>Quản lý thông tin cấu hình sân bóng và thông số vận hành.</p>
        </div>
      </div>

      {saved && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '12px 16px', borderRadius: '4px', fontSize: '13px', marginBottom: '20px' }}>
          <CheckCircle2 size={18} color="#16a34a" />
          <span>Đã lưu cấu hình hệ thống thành công!</span>
        </div>
      )}

      {/* Khung nội dung chính phong cách cổ điển sang trọng */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>
        
        {/* Cột trái: Form cấu hình */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #e2e8f0', padding: '28px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
            <Building size={20} color="#d4af37" /> Thông tin cơ sở sân bóng
          </div>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tên sân bóng</label>
              <input
                type="text"
                value={stadiumName}
                onChange={(e) => setStadiumName(e.target.value)}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Số điện thoại liên hệ</label>
                <input
                  type="text"
                  value={hotline}
                  onChange={(e) => setHotline(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Giờ hoạt động</label>
                <input
                  type="text"
                  value={openTime}
                  onChange={(e) => setOpenTime(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Địa chỉ cơ sở</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button
                type="submit"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#0f172a', color: '#d4af37', border: '1px solid #d4af37', borderRadius: '4px', padding: '10px 20px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '0.5px', textTransform: 'uppercase', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
              >
                <Save size={16} /> Lưu thay đổi
              </button>
            </div>
          </form>
        </div>

        {/* Cột phải: Thẻ trạng thái hệ thống */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>
              <Database size={18} color="#d4af37" /> Trạng thái cơ sở dữ liệu
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#475569' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Trạng thái kết nối:</span>
                <span style={{ color: '#16a34a', fontWeight: 600 }}>Hoạt động (Stable)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Nền tảng Cloud:</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>Supabase PostgreSQL</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Phiên bản giao diện:</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>v2.5 Luxury</span>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#0f172a', borderRadius: '6px', border: '1px solid #d4af37', padding: '20px', color: '#f8fafc' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: '#d4af37', marginBottom: '8px' }}>
              <Shield size={16} /> Bảo mật quản trị
            </div>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, lineHeight: '1.5' }}>
              Hệ thống được bảo vệ bằng mã hóa token phiên làm việc và xác thực qua bảng phân quyền quản trị.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
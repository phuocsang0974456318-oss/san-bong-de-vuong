import { MapPin, Phone } from 'lucide-react';

export default function Navbar() {
  return (
    <div className="w-full font-sans shadow-sm">
      {/* 1. Thanh thông tin trên cùng (Địa chỉ & Hotline) */}
      <div className="bg-white border-b border-gray-200 text-xs py-2 px-6 md:px-12 flex flex-col sm:flex-row justify-between items-center text-gray-700 gap-2">
        <div className="flex items-center gap-1.5">
          <MapPin size={14} className="text-gray-600 flex-shrink-0" />
          <span>206/9 Trệt Trần Hưng Đạo, Phường Chợ Lớn, TPHCM</span>
        </div>
        <div className="flex items-center gap-1.5 font-semibold">
          <Phone size={14} className="text-gray-600 flex-shrink-0" />
          <span>Số điện thoại: 0373860221</span>
        </div>
      </div>

      {/* 2. Thanh Menu đỏ chính */}
      <header className="bg-[#cc0000] text-white">
        <div className="max-w-7xl mx-auto px-6 h-20 flex flex-col md:flex-row justify-between items-center">
          
          {/* Logo / Tên thương hiệu */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col tracking-wider font-extrabold text-sm md:text-base leading-tight">
              <div className="flex items-end gap-1">
                {/* Icon phác thảo logo đỉnh núi trắng */}
                <svg className="w-10 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M3 20L10 8L15 14L21 6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-[10px] tracking-[0.2em] font-bold text-white/90">SÂN BÓNG ĐẾ VƯƠNG</span>
            </div>
          </div>

          {/* Các mục Menu điều hướng */}
          <nav className="flex flex-wrap justify-center gap-6 md:gap-8 font-bold text-sm tracking-wide uppercase">
            <a href="#" className="hover:text-yellow-200 transition-colors py-2">TRANG CHỦ</a>
            <a href="#" className="hover:text-yellow-200 transition-colors py-2">GIỚI THIỆU</a>
            <a href="#" className="text-yellow-200 transition-colors py-2 border-b-2 border-white">THUÊ SÂN</a>
            <a href="#" className="hover:text-yellow-200 transition-colors py-2">KHÓA HỌC</a>
            <a href="#" className="hover:text-yellow-200 transition-colors py-2">TIN TỨC</a>
            <a href="#" className="hover:text-yellow-200 transition-colors py-2">LIÊN HỆ</a>
          </nav>

        </div>
      </header>
    </div>
  );
}
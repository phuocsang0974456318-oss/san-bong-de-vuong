import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Phone,
  ShieldCheck,
  Trophy,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { SiteContent } from '../lib/siteContent';

export default function SiteFooter({ siteContent }: { siteContent: SiteContent }) {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteContent.address)}`;
  const zaloUrl = `https://zalo.me/${siteContent.phone.replace(/\D/g, '')}`;

  return (
    <footer className="site-footer">
      <div className="site-footer__background" aria-hidden="true" />
      <div className="site-footer__inner">
        <section className="footer-cta">
          <div className="footer-cta__copy">
            <span className="footer-cta__eyebrow"><Trophy size={15} aria-hidden="true" /> SÂN BÓNG ĐẾ VƯƠNG</span>
            <h2>Sẵn sàng cho trận đấu tiếp theo?</h2>
            <p>Liên hệ với sân để hỏi lịch trống và chọn khung giờ phù hợp cho đội bóng.</p>
          </div>
          <div className="footer-cta__actions">
            <Link to="/booking"><CalendarDays size={17} aria-hidden="true" /> Gửi yêu cầu đặt sân</Link>
            <a href={zaloUrl} target="_blank" rel="noreferrer">Nhắn Zalo <ArrowRight size={16} aria-hidden="true" /></a>
          </div>
        </section>

        <div className="footer-columns">
          <section className="footer-brand">
            <Link to="/" className="footer-brand__logo">
              <span className="footer-brand__mark" aria-hidden="true">
                <svg viewBox="0 0 100 56" fill="none">
                  <path d="M5 50 29 20l10 13L62 5l32 40M31 47l17-22 9 11" />
                </svg>
              </span>
              <span><strong>Sân Bóng</strong><b>ĐẾ VƯƠNG</b></span>
            </Link>
            <p className="footer-brand__description">
              Điểm hẹn cho những trận cầu sôi động. Liên hệ trực tiếp để được hỗ trợ đặt sân và xác nhận khung giờ.
            </p>
            <a className="footer-contact-card" href={`tel:${siteContent.phone}`}>
              <span><Phone size={17} aria-hidden="true" /></span>
              <span><strong>{siteContent.phone}</strong><small>Gọi để được hỗ trợ đặt sân</small></span>
            </a>
            <a className="footer-contact-card" href={mapUrl} target="_blank" rel="noreferrer">
              <span><MapPin size={17} aria-hidden="true" /></span>
              <span><strong>Địa chỉ sân</strong><small>{siteContent.address}</small></span>
            </a>
          </section>

          <nav className="footer-link-column" aria-label="Dành cho khách hàng">
            <h3>DÀNH CHO KHÁCH HÀNG</h3>
            <Link to="/schedule">Tìm sân bóng</Link>
            <Link to="/booking">Gửi yêu cầu đặt sân</Link>
            <Link to="/contact">Thông tin liên hệ</Link>
            <Link to="/register">Tạo tài khoản khách hàng</Link>
            <Link to="/login">Đăng nhập</Link>
          </nav>

          <nav className="footer-link-column" aria-label="Thông tin sân bóng">
            <h3>THÔNG TIN SÂN BÓNG</h3>
            <a href="/#courts">Sân bóng 5 người</a>
            <a href="/#courts">Sân bóng 7 người</a>
            <a href="/#how-it-works">Hướng dẫn đặt sân</a>
            <Link to="/contact">Câu hỏi và hỗ trợ</Link>
            <span className="footer-trust"><ShieldCheck size={16} aria-hidden="true" /> Xác nhận lịch trực tiếp với sân</span>
          </nav>

          <section className="footer-location">
            <h3>ĐỊA ĐIỂM</h3>
            <div className="footer-location__card">
              <MapPin size={18} aria-hidden="true" />
              <div>
                <strong>Sân bóng Đế Vương</strong>
                <p>{siteContent.address}</p>
              </div>
            </div>
            <a className="footer-location__map" href={mapUrl} target="_blank" rel="noreferrer">
              Mở Google Maps <ArrowRight size={15} aria-hidden="true" />
            </a>
          </section>
        </div>

        <div className="site-footer__bottom">
          <span>© {new Date().getFullYear()} Sân bóng Đế Vương </span>
          <span>Đồng hành cùng đam mê bóng đá</span>
        </div>
      </div>
    </footer>
  );
}

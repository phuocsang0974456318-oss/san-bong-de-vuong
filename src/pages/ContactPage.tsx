import { CalendarCheck, MapPin, MessageCircle, Phone, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { defaultSiteContent, type SiteContent } from '../lib/siteContent';

const supportHighlights = [
  { icon: Zap, text: 'Phản hồi trực tiếp qua điện thoại và Zalo' },
  { icon: ShieldCheck, text: 'Xác nhận lịch sân trước khi đặt' },
  { icon: CalendarCheck, text: 'Hỗ trợ chọn khung giờ phù hợp' },
];

export default function ContactPage({ siteContent = defaultSiteContent }: { siteContent?: SiteContent }) {
  const { session } = useAuth();
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteContent.address)}`;
  const zaloUrl = `https://zalo.me/${siteContent.phone.replace(/\D/g, '')}`;

  return (
    <div className="contact-page">
      <section className="contact-page__intro">
        <div className="contact-page__glow" aria-hidden="true" />
        <div className="contact-page__inner">
          <div className="contact-page__highlights">
            {supportHighlights.map(({ icon: Icon, text }) => (
              <span className="contact-page__highlight" key={text}>
                <Icon size={15} aria-hidden="true" /> {text}
              </span>
            ))}
          </div>
          <span className="contact-page__eyebrow">Sân bóng Đế Vương</span>
          <h1>Chúng tôi sẵn sàng<br /><span>hỗ trợ bạn</span></h1>
          <p>Liên hệ với sân để được tư vấn, kiểm tra giờ trống hoặc gửi yêu cầu đặt sân.</p>
        </div>
      </section>

      <section className="contact-page__content">
        <div className="contact-page__tabs" aria-label="Các cách liên hệ">
          <a className="contact-page__tab contact-page__tab--active" href="#support">
            <MessageCircle size={18} aria-hidden="true" /> Hỗ trợ khách hàng
          </a>
          <Link className="contact-page__tab" to="/booking">
            <CalendarCheck size={18} aria-hidden="true" /> Gửi yêu cầu đặt sân
          </Link>
        </div>

        <div className="contact-cards" id="support">
          <article className="contact-card">
            <span className="contact-card__icon contact-card__icon--green"><Phone size={21} aria-hidden="true" /></span>
            <h2>Gọi điện trực tiếp</h2>
            <strong className="contact-card__value">{siteContent.phone}</strong>
            <p>Gọi để hỏi lịch sân, giá thuê và thông tin đặt sân.</p>
            <a className="contact-card__button contact-card__button--green" href={`tel:${siteContent.phone}`}>
              <Phone size={16} aria-hidden="true" /> Gọi ngay
            </a>
          </article>

          <article className="contact-card">
            <span className="contact-card__icon contact-card__icon--blue"><MessageCircle size={21} aria-hidden="true" /></span>
            <h2>Nhắn tin Zalo</h2>
            <strong className="contact-card__value">Sân bóng Đế Vương</strong>
            <p>Nhắn tin để trao đổi nhanh về khung giờ và nhu cầu thuê sân.</p>
            <a className="contact-card__button contact-card__button--blue" href={zaloUrl} target="_blank" rel="noreferrer">
              <MessageCircle size={16} aria-hidden="true" /> Mở Zalo
            </a>
          </article>

          <article className="contact-card">
            <span className="contact-card__icon contact-card__icon--blue"><MapPin size={21} aria-hidden="true" /></span>
            <h2>Địa chỉ sân</h2>
            <strong className="contact-card__value contact-card__value--address">{siteContent.address}</strong>
            <p>Xem đường đi đến sân trên bản đồ.</p>
            <a className="contact-card__button contact-card__button--blue" href={mapsUrl} target="_blank" rel="noreferrer">
              <MapPin size={16} aria-hidden="true" /> Xem bản đồ
            </a>
          </article>

          <article className="contact-card">
            <span className="contact-card__icon contact-card__icon--dark"><CalendarCheck size={21} aria-hidden="true" /></span>
            <h2>Đặt sân trực tuyến</h2>
            <strong className="contact-card__value">Gửi yêu cầu đặt sân</strong>
            <p>Chọn loại sân, ngày và khung giờ mong muốn để gửi yêu cầu.</p>
            <Link className="contact-card__button contact-card__button--dark" to={session ? '/booking' : '/login'}>
              <CalendarCheck size={16} aria-hidden="true" /> Đặt sân ngay
            </Link>
          </article>
        </div>

        <div className="contact-page__note">
          <MapPin size={20} aria-hidden="true" />
          <div>
            <strong>Sân bóng Đế Vương</strong>
            <p>{siteContent.address}</p>
          </div>
          <a href={mapsUrl} target="_blank" rel="noreferrer">Chỉ đường</a>
        </div>
      </section>
    </div>
  );
}

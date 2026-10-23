import { useLocation } from 'react-router';
import { brand, chat } from '../../content/copy';
import { useUi } from '../../store/uiStore';
import { Icon } from '../ui/Icon';

/**
 * WhatsApp and Messenger shortcuts. Until the client's numbers are set they show a notice.
 * Hidden at checkout, where they would cover form fields on a phone.
 */
export function ChatButtons() {
  const toast = useUi((s) => s.toast);
  const { pathname } = useLocation();
  const whatsapp = brand.whatsapp
    ? `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent('Hello! I have a question about a saree.')}`
    : null;
  const messenger = brand.messenger ? `https://m.me/${brand.messenger}` : null;

  const item = (href: string | null, label: string, icon: 'whatsapp' | 'messenger', cls: string) =>
    href ? (
      <a
        className={`chat-btn ${cls}`}
        href={href}
        target="_blank"
        rel="noopener"
        aria-label={label}
      >
        <Icon name={icon} />
      </a>
    ) : (
      <button
        type="button"
        className={`chat-btn ${cls}`}
        aria-label={label}
        onClick={() => toast(chat.notSet)}
      >
        <Icon name={icon} />
      </button>
    );

  if (pathname.startsWith('/checkout')) return null;
  return (
    <div className="chat-buttons">
      {item(messenger, chat.messenger, 'messenger', 'chat-btn--messenger')}
      {item(whatsapp, chat.whatsapp, 'whatsapp', 'chat-btn--whatsapp')}
    </div>
  );
}

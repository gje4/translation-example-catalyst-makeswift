import { BookUser, Eye, Gift, Mail, Package, Settings } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { ReactNode } from 'react';

import { Link } from '~/components/link';
import { LocaleType } from '~/i18n';

interface AccountItem {
  children: ReactNode;
  description?: string;
  href: string;
  title: string;
}

const AccountItem = ({ children, title, description, href }: AccountItem) => {
  return (
    <Link
      className="flex items-center border border-gray-200 p-6 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
      href={href}
    >
      {children}
      <span>
        <h3 className="text-xl font-bold lg:text-2xl">{title}</h3>
        {description ? <p>{description}</p> : null}
      </span>
    </Link>
  );
};

interface Props {
  params: {
    locale: LocaleType;
  };
}

export default async function AccountPage({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: 'Account.Home' });

  return (
    <div className="mx-auto">
      <h1 className="my-8 text-4xl text-[#522d72] lg:my-8 lg:text-5xl">{t('heading')}</h1>

      <div className="mb-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AccountItem href="/account/orders" title={t('orders')}>
          <Package className="me-8" size={48} strokeWidth={1.5} />
        </AccountItem>
        <AccountItem href="/account/messages" title={t('messages')}>
          <Mail className="me-8" size={48} strokeWidth={1.5} />
        </AccountItem>
        <AccountItem href="/account/addresses" title={t('addresses')}>
          <BookUser className="me-8" size={48} strokeWidth={1.5} />
        </AccountItem>
        <AccountItem href="/account/wishlists" title={t('wishlists')}>
          <Gift className="me-8" size={48} strokeWidth={1.5} />
        </AccountItem>
        <AccountItem href="/account/recently-viewed" title={t('recentlyViewed')}>
          <Eye className="me-8" size={48} strokeWidth={1.5} />
        </AccountItem>
        <AccountItem href="/account/settings" title={t('settings')}>
          <Settings className="me-8" size={48} strokeWidth={1.5} />
        </AccountItem>
      </div>
    </div>
  );
}

export const runtime = 'edge';

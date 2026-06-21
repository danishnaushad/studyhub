import { SkeletonPageLayout } from '../components/SkeletonPageLayout';
import { CreditCard } from 'lucide-react';

export function SubscriptionSkeleton() {
  return (
    <SkeletonPageLayout
      title="Subscription System"
      description="Manage premium features, billing, and usage limits."
      icon={CreditCard}
      status="Future"
      architectureNodes={["Stripe Integration","Entitlements Engine","Webhook Listener"]}
      features={[{"title":"Pro Tiers","desc":"Unlock advanced AI and storage."},{"title":"Usage Tracking","desc":"Monitor API limits."},{"title":"Billing History","desc":"View past invoices."}]}
    />
  );
}

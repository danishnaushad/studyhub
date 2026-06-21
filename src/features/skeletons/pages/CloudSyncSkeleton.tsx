import { SkeletonPageLayout } from '../components/SkeletonPageLayout';
import { Cloud } from 'lucide-react';

export function CloudSyncSkeleton() {
  return (
    <SkeletonPageLayout
      title="Cloud Sync"
      description="Real-time synchronization across all your devices."
      icon={Cloud}
      status="Future"
      architectureNodes={["CRDT Engine","WebSocket Service","Local First DB"]}
      features={[{"title":"Multi-device","desc":"Seamless transition between desktop and mobile."},{"title":"Offline Mode","desc":"Study without internet."},{"title":"Conflict Resolution","desc":"Smart data merging."}]}
    />
  );
}

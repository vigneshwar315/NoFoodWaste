const STATUS_CONFIG = {
  pending_verification: { label: 'Pending Verification', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  verified: { label: 'Verified', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  validated: { label: 'Validated', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  assigned: { label: 'Driver Assigned', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  picked: { label: 'Picked Up', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  in_transit: { label: 'In Transit', color: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
  delivered: { label: 'Delivered ✓', color: 'bg-green-100 text-green-800 border-green-200' },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-800 border-red-200' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700 border-red-200' },
  expired: { label: 'Expired', color: 'bg-gray-100 text-gray-600 border-gray-200' },
  // Delivery statuses
  accepted: { label: 'Accepted', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  picked_up: { label: 'Picked Up', color: 'bg-orange-100 text-orange-800 border-orange-200' },
};

export default function StatusBadge({ status, size = 'sm' }) {
  const cfg = STATUS_CONFIG[status] || { label: status, color: 'bg-gray-100 text-gray-600 border-gray-200' };
  const sizeClass = size === 'lg' ? 'px-3 py-1.5 text-sm' : 'px-2 py-0.5 text-xs';

  return (
    <span className={`inline-flex items-center rounded-full border font-semibold ${cfg.color} ${sizeClass}`}>
      {cfg.label}
    </span>
  );
}

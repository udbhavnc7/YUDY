const leases = new WeakMap<object, { users: number; timer?: number }>();

// Keep recently unmounted assets ready for reverse scroll. Another consumer of
// the same asset, such as the showcase book, cancels disposal before reuse.
export function retainAsset(asset: object, dispose: () => void) {
  const lease = leases.get(asset) ?? { users: 0 };
  leases.set(asset, lease);
  window.clearTimeout(lease.timer);
  lease.users++;
  return () => {
    if (--lease.users !== 0) return;
    lease.timer = window.setTimeout(() => {
      leases.delete(asset);
      dispose();
    }, 5000);
  };
}

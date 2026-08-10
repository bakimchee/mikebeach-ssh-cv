const MAX_CONCURRENT_SESSIONS_PER_IP = 3;
const MAX_CONNECTIONS_PER_IP_PER_MINUTE = 10;
const IDLE_TIMEOUT_MS = 5 * 60 * 1000;

const activeSessionsByIp = new Map<string, number>();
const recentConnectionsByIp = new Map<string, number[]>();

function pruneOlderThanOneMinute(timestamps: number[]): number[] {
  const cutoff = Date.now() - 60_000;
  return timestamps.filter((t) => t > cutoff);
}

/** Call once per incoming TCP connection, before any SSH handshake work. */
export function admitConnection(ip: string): boolean {
  const recent = pruneOlderThanOneMinute(recentConnectionsByIp.get(ip) ?? []);
  if (recent.length >= MAX_CONNECTIONS_PER_IP_PER_MINUTE) {
    return false;
  }
  recent.push(Date.now());
  recentConnectionsByIp.set(ip, recent);

  const active = activeSessionsByIp.get(ip) ?? 0;
  if (active >= MAX_CONCURRENT_SESSIONS_PER_IP) {
    return false;
  }
  activeSessionsByIp.set(ip, active + 1);
  return true;
}

/** Call once when a connection's session ends, mirroring a prior admitConnection(ip) === true. */
export function releaseConnection(ip: string): void {
  const active = activeSessionsByIp.get(ip) ?? 0;
  if (active <= 1) {
    activeSessionsByIp.delete(ip);
  } else {
    activeSessionsByIp.set(ip, active - 1);
  }
}

/**
 * Ends the session via `onTimeout` if no activity is observed for IDLE_TIMEOUT_MS.
 * Call `touch()` on every inbound data event to reset the clock.
 */
export function createIdleTimer(onTimeout: () => void) {
  let timer = setTimeout(onTimeout, IDLE_TIMEOUT_MS);
  return {
    touch(): void {
      clearTimeout(timer);
      timer = setTimeout(onTimeout, IDLE_TIMEOUT_MS);
    },
    clear(): void {
      clearTimeout(timer);
    },
  };
}

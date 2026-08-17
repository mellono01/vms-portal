export const CORRELATION_ID_HEADER = 'x-correlation-id';

export function generateCorrelationId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getOrCreateCorrelationId(
  headersLike?: Headers | null
): string {
  const correlationId = headersLike?.get(CORRELATION_ID_HEADER)?.trim();

  if (correlationId) {
    return correlationId;
  }

  return generateCorrelationId();
}
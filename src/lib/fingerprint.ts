const STORAGE_KEY = 'spygram:fingerprint'

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`
}

/**
 * Retorna um fingerprint estável para o dispositivo.
 * Prioriza o valor salvo no localStorage; se não existir, gera um novo UUID.
 * O backend usa esse valor para aplicar a política de acesso (1 busca grátis
 * por fingerprint).
 */
export function getFingerprint(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return stored
  } catch {
    // localStorage pode estar indisível em modo privado ou restrito.
  }

  const id = generateId()
  try {
    localStorage.setItem(STORAGE_KEY, id)
  } catch {
    // ignore
  }
  return id
}

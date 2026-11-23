export type StorageKind = "local" | "session"

function getStorage(kind: StorageKind): Storage | null {
  if (typeof window === "undefined") return null
  try {
    return kind === "local" ? window.localStorage : window.sessionStorage
  } catch {
    return null
  }
}

export function readString(kind: StorageKind, key: string): string | null {
  const storage = getStorage(kind)
  if (!storage) return null
  try {
    return storage.getItem(key)
  } catch {
    return null
  }
}

export function writeString(kind: StorageKind, key: string, value: string): void {
  const storage = getStorage(kind)
  if (!storage) return
  try {
    storage.setItem(key, value)
  } catch {
    return
  }
}

export function readJson<T>(kind: StorageKind, key: string): T | null {
  const raw = readString(kind, key)
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function writeJson(kind: StorageKind, key: string, value: unknown): void {
  writeString(kind, key, JSON.stringify(value))
}

export function removeString(kind: StorageKind, key: string): void {
  const storage = getStorage(kind)
  if (!storage) return
  try {
    storage.removeItem(key)
  } catch {
    return
  }
}

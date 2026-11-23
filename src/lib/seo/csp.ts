type CspOptions = { nonce: string; isDev: boolean }

export function buildCspHeader({ nonce, isDev }: CspOptions): string {
  const devScript = isDev ? " 'unsafe-eval'" : ""
  const devConnect = isDev ? " ws: wss:" : ""

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${devScript}`,
    `script-src-elem 'self' 'nonce-${nonce}'${devScript}`,
    `style-src 'self' 'nonce-${nonce}' 'unsafe-inline'`,
    "style-src-elem 'self' 'unsafe-inline'",
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src 'self'${devConnect}`,
    "media-src 'self' blob:",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
  ].join("; ")
}

export function buildSecurityHeaders(nonce: string, isDev: boolean): Headers {
  const headers = new Headers()

  headers.set("Content-Security-Policy", buildCspHeader({ nonce, isDev }))
  headers.set("X-Content-Type-Options", "nosniff")
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), fullscreen=(self)",
  )
  headers.set("X-Frame-Options", "DENY")

  return headers
}

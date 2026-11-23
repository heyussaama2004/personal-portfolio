import { NextRequest } from "next/server"
import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"
import { buildSecurityHeaders } from "./lib/seo/csp"

const intlMiddleware = createMiddleware(routing)

export function proxy(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID())
  const isDev = process.env.NODE_ENV === "development"
  const securityHeaders = buildSecurityHeaders(nonce, isDev)

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-nonce", nonce)
  requestHeaders.set("Content-Security-Policy", securityHeaders.get("Content-Security-Policy")!)

  const response = intlMiddleware(
    new NextRequest(request, {
      headers: requestHeaders,
    }),
  )

  securityHeaders.forEach((value, key) => {
    response.headers.set(key, value)
  })

  return response
}

export const config = {
  matcher: ["/", "/((?!api|_next|_vercel|.*\\..*).*)"],
}

import { buildLlmsIndex } from '@/lib/docs'

// Prerendered at build time so the docs/*.md reads happen during the build
// (no runtime filesystem access on the serverless host).
export const dynamic = 'force-static'

export function GET() {
  return new Response(buildLlmsIndex(), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}

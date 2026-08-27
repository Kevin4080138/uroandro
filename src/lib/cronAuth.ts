import { timingSafeEqual } from 'node:crypto'

function xavfsizTeng(left: string, right: string) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)
  if (leftBuffer.length !== rightBuffer.length) return false
  return timingSafeEqual(leftBuffer, rightBuffer)
}

export function cronRuxsatBormi(request: Request, secret = process.env.CRON_SECRET) {
  if (!secret) return false
  const authorization = request.headers.get('authorization')
  if (!authorization?.startsWith('Bearer ')) return false
  return xavfsizTeng(authorization.slice(7), secret)
}

export function cronRuxsatXatosi(request: Request, secret = process.env.CRON_SECRET) {
  return cronRuxsatBormi(request, secret)
    ? null
    : Response.json({ error: "Ruxsat yo'q" }, { status: 401 })
}

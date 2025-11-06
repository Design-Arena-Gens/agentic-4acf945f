import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Spotify Clone',
  description: 'A Spotify clone using Deezer API',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

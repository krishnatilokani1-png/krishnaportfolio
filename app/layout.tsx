import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Krishna Portfolio',
  description: 'Portfolio of Krishna Tilokani',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ margin: 0, padding: 0, height: '100%', width: '100%' }}>
        {children}
      </body>
    </html>
  )
}
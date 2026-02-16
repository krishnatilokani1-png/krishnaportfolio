import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Krishna Tilokani Portfolio',
  description: 'The Portfolio of a Strategist & Alchemist',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full w-full">
      <body className={`${inter.className} h-full w-full m-0 p-0 bg-black text-white overflow-x-hidden`}>
        {children}
      </body>
    </html>
  )
}
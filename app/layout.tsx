import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import { Providers } from '@/lib/providers/providers'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Futvibe',
  description: 'Organize partidas casuais de futevôlei',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Futvibe',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#16a34a',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={geist.variable} suppressHydrationWarning>
      <head>
        {/* Reads localStorage before hydration to prevent dark mode flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('futvibe:dark')==='1')document.documentElement.classList.add('dark')}catch(e){}`,
          }}
        />
      </head>
      <body className="bg-background text-foreground min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

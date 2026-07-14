import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import 'availability-datetime-picker/styles.css'
import './globals.css'

import { Sidebar } from '@/components/site/sidebar'

export const metadata: Metadata = {
  title: {
    default: 'picker-cookbook — availability-datetime-picker',
    template: '%s — picker-cookbook',
  },
  description:
    'Use-case cookbook for availability-datetime-picker: live demos, code samples, and in-depth guides for every component, hook, and engine feature.',
}

// Runs before paint: applies the stored (or OS-preferred) theme so dark
// mode never flashes light on load.
const THEME_BOOT = `(function(){try{var t=localStorage.getItem('pc-theme');if(t!=='dark'&&t!=='light'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}})()`

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
        <div className='shell'>
          <Sidebar />
          <main className='shell-main'>{children}</main>
        </div>
      </body>
    </html>
  )
}

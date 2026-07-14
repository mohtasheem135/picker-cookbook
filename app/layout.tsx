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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <div className='shell'>
          <Sidebar />
          <main className='shell-main'>{children}</main>
        </div>
      </body>
    </html>
  )
}

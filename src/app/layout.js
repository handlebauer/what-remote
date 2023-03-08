import './globals.css'

export const metadata = {
  title: 'What Remote',
  description: 'Sports!',
  themeColor: '#334155',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  )
}

import '../styles/globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'

export const metadata = {
  title: 'Delightsome Kids School',
  description: 'Delightsome Kids School - Itori',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}

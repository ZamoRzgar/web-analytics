import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

// Use system font instead of Google Fonts to avoid connectivity issues
export const metadata: Metadata = {
    title: 'Web Analytics Dashboard',
    description: 'Track and analyze your website traffic',
}

interface RootLayoutProps {
    children: React.ReactNode
}

const RootLayout = ({ children }: RootLayoutProps): React.ReactElement => {
    return (
        <html lang="en">
            <body className="font-sans">
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}

export default RootLayout
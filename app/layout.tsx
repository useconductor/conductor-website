import type { Metadata, Viewport } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#050505',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://conductor.sh'),
  title: {
    default: 'Conductor — MCP Server for AI Agents',
    template: '%s | Conductor',
  },
  description: 'The single MCP server that gives AI agents access to 255+ tools. Connect Claude, Cursor, Cline to GitHub, Slack, databases, and more. Zero-config, free forever.',
  keywords: ['MCP', 'Model Context Protocol', 'AI', 'Claude', 'Cursor', 'Cline', 'tools', 'plugins', 'MCP server', 'AI agents', 'developer tools'],
  authors: [{ name: 'TheAlxLabs', url: 'https://thealxlabs.ca' }],
  creator: 'TheAlxLabs',
  publisher: 'TheAlxLabs',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://conductor.sh',
    siteName: 'Conductor',
    title: 'Conductor — MCP Server for AI Agents',
    description: 'The single MCP server that gives AI agents access to 255+ tools. Connect Claude, Cursor, Cline to GitHub, Slack, databases, and more.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Conductor - MCP Server',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Conductor — MCP Server for AI Agents',
    description: 'The single MCP server that gives AI agents access to 255+ tools.',
    creator: '@conductormcp',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://conductor.sh',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${ibmPlexMono.variable} bg-[#050505] font-sans text-white antialiased overflow-x-hidden`}
      >
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

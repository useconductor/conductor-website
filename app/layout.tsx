import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Conductor — One connection. Every tool.",
  description:
    "The single MCP server that gives any AI agent access to 100+ tools. Connect Claude Code, Cursor, Cline, and more to your entire system.",
  keywords: ["MCP", "AI", "Claude", "Cursor", "Cline", "tools", "plugins"],
  openGraph: {
    title: "Conductor — One connection. Every tool.",
    description:
      "The single MCP server that gives any AI agent access to 100+ tools.",
    type: "website",
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
        className={`${inter.variable} ${ibmPlexMono.variable} bg-[#050505] font-sans text-white antialiased`}
      >
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Exo } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/store";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const exo = Exo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-exo",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FreshCart | Online Shopping Store",
    template: "%s | FreshCart",
  },
  description:
    "FreshCart — groceries, electronics and more at the best prices. Free shipping on orders over 500 EGP, easy returns and secure checkout.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// Applies the saved theme before first paint so there is no flash of the wrong theme.
const themeScript = `(function(){try{var t=localStorage.getItem("fc_theme");if(t!=="dark"&&t!=="light"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}var d=t==="dark";document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=t;}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${exo.variable} flex min-h-screen flex-col bg-surface font-sans font-medium text-fg antialiased`}
      >
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
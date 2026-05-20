import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Navigation } from "../components/landing-page/nav-bar";
import { Footer } from "../components/landing-page/footer";

const poppins = Poppins({
  variable: "--font-site",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Karisimbi Real Estate",
  description: "Karisimbi Real Estate - Your Dream Home Awaits",
  icons:{
    icon: "/logo.jpeg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MED-ID - Your Medical Identity, Secured by Biometrics",
  description:
    "MED-ID is a biometric medical identity platform that securely stores and provides instant access to your complete medical history.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full bg-bg-main dark:bg-[#0F0F15]">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MED-ID - Tibbiy Identifikatsiyangiz, Biometriya bilan Himoyalangan",
  description:
    "MED-ID - bu biometrik tibbiy identifikatsiya platformasi bo'lib, sizning to'liq tibbiy tarixingizni xavfsiz saqlaydi va tezkor kirish imkonini beradi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full bg-bg-main ">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

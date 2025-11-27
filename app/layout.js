import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { RatingsProvider } from "@/lib/ratings-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CineLog - Personal Movie Tracker",
  description: "Track and rate your favorite movies",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <RatingsProvider>
          <Navigation />
          <main>{children}</main>
        </RatingsProvider>
      </body>
    </html>
  );
}

import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";

const inter = Inter({ subsets: ["latin"] });
const cairo = Cairo({ subsets: ["arabic", "latin"] });

export const metadata = {
  title: "LinkSaver",
  description: "Securely save your links and accounts",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${cairo.className}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

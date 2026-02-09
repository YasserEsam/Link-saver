import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";
import Script from "next/script";

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
        <Script
          src="https://velents-shared.s3.us-east-1.amazonaws.com/loader.global.js"
          data-agent-id="1"
          data-auth-token="null"
          data-plugin-mode="true"
          data-widget="https://velents-shared.s3.us-east-1.amazonaws.com/widget.html"
          data-logo="https://velents-shared.s3.us-east-1.amazonaws.com/Logo-Icon.svg"
          data-color="#f7dc6f"
          data-brand="Velents"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}

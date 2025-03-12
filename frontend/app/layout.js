import "./globals.css";
import Providers from "./Providers";
import AuthGuard from "@/components/auth/AuthGuard";

export default async function RootLayout({ children }) {

  return (
    <html lang="en">
      <body>
        <Providers>
          <AuthGuard>
            {children}
          </AuthGuard>
        </Providers>
      </body>
    </html>
  );
}

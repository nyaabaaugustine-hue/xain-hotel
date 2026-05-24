import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/lib/query-provider";
import { AuthProvider } from "@/lib/auth-context";
import SplashScreen from "@/components/SplashScreen";

export const metadata: Metadata = {
  title: { template: "%s | SMIC360 Softwares", default: "SMIC360 Softwares Hotel Management" },
  description: "Hotel management system by SMIC360 Softwares",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SplashScreen>
          <QueryProvider>
            <AuthProvider>{children}</AuthProvider>
          </QueryProvider>
        </SplashScreen>
      </body>
    </html>
  );
}

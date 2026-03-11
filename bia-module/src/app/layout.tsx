import type { Metadata } from "next";
import "./globals.css";
import BCMLayout from "@/components/BCMLayout";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { OrganizationalChartProvider } from "@/contexts/OrganizationalChartContext";
import { UserProfileProvider } from "@/contexts/UserProfileContext";
import { OrganizationProvider } from "@/contexts/OrganizationContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { BCPTestProvider } from "@/contexts/BCPTestContext";

export const metadata: Metadata = {
  title: "AutoBCM - Business Continuity Management",
  description: "Comprehensive Business Continuity Management platform with BIA, Risk Assessment, and BCP modules",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 min-h-screen font-sans">
        <AuthProvider>
          <ThemeProvider>
            <OrganizationProvider>
              <OrganizationalChartProvider>
                <UserProfileProvider>
                  <BCPTestProvider>
                    <BCMLayout>
                      {children}
                    </BCMLayout>
                  </BCPTestProvider>
                </UserProfileProvider>
              </OrganizationalChartProvider>
            </OrganizationProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

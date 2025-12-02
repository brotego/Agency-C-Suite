import "./globals.css";
import ClientLayout from "@/client-layout";
import TopBar from "@/components/TopBar/TopBar";
import SplashScreen from "@/components/SplashScreen/SplashScreen";

export const metadata = {
  title: "Agency C-Suite | Fractional Executives",
  description: "Fractional Executives for Start-up and Independent Creative Agencies",
  icons: {
    icon: "/logo.JPEG",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SplashScreen />
        <ClientLayout>
          <TopBar />
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { CustomAlert } from "@/components/CustomAlert";

export const metadata: Metadata = {
  title: "Boutique Elegance",
  description: "Shop online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <div className="absolute h-screen">
          <CustomAlert />
        </div>
      </body>
    </html>
  );
}

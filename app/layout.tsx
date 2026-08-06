import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Typhoon PRO — electric convection coffee roasters",
  description:
    "Typhoon 2.5 PRO, 5 PRO and 10 PRO electric convection coffee roasters.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

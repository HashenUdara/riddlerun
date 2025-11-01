import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Riddle Run | UCSC IEEE Monthly Meetup November",
  description: "The IEEE student branch of UCSC proudly celebrates IEEE Day by stepping into the future with the Riddle Run treasure hunt game.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Rubik:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet' />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

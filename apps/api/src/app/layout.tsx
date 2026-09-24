export const metadata = {
  title: "Notter API",
  description: "Notter backend service",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

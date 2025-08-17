export const metadata = {
  title: "MJ Studio",
  description: "Salon za nokte i šminku",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sr">
      <body>{children}</body>
    </html>
  )
}

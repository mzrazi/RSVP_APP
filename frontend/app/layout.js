import "./globals.css";

export const metadata = {
  title: "Meetup Tracker",
  description: "Local meetup RSVPs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

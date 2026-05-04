import './globals.css';
import { AppProvider } from '@/context/AppContext';

export const metadata = {
  title: 'Studesh — Campus Intelligence Platform',
  description: 'A comprehensive, multi-role digital campus ecosystem that unifies administrative operations, faculty workflows, and student learning — powered by contextual AI.',
  keywords: 'campus, education, attendance, AI, learning, timetable, university',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}

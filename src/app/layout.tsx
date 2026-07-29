import './globals.css';
import { ConvexClientProvider } from '@/providers/ConvexClientProvider';

export const metadata = {
  title: 'InternEdge',
  description:
    'Streamline your internship journey with an AI-powered platform that helps students discover opportunities, optimize resumes, and prepare for interviews.',
  robots: {
    index: false,
  },
  openGraph: {
    title: 'InternEdge',
    description:
      'AI-powered internship readiness & career acceleration platform.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#050505] text-[#FAFAFA]">
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Claude Prompt Vault — The Best Claude Prompts. Instantly Copy. Instantly Build.',
  description: 'Curated library of premium Claude prompts, skills, and workflows. Copy, use, and build faster with the internet\'s best AI prompt collection.',
  themeColor: '#CC785C',
  openGraph: {
    title: 'Claude Prompt Vault',
    description: 'The Best Claude Prompts. Instantly Copy. Instantly Build.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,300&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

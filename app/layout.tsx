import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'CineLumina - Rede Social de Filmes & Cinéfilos',
  description: 'Cadastre seus filmes favoritos, descubra o gosto de outros cinéfilos e deixe comentários e impressões em seus perfis.',
  openGraph: {
    title: 'CineLumina - Rede Social de Filmes & Cinéfilos',
    description: 'Cadastre seus filmes favoritos, descubra o gosto de outros cinéfilos e deixe comentários e impressões em seus perfis.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CineLumina - Rede Social de Filmes & Cinéfilos',
    description: 'Cadastre seus filmes favoritos, descubra o gosto de outros cinéfilos e deixe comentários e impressões em seus perfis.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning className="bg-[#0b0f19] text-[#dfe2f1] min-h-screen antialiased selection:bg-[#a855f7]/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}

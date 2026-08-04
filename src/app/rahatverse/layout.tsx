import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RahatVerse — 3D City Experience',
  description: 'Explore Rahat Ahmed\'s portfolio inside an immersive 3D city.',
};

export default function RahatVerseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="rahatverse">
      {children}
    </div>
  );
}
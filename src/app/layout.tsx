import type { Metadata } from 'next';
import { Providers } from '@/components/Providers';
import '@/styles/globals.css';

const appUrl = 'https://tip-jar-frames-phessophissys-projects.vercel.app';

const frameEmbed = {
  version: "next",
  imageUrl: `${appUrl}/api/frame/image?type=og`,
  button: {
    title: "Open Tip Jar",
    action: {
      type: "launch_frame",
      name: "Tip Jar",
      url: appUrl,
      splashImageUrl: `${appUrl}/api/frame/image?type=splash`,
      splashBackgroundColor: "#0F0F1A"
    }
  }
};

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: 'Tip Jar Frames - Social Tipping for Farcaster',
  description: 'Create your personal tip jar and receive tips directly on Farcaster. Zero friction, instant payments on Base.',
  openGraph: {
    title: 'Tip Jar Frames',
    description: 'Create your personal tip jar for Farcaster',
    images: [`${appUrl}/api/frame/image?type=og`],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tip Jar Frames',
    description: 'Create your personal tip jar for Farcaster',
    images: [`${appUrl}/api/frame/image?type=og`],
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  other: {
    'fc:frame': JSON.stringify(frameEmbed),
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

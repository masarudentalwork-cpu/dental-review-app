import './globals.css';

export const metadata = {
  title: '口コミ投稿サポート | 歯科医院向け',
  description: 'いくつかの質問に答えるだけで、素敵な口コミが完成します',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}

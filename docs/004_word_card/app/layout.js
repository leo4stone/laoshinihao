export const metadata = {
  title: '影视英语单词卡',
  description: '通过影视场景学习英语单词的应用',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  );
} 
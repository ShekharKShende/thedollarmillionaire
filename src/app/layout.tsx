import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Stock Tracker</title>
        <meta name="description" content="Track your favorite stocks" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <div>
          <nav className="p-4 bg-gray-800 text-white flex justify-between">
            <Link href="/">
              <span className="text-lg font-bold cursor-pointer">Stock Tracker</span>
            </Link>
            <Link href="/watchlist">
              <button className="px-4 py-2 bg-blue-500 rounded-lg">Watchlist</button>
            </Link>
          </nav>
          {children}
        </div>
      </body>
    </html>
  );
}

import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 px-4">
      <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-10 text-center max-w-md w-full">
        <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          404
        </h1>

        <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
          Page not found
        </p>

        <Link
          href="/"
          className="
            inline-flex items-center justify-center
            px-5 py-2.5
            rounded-xl
            border
            text-gray-700 dark:text-gray-300
            bg-gray-100 dark:bg-gray-700
            hover:bg-gray-200 dark:hover:bg-gray-600
            transition
          "
        >
          Back to Home
        </Link>
      </article>
    </main>
  );
}
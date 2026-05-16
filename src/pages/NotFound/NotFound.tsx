import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-md p-10 text-center max-w-md w-full">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>

        <p className="text-gray-600 text-lg mb-6">Page not found</p>

        <Link
          to="/"
          className="
            inline-flex items-center justify-center
            px-5 py-2.5
            rounded-xl
            border border-gray-300
            text-gray-700
            hover:bg-gray-100
            transition
          "
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

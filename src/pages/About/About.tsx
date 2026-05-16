export default function About() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">About this project</h1>

        <div className="space-y-4 text-center">
          <p className="text-gray-600 text-lg">
            This application was created as part of the React course.
          </p>

          <p className="text-gray-700 font-medium">Author: Nina Yeulash</p>

          <div className="flex flex-col gap-3 items-center pt-4">
            <a
              href="https://github.com/ninaevlash"
              target="_blank"
              rel="noreferrer"
              className="text-gray-800 underline underline-offset-4 
            hover:text-black transition"
            >
              My GitHub
            </a>

            <a
              href="https://rs.school/courses/reactjs"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline underline-offset-4 
            hover:text-blue-700 transition"
            >
              RS School React Course
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

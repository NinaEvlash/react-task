import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function About({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  setRequestLocale(locale);
  const t = await getTranslations('About');
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 px-4">
      <article className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
          {t('title')}
        </h1>

        <div className="space-y-4 text-center">
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            {t('courseText')}
          </p>

          <p className="text-gray-700 dark:text-gray-300 font-medium">
            {t('autorText')}
          </p>

          <nav
            aria-label="External links"
            className="flex flex-col gap-3 items-center pt-4"
          >
            <a
              href="https://github.com/ninaevlash"
              target="_blank"
              rel="noopener noreferrer"
              className="
              text-gray-800 
              dark:text-gray-200 
              underline 
              underline-offset-4 
              hover:text-black 
              dark:hover:text-white 
              transition
              "
            >
              {t('gitHub')}
            </a>

            <a
              href="https://rs.school/courses/reactjs"
              target="_blank"
              rel="noopener noreferrer"
              className="
              text-blue-600 
              dark:text-blue-400 
              underline 
              underline-offset-4 
              hover:text-blue-700 
              dark:hover:text-blue-300 
              transition
              "
            >
              RS School React Course
            </a>
          </nav>
        </div>
      </article>
    </main>
  );
}

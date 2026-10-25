import { useState } from 'react'
import ResultCard from './components/ResultCard.jsx'
import ShortenForm from './components/ShortenForm.jsx'
import UrlList from './components/UrlList.jsx'

const App = () => {
  const [shortenedUrl, setShortenedUrl] = useState(null)

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 flex items-center gap-4 sm:mb-10">
          <img
            src="/url-shortener-icon.svg"
            alt=""
            className="h-12 w-12 rounded-xl shadow-sm"
          />
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              URL Shortener
            </h1>
            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              Make long links short, simple, and ready to share.
            </p>
          </div>
        </header>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-5 sm:p-8">
            <ShortenForm onShortened={setShortenedUrl} />
          </div>
          {shortenedUrl && <ResultCard url={shortenedUrl} />}
          <div className="border-t border-slate-200 p-5 sm:p-8">
            <UrlList refreshTrigger={shortenedUrl} />
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-slate-400">
          Create and manage your short links in one place.
        </p>
      </div>
    </main>
  )
}

export default App
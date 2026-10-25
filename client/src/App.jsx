import { useState } from 'react'
import ResultCard from './components/ResultCard.jsx'
import ShortenForm from './components/ShortenForm.jsx'
import UrlList from './components/UrlList.jsx'

const App = () => {
  const [shortenedUrl, setShortenedUrl] = useState(null)

  return (
    <main className="min-h-screen bg-white px-5 py-12 text-gray-900 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            URL Shortener
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Make a long link shorter and easier to share.
          </p>
        </header>

        <div className="space-y-8">
          <ShortenForm onShortened={setShortenedUrl} />
          {shortenedUrl && <ResultCard url={shortenedUrl} />}
          <UrlList refreshTrigger={shortenedUrl} />
        </div>
      </div>
    </main>
  )
}

export default App
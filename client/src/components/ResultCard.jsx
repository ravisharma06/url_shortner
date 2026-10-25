import { useEffect, useState } from 'react'

const ResultCard = ({ url }) => {
  const [copyStatus, setCopyStatus] = useState('idle')



  useEffect(() => {
    if (copyStatus !== 'copied') return

    const timeoutId = window.setTimeout(() => setCopyStatus('idle'), 2000)
    return () => window.clearTimeout(timeoutId)
  }, [copyStatus])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url.shortUrl)
      setCopyStatus('copied')
    } catch {
      setCopyStatus('error')
    }
  }

  return (
    <section
      aria-labelledby="result-heading"
      className="border-t border-blue-100 bg-blue-50/70 px-5 py-5 sm:px-8"
    >
      <h2 id="result-heading" className="mb-3 text-sm font-semibold text-slate-700">
        Your shortened link
      </h2>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <a
          href={url.shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="min-w-0 flex-1 break-all rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm font-medium text-blue-700"
        >
          {url.shortUrl}
        </a>
        <button
          type="button"
          onClick={handleCopy}
          className="cursor-pointer rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          {copyStatus === 'copied' ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {copyStatus === 'error' && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          Could not copy the link. Check your browser permissions and try again.
        </p>
      )}
    </section>
  )
}

export default ResultCard

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
      className="border-t border-gray-200 pt-6"
    >
      <h2 id="result-heading" className="mb-3 text-sm font-medium text-gray-700">
        Your shortened link
      </h2>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <a
          href={url.shortUrl}
          className="min-w-0 flex-1 break-all rounded-md bg-gray-50 px-3 py-2.5 text-sm text-blue-700"
        >
          {url.shortUrl}
        </a>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-md cursor-pointer border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
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

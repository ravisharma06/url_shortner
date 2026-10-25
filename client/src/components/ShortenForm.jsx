
import { useRef,useState } from 'react'
import api, { shortUrlBase } from '../config/api'
const ShortenForm = ({ onShortened }) => {
  const inputRef = useRef(null)
  const [error, setError] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const originalUrl = inputRef.current.value.trim()
    if (!originalUrl) {
      setError('Please enter a valid URL.')
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      const response = await api.post('/url', { originalUrl })
      const url = response.data.response


      console.log(api.defaults.baseURL)
      onShortened({
        ...url,
        shortUrl: `${shortUrlBase}/${url.shortCode}`,
      })
      inputRef.current.value = ''
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ??
          'Could not shorten the URL. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section>
      <label
        htmlFor="long-url"
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        Long URL
      </label>
      <div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
          <input
            ref={inputRef}
            id="long-url"
            type="url"
            placeholder="https://example.com/your-long-link"
            className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-32"
          >
            {isSubmitting ? 'Shortening…' : 'Shorten'}
          </button>
        </form>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Enter a complete URL beginning with http:// or https://.
      </p>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </section>
  )
}

export default ShortenForm

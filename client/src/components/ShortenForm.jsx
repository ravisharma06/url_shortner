
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
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        Long URL
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <form onSubmit={handleSubmit} className="flex flex-1 gap-2">
          <input
            ref={inputRef}
            id="long-url"
            type="url"
            placeholder="https://example.com/your-long-link"
            className="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            {isSubmitting ? 'Shortening…' : 'Shorten'}
          </button>
        </form>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Enter a URL beginning with http:// or https://
      </p>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </section>
  )
}

export default ShortenForm

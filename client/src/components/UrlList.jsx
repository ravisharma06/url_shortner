
import { useEffect, useState } from 'react'
import api, { shortUrlBase } from '../config/api'
import QRCode from 'qrcode'

const UrlList = ({ refreshTrigger }) => {

  const [urls, setUrls] = useState([]);
  const [qrCodes, setQrCodes] = useState({});





  const handleDelete = async (shortCode) => {

    try {
      await api.delete(`/url/${shortCode}`);


      setUrls((prevUrls) => prevUrls.filter(url => url.shortCode !== shortCode));

    } catch (error) {
      console.log('Error deleting URL:', error);
    }
  }

  const generateQRCode = async (shortCode) => {
    try {
      const dataUrl = await QRCode.toDataURL(`${shortUrlBase}/${shortCode}`);
      setQrCodes((previousQrCodes) => ({
        ...previousQrCodes,
        [shortCode]: dataUrl,
      }));
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  }

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const response = await api.get('/urls');
        setUrls(response.data.response);
      }
      catch (error) {
        console.error('Error fetching URLs:', error);
      }
    }

    fetchUrls();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchUrls();
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }



  }, [refreshTrigger]);

  return (
    <section
      aria-labelledby="links-heading"
      className="border-t border-gray-200 pt-6"
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 id="links-heading" className="text-sm font-medium text-gray-700">
          Recent links
        </h2>
      </div>

      <div>
        {urls.length === 0 ? (
          <p className="text-sm text-gray-500">No links found.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {urls.map((url) => (
              <li key={url.shortCode} className="py-3">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`${shortUrlBase}/${url.shortCode}`}
                    className="min-w-0 break-all text-sm text-blue-700"
                  >{`${shortUrlBase}/${url.shortCode}`}</a>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm text-gray-500">
                      Clicks: {url.clicks}
                    </span>
                    <button
                      onClick={() => generateQRCode(url.shortCode)}
                      type="button"
                      className="cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      Generate QR code
                    </button>
                    {qrCodes[url.shortCode] && (
                      <img
                        src={qrCodes[url.shortCode]}
                        alt={`QR code for ${shortUrlBase}/${url.shortCode}`}
                        width="128"
                        height="128"
                        className="rounded border border-gray-200"
                      />
                    )}
                    <button
                      onClick={() => handleDelete(url.shortCode)}
                      type="button"
                      className="cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-gray-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

    </section>
  )
}

export default UrlList

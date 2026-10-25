
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
      className="min-w-0"
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 id="links-heading" className="text-lg font-semibold text-slate-900">
          Recent links
        </h2>
        <span className="text-sm text-slate-500">
          {urls.length} {urls.length === 1 ? 'link' : 'links'}
        </span>
      </div>

      <div>
        {urls.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center">
            <p className="text-sm font-medium text-slate-700">No links yet</p>
            <p className="mt-1 text-sm text-slate-500">
              Your shortened links will appear here.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {urls.map((url) => (
              <li
                key={url.shortCode}
                className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 sm:p-5"
              >
                <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`${shortUrlBase}/${url.shortCode}`}
                      className="block break-all text-sm font-semibold text-blue-700 hover:text-blue-800 hover:underline"
                    >{`${shortUrlBase}/${url.shortCode}`}</a>
                    {url.originalUrl && (
                      <p className="mt-1 truncate text-xs text-slate-500" title={url.originalUrl}>
                        {url.originalUrl}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                    <span className="mr-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                      {url.clicks} {url.clicks === 1 ? 'click' : 'clicks'}
                    </span>
                    <button
                      onClick={() => generateQRCode(url.shortCode)}
                      type="button"
                      className="cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Generate QR code
                    </button>
                    <button
                      onClick={() => handleDelete(url.shortCode)}
                      type="button"
                      className="cursor-pointer rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {qrCodes[url.shortCode] && (
                  <div className="mt-4 flex items-center gap-4 rounded-lg bg-slate-50 p-3">
                    <img
                      src={qrCodes[url.shortCode]}
                      alt={`QR code for ${shortUrlBase}/${url.shortCode}`}
                      width="112"
                      height="112"
                      className="rounded-md border border-slate-200 bg-white p-1"
                    />
                    <p className="text-sm text-slate-600">
                      Scan to open this short link.
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

    </section>
  )
}

export default UrlList

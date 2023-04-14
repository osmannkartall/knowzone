import { useEffect, useState } from 'react';

const fetchData = async (url, method, JSONStringBody) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  if (method !== 'GET' && JSONStringBody) {
    options.body = JSONStringBody;
  }

  const response = await fetch(url, options);
  return response.json();
};

function getUrl(url, queryString, cursor) {
  return url + (queryString ? `?${queryString}&cursor=${cursor}` : `?cursor=${cursor}`);
}

function usePagination(request) {
  const { url, method, body, queryParameters } = request;

  const queryString = Object.keys(queryParameters ?? {}).map(
    (k) => `${k}=${queryParameters[k]}`,
  ).join('&');
  const JSONStringBody = body ? JSON.stringify(body) : null;

  const [currentUrl, setCurrentUrl] = useState(getUrl(url, queryString));
  const [cursor, setCursor] = useState(null);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const resetAfterQueryStringOrBodyChanged = () => {
      setStatus('idle');
      setCursor(null);
      setCurrentUrl(getUrl(url, queryString));
      setData(null);
      setErrorMessage(null);
    };

    resetAfterQueryStringOrBodyChanged();
  }, [url, queryString, JSONStringBody]);

  useEffect(() => {
    let mounted = true;

    const handleDataChange = (records) => {
      if (mounted) {
        if (Array.isArray(records)) {
          setData((prevData) => [...(prevData ?? []), ...records]);
        } else {
          setData((prevData) => {
            const newData = {};
            Object.entries(records ?? {}).forEach(([k, v]) => {
              if (Array.isArray(v)) {
                newData[k] = [...((prevData ?? {})[k] ?? []), ...v];
              } else if (typeof v === 'object') {
                newData[k] = { ...((prevData ?? {})[k] ?? {}), ...v };
              }
            });
            return newData;
          });
        }
      }
    };

    const fetchResults = async () => {
      try {
        setStatus('loading');
        const nextPage = await fetchData(currentUrl, method, JSONStringBody);
        handleDataChange(nextPage.records);
        setCursor(nextPage.cursor);
        if (nextPage.hasNext) {
          setStatus('hasNext');
        } else if (nextPage.noResult) {
          setStatus('noResult');
        } else {
          setStatus('resolved');
        }
      } catch (err) {
        console.log(err);
        setStatus('error');
        setErrorMessage(err.message);
      }
    };

    fetchResults();

    return function cleanup() {
      mounted = false;
    };
  }, [currentUrl, method, JSONStringBody]);

  function getNextPage() {
    setCurrentUrl(getUrl(url, queryString, cursor));
  }

  return { data, setData, getNextPage, status, errorMessage };
}

export default usePagination;

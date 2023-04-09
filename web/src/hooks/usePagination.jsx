import { useState } from 'react';

function usePagination(handler, handlerArgs = {}) {
  const [page, setPage] = useState({ hasNext: true, cursor: '' });

  function handleSetPage(newPage) {
    setPage({ hasNext: newPage?.hasNext, cursor: newPage?.cursor });
  }

  const getFirstPage = async () => {
    const firstPage = await handler(handlerArgs);
    handleSetPage(firstPage);
    return firstPage;
  };

  const getNextPage = async () => {
    const nextPage = await handler({ cursor: page?.cursor, ...handlerArgs });
    handleSetPage(nextPage);
    return nextPage;
  };

  return { page, getFirstPage, getNextPage };
}

export default usePagination;

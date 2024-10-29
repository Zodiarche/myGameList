import { useState, useMemo } from 'react';

const usePagination = (items, itemsPerPage) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => {
    return Math.ceil(items.length / itemsPerPage);
  }, [items, itemsPerPage]);

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return items.slice(start, end);
  }, [items, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPageButtons = () => {
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (endPage - startPage + 1 < maxButtons) {
      if (currentPage < Math.ceil(totalPages / 2)) {
        endPage = Math.min(startPage + maxButtons - 1, totalPages);
      } else {
        startPage = Math.max(1, endPage - maxButtons + 1);
      }
    }

    const pageButtons = [];

    if (currentPage > 1) {
      pageButtons.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="pagination__button pagination__button--prev"
        >
          Précédent
        </button>
      );
    }

    for (let index = startPage; index <= endPage; index++) {
      pageButtons.push(
        <button
          key={index}
          onClick={() => handlePageChange(index)}
          className={`pagination__button ${
            index === currentPage ? 'pagination__button--disabled' : ''
          }`}
          disabled={index === currentPage}
        >
          {index}
        </button>
      );
    }

    if (currentPage < totalPages) {
      pageButtons.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="pagination__button pagination__button--next"
        >
          Suivant
        </button>
      );
    }

    return <div className="pagination">{pageButtons}</div>;
  };

  return { currentItems, currentPage, totalPages, renderPageButtons, handlePageChange };
};

export default usePagination;

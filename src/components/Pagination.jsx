import React from 'react';
import './user-management/UserManagement.scss';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getVisiblePages = (currentPage, totalPages) => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage === 1) {
      return [1, 2, 3];
    }

    if (currentPage === totalPages) {
      return [totalPages - 2, totalPages - 1, totalPages];
    }

    return [currentPage - 1, currentPage, currentPage + 1];
  };

  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <nav className="pagination-nav">
      <ul className="pagination">
        {currentPage > 1 && (
          <li className="page-item" onClick={() => onPageChange(currentPage - 1)}>
            <span className="page-link">Previous</span>
          </li>
        )}

        {visiblePages.map((page) => (
          <li
            key={page}
            className={`page-item ${page === currentPage ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            <span className="page-link">{page}</span>
          </li>
        ))}

        {currentPage < totalPages && (
          <li className="page-item" onClick={() => onPageChange(currentPage + 1)}>
            <span className="page-link">Next</span>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;

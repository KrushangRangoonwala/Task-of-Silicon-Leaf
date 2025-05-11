import React, { useState } from "react";
import "./Pagination.css";

const Pagination = ({ totalPages, setPageSize, pageSize,setPageNo, pageNo }) => {
    // const [pageNo, setPageNo] = useState(1);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setPageNo(page);
        }else{
            setPageNo(1);
        }
    };

    return (
        <>
                <div className="page-size-selector">
                    <label htmlFor="pageSize" className=''>Rows per page:</label>
                    <select
                        id="pageSize"
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>

                <div className="pagination">
                    <button
                        className="nav-btn"
                        onClick={() => goToPage(pageNo - 1)}
                        disabled={pageNo === 1}
                    >
                        &laquo; Prev
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i + 1}
                            className={`page-btn ${pageNo === i + 1 ? "active" : ""}`}
                            onClick={() => goToPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        className="nav-btn"
                        onClick={() => goToPage(pageNo + 1)}
                        disabled={pageNo === totalPages}
                    >
                        Next &raquo;
                    </button>
                </div>
        </>
    );
};

export default Pagination;

import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AiFillLike, AiFillDislike } from "react-icons/ai";

const BoardListPagination = () => {
  let state = useSelector((state) => {
    return state;
  });

  // let navigate = useNavigate();

  let boardState = state.boardReducer;

  // pagination data
  const items = boardState;

  // styled component
  let Reply = styled("div")`
    background-color: #2d4059;
    color: white;
    display: flex;
    justify-content: space-between;
    padding: 10px;
    margin-top: 20px;
    border-radius: 12px;
  `;

  // pagination
  function Items({ currentItems }) {
    return (
      <>
        <div className="container-lg d-flex justify-content-center">
          <div style={{ width: "800px", marginTop: "100px" }}>
            <div
              style={{
                fontSize: "24px",
                borderBottom: "2px solid #2D4059",
                textAlign: "left",
              }}
            >
              <span>글 목록</span>
            </div>
            {currentItems &&
              currentItems.map((item, index) => (
                <Reply className="row" key={index}>
                  <div
                    className="col-lg-7"
                    style={{
                      textAlign: "left",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item == null ? null : item.title}
                  </div>
                  <div
                    className="col-lg-5"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "end",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: "90px",
                        paddingRight: "10px",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item == null ? null : item.writer}
                    </span>
                    <span
                      style={{
                        display: "inline-block",
                        paddingRight: "10px",
                      }}
                    >
                      {item == null
                        ? null
                        : item.bdate === "2021/00/00"
                        ? null
                        : String(
                            new Date(+new Date(item.bdate) + 3240 * 10000)
                              .toISOString()
                              .split("T")[0]
                          )}
                    </span>
                    <AiFillLike
                      style={{ color: "#EA5455", cursor: "pointer" }}
                    />
                    <span
                      style={{
                        display: "inline-block",
                        paddingRight: "10px",
                      }}
                    >
                      {item == null ? null : item.blike}
                    </span>
                    <AiFillDislike
                      style={{ color: "#F07B3F", cursor: "pointer" }}
                    />
                    <span
                      style={{
                        display: "inline-block",
                        paddingRight: "10px",
                      }}
                    >
                      {item == null ? null : item.bdislike}
                    </span>
                  </div>
                </Reply>
              ))}
          </div>
        </div>
      </>
    );
  }

  function PaginatedItems({ itemsPerPage }) {
    // We start with an empty list of items.
    const [currentItems, setCurrentItems] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);

    useEffect(() => {
      // Fetch items from another resources.
      const endOffset = itemOffset + itemsPerPage;
      console.log(`Loading items from ${itemOffset} to ${endOffset}`);
      setCurrentItems(items.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(items.length / itemsPerPage));
    }, [itemOffset, itemsPerPage]);

    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
      const newOffset = (event.selected * itemsPerPage) % items.length;
      console.log(
        `User requested page number ${event.selected}, which is offset ${newOffset}`
      );
      setItemOffset(newOffset);
    };

    return (
      <>
        <Items currentItems={currentItems} />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "30px",
          }}
        >
          <ReactPaginate
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            marginPagesDisplayed={0}
            pageCount={pageCount}
            previousLabel="<"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakLabel=""
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            activeClassName="active"
            renderOnZeroPageCount={null}
          />
        </div>
      </>
    );
  }
  // end pagination
  return (
    <div>
      <PaginatedItems itemsPerPage={6} />
    </div>
  );
};

export default BoardListPagination;

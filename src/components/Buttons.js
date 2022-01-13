/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import classNames from "classnames";

const Buttons = (props) => {
  const pageLinks = [];

  for (let page = 1; page <= props.pages; page++) {
    pageLinks.push(
      <li
        key={page}
        className={classNames({
          "page-item": true,
          active: props.currentPage == page,
        })}
        onClick={() => props.nextPage(page)}
      >
        <a
          id="btn"
          className={classNames({
            "page-link": true,
            "btn disabled": props.currentPage == page,
          })}
          href="#"
        >
          {page}
        </a>
      </li>
    );
  }

  return (
    <div
      className="container"
      style={{ marginTop: "10px", marginBottom: "0px" }}
    >
      <ul className="pagination justify-content-center">
        <li
          className={classNames({
            "page-item": true,
            disabled: props.currentPage == 1,
          })}
          onClick={() => props.nextPage(props.currentPage - 1)}
        >
          <a
            id="btn"
            className={classNames({
              "page-link": true,
              "btn disabled": props.currentPage == 1,
            })}
            href="#"
          >
            &laquo;
          </a>
        </li>
        {pageLinks}
        <li
          className={classNames({
            "page-item": true,
            disabled: props.currentPage == props.pages,
          })}
          onClick={() => props.nextPage(props.currentPage + 1)}
        >
          <a
            id="btn"
            className={classNames({
              "page-link": true,
              "btn disabled": props.currentPage == props.pages,
            })}
            href="#"
          >
            &raquo;
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Buttons;

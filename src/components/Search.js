import React from "react";

export default class Search extends React.Component {
  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <div className="input-group" style={{ width: "400px", margin: "auto" }}>
          <input
            type="text"
            className="form-control"
            style={{
              borderTopLeftRadius: "5px",
              borderBottomLeftRadius: "5px",
            }}
            placeholder="Enter a location"
            onChange={this.props.onChange}
            onKeyDown={this.props.handleKey}
          />
          <div className="input-group-append">
            <button
              className="btn btn-dark"
              style={{
                borderTopRightRadius: "5px",
                borderBottomRightRadius: "5px",
              }}
              onClick={this.props.onSubmit}
              type="submit"
            >
              <i className="fa fa-search">
                <span style={{ fontFamily: "arial", fontSize: "14px" }}>
                  &nbsp;Search
                </span>
              </i>
            </button>
          </div>
        </div>
        {this.props.errMsg ? (
          <div
            className="alert alert-danger"
            style={{
              padding: "15px",
              paddingTop: "8px",
              paddingBottom: "8px",
              width: "max-content",
              margin: "auto",
              marginTop: "12px",
              marginBottom: "18px",
            }}
          >
            <b>Error! </b>
            {this.props.errMsg}
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

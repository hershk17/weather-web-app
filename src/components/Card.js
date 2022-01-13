import React from "react";

export default class Card extends React.Component {
  render() {
    return (
      <div>
        {this.props.location != undefined ? (
          this.props.showDetails ? (
            <li className="card-body-large">
              <div className="column">
                <img src={this.props.location.icon} alt="" width="80" />
              </div>
              <div className="column">
                <img src={this.props.location.flagURL} alt="flag" width="20" />
                &nbsp;{" "}
                <b>
                  {this.props.location.name}, {this.props.location.country}
                </b>
                &nbsp;
                <br />
                Feels like {this.props.location.feelsLike},{" "}
                {this.props.location.condition}.<br />
                <b style={{ fontSize: "30px", fontWeight: "bold" }}>
                  {this.props.location.temp}
                </b>
                <br />
                <br />
                Min: {this.props.location.min}, Max: {this.props.location.max}
                <br />
                Wind: {this.props.location.windSpeed}, humidity:{" "}
                {this.props.location.humidity}, pressure:{" "}
                {this.props.location.pressure}
                <br />
                sunrise: {this.props.location.sunrise}, sunset:{" "}
                {this.props.location.sunset}
                <br />
                Geo coords: [{this.props.location.lat},{" "}
                {this.props.location.lon}]<br />
                <br />
                <div className="collapse-info">
                  {this.props.lastUpdated ? (
                    <>Last updated: {this.props.location.lastUpdated}</>
                  ) : (
                    <>click to collapse</>
                  )}
                </div>
              </div>
            </li>
          ) : (
            <li className="card-body">
              <div className="column">
                <img src={this.props.location.icon} alt="" width="80" />
              </div>
              <div className="column">
                <img src={this.props.location.flagURL} alt="flag" width="20" />
                &nbsp;{" "}
                <b>
                  {this.props.location.name}, {this.props.location.country}
                </b>
                &nbsp;
                <br />
                Feels like {this.props.location.feelsLike},{" "}
                {this.props.location.condition}.<br />
                <b style={{ fontSize: "30px", fontWeight: "bold" }}>
                  {this.props.location.temp}
                </b>
                <br />
                <br />
                <div className="expand-info">click to expand</div>
              </div>
            </li>
          )
        ) : (
          "Error, location not found!"
        )}
      </div>
    );
  }
}

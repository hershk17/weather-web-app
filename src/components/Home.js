/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import moment from "moment";
import classNames from "classnames";
import Search from "./Search";
import Card from "./Card";
import Buttons from "./Buttons";

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: "",
      errMsg: "",
      results: [],
      dataFound: false,
      pageData: [],
      currentPage: 1,
      rows: 3,
    };

    this.handleKey = this.handleKey.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.toggleDetails = this.toggleDetails.bind(this);
  }

  onChange = (e) => {
    this.setState({ query: e.target.value });
  };

  handleKey = (e) => {
    if (e.key == "Enter") {
      this.onSubmit(e);
    }
  };

  componentDidMount() {
    if (this.props.setLocal !== undefined) {
      this.props.setLocal(false);
    }
  }

  componentWillUnmount() {}

  fetchWeatherData() {
    let foundCities = "";

    let parsedInput = this.state.query.split(/[,]+/);
    let str1 =
      parsedInput[0].trim() +
      (parsedInput.length == 2 ? "," + parsedInput[1].trim() : "");

    for (let i = 0; i < this.props.cityList.length; i++) {
      let str2 =
        this.props.cityList[i].name +
        (parsedInput.length == 2 ? "," + this.props.cityList[i].country : "");

      foundCities +=
        str1.toUpperCase() == str2.toUpperCase()
          ? this.props.cityList[i].id + ","
          : "";
    }

    foundCities = foundCities.substr(0, foundCities.length - 1);

    fetch(
      `https://api.openweathermap.org/data/2.5/group?id=${foundCities}&cnt=50&units=metric&appid=3cfba60ea5c89eb0716b89f4e1fdb797`
    )
      .then((res) => {
        if (res.status == 404) {
          throw Error("City not found.");
        }
        res
          .json()
          .then(
            (result) => {
              this.setState(
                {
                  results: result.list,
                  currentPage: 1,
                  errMsg: "",
                  dataFound: true,
                },
                () => {
                  this.loadPage();
                }
              );
            },
            (err) => {
              throw err;
            }
          )
          .catch((err) => {
            this.setState({ errMsg: err });
          });
      })
      .catch((err) => {
        this.setState({ errMsg: err });
      });
  }

  loadPage = () => {
    this.setState(
      {
        pageData: [],
      },
      () => {
        let trimmedStart = (this.state.currentPage - 1) * this.state.rows;
        let trimmedEnd = trimmedStart + this.state.rows;

        this.setState(
          { pageData: this.state.results.slice(trimmedStart, trimmedEnd) },
          () => {
            let filteredData = [];
            for (let i = 0; i < this.state.pageData.length; i++) {
              var record = {
                id: this.state.pageData[i].id,
                temp: this.state.pageData[i].main.temp + "°C",
                feelsLike: this.state.pageData[i].main.feels_like + "°C",
                condition: this.state.pageData[i].weather[0].description,
                min: this.state.pageData[i].main.temp_min + "°C",
                max: this.state.pageData[i].main.temp_max + "°C",
                humidity: this.state.pageData[i].main.humidity + "%",
                pressure: this.state.pageData[i].main.pressure + " hPa",
                windSpeed: this.state.pageData[i].wind.speed + " m/s",
                sunrise: moment
                  .unix(this.state.pageData[i].sys.sunrise)
                  .format("hh:mm:ss A"),
                sunset: moment
                  .unix(this.state.pageData[i].sys.sunset)
                  .format("hh:mm:ss A"),
                lat: this.state.pageData[i].coord.lat,
                lon: this.state.pageData[i].coord.lon,
                name: this.state.pageData[i].name,
                country: this.state.pageData[i].sys.country,
                icon:
                  "https://openweathermap.org/img/wn/" +
                  this.state.pageData[i].weather[0].icon +
                  "@2x.png",
                flagURL:
                  "https://flagcdn.com/28x21/" +
                  this.state.pageData[i].sys.country.toLowerCase() +
                  ".png",
                showDetails: false,
                lastUpdated: new Date().toLocaleString("en-US"),
              };
              filteredData.push(record);
            }
            this.setState({ pageData: filteredData });
          }
        );
      }
    );
  };

  nextPage = (pageNo) => {
    if (
      pageNo >= 1 &&
      pageNo <= Math.ceil(this.state.results.length / this.state.rows)
    ) {
      this.setState({ currentPage: pageNo }, () => this.loadPage());
    }
  };

  onSubmit = (e) => {
    e.preventDefault();

    if (this.state.query == "") {
      this.setState({ errMsg: "Please enter a valid location name." });
    } else {
      this.fetchWeatherData();
    }
  };

  toggleDetails(e, location) {
    e.preventDefault();

    this.setState(
      {
        pageData: this.state.pageData.map((record) => {
          return location.id == record.id
            ? { ...record, showDetails: !record.showDetails }
            : record;
        }),
      },
      () => {
        this.props.updateHistory(location);
      }
    );
  }

  render() {
    const totalPages = Math.ceil(this.state.results.length / this.state.rows);
    return (
      <div>
        <Search
          handleKey={this.handleKey}
          onChange={this.onChange}
          onSubmit={this.onSubmit}
          errMsg={this.state.errMsg}
        />
        {this.state.dataFound ? (
          this.state.errMsg ? (
            ""
          ) : (
            <div>
              <div
                className="alert alert-success"
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
                <b>Success! </b>
                {this.state.results.length} results found.
              </div>
              <ul className="page" style={{ listStyle: "none" }}>
                {this.state.pageData.map((location) => (
                  <a
                    className={classNames({
                      "summary-card": !location.showDetails,
                      "detailed-card": location.showDetails,
                    })}
                    key={location.id}
                    href=""
                    onClick={(e) => this.toggleDetails(e, location)}
                  >
                    <Card
                      location={location}
                      showDetails={location.showDetails}
                      lastUpdated={false}
                    />
                  </a>
                ))}
              </ul>
              <br />
              {this.state.results.length > this.state.rows &&
              !this.state.errMsg ? (
                <Buttons
                  pages={totalPages}
                  nextPage={this.nextPage}
                  currentPage={this.state.currentPage}
                />
              ) : (
                ""
              )}
              <br />
              <br />
            </div>
          )
        ) : (
          <div>
            {this.state.errMsg ? (
              ""
            ) : (
              <div
                className="alert alert-primary"
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
                <b>Welcome, </b>try searching for a city!
              </div>
            )}
            <div className="home">
              <div id="loc">
                {this.props.localInfo.location}
                &nbsp;<img src={this.props.localInfo.flag} alt=""></img>
                &nbsp;<div id="cond">{this.props.localInfo.condition}</div>
              </div>
              <div id="temp">{this.props.localInfo.currTemp}</div>
              <div id="minmax">{this.props.localInfo.minmax}</div>
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <div id="date">{this.props.localInfo.dateTime}</div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

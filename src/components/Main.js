import React from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import Home from "./Home";
import Card from "./Card";

export default class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showLocal: false,
      cityList: [],
      localInfo: {},
      userHistory: [],
      maxHistory: 5,
    };
    this.updateHistory = this.updateHistory.bind(this);
    this.setLocal = this.setLocal.bind(this);
  }

  updateHistory(location) {
    if (!location.showDetails) {
      let locIndex = -1;
      for (let i = 0; i < this.state.userHistory.length; i++) {
        if (this.state.userHistory[i]["id"] == location.id) {
          locIndex = i;
        }
      }
      if (locIndex > -1) {
        this.setState({
          userHistory: this.state.userHistory.filter((_, i) => i !== locIndex),
        });
      } else {
        if (this.state.userHistory.length == this.state.maxHistory) {
          this.setState({
            userHistory: this.state.userHistory.filter(
              (_, i) => i !== this.state.maxHistory - 1
            ),
          });
        }
      }
      this.setState((prevState) => ({
        userHistory: [location, ...prevState.userHistory],
      }));
    }
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    fetch("city.list.json")
      .then((res) => {
        if (res.status !== 200) {
          throw Error("Error reading city list file! code: " + res.status);
        }
        res
          .json()
          .then(
            (json) => {
              this.setState({ cityList: json });
            },
            (err) => {
              throw err;
            }
          )
          .catch((err) => {
            alert(err);
          });
      })
      .catch((err) => {
        alert(err);
      });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState(
          {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          },
          () => this.getLocationInfo()
        );
      });
    } else {
      alert("Error! Geolocation not supported by this browser.");
    }
  }

  getLocationInfo() {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${this.state.lat}&lon=${this.state.lon}&units=metric&appid=3cfba60ea5c89eb0716b89f4e1fdb797`
    )
      .then((res) => {
        if (res.status !== 200) {
          throw Error("Error getting weather data! code: " + res.status);
        }
        res
          .json()
          .then(
            (result) => {
              let data = {
                location: result.name + ", " + result.sys.country,
                country: result.sys.country,
                currTemp: result.main.temp + "°C",
                minmax:
                  result.main.temp_max + "°C / " + result.main.temp_min + "°C",
                main: result.weather[0].main,
                condition: result.weather[0].description,
                flag: `https://flagcdn.com/28x21/${result.sys.country.toLowerCase()}.png`,
              };
              this.setState(
                {
                  localInfo: data,
                },
                () => this.getDateTime()
              );
            },
            (error) => {
              throw Error("Error parsing weather data!");
            }
          )
          .catch((err) => {
            alert(err);
          });
      })
      .catch((err) => {
        alert(err);
      });
  }

  getDateTime() {
    var date = new Date();
    let currDate = date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    let hrs = date.getHours();
    let mins = date.getMinutes();
    let secs = date.getSeconds();

    let unit = hrs > 12 ? "PM" : "AM";

    hrs = hrs % 12;
    hrs = hrs ? hrs : 12;
    mins = mins < 10 ? "0" + mins : mins;
    secs = secs < 10 ? "0" + secs : secs;

    var currTime = hrs + ":" + mins + ":" + secs + " " + unit;

    this.setState((prevState) => ({
      localInfo: {
        ...prevState.localInfo,
        dateTime: currDate + ", " + currTime,
      },
    }));
  }

  setLocal(newState) {
    this.setState({ showLocal: newState });
  }

  render() {
    return (
      <Router>
        <Navbar bg="navbar navbar-dark bg-dark" expand="lg">
          <Navbar.Brand href="/">Weather Widget</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="mr-auto">
              <LinkContainer to="/" onClick={() => this.setLocal(true)}>
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
              <NavDropdown
                title="Visited Cities"
                id="basic-nav-dropdown"
                disabled={this.state.userHistory.length == 0}
              >
                {this.state.userHistory.map((item) => (
                  <NavDropdown.Item
                    as={Link}
                    key={item.id}
                    to={`/city/${item.id}`}
                  >
                    {item.name}, {item.country}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <br />
        <Switch>
          {this.state.showLocal ? (
            <Route
              exact
              path="/"
              component={() => (
                <Home
                  setLocal={this.setLocal}
                  localInfo={this.state.localInfo}
                  cityList={this.state.cityList}
                  updateHistory={this.updateHistory}
                />
              )}
            />
          ) : (
            <Route
              exact
              path="/"
              render={() => (
                <Home
                  localInfo={this.state.localInfo}
                  cityList={this.state.cityList}
                  updateHistory={this.updateHistory}
                />
              )}
            />
          )}
          <Route
            exact
            path="/city/:id"
            render={(props) => (
              <ul className="page" style={{ listStyle: "none" }}>
                <a className="detailed-card">
                  <Card
                    location={
                      this.state.userHistory.filter((item) => {
                        return item.id == props.match.params.id;
                      })[0]
                    }
                    showDetails={true}
                    lastUpdated={true}
                  />
                </a>
              </ul>
            )}
          />

          <Route render={() => <h1>Not Found</h1>} />
        </Switch>
      </Router>
    );
  }
}

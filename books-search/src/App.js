import React, { Component } from "react";
import "./App.css";
import DataComp from "./components/DataComp";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Books Search
          <h4>
            by Rakesh Peela (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/rakhi2104"
            >
              rakhi2104
            </a>
            )
          </h4>
        </header>
        <DataComp />
      </div>
    );
  }
}

export default App;

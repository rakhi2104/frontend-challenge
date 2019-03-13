import axios from "axios";
import React from "react";
import { Button, Col, Container, Form, Input, Label, Row, Spinner } from "reactstrap";
import { parseString } from "xml2js";
import TableComp from "./TableComp";

export default class DataComp extends React.Component {
  state = {
    isLoading: false,
    numPages: 0,
    searchText: null,
    prevSearch: null,
    tableProps: {
      currentPage: 1,
      data: null,
      query: null,
      totalResults: 0
    }
  };

  fetchBooks = requestURI => {
    axios.get(requestURI).then(response => {
      this.setState({
        isLoading: false
      });
      // console.log(requestURI);

      parseString(response.data, (err, result) => {
        if (err) {
          console.log(err);
        }
        const searchResult = result.GoodreadsResponse.search[0];
        const totalResults = searchResult["total-results"];
        const results = searchResult["results"][0].work;
        const { tableProps } = this.state;
        tableProps["data"] = results;
        tableProps["totalResults"] = totalResults;
        tableProps["query"] = searchResult.query[0];

        this.setState({
          numPages: Math.ceil(totalResults / 20),
          tableProps
        });
      });
    });
  };

  onFormSubmit = e => {
    e.preventDefault();

    // const { tableProps, prevSearch } = this.state;

    // if (this.searchField.value !== prevSearch) tableProps["currentPage"] = 1;

    this.setState(
      {
        searchText:
          this.searchField.value
            .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "")
            .toLowerCase() || "book",
        isLoading: true
        // prevSearch:
        //   this.searchField.value !== prevSearch ? this.searchField.value : null,
        // tableProps
      },
      () => {
        const requestURI =
          "https://cors-anywhere.herokuapp.com/www.goodreads.com/search/index.xml?q=" +
          encodeURIComponent(this.state.searchText) +
          "&page=" +
          this.state.tableProps.currentPage +
          "&key=" +
          process.env.REACT_APP_GR_KEY;

        this.fetchBooks(requestURI);
      }
    );
  };

  onSelectChange = e => {
    e.preventDefault();
    // console.log(this.selectField.value);
    const { tableProps } = this.state;
    tableProps["currentPage"] = this.selectField.value;
    this.setState({
      tableProps
    });
    this.onFormSubmit(e);
  };

  render() {
    const selectOptions = [];

    if (this.state.numPages > 0)
      for (let i = 1; i <= this.state.numPages; i++) {
        selectOptions.push(
          <option key={i} value={i}>
            Page {i}
          </option>
        );
      }

    return (
      <div className="dataComp">
        <Container>
          <Row>
            <Col>
              <Form onSubmit={this.onFormSubmit} inline>
                <Label for="searchField">Search Book by Title</Label>
                <Input
                  innerRef={o => (this.searchField = o)}
                  type="text"
                  name="search"
                  id="searchField"
                  placeholder="Hunger Games"
                />
                <Button disabled={this.state.isLoading}>Submit</Button>
              </Form>
            </Col>

            <Col>
              {this.state.numPages > 0 ? (
                <Row>
                  <Col>
                    <Label for="pageSelect">Select Page</Label>
                  </Col>
                  <Col>
                    <Input
                      onChange={this.onSelectChange}
                      type="select"
                      name="select"
                      id="pageSelect"
                      innerRef={o => (this.selectField = o)}
                    >
                      {selectOptions}
                    </Input>
                  </Col>
                </Row>
              ) : (
                <span />
              )}
            </Col>
          </Row>
        </Container>
        <div className="dataTable">
          {this.state.searchText !== null ? (
            this.state.isLoading ? (
              <h3 className="text-center">
                Loading
                <Spinner
                  style={{ width: "2rem", height: "2rem" }}
                  type="grow"
                />
              </h3>
            ) : (
              <TableComp tableProps={this.state.tableProps} />
            )
          ) : (
            <span />
          )}
        </div>
      </div>
    );
  }
}

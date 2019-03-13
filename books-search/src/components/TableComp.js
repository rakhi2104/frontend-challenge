import React from "react";
import { Card, Col, Container, Row, Table } from "reactstrap";

export default class TableComp extends React.Component {
  render() {
    const TableRows = [];

    if (this.props.tableProps.data != null)
      this.props.tableProps.data.forEach((book, index) => {
        TableRows.push(
          <tr key={index + 1}>
            <td>
              <img
                src={book.best_book[0].image_url[0]}
                alt={book.best_book[0].title[0]}
              />
            </td>
            <td>{book.best_book[0].title[0]}</td>
            <td>{book.best_book[0].author[0].name[0]}</td>
          </tr>
        );
      });

    const currentPage = this.props.tableProps.currentPage;
    const totalResults = Number(this.props.tableProps.totalResults[0]);
    const startIndex = (currentPage - 1) * 20;
    const endIndex =
      startIndex + 20 < totalResults
        ? startIndex + 20
        : startIndex + (totalResults % 20);

    // console.log(currentPage, totalResults, startIndex, endIndex);

    return (
      <div>
        <Container>
          <Row>
            <Col>
              <b>{this.props.tableProps.totalResults[0]}</b> books found for{" "}
              <b>{this.props.tableProps.query}</b>
            </Col>
            <Col>
              Showing results{" "}
              <b>
                {startIndex} - {endIndex}
              </b>
            </Col>
          </Row>
        </Container>

        <Card className="dataTable">
          <Table hover size="sm" striped>
            <thead>
              <tr>
                <th width="250" />
                <th>Title</th>
                <th>Author</th>
              </tr>
            </thead>
            <tbody>{TableRows}</tbody>
          </Table>
        </Card>
      </div>
    );
  }
}

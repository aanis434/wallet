import React, { Component } from "react";
import Expense from "./../report/expense";
import { Redirect } from "react-router";

class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: localStorage.getItem("isAuthenticated"),
    };
  }

  render() {
    const { isAuthenticated } = this.state;
    if (!isAuthenticated) {
      return <Redirect push to="/sign-in" />;
    }
    return (
      <div className="Report">
        <Expense />
      </div>
    );
  }
}

export default Report;

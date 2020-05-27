import React, { Component } from "react";
import CategoryWise from "./categoryWise";
import ExpenseJournal from "./journal";
import JournalToPrint from "./jornalToPrint";
import CategoryWiseToPrint from "./categoryWiseToPrint";
import ReportNabBar from "./../reportNavBar";
import Select from "react-select";

import { Redirect } from "react-router-dom";

import "flatpickr/dist/themes/material_green.css";
import "./../date-range-picker.css";
import Flatpickr from "react-flatpickr";
import MasterLayout from "../../../layouts/MasterLayout";

const currentDate = new Date();
const currentFullYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();
const firstDay = new Date(currentFullYear, currentMonth, 1);
const lastDay = new Date(currentFullYear, currentMonth + 1, 0);
const dateFormatOptions = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
};

class ExpenseReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: localStorage.getItem("token"),
      isAuthenticated: localStorage.getItem("isAuthenticated"),
      categoryList: [],
      selectedOption: { value: 0, label: "Expense Journal" },
      startDate: firstDay.toLocaleDateString("en-CA", dateFormatOptions),
      endDate: lastDay.toLocaleDateString("en-CA", dateFormatOptions),
      category: 0,
      expenseList: [],
      expenseJournal: [],
    };
  }

  componentDidMount() {
    this.fetchCategory();
    this.handleExpenseReport(0);
  }

  handleExpenseReport = (category) => {
    const { startDate, endDate } = this.state;
    // console.log(startDate, endDate, category);

    let url = `http://127.0.0.1:8000/expense/reports/?category=${category}&start_date=${startDate}&end_date=${endDate}`;

    if (category === 0) {
      url = `http://127.0.0.1:8000/expense/journal/?start_date=${startDate}&end_date=${endDate}`;
    }

    fetch(url, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Token ${this.state.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        if (!data.journal) {
          this.setState({
            expenseList: data,
            expenseJournal: [],
          });
        } else {
          this.setState({
            expenseJournal: data.results,
            expenseList: [],
          });
        }
      });

    // console.log("result: ", result);
  };

  fetchCategory = () => {
    let options = [{ value: 0, label: "Expense Journal" }];

    const url = "http://127.0.0.1:8000/expense/category/list/";
    fetch(url, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Token ${this.state.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.detail) {
          data.map((item, index) => {
            return options.push({
              value: item.id,
              label: item.name,
            });
          });
        }
      });
    this.setState({
      categoryList: options,
    });
    // console.log("options: ", options);
  };

  // Select option on change action
  handleSelectOptionChange = (selectedOption) => {
    this.setState({
      selectedOption: selectedOption,
      category: selectedOption.value,
    });
    this.handleExpenseReport(selectedOption.value);
  };

  render() {
    const { isAuthenticated } = this.state;
    if (!isAuthenticated) {
      return <Redirect push to="/sign-in" />;
    }
    const { categoryList } = this.state;
    const { expenseJournal } = this.state;
    const { selectedOption } = this.state;
    const { startDate } = this.state;
    const { endDate } = this.state;
    // console.log("endDate:", endDate);
    let self = this;
    return (
      <div className="Item">
        <MasterLayout>
          <div className="row">
            <div className="col-12">
              <div className="page-title-box">
                <ReportNabBar />
                <h4 className="page-title">Reports</h4>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-xl-3">
                      <div className="form-group">
                        <label className="text-center">Report types</label>
                        <Select
                          onChange={self.handleSelectOptionChange}
                          options={categoryList}
                          value={selectedOption}
                          placeholder="Enter types"
                        />
                        <span className="font-12 text-danger"></span>
                      </div>
                    </div>
                    <div className="col-xl-2">
                      <div className="form-group">
                        <label className="text-center">Start date</label>
                        <Flatpickr
                          className="form-control input-sm"
                          id="startDate"
                          value={startDate}
                          onChange={(date) => {
                            let updateDate = date.toLocaleString(
                              "en-CA",
                              dateFormatOptions
                            );
                            this.setState({
                              startDate: updateDate,
                            });
                            self.handleExpenseReport(
                              this.state.selectedOption.value
                            );
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-xl-2">
                      <div className="form-group">
                        <label className="text-center">End date</label>
                        <Flatpickr
                          className="form-control"
                          id="endDate"
                          value={endDate}
                          onChange={(date) => {
                            let updateDate = date.toLocaleString(
                              "en-CA",
                              dateFormatOptions
                            );
                            this.setState({
                              endDate: updateDate,
                            });
                            self.handleExpenseReport(
                              this.state.selectedOption.value
                            );
                          }}
                        />
                      </div>
                    </div>
                    <div className="reportPrintBtn">
                      <div className="form-group">
                        <label className="text-center">&nbsp;</label>
                        {expenseJournal.length > 0 ? (
                          <JournalToPrint
                            expenseJournal={this.state.expenseJournal}
                            startDate={startDate}
                            endDate={endDate}
                            removeAfterPrint={true}
                          />
                        ) : (
                          <CategoryWiseToPrint
                            expenseList={this.state.expenseList}
                            startDate={startDate}
                            endDate={endDate}
                            category={this.state.selectedOption.label}
                            removeAfterPrint={true}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-12">
                      {expenseJournal.length > 0 ? (
                        <ExpenseJournal
                          expenseJournal={this.state.expenseJournal}
                        />
                      ) : (
                        <CategoryWise expenseList={this.state.expenseList} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MasterLayout>
      </div>
    );
  }
}

export default ExpenseReport;

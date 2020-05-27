import React, { Component } from "react";
import MasterLayout from "./../../layouts/MasterLayout";
import Chart from "react-google-charts";

import Select from "react-select";

import { Redirect } from "react-router-dom";

const currentDate = new Date();
const currentFullYear = currentDate.getFullYear();

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: localStorage.getItem("isAuthenticated"),
      selectedYear: { value: currentFullYear, label: currentFullYear },
      totalYears: [],
      chart: [],
      chartTotal: 0,
      totalExpense: 0,
      currentMonthExpense: 0,
      token: localStorage.getItem("token"),
    };
  }

  componentDidMount() {
    this.fetchExpenseSummary();
    this.fetchExpenseChart(currentFullYear);
  }

  fetchExpenseChart = (year) => {
    const url = `http://127.0.0.1:8000/dashboard/expense/chart/?year=${year}`;
    // console.log("token: ", token);
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
          this.setState({
            chart: data.chart,
            chartTotal: data.chart_total["total__sum"],
          });
        }
      });
  };

  fetchExpenseSummary = () => {
    let options = [];
    const url = "http://127.0.0.1:8000/dashboard/expense/summary/";
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
          data.total_years.map((item, index) => {
            return options.push({
              value: item,
              label: item,
            });
          });

          this.setState({
            totalExpense: data.total_expense["total__sum"],
            currentMonthExpense: data.current_month_expense["total__sum"],
          });
        }
      });

    this.setState({
      totalYears: options,
    });

    // console.log(this.state.totalExpense);
  };

  // Select option on change action
  handleSelectOptionChange = (selectedYear) => {
    this.setState({
      selectedYear: selectedYear,
    });
    this.fetchExpenseChart(selectedYear.value);
  };

  render() {
    const { isAuthenticated } = this.state;
    if (!isAuthenticated) {
      return <Redirect push to="/sign-in" />;
    }
    const options = {
      title: "Year and Month wise Category Expenses",
      chartArea: { width: "50%" },
      isStacked: true,
      hAxis: {
        title: "Month",
        minValue: 0,
      },
      vAxis: {
        title: "Total Expense",
      },
    };

    const { chart } = this.state;
    // console.log("chart: ", chart);
    const { chartTotal } = this.state;
    const { totalExpense } = this.state;
    const { currentMonthExpense } = this.state;
    return (
      <div className="Dashboard">
        <MasterLayout>
          <div className="row">
            <div className="col-12">
              <div className="page-title-box">
                <div className="page-title-right">
                  {/* <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="#!">Codefox</a>
                  </li>
                  <li className="breadcrumb-item active">Dashboard</li>
                </ol> */}
                </div>
                <h4 className="page-title">Dashboard</h4>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xl-3 col-md-6">
              <div className="card widget-box-two bg-purple">
                <div className="card-body">
                  <div className="float-right avatar-lg rounded-circle bg-soft-light mt-2">
                    <i className="fas fa-funnel-dollar font-22 avatar-title text-white"></i>
                  </div>
                  <div className="wigdet-two-content">
                    <p
                      className="m-0 text-uppercase text-white"
                      title="Statistics"
                    >
                      Expense
                    </p>
                    <h2 className="text-white">
                      <span data-plugin="counterup">{totalExpense}</span>{" "}
                      <i className="mdi mdi-arrow-up text-white font-22"></i>
                    </h2>
                    <p className="text-white m-0">
                      <b>Total</b> Expenses From Begining
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div className="card widget-box-two bg-info">
                <div className="card-body">
                  <div className="float-right avatar-lg rounded-circle bg-soft-light mt-2">
                    <i className="fas fa-funnel-dollar  font-22 avatar-title text-white"></i>
                  </div>

                  <div className="wigdet-two-content">
                    <p
                      className="m-0 text-white text-uppercase"
                      title="User Today"
                    >
                      This Month
                    </p>
                    <h2 className="text-white">
                      <span data-plugin="counterup">{currentMonthExpense}</span>{" "}
                      <i className="mdi mdi-arrow-up text-white font-22"></i>
                    </h2>
                    <p className="text-white m-0">
                      <b>Current Month</b> Expense
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div className="card widget-box-two bg-pink">
                <div className="card-body">
                  <div className="float-right avatar-lg rounded-circle bg-soft-light mt-2">
                    <i className="mdi mdi-timetable font-22 avatar-title text-white"></i>
                  </div>
                  <div className="wigdet-two-content">
                    <p
                      className="m-0 text-uppercase text-white"
                      title="Request Per Minute"
                    >
                      Total Credit
                    </p>
                    <h2 className="text-white">
                      <span data-plugin="counterup">2365</span>{" "}
                      <i className="mdi mdi-arrow-up text-white font-22"></i>
                    </h2>
                    <p className="text-white m-0">
                      <b>Total</b> Cradit From Begining
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div className="card widget-box-two bg-success">
                <div className="card-body">
                  <div className="float-right avatar-lg rounded-circle bg-soft-light mt-2">
                    <i className="fe-upload font-22 avatar-title text-white"></i>
                  </div>
                  <div className="wigdet-two-content">
                    <p
                      className="m-0 text-white text-uppercase"
                      title="New Downloads"
                    >
                      Payable Credit
                    </p>
                    <h2 className="text-white">
                      <span data-plugin="counterup">854</span>{" "}
                      <i className="mdi mdi-arrow-up text-white font-22"></i>
                    </h2>
                    <p className="text-white m-0">
                      <b>Total</b> Payable Credit
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="page-title-box">
                <div className="page-title-right" style={{ width: "100px" }}>
                  <Select
                    onChange={this.handleSelectOptionChange}
                    options={this.state.totalYears}
                    value={this.state.selectedYear}
                    placeholder="Enter Year"
                  />
                </div>
                <h4 className="page-title">
                  Year's Total: <span>{chartTotal}</span>
                </h4>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 ">
              <div className="my-pretty-chart-container text-center">
                {chartTotal > 0 ? (
                  <Chart
                    width={"1050px"}
                    height={"400px"}
                    chartType="ColumnChart"
                    loader={<div>Loading Chart</div>}
                    data={chart}
                    options={options}
                  />
                ) : (
                  <p className="text-info">No Column Found</p>
                )}
              </div>
            </div>
          </div>
        </MasterLayout>
      </div>
    );
  }
}

export default Dashboard;

import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { notify } from "./../common/functions";

import Select from "react-select";
import MasterLayout from "../../layouts/MasterLayout";

let currentDate = new Date().toLocaleDateString("en-CA", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

class ExpenseCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: localStorage.getItem("token"),
      isAuthenticated: localStorage.getItem("isAuthenticated"),
      redirect: false,
      categoryList: [],
      selectedOption: null,
      imgSrc: null,
      imgSrcExt: null,
      errors: {
        imgSize: null,
        imgType: null,
        expense_date: null,
        category: null,
        merchant: null,
        amount: null,
      },
      btnDisable: false,
      newExpense: {
        id: null,
        expense_date: currentDate,
        merchant: "",
        description: "",
        attachment: null,
        amount: 0,
        tip: 0,
        tax: 0,
        total: 0,
        category: 0,
      },
      editing: false,
      title: "Add An Expense",
      buttonValue: "Create",
    };
  }

  componentDidMount() {
    this.fetchCategory();

    const { id } = this.props.match.params;
    if (id) {
      this.fetchExpenseDetails(id);
      this.setState({
        title: "Update Expense",
        buttonValue: "Update",
        editing: true,
      });
    }
  }

  fetchCategory = () => {
    let options = [];
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
  };

  fetchExpenseDetails = (id) => {
    let url = `http://127.0.0.1:8000/expense/details/${id}/`;
    fetch(url, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Token ${this.state.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          newExpense: data,
          selectedOption: { value: data.category, label: data.category_name },
        })
      );
  };

  handleSubmit = (e) => {
    e.preventDefault(); // stop form-reload
    // console.log("item: ", this.state.newExpense);
    let message = "Expense Add Successful.";
    let className = "text-success";

    const { newExpense } = this.state;
    // console.log("newExpense", newExpense);
    const { expense_date, merchant, category, amount } = this.state.newExpense;
    if (expense_date === "") {
      this.setState({
        errors: {
          ...this.state.errors,
          expense_date: "Expense Date Must not be empty.",
        },
      });
      return false;
    }

    if (merchant === "") {
      this.setState({
        errors: {
          ...this.state.errors,
          merchant: "Merchant Must not be empty.",
        },
      });
      return false;
    }

    if (category === 0) {
      this.setState({
        errors: {
          ...this.errors,
          category: "Category Must not be empty.",
        },
      });
      return false;
    }

    if (amount === 0) {
      this.setState({
        errors: {
          ...this.state.errors,
          amount: "Amount Must not be empty.",
        },
      });
      return false;
    }

    let url = `http://127.0.0.1:8000/expense/list/`;
    let method = "POST";

    if (this.state.editing === true) {
      url = `http://127.0.0.1:8000/expense/details/${newExpense.id}/`;
      method = "PUT";
      this.setState({
        editing: false,
      });
    }

    fetch(url, {
      method: method,
      headers: {
        "Content-type": "application/json",
        Authorization: `Token ${this.state.token}`,
      },
      body: JSON.stringify(newExpense),
    })
      .then((response) => {
        // console.log("response", response);
        // console.log("response.status", response.status);
        if (response.status === 200 || response.status === 201) {
          this.setState({
            newExpense: {
              id: null,
              expense_date: currentDate,
              merchant: "",
              description: "",
              attachment: null,
              amount: 0,
              tip: 0,
              tax: 0,
              total: 0,
              category: 0,
              // user: 1,
            },
            selectedOption: { value: 0, label: null },
            errors: {
              expense_date: null,
              amount: null,
              category: null,
              merchant: null,
            },
          });

          if (method === "PUT") {
            message = "Expense Updated Successful.";
            className = "text-success";
            notify(message, className);

            this.setState({
              redirect: true,
            });
          } else {
            notify(message, className);
          }
        }
      })
      .catch(function (error) {
        console.log("ERROR: ", error);
      });
  };

  /*
  helper function 
  */
  // Select option on change action
  handleSelectOptionChange = (selectedOption) => {
    this.setState({
      selectedOption: selectedOption,
      newExpense: {
        ...this.state.newExpense,
        category: selectedOption.value,
      },
      errors: {
        category: null,
      },
    });
  };

  handleInputChange = (e) => {
    let id = e.target.id;
    let value = e.target.value;

    if (id === "tax" || id === "amount" || id === "tip") {
      if (value === "") {
        value = 0;
      }
    }

    this.setState({
      newExpense: {
        ...this.state.newExpense,
        [id]: value,
      },
      errors: {
        ...this.state.errors,
        [id]: null,
      },
    });
  };

  handleTotal = () => {
    let { amount, tip, tax } = this.state.newExpense;

    amount = amount !== "" ? parseInt(amount) : 0;
    tip = tip !== "" ? parseInt(tip) : 0;
    tax = tax !== "" ? parseInt(tax) : 0;

    let total = amount + tip + tax;

    // console.log(amount, tip, tax);

    this.setState({
      newExpense: {
        ...this.state.newExpense,
        total: total,
      },
    });
  };

  render() {
    const { isAuthenticated } = this.state;
    if (!isAuthenticated) {
      return <Redirect push to="/sign-in" />;
    }
    if (this.state.redirect) {
      return <Redirect push to="/expense-list" />;
    }
    let { selectedOption } = this.state;
    let { newExpense } = this.state;
    let categories = this.state.categoryList;
    const { expense_date, amount, category, merchant } = this.state.errors;
    // console.log("newExpense: ", newExpense);
    return (
      <div className="ExpenseCreate">
        <MasterLayout>
          <div className="row">
            <div className="col-12">
              <div className="page-title-box">
                <div className="page-title-right">
                  <Link to="/expense-list">
                    <button className="btn btn-info">Expenses</button>
                  </Link>
                </div>
                <h4 className="page-title">{this.state.title}</h4>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-xl-6">
                      {/* <h4 className="header-title">
                      Category Based Add Your Expense
                    </h4> */}
                      <p className="sub-header">
                        <code>All* </code> is mandatory filed.
                      </p>

                      <form
                        className="form-horizontal"
                        onSubmit={this.handleSubmit}
                      >
                        <div className="form-group row">
                          <label
                            className="col-md-3 col-form-label"
                            htmlFor="expense_date"
                          >
                            Expense Date
                            <code>*</code>
                          </label>
                          <div className="col-md-9">
                            <input
                              type="text"
                              name="expense_date"
                              id="expense_date"
                              className="form-control input-sm"
                              data-toggle="input-mask"
                              data-mask-format="0000/00/00/"
                              value={newExpense.expense_date}
                              onChange={this.handleInputChange}
                            />
                            <span className="font-12 text-muted">
                              <code>e.g "YYYY-MM-DD (2020-04-22)"</code>
                            </span>
                            <br />
                            <span className="font-12 text-danger">
                              {expense_date ? expense_date : ""}
                            </span>
                          </div>
                        </div>
                        <div className="form-group row">
                          <label
                            className="col-md-3 col-form-label"
                            htmlFor="example-input-merchant"
                          >
                            Merchant
                            <code>*</code>
                          </label>
                          <div className="col-md-9">
                            <input
                              type="text"
                              id="merchant"
                              name="merchant"
                              value={newExpense.merchant}
                              className="form-control input-sm"
                              placeholder="Enter Merchant"
                              onChange={this.handleInputChange}
                            />
                            <span className="font-12 text-danger">
                              {merchant ? merchant : ""}
                            </span>
                          </div>
                        </div>

                        <div className="form-group row">
                          <label
                            className="col-md-3 col-form-label"
                            htmlFor="example-input-merchant"
                          >
                            Category
                            <code>*</code>
                          </label>
                          <div className="col-md-9">
                            <Select
                              onChange={this.handleSelectOptionChange}
                              value={selectedOption}
                              options={categories}
                              placeholder="Enter Category"
                            />
                            <span className="font-12 text-danger">
                              {category ? category : ""}
                            </span>
                          </div>
                        </div>

                        <div className="form-group row">
                          <label
                            className="col-md-3 col-form-label"
                            htmlFor="description"
                          >
                            Description
                          </label>
                          <div className="col-md-9">
                            <textarea
                              className="form-control input-sm"
                              rows="1"
                              id="description"
                              name="description"
                              onChange={this.handleInputChange}
                              value={
                                newExpense.description === ""
                                  ? "Enter Description"
                                  : newExpense.description
                              }
                            ></textarea>
                          </div>
                        </div>
                        <div className="form-group row">
                          <label
                            className="col-md-3 col-form-label"
                            htmlFor="example-input-merchant"
                          >
                            Amount
                            <code>*</code>
                          </label>
                          <div className="col-md-9">
                            <input
                              type="number"
                              id="amount"
                              name="amount"
                              value={
                                newExpense.amount !== 0 && newExpense.amount
                              }
                              className="form-control input-sm"
                              placeholder="Amount"
                              onChange={this.handleInputChange}
                              onKeyUp={this.handleTotal}
                            />
                            <span className="font-12 text-danger">
                              {amount ? amount : ""}
                            </span>
                          </div>
                        </div>
                        <div className="form-group row">
                          <label
                            className="col-md-3 col-form-label"
                            htmlFor="example-input-merchant"
                          >
                            Tax
                          </label>
                          <div className="col-md-9">
                            <input
                              type="number"
                              id="tax"
                              name="tax"
                              value={newExpense.tax !== 0 && newExpense.tax}
                              className="form-control input-sm"
                              placeholder="Tax"
                              onChange={this.handleInputChange}
                              onKeyUp={this.handleTotal}
                            />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label
                            className="col-md-3 col-form-label"
                            htmlFor="example-input-merchant"
                          >
                            Tip
                          </label>
                          <div className="col-md-9">
                            <input
                              type="number"
                              id="tip"
                              name="tip"
                              value={newExpense.tip !== 0 && newExpense.tip}
                              className="form-control input-sm"
                              placeholder="Tip"
                              onChange={this.handleInputChange}
                              onKeyUp={this.handleTotal}
                            />
                          </div>
                        </div>
                        <div className="text-right">
                          <button
                            type="submit"
                            className="btn btn-info waves-effect waves-light mt-3"
                            disabled={this.state.btnDisable}
                          >
                            {this.state.buttonValue}
                          </button>
                        </div>
                      </form>
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

export default ExpenseCreate;

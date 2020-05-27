import React, { Component } from "react";
import { Link } from "react-router-dom";
import { notify } from "./../common/functions";

import Select from "react-select";

let currentDate = new Date().toLocaleDateString("en-CA", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

// const imageMaxSize = 2000000; // bytes
// const acceptedFileTypes = "image/x-png, image/png, image/jpg, image/jpeg";
// const acceptedFileTypesArray = acceptedFileTypes.split(",").map((item) => {
//   return item.trim();
// });

class ExpenseCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
        user: 1,
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
    fetch("http://127.0.0.1:8000/expense/category/list/")
      .then((response) => response.json())
      .then(
        (data) =>
          data.map((item, index) => {
            return options.push({
              value: item.id,
              label: item.name,
            });
          }),
        this.setState({
          categoryList: options,
        })
      );
  };

  fetchExpenseDetails = (id) => {
    let url = `http://127.0.0.1:8000/expense/details/${id}/`;
    fetch(url)
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
    console.log("item: ", this.state.newExpense);
    let message = "Expense Add Successful.";
    let className = "text-success";

    const { newExpense } = this.state;
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

    // if (this.state.btnDisable) return false;
    // console.log("filename: ", newExpense.attachment.name);
    // const filename = newExpense.attachment.name;
    // const fd = new FormData();
    // fd.append("attachment", newExpense.attachment, newExpense.attachment.name);
    // fd.append("merchant", newExpense.merchant);
    // fd.append("expense_date", newExpense.expense_date);
    // fd.append("amount", newExpense.amount);
    // fd.append("category", newExpense.category);
    // fd.append("user", 1);
    // console.log("fd: ", fd);

    let url = `http://127.0.0.1:8000/expense/list/`;
    let method = "POST";

    if (this.state.editing === true) {
      url = `http://127.0.0.1:8000/expense/details/${newExpense.id}/`;
      method = "PUT";
      this.setState({
        editing: false,
      });
    }
    // application/x-www-form-urlencoded; charset=UTF-8
    // "Content-type": "application/json",*/*,multipart/form-data
    // "Content-Disposition": "attachment; filename=upload.jpg",
    fetch(url, {
      method: method,
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(newExpense),
    })
      .then((response) => {
        // this.fetchTasks();
        console.log("response", response);
        console.log("response.status", response.status);
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
              user: 1,
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

            let path = "/expense-list/";
            this.redirectTo(path);
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

  // verifyFile = (files) => {
  //   if (files && files.length > 0) {
  //     const currentFile = files[0];
  //     const currentFileType = currentFile.type;
  //     const currentFileSize = currentFile.size;

  //     if (currentFileSize > imageMaxSize) {
  //       this.setState({
  //         errors: {
  //           ...this.state.errors,
  //           imgSize:
  //             "This file is not allowed. " +
  //             currentFileSize +
  //             " bytes is too large",
  //         },
  //         btnDisable: true,
  //       });
  //       return false;
  //     }
  //     if (!acceptedFileTypesArray.includes(currentFileType)) {
  //       this.setState({
  //         errors: {
  //           ...this.state.errors,
  //           imgType:
  //             "This file is not allowed. Only JPG, PNG images are allowed.",
  //         },
  //         btnDisable: true,
  //       });
  //       return false;
  //     }
  //     return true;
  //   }
  // };

  // handleFileChange = (e) => {
  //   const files = e.target.files;
  //   const values = e.target.value;
  //   console.log("files", files);
  //   console.log("va", values);

  //   this.setState({
  //     imgSrc: null,
  //   });

  //   if (files && files.length > 0) {
  //     const isVerified = this.verifyFile(files);
  //     if (isVerified) {
  //       const currentFile = files[0];
  //       var reader = new FileReader();
  //       reader.onload = () => {
  //         const imgURL = reader.result;
  //         const imgExt = extractImageFileExtensionFromBase64(imgURL);

  //         const fd = new FormData();
  //         fd.append("image", currentFile, currentFile.name);

  //         console.log("fd:", fd);
  //         // const myNewFile = "data:image/png;base64," + imgURL;
  //         this.setState({
  //           imgSrc: imgURL,
  //           imgSrcExt: imgExt,
  //           errors: {
  //             ...this.state.errors,
  //             imageSize: null,
  //             imgType: null,
  //           },
  //           btnDisable: false,
  //           newExpense: {
  //             ...this.state.newExpense,
  //             attachment: currentFile,
  //           },
  //         });
  //       };

  //       this.setState({
  //         newExpense: {
  //           ...this.state.newExpense,
  //           attachment: currentFile,
  //         },
  //       });
  //       reader.readAsDataURL(currentFile);
  //     }
  //   }
  // };

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

    console.log(amount, tip, tax);

    this.setState({
      newExpense: {
        ...this.state.newExpense,
        total: total,
      },
    });
  };

  // redirectTo function used for redirect component through react-router
  redirectTo = (path) => {
    const { history } = this.props;
    console.log("history", history);
    const supportsHistory = "pushState" in window.history;

    console.log("supportsHistory", supportsHistory);
    if (supportsHistory) {
      history.push(path);
    }
  };

  render() {
    let { selectedOption } = this.state;
    let { newExpense } = this.state;
    let categories = this.state.categoryList;
    // const { errors } = this.state;
    // const { imgSize, imgType } = this.state.errors;
    // const { imgSrc } = this.state;
    const { expense_date, amount, category, merchant } = this.state.errors;
    // console.log("newExpense: ", newExpense);
    // let self = this;
    return (
      <div className="ExpenseCreate">
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
                          </span>{" "}
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
                            placeholder="Enter Your Merchant"
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
                                ? "Enter Your Description"
                                : newExpense.description
                            }
                            placeholder="new "
                          ></textarea>
                        </div>
                      </div>
                      {/* <div className="form-group row">
                        <label className="col-md-3 col-form-label">
                          Attachment
                        </label>
                        <div className="col-md-9">
                          <div className="mt3">
                            <input
                              type="file"
                              name="attachment"
                              className="input-sm"
                              onChange={this.handleFileChange}
                              accept={acceptedFileTypes}
                              multiple={false}
                              maxSize={imageMaxSize}
                            />
                            <span className="font-12 text-danger">
                              {imgSize != null ? imgSize : ""}
                              {imgType != null ? imgType : ""}
                            </span>
                            <img
                              src={imgSrc != null ? imgSrc : ""}
                              alt=""
                              width="150"
                              height="150"
                              style={{ paddingTop: "15px" }}
                            />
                          </div>
                        </div>
                      </div> */}
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
                            value={newExpense.amount !== 0 && newExpense.amount}
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
      </div>
    );
  }
}

export default ExpenseCreate;

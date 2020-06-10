import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import MasterLayout from "../../layouts/MasterLayout";

class Expense extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: localStorage.getItem("token"),
      isAuthenticated: localStorage.getItem("isAuthenticated"),
      expenseList: [],
      offset: 0,
      perPage: 10,
      currentPage: 0,
      query: "",
    };
  }

  componentDidMount() {
    this.fetchExpenses();
  }

  fetchExpenses = () => {
    let url = "http://127.0.0.1:8000/expense/list/";
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
          expenseList: data.results,
          pageCount: Math.ceil(data.count / this.state.perPage),
        })
      );
  };

  handlePagination = (e) => {
    const selectedPage = e.selected + 1;
    // console.log("selectedPage", selectedPage);
    const offset = selectedPage * this.state.perPage;
    // console.log("offset", offset);
    let url = `http://127.0.0.1:8000/expense/list/?page=${selectedPage}`;
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
          expenseList: data.results,
          currentPage: selectedPage,
          offset: offset,
        })
      );
  };

  startDelete = (expense) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: false, //"warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        expense.delete_status = 1;

        fetch(`http://127.0.0.1:8000/expense/details/${expense.id}/`, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(expense),
        })
          .then((response) => {
            if (response.status === 200) {
              Swal.fire("Deleted!", "Your file has been deleted.", "success");
            }
            this.fetchExpenses();
          })
          .catch(function (error) {
            console.log("ERROR: ", error);
          });
      }
    });
  };

  handleSearch = (e) => {
    e.preventDefault();
    // let id = e.target.id;
    let q = e.target.value;
    this.setState({
      query: q,
    });

    if (q === "") {
      this.fetchExpenses();
      return false;
    }

    let url = `http://127.0.0.1:8000/expense/query/?q=${q}`;

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
          expenseList: data,
        })
      )
      .catch(function (error) {
        console.log("ERROR: ", error);
      });
  };

  render() {
    const { isAuthenticated } = this.state;
    if (!isAuthenticated) {
      return <Redirect push to="/sign-in" />;
    }
    let expenses = this.state.expenseList;
    // console.log("expenses", expenses);
    let self = this;
    return (
      <div className="Expense">
        <MasterLayout>
          <div className="row">
            <div className="col-12">
              <div className="page-title-box">
                <div className="page-title-right">
                  <Link to="/expense-create">
                    <button className="btn btn-info">Add an expense</button>
                  </Link>
                </div>
                <div
                  className="page-title-right d-none d-sm-block col-md-3"
                  style={{ marginRight: "30%" }}
                >
                  <form className="app-search">
                    <div className="app-search-box">
                      <div className="input-group">
                        <input
                          type="text"
                          id="query"
                          name="query"
                          value={this.state.query}
                          onChange={this.handleSearch}
                          className="form-control text-center"
                          placeholder="Search expenses"
                        />
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="fe-search"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <h4 className="page-title">Expenses</h4>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="responsive-table-plugin">
                    <div className="table-rep-plugin">
                      <div
                        className="table-responsive"
                        data-pattern="priority-columns"
                      >
                        <table
                          id="tech-companies-1"
                          className="table table-striped "
                        >
                          <thead>
                            <tr>
                              <th>Merchant</th>
                              <th data-priority="1">Description</th>
                              {/* <th data-priority="3">Photo</th> */}
                              <th data-priority="1">Category</th>
                              <th data-priority="3">Date</th>
                              <th data-priority="3">Total</th>
                              <th data-priority="6">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {expenses ? (
                              expenses.map(function (expense, index) {
                                const options = {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                };
                                let expDate = new Date(
                                  expense.expense_date
                                ).toLocaleDateString("en-GB", options);
                                return (
                                  <tr key={index}>
                                    <th>
                                      {expense.merchant}
                                      {/* <span className="co-name">Google Inc.</span> */}
                                    </th>
                                    <td> {expense.description}</td>
                                    {/* <td> {expense.attachment}</td> */}
                                    <td> {expense.category_name}</td>
                                    <td> {expDate}</td>
                                    <td> {expense.total}</td>
                                    <td>
                                      <Link to={`/expense/edit/${expense.id}`}>
                                        <button className="btn btn-sm btn-info">
                                          <i className="fe-edit"></i>
                                        </button>
                                      </Link>
                                      &nbsp;
                                      <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => {
                                          self.startDelete(expense);
                                        }}
                                      >
                                        <i className="fe-delete"></i>
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td
                                  colSpan="6"
                                  className="text-center text-info"
                                >
                                  No Records Found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                        <div>
                          <ReactPaginate
                            previousLabel={"<<"}
                            nextLabel={">>"}
                            breakLabel={"..."}
                            breakClassName={"break-me"}
                            pageCount={this.state.pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={2}
                            onPageChange={this.handlePagination}
                            containerClassName={
                              "pagination justify-content-center"
                            }
                            subContainerClassName={"pages pagination"}
                            activeClassName={"active"}
                          />
                        </div>
                      </div>
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

export default Expense;

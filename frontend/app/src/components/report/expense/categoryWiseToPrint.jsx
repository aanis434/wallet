import React, { Component } from "react";
import ReactToPrint from "react-to-print";

const dateFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

class ComponentToPrint extends Component {
  render() {
    const { expenseList } = this.props;
    let { category } = this.props;
    // console.log(expenseList);
    let { startDate } = this.props;
    startDate = new Date(startDate).toLocaleDateString(
      "en-GB",
      dateFormatOptions
    );
    let { endDate } = this.props;
    endDate = new Date(endDate).toLocaleDateString("en-GB", dateFormatOptions);

    let total = 0;
    return (
      <div className="expensePrint" style={{ margin: "6%" }}>
        <div className="row">
          <div
            className="col-md-12 text-center text-secondary"
            style={{ marginBottom: "1.5%" }}
          >
            <h3>Expense Category Report</h3>
            <h4>
              {startDate} to {endDate}
            </h4>
            <h5>{category}</h5>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12">
            <div className="responsive-table-plugin">
              <div className="table-rep-plugin">
                <div
                  className="table-responsive"
                  data-pattern="priority-columns"
                >
                  <table id="tech-companies-1" className="table table-striped ">
                    <thead>
                      <tr>
                        <th>Merchant</th>
                        <th data-priority="1">Description</th>
                        <th data-priority="3">Date</th>
                        <th data-priority="3">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenseList.length > 0 ? (
                        expenseList.map(function (expense, index) {
                          total += expense.total;
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
                              <th>{expense.merchant}</th>
                              <td> {expense.description}</td>
                              <td> {expDate}</td>
                              <td> {expense.total}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center text-info">
                            No Records Found
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td colSpan="3" className="text-right text-info">
                          Total
                        </td>
                        <td className="text-info">{total}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class CategoryWiseToPrint extends Component {
  render() {
    const { expenseList } = this.props;
    const { category } = this.props;
    const { startDate } = this.props;
    const { endDate } = this.props;
    return (
      <div>
        <ReactToPrint
          trigger={() => (
            <button className="btn btn-info">
              <i className="fe-printer"></i>
            </button>
          )}
          content={() => this.componentRef}
        />
        <div style={{ display: "none" }}>
          <ComponentToPrint
            ref={(el) => (this.componentRef = el)}
            expenseList={expenseList}
            category={category}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
      </div>
    );
  }
}

export default CategoryWiseToPrint;

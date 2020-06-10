import React, { Component } from "react";

class categoryWise extends Component {
  render() {
    const { expenseList } = this.props;
    let total = 0;
    return (
      <div className="categoryWise">
        <div className="responsive-table-plugin">
          <div className="table-rep-plugin">
            <div className="table-responsive" data-pattern="priority-columns">
              <table id="tech-companies-1" className="table table-striped ">
                <thead>
                  <tr>
                    <th>Merchant</th>
                    <th data-priority="1">Description</th>
                    <th data-priority="1">Category</th>
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
                          <td> {expense.category_name}</td>
                          <td> {expDate}</td>
                          <td> {expense.total}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center text-info">
                        No Records Found
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan="4" className="text-right text-info">
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
    );
  }
}

export default categoryWise;

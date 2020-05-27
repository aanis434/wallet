import React, { Component } from "react";

class expenseJournal extends Component {
  render() {
    const { expenseJournal } = this.props;
    let total = 0;
    return (
      <div className="expenseJournal">
        <div className="responsive-table-plugin">
          <div className="table-rep-plugin">
            <div className="table-responsive" data-pattern="priority-columns">
              <table id="tech-companies-1" className="table table-striped ">
                <thead className="text-center">
                  <tr>
                    <th>Category</th>
                    <th data-priority="3">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {expenseJournal.length > 0 ? (
                    expenseJournal.map(function (expense, index) {
                      total += expense.cat_sum;
                      return (
                        <tr key={index}>
                          <th>{expense.category__name}</th>
                          <td>{expense.cat_sum}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center text-info">
                        No Records Found
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td className="text-right text-info">Total</td>
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

export default expenseJournal;

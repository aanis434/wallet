import React, { Component } from "react";
import ReactToPrint from "react-to-print";

const dateFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

class ComponentToPrint extends Component {
  render() {
    const { expenseJournal } = this.props;
    let { startDate } = this.props;
    startDate = new Date(startDate).toLocaleDateString(
      "en-GB",
      dateFormatOptions
    );
    let { endDate } = this.props;
    endDate = new Date(endDate).toLocaleDateString("en-GB", dateFormatOptions);

    let total = 0;
    return (
      <div className="expensePrint container" style={{ margin: "6%" }}>
        <div className="row">
          <div
            className="col-md-12 text-center"
            style={{ marginBottom: "1.5%" }}
          >
            <h3>Expense Journal</h3>
            <h4>
              {startDate} to {endDate}
            </h4>
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
                  <table id="tech-companies-1" className="table table-sm">
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
        </div>
      </div>
    );
  }
}

class JournalToPrint extends Component {
  render() {
    const { expenseJournal } = this.props;
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
            expenseJournal={expenseJournal}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
      </div>
    );
  }
}

export default JournalToPrint;

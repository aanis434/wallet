import React from "react";
import { Link } from "react-router-dom";
// stateless functional component - sfc
const ReportNavBar = () => {
  return (
    <div className="page-title-right">
      <div className="btn-group mb-2">
        <button type="button" className="btn btn-info waves-effect waves-light">
          Balance
        </button>
        <button type="button" className="btn btn-info waves-effect waves-light">
          Creditor
        </button>
        <Link to="/reports">
          <button
            type="button"
            className="btn btn-info waves-effect waves-light"
          >
            Expense
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ReportNavBar;

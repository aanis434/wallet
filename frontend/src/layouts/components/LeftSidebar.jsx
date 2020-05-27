import React, { Component } from "react";
import { Link } from "react-router-dom";

class LeftSidebar extends Component {
  render() {
    return (
      <div className="LeftSidebar">
        <div className="left-side-menu">
          <div className="slimscroll-menu">
            <div id="sidebar-menu">
              <ul className="metismenu" id="side-menu">
                {/* <li className="menu-title">Navigation</li> */}

                <li>
                  <Link to="/home">
                    <i className="fe-airplay"></i>
                    {/* <span className="badge badge-success badge-pill float-right">
                      1
                    </span> */}
                    <span> Home </span>
                  </Link>
                </li>

                <hr style={{ borderTopColor: "#f3f3f3" }} />

                <li>
                  <Link to="/expense-list">
                    <i className="fas fa-funnel-dollar"></i>
                    <span> Expenses </span>
                  </Link>
                </li>
                <li>
                  <Link to="/creditor-list">
                    <i className="fe-users"></i>
                    <span> Creditors </span>
                  </Link>
                </li>

                <hr style={{ borderTopColor: "#f3f3f3" }} />
                <li>
                  <Link to="/reports">
                    <i className="fe-pie-chart"></i>
                    <span> Reports </span>
                  </Link>
                </li>

                <hr style={{ borderTopColor: "#f3f3f3" }} />
              </ul>
            </div>

            <div className="clearfix"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default LeftSidebar;

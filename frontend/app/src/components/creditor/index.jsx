import React, { Component } from "react";
import MasterLayout from "../../layouts/MasterLayout";

class Creditor extends Component {
  render() {
    return (
      <div className="Creditor">
        <MasterLayout>
          <div className="row">
            <div className="col-12">
              <div className="page-title-box">
                <div className="page-title-right">
                  <button className="btn btn-primary">Add a Creditor</button>
                </div>
                <h4 className="page-title">Creditors</h4>
              </div>
            </div>
          </div>

          <div className="row">
            <p>This is a Creditor component!! Coming Soon!! </p>
          </div>
        </MasterLayout>
      </div>
    );
  }
}

export default Creditor;

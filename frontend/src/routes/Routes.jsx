import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

// Pages Imported
import Dashboard from "./../components/dashboard/";
import Login from "./../components/auth/login";
import Registration from "./../components/auth/registration";
import expense from "../components/expense";
import Creditor from "../components/creditor";
import Report from "../components/report";
import NotFound from "../components/notFound";

// Route definition
class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/sign-in" component={Login} />
        <Route exact path="/sign-up" component={Registration} />
        <Route exact path="/home" component={Dashboard} />
        <Route exact path="/expense-list" component={expense.list} />
        <Route exact path="/expense/edit/:id" component={expense.create} />
        <Route exact path="/expense-create" component={expense.create} />
        <Route exact path="/creditor-list" component={Creditor} />
        <Route exact path="/reports" component={Report} />

        {/*    404    */}
        <Route path="*" component={NotFound} />
      </Switch>
    );
  }
}

export default Routes;

import { FC } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Dashboard } from "src/pages/dashboard";

export const Router: FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/dashboard">
          <Dashboard />
        </Route>
        <Route path="/">
          <Dashboard />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

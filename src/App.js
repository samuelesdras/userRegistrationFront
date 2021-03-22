import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Header from './components/header'
import List from './components/user/list';
import Create from './components/user/create';
import View from './components/user/view';
import Edit from './components/user/edit'
import NotFound from './components/notfound';
import { toast } from 'react-toastify';

toast.configure()
const App = () => {
  return (
    <BrowserRouter>
      <div className="container">
      <Header/>
      <hr/>
        <Switch>
          <Route path="/create" component={Create}/>
          <Route path="/view/:id" component={View}/>
          <Route path="/edit/:id" component={Edit}/>
          <Route path="/" exact component={List}/>

          <Route component={NotFound}/>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;

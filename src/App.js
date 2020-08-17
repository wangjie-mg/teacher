import React from 'react';

import {BrowserRouter as Router,Route} from 'react-router-dom';

import main from './Main/main';
import signin from './Signin/signin';
import abministrator from './Abministrator/abministrator';


function App() {
  return (
    <Router>
      <div>
        <Route exact path="/" component={main} />
        <Route exact path="/Signin" component={signin} />
        <Route exact path="/Abministrator" component={abministrator} />
      </div>
    </Router>
  );
}

export default App;

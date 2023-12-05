import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Login from './Pages/Login'
import Home from './Pages/Home'
import PageNotFound from './Pages/PageNotFound'
import Settings from './Pages/Settings'
import CompanyHome from './Pages/CompanyHome'
import ResetPassword from './Pages/ResetPassword'
import AllAccounts from './Pages/AllAccounts';
import MarkettingServices from './Pages/MarkettingServices'
import Links from './Pages/Links';
import Activity from './Pages/Activity';
import Docs from './Pages/Docs'
import Renewals from './Pages/Renewals'
import Team from './Pages/Team';
import MyAccounts from './Pages/MyAccounts';
import UpcomingRenewals from './Pages/UpcomingRenewals';
import TouchBase from './Pages/touchbase';
import { LoginActivity } from './Pages/AdminPages/LoginActivity';
import { UpcomingRenewalsAdmin } from './Pages/AdminPages/UpcomingRenewalsAdmin';
import { TouchbaseDueAdmin } from './Pages/AdminPages/TouchbaseDueAdmin';
import BookUpload from './Pages/uploadBook'

function App() {
  return (
    // <div>
      <Router>
              <Switch>
                <Route path='/' exact component={Login} />
                <Route path='/home' exact render={props => (<Home {...props} />)} />
                <Route path='/settings' exact component={Settings} />
                <Route path='/company/:id' exact component={CompanyHome} />
                <Route path='/links' exact component={Links} />
                <Route path='/resetPassword' exact component={ResetPassword} />
                <Route path='/allaccounts' exact component={AllAccounts} />
                <Route path='/marketingservices' exact component={MarkettingServices} />
                <Route path='/docs' exact component={Docs} />
                <Route path='/activity' exact component={Activity} />
                <Route path='/allrenewals' exact component={Renewals} />
                <Route path='/myteam' exact component={Team} />
                <Route path='/myAccounts' exact component={MyAccounts} />
                <Route path='/upcomingrenewals' exact component={UpcomingRenewals} />
                <Route path='/TouchBase' exact component={TouchBase} />
                <Route path='/loginActivity' exact component={LoginActivity} />
                <Route path='/upcomingRenewalsAdmin' exact component={UpcomingRenewalsAdmin} />
                <Route path='/touchbaseDueAdmin' exact component={TouchbaseDueAdmin} />
                <Route path='/uploadBook' exact component={BookUpload} />
                <Route path='*' exact component={PageNotFound} />
              </Switch>
      </Router>
    // </div>
    );
}

export default App;

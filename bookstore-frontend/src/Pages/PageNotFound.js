import React from 'react';
import './../res/css/PageNotFound.css';
import SideNavBar from './../Components/SideNavBar';
import NavBar from './../Components/NavBar';

function PageNotFound() {
  return (
    <div className="sfds">
      <SideNavBar/>
      <NavBar/>
      <p className="pageNotFound">
        Opps!!! This Page is not developed yet!!!!
        <br/>
        How Did you Land Here? </p>
      </div>
  )
}

export default PageNotFound

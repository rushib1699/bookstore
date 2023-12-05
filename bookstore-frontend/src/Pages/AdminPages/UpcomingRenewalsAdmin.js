import React, { useState } from 'react'
import NavBar from '../../Components/NavBar'
import SideNavBar from '../../Components/SideNavBar'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'


export const UpcomingRenewalsAdmin = () => {

  const rowData = [
    { companyName: 'Premium Hvac', mrr: '200$', accountManager: 'Pratap' },
    { companyName: 'Field Solutions', mrr: '400$', accountManager: 'Shoaib' }
  ];

  const columnDefs = [
    { field: 'companyName' },
    { field: 'mrr' },
    { field: 'accountManager' }
  ];

  return (
    <>
      <NavBar />
      <SideNavBar />
      <div className='main-content'>
        <div className='dashboard-heading'>Upcoming Renewals</div>
        <div className='ag-theme-alpine'
        style={{
          height: '300'
        }}>
          <AgGridReact
            rowData={rowData}
            columndefs={columnDefs}
             />
        </div>
      </div>
    </>
  )
}

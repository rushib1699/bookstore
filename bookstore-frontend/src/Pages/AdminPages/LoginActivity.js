import React, { useMemo } from 'react'
import NavBar from '../../Components/NavBar'
import SideNavBar from '../../Components/SideNavBar'
import { AgGridReact } from 'ag-grid-react'
import { useState } from 'react'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'

export const LoginActivity = () => {

  const [rowData, setRowData] = useState([
    { accountManager: 'Pratap', usage: '120 mins', contactNumber: '9234543236' },
    { accountManager: 'Shoaib', usage: '60 mins', contactNumber: '6523409870' },
    { accountManager: 'Priyam', usage: '30 mins', contactNumber: '6108348241' },
    { accountManager: 'Anamika', usage: '43 mins', contactNumber: '8321098766'}
  ]);

  const [columnDefs, setColumnDefs] = useState([
    { field: 'accountManager'},
    { field: 'usage'},
    { field: 'contactNumber'}
  ]);

  const defaultColDef = useMemo(()=>({
    sortable: true, 
    filter: true,
    flex: 1,
    minWidth: 200,
    resizable: true
  }), []);

  return (
    <>
      <NavBar />
      <SideNavBar />
      <div className='main-content'>
        <div className='dashboard-heading'>Login Activity</div>
        <div className='ag-theme-alpine'
          style={{
            height: 400,
            width: 602
          }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            animateRows={true}
            rowSelection={false} />
        </div>
      </div>
    </>
  )
}

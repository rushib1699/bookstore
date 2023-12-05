import React, {useState, useEffect} from 'react'
import { AgGridReact, AgGridColumn } from 'ag-grid-react'
import AddNewCompany from './AddNewCompany';
import Axios from "axios";
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import 'ag-grid-community/dist/styles/ag-grid.css'
import './../res/css/CompanyTable.css'
import { useHistory } from "react-router-dom"



export const GridTable = () => {
const apis = require("../Config/API.json");
    const [rowData, setRowData] = useState()
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [hideColumn, setHideCloumn] = useState(false);
    const [loading, setLoading] = useState(false);
    const onGridReady = (params) => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
    };

    
    /***************************FILTERS************************************************************************************************************* */
    const dateFilterParams = {
        comparator: function (filterLocalDateAtMidnight, cellValue) {
            var dateAsString = cellValue;
            if (dateAsString == null) return -1;
            var dateParts = dateAsString.split('-');
            //console.log(dateParts)
            var cellDate = new Date(
                Number(dateParts[2]),
                Number(dateParts[1]) - 1,
                Number(dateParts[0])
            );
            //console.log(cellDate)
            if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
                return 0;
            }
            if (cellDate < filterLocalDateAtMidnight) {
                return -1;
            }
            if (cellDate > filterLocalDateAtMidnight) {
                return 1;
            }
        },
        browserDatePicker: true,
        minValidYear: 2000,
    };

    function contains(target, lookingFor) {
        return target && target.indexOf(lookingFor) >= 0;
    }



    const genericFilterParams = {
        filterOptions: ['contains'],
        textCustomComparator: function (_, value, filterText) {
            var filterTextLowerCase = filterText.toLowerCase();
            var valueLowerCase = value.toString().toLowerCase();
            var literalMatch = contains(valueLowerCase, filterTextLowerCase);
            return (
                literalMatch
            );
        },
        trimInput: true,
        debounceMs: 1000,
    };



    const companyFilterParams = {
        filterOptions: ['contains', 'notContains'],
        textFormatter: function (r) {
            if (r == null) return null;
            return r
                .toLowerCase()
                .replace(/[àáâãäå]/g, 'a')
                .replace(/æ/g, 'ae')
                .replace(/ç/g, 'c')
                .replace(/[èéêë]/g, 'e')
                .replace(/[ìíîï]/g, 'i')
                .replace(/ñ/g, 'n')
                .replace(/[òóôõö]/g, 'o')
                .replace(/œ/g, 'oe')
                .replace(/[ùúûü]/g, 'u')
                .replace(/[ýÿ]/g, 'y');
        },
        debounceMs: 200,
        suppressAndOrCondition: true,
    };

    /***************************FILTERS************************************************************************************************************* */


    useEffect(() => {
        setLoading(true);

        let Access_token = sessionStorage.getItem("token")

        let config = {
            headers: {
                'Authorization' : `Bearer ${Access_token}`
            }
        }
        Axios.get(apis.ALLCOMPANIES_FETCH, config)
            .then((response) => {
                console.log(response.data.companies)
                setRowData(response.data.companies)
                console.log(rowData)
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);
    if (loading) {
        return <p>Data is loading...</p>;
    }
    const EditCompanyDetails = params => {
        const history = useHistory();
        const comapanyRoute = () => history.push({
            pathname: `/company/${params.data.id}`,
            state: params.data
        })
        return <span><button onClick={comapanyRoute} className="btn btn-Action">EDIT</button></span>;
    }
    const HideColumn = () => {
        gridColumnApi.setColumnVisible(['am'], hideColumn)
        gridColumnApi.setColumnVisible(['om'], hideColumn)
        gridColumnApi.setColumnVisible(['status'], hideColumn)
        gridColumnApi.setColumnVisible(['timezone'], hideColumn)
        gridColumnApi.setColumnVisible(['live_date'], hideColumn)
        gridColumnApi.setColumnVisible(['handoff_date'], hideColumn)
        gridColumnApi.setColumnVisible(['contract_type'], hideColumn)
        gridColumnApi.setColumnVisible(['previous_platform'], hideColumn)
        gridColumnApi.setColumnVisible(['accounting_software'], hideColumn)
        gridColumnApi.setColumnVisible(['payment_partner'], hideColumn)
        gridColumnApi.setColumnVisible(['ob_date'], hideColumn)
        gridColumnApi.setColumnVisible(['ob_time'], hideColumn)
        gridColumnApi.setColumnVisible(['churned_date'], hideColumn)
        setHideCloumn(!hideColumn)
    }

    return (
        <>
            <div
                id="myGrid"
                style={{
                    height: '550px',
                    position: 'relative',
                    width: '1500px',
                    marginTop: '13%'
                }}
                className="ag-theme-alpine"
            >
                <button class="button button1" onClick={AddNewCompany}>Add New Company</button>
                <button class="button button1" onClick={HideColumn}>Hide</button>
                <AgGridReact
                    defaultColDef={{
                        flex: 1,
                        minWidth: 200,
                        resizable: true,
                        filter: true,
                        sortable: true
                    }}
                    frameworkComponents={{ editcompanydetails: EditCompanyDetails }}
                    onGridReady={onGridReady}
                    rowData={rowData}
                    rowSelection="Single"
                >
                    <AgGridColumn field="name"
                    headerName="Company Name"
                        filterParams={companyFilterParams}
                        filterParams={{
                            alwaysShowBothConditions: true,
                            defaultJoinOperator: 'OR',
                        }}
                    />
                    <AgGridColumn field="support_email" 
                    headerName="Support Mail"/>
                    <AgGridColumn
                        field="am"
                        headerName="Account Manager"
                        filterParams={{
                            filterOptions: ['contains', 'startsWith', 'endsWith'],
                            defaultOption: 'startsWith',
                        }}
                    />
                    <AgGridColumn
                        field="om"
                        headerName="Onboarding Manager"
                        filterParams={{
                            filterOptions: ['contains', 'startsWith', 'endsWith'],
                            defaultOption: 'startsWith',
                        }}
                    />
                    <AgGridColumn field="status"
                    headerName="Status"
                        filter="agTextColumnFilter"
                        filterParams={genericFilterParams}
                    />
                    <AgGridColumn field="timezone" 
                    headerName="Time Zone"/>
                    <AgGridColumn
                        field="live_date"
                        headerName="Live Date"
                        filter="agDateColumnFilter"
                        filterParams= {dateFilterParams}
                    />
                    <AgGridColumn
                        field="handoff_date"
                        headerName="Handoff Date"
                        filter="agDateColumnFilter"
                        filterParams={dateFilterParams}
                    />
                    <AgGridColumn
                        field="churned_date"
                        headerName="Churned Date"
                        filter="agDateColumnFilter"
                        filterParams={dateFilterParams}
                    />
                    <AgGridColumn
                        field="ob_date"
                        headerName="Onboarding Date"
                        filter="agDateColumnFilter"
                        filterParams={dateFilterParams}
                    />
                    <AgGridColumn
                        field="ob_time"
                        headerName="Onboarding Time"
                        filter="agDateColumnFilter"
                    />
                    <AgGridColumn
                        field="mrr"
                        headerName="MRR ($)"
                        filter="agNumberColumnFilter"
                    //filterParams={mrrFilterParams}
                    //valueFormatter={mrrValueFormatter}
                    //valueFormatter={numberValueFormatter}
                    />
                    <AgGridColumn field="contract_type"
                    headerName="Contract Type"/>
                    <AgGridColumn field="previous_platform" 
                    headerName="Previous Platform"/>
                    <AgGridColumn field="accounting_software" 
                        headerName = "Accounting Software"
                        />
                    <AgGridColumn field="payment_partner" 
                        headerName = "Payment Partner"
                    />
                    <AgGridColumn
                            field="last_touchbase"
                            headerName="Last TouchBase"
                            
                            filter="agDateColumnFilter"
                            filterParams={dateFilterParams}
                        />
                    <AgGridColumn field="Action" cellRenderer="editcompanydetails" />
                </AgGridReact>
            </div>
        </>
    );
}
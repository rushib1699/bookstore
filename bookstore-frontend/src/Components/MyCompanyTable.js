import React, {useState, useEffect} from 'react'
import { AgGridReact, AgGridColumn } from 'ag-grid-react'
import Axios from "axios";

import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import 'ag-grid-community/dist/styles/ag-grid.css'
import './../res/css/CompanyTable.css'
import { useHistory } from "react-router-dom"
export const GridTable = () => {
    const apis = require("../Config/API.json");
    const [rowData, setRowData] = useState([])
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [hideColumn, setHideCloumn] = useState(false);
    const [loading, setLoading] = useState(false);
    const onGridReady = (params) => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
    };

    useEffect(() => {
        setLoading(true);
        Axios.post((apis.MYCOMPANIES_FETCH) ,{
            user: sessionStorage.getItem("user-id"),
        }).then((response) => {
                console.log (response.data.companies)
                setRowData(response.data.mycompanies)
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);
    /***************************FILTERS************************************************************************************************************* */
    var dateFilterParams = {
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
    var genericFilterParams = {
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
    var companyFilterParams = {
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
/*     var numberValueFormatter = function (params) {
        return params.value.toFixed(2);
    };
    var mrrFilterParams = {
        allowedCharPattern: '\\d\\-\\,\\$',
        numberParser: function (text) {
            return text == null
                ? null
                : text.replace(',', '.');
        },
    };
     */
    /***************************FILTERS************************************************************************************************************* */
    const EditCompanyDetails = params => {
        const history = useHistory();
        const comapanyRoute = () => history.push({
            pathname: `/company/${params.data.New_Company_ID}`,
            state: params.data
        })
        return <span><button onClick={comapanyRoute} className="btn btn-Action">EDIT</button></span>;
    }
    const HideColumn = () => {
        gridColumnApi.setColumnVisible(['Account_Manager'], hideColumn)
        gridColumnApi.setColumnVisible(['Onboarding_Manager'], hideColumn)
        gridColumnApi.setColumnVisible(['Account_Status'], hideColumn)
        gridColumnApi.setColumnVisible(['Time_Zone'], hideColumn)
        gridColumnApi.setColumnVisible(['Live_Date'], hideColumn)
        gridColumnApi.setColumnVisible(['Handoff_date'], hideColumn)
        gridColumnApi.setColumnVisible(['Contract_Type'], hideColumn)
        gridColumnApi.setColumnVisible(['Previous_Platform'], hideColumn)
        gridColumnApi.setColumnVisible(['QuickBooks'], hideColumn)
        gridColumnApi.setColumnVisible(['PaymPayment_Partnerent'], hideColumn)
        setHideCloumn(!hideColumn)
    }
    return (
        <>
            <div
                id="myGrid"
                style={{
                    height: '500px',
                    width: '1700px',
                }}
                className="ag-theme-alpine"
            >
                <button class="button button1" onClick={HideColumn}>Hide</button>
                <AgGridReact
                    defaultColDef={{
                        flex: 1,
                        minWidth: 200,
                        resizable: true,
                        filter: true,
                    }}
                    frameworkComponents={{ editcompanydetails: EditCompanyDetails }}
                    onGridReady={onGridReady}
                    rowData={rowData}
                    rowSelection="Single"
                >
                    <AgGridColumn field="Customer_Name"
                        filterParams={companyFilterParams}
                    />
                    <AgGridColumn
                        field="New_Company_ID"
                        filter="agNumberColumnFilter"
                        filterParams={{
                            alwaysShowBothConditions: true,
                            defaultJoinOperator: 'OR',
                        }}
                    />
                    <AgGridColumn field="Support_Email_Address" />
                    <AgGridColumn
                        field="Account_Manager"
                        // filter="agTextColumnFilter"
                        //filterParams={userFilterParams}
                        filterParams={{
                            filterOptions: ['contains', 'startsWith', 'endsWith'],
                            defaultOption: 'startsWith',
                        }}
                    />
                    <AgGridColumn
                        field="Onboarding_Manager"
                        filterParams={{
                            filterOptions: ['contains', 'startsWith', 'endsWith'],
                            defaultOption: 'startsWith',
                        }}
                    />
                    <AgGridColumn field="Account_Status"
                        filter="agTextColumnFilter"
                        filterParams={genericFilterParams}
                    />
                    <AgGridColumn field="Time_Zone" />
                    <AgGridColumn
                        field="Live_Date"
                        filter="agDateColumnFilter"
                        filterParams={dateFilterParams} 
                    />
                    <AgGridColumn
                        field="Handoff_date"
                        filter="agDateColumnFilter"
                        filterParams={dateFilterParams}
                    />
                    <AgGridColumn
                        field="MRR"
                        headerName="MRR ($)"
                        filter="agNumberColumnFilter"
                    //filterParams={mrrFilterParams}
                    //valueFormatter={mrrValueFormatter}
                    //valueFormatter={numberValueFormatter}
                    />
                    <AgGridColumn field="Contract_Type" />
                    <AgGridColumn field="Previous_Platform" />
                    <AgGridColumn field="QuickBooks" />
                    <AgGridColumn field="Payment_Partner" />
                    <AgGridColumn field="Action" cellRenderer="editcompanydetails" />
                </AgGridReact>
            </div>
        </>
    );
}
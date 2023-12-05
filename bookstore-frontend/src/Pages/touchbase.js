


import React, { useState, useEffect } from 'react'
import { AgGridReact, AgGridColumn } from 'ag-grid-react'
import Axios from "axios";
import NavBar from './../Components/NavBar'
import SideNavBar from './../Components/SideNavBar'
import { useParams } from "react-router-dom";
import './../res/css/CompanyTable.css'

import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import 'ag-grid-community/dist/styles/ag-grid.css'


function TouchBase() {

    const apis = require("../Config/API.json");

    const [rowData, setRowData] = useState()
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [lastTouchBase, setCallDate] = useState();
    const [note, setNote] = useState("");
    const [actionItems, setActionItems] = useState("");
    let { id } = useParams();

    const onGridReady = (params) => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
    };


    let Access_token = sessionStorage.getItem("token");

    let config = {
        headers: {
            'Authorization': `Bearer ${Access_token}`
        },
        params: {
            userId: sessionStorage.getItem('user-id')
        }
    }






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

        Axios.get(apis.TOUCHBASE_DUE, config)
            .then((response) => {
                //console.log(response.data)
                setRowData(response.data)
                //console.log(rowData)
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);






    return (
        <>
            <NavBar />
            <SideNavBar />
            <div
                id="myGrid"
                style={{
                    height: '650px',
                    width: '1550px',
                    marginLeft: '12%',
                    marginTop: '5%'
                }}
                className="ag-theme-alpine"
            >
                <AgGridReact
                    defaultColDef={{
                        flex: 1,
                        minWidth: 200,
                        resizable: true,
                        filter: true,
                        sortable: true
                    }}
                    onGridReady={onGridReady}
                    rowData={rowData}
                    rowSelection="Single"
                >
                    <AgGridColumn field="company_name"
                        headerName="Company"
                    />
                    <AgGridColumn field="next_touchbase"
                        headerName="Next TouchBase"
                        filter="agDateColumnFilter"
                        filterParams={dateFilterParams}
                    />
                    <AgGridColumn field="created_by"
                        headerName="Created By"
                    />
                </AgGridReact>
            </div>
        </>
    );
}


export default TouchBase
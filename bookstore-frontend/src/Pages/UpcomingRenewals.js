import NavBar from './../Components/NavBar'
import SideNavBar from './../Components/SideNavBar'
import { AgGridReact, AgGridColumn } from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import 'ag-grid-community/dist/styles/ag-grid.css'
import './../res/css/CompanyTable.css'
import { useEffect, useState } from 'react'
import { useHistory, Redirect } from "react-router-dom"
import Axios from "axios"


function UpcomingRenewals() {
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

        let Access_token = sessionStorage.getItem("token")
        //console.log(Access_token)

        let config = {
            headers: {
                'Authorization' : `Bearer ${Access_token}`
            },
            params : {
                id: sessionStorage.getItem('user-id')
            }

        }

        if(! (sessionStorage.getItem('login-status'))) {
            console.log("here")
            return <Redirect to='/' />
            }

        Axios.get((apis.UPCOMINGRENEWALS_FETCH),config)
            .then((response) => {
                console.log (response.data.upcomingRenewals)
                setRowData(response.data.upcomingRenewals)
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
            //console.log(dateAsString)
            if (dateAsString == null) return -1;
            var dateParts = dateAsString.split('-');
            //console.log(dateParts)
            var cellDate = new Date(
                Number(dateParts[2]),
                Number(dateParts[1]) - 1,
                Number(dateParts[0])
            );
            console.log(cellDate)
            

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


    return (
        <div>
            <NavBar />
            <SideNavBar />
            <>
                <div
                    id="myGrid"
                    style={{
                        height: '775px',
                        width: '1690px',
                    }}
                    className="ag-theme-alpine"
                >
                    <AgGridReact
                        defaultColDef={{
                            flex: 1,
                            minWidth: 200,
                            resizable: true,
                            filter: true,
                        }}
                        onGridReady={onGridReady}
                        rowData={rowData}
                        rowSelection="Single"
                    >
                        <AgGridColumn field="name"
                        headerName="Company Name"
                        filterParams={companyFilterParams}
                    />
                    <AgGridColumn
                        field="renewal_month"
                        headerName="Renewal Date"
                        filter="agDateColumnFilter"
                        filterParams={dateFilterParams} 
                    />
                    </AgGridReact>
                </div>
            </>
        </div>
    )
}

export default UpcomingRenewals

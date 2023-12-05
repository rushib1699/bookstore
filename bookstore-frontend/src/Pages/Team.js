import React, { useState, useEffect } from 'react'
import NavBar from '../Components/NavBar'
import SideNavBar from '../Components/SideNavBar'
import './../res/css/MainContent.css'
import Axios from "axios";
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import 'ag-grid-community/dist/styles/ag-grid.css'
import { Redirect } from 'react-router-dom';

import { AgGridReact, AgGridColumn } from 'ag-grid-react'


function Team() {
    const apis = require("../Config/API.json");
    const [loading, setLoading] = useState(false);
    const [Team, setTeam] = useState([]);
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
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
                'Authorization': `Bearer ${Access_token}`
            },
            params: {
                id: sessionStorage.getItem('user-id')
            }

        }
        Axios.get(apis.TEAM_FETCH, config)

            .then((response) => {
                setTeam(response.data.team)
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);


    if (!(sessionStorage.getItem('login-status'))) {
        console.log("here")
        return <Redirect to='/' />
    }

    if (loading) {
        return <p>Data is loading...</p>;
    }
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
    return (
        <div>
            <NavBar />
            <SideNavBar />
            <div className='main-content'>
                <div className="dashboard-heading"> My Team </div>
                <div
                    id="myGrid"
                    style={{
                        height: '700px',
                        width: '1500px',
                        position: 'relative',
                        right: '2%'
                    }}
                    className="ag-theme-alpine"
                >
                    <AgGridReact
                        defaultColDef={{
                            flex: 1,
                            minWidth: 150,
                            resizable: true,
                            filter: true,
                        }}
                        onGridReady={onGridReady}
                        rowData={Team}
                        rowSelection="Single"
                    >
                        <AgGridColumn field="first_name"
                            headerName="First Name" />
                        <AgGridColumn field="last_name"
                            headerName="Last Name" />
                        <AgGridColumn field="contact"
                            headerName="Phone" />
                        <AgGridColumn field="email"
                            headerName="Email" />
                    </AgGridReact>
                </div>
            </div>
        </div>
    )
}

export default Team

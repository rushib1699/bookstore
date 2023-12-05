import React, { useState, useEffect } from 'react'
import NavBar from '../Components/NavBar'
import SideNavBar from '../Components/SideNavBar'
import Button from "@material-ui/core/Button";
import './../res/css/MainContent.css'
import './../res/css/Button.css'
import './../res/css/Renewals.css'
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import Axios from "axios";
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import 'ag-grid-community/dist/styles/ag-grid.css'
import { Redirect } from 'react-router-dom';

import { AgGridReact, AgGridColumn } from 'ag-grid-react'


function Renewals() {
    const apis = require("../Config/API.json");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [renewals, setRenewals] = useState([]);
    const [newRenewal, setNewRenewal] = useState([]);
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const onGridReady = (params) => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
    };
    useEffect(() => {
        setLoading(true);
        Axios.post(apis.RENEWALS_FETCH)
            .then((response) => {
                setRenewals(response.data.renewals);
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
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const btnActions = params => {
        const editRenewal = () =>
            window.open(params.data.Link, '_blank');
        const deleteRenewal = () =>
            Axios.put(apis.RENEWALS_DELETE, {
                id: params.data.id
            }).then((response) => {
                if (response.data.error) {
                    //notifyError();
                } else {
                    setLoading(true);
                    Axios.get(apis.RENEWALS_FETCH)
                        .then((response) => {
                            setRenewals(response.data.renewals);
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                        .finally(() => {
                            setLoading(false);
                        });
                }
            })
        return <span><button onClick={editRenewal} className="btn btn-Action">Edit</button><button onClick={deleteRenewal} className="btn btn-Action">Delete</button></span>;
    }
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
    const submitRenewal = () => {
        setOpen(false);
        // console.log(sessionStorage.getItem("user-id"))
        // if (linkName !== "") {
        //     Axios.post("http://localhost:3002/links", {
        //         user: sessionStorage.getItem("user-id"),
        //         link: linkLink,
        //         name: linkName,
        //     }).then((response) => {
        //         if (response.data.error) {
        //             //notifyError();
        //         } else {
        //             setLoading(true);
        //             Axios.post("http://localhost:3002/links/fetch")
        //                 .then((response) => {
        //                     console.log(response.data.links)
        //                     setLinks(response.data.links)
        //                     console.log(links)
        //                 })
        //                 .catch((err) => {
        //                     console.log(err);
        //                 })
        //                 .finally(() => {
        //                     setLoading(false);
        //                 });
        //             //notifySuccess();
        //         }
        //     });
        // }
    };
    return (
        <div>
            <NavBar />
            <SideNavBar />
            <div className='main-content'>
                <div className="dashboard-heading">Renewal Dashboard</div>
                <div className="renewals-add-btn">
                    <Button
                        class='Add-button button'
                        onClick={handleClickOpen}
                    >
                        ADD
                    </Button>
                </div>


                <Dialog aria-labelledby="customized-dialog-title" open={open}>
                    <MuiDialogTitle
                        id="customized-dialog-title"
                        onClose={handleClose}
                    >
                        Add Link
                    </MuiDialogTitle>
                    <MuiDialogContent dividers>
                        <input className="link-input"
                            type="text"
                            placeholder="Enter Title"
                            onChange={(event) => {
                                setNewRenewal(event.target.value);
                            }}
                        />
                        <hr />
                        <input className="link-input"
                            type="text"
                            placeholder="Paste Full Link"
                        // onChange={(event) => {
                        //     setLinkLink(event.target.value);
                        // }}
                        />
                    </MuiDialogContent>
                    <MuiDialogActions>
                        <Button autoFocus onClick={handleClose}>
                            Discard
                        </Button>
                        <Button autoFocus color="green" onClick={submitRenewal} >
                            Save Renewal
                        </Button>
                    </MuiDialogActions>
                </Dialog>
                <div
                    id="myGrid"
                    style={{
                        height: '700px',
                        width: '1500px',
                        position: 'relative',
                        bottom: '3%',
                        right: '1%'
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
                        frameworkComponents={{ btnActions: btnActions }}
                        onGridReady={onGridReady}
                        rowData={renewals}
                        rowSelection="Single"
                    >
                        <AgGridColumn field="company_name"
                            headerName="Customer Name" />
                        <AgGridColumn field="renewal_month"
                            headerName="Renewal Month" />
                        <AgGridColumn field="amount_collection"
                            headerName="Amount Collection" />
                        <AgGridColumn field="new_amount"
                            headerName="New Amount" />
                        <AgGridColumn field="increase_percentage"
                            headerName="Increase %" />
                        <AgGridColumn field="Action" cellRenderer="btnActions" />

                    </AgGridReact>
                </div>
            </div>
        </div>
    )
}

export default Renewals

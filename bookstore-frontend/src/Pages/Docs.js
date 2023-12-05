import React, { useEffect, useState } from 'react'
import NavBar from '../Components/NavBar';
import SideNavBar from '../Components/SideNavBar';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Axios from 'axios'
import {Redirect} from 'react-router-dom'; 
import './../res/css/CompanyTable.css'
import './../res/css/Docs.css'
import './../res/css/Button.css'
import { AgGridReact, AgGridColumn } from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import 'ag-grid-community/dist/styles/ag-grid.css'


function Docs() {
    let Access_token = sessionStorage.getItem("token");
    let config_get = {
        headers: {
            'Authorization' : `Bearer ${Access_token}`
        }
    }
    const apis = require("../Config/API.json");
    const [open, setOpen] = useState(false);
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [loading, setLoading] = useState(false);
    const [docs, setDocs] = useState([]);
    const [docName, setDocName] = useState();
    const [docLink, setDocLink] = useState();
    const [docType, setDocType] = useState();


    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const onGridReady = (params) => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
    };
    const goToLinK = params => {
        const openLink = () =>
            window.open(params.data.link, '_blank');
        const deleteLink = () =>{

            console.log(params.data.id)
            Axios.put(apis.DOCS_DELETE, {id: params.data.id}, 
            {headers: {
                'Authorization' : `Bearer ${Access_token}`
            }
        } ).then ((response) => {
                if (response.data.error) {
                    //notifyError();
                } else {
                    setLoading(true);
                    
                    Axios.get(apis.DOCS_FETCH, config_get)
                        .then((response) => {
                            setDocs(response.data.docs)
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                        .finally(() => {
                            setLoading(false);
                        });
                }
            })
        }
        return <span><button onClick={openLink} className="btn btn-Action">Open Link</button><button onClick={deleteLink} className="btn btn-Action">Delete</button></span>;
    }

    /*********************TABLE FILTERS*****************************************************/


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



    var dateValueaFormatter = (params) => {
        //console.log(params.value)
        var dateAsString = params.value
        var dateParts = dateAsString.split('-');
        return `${dateParts[2]} - ${dateParts[1]} - ${dateParts[0]}`;

    }
    /*********************TABLE FILTERS*****************************************************/



    useEffect(() => {
        Axios.get(apis.DOCS_FETCH, config_get).then((response) => {
            setDocs(response.data.docs);
            console.log(response)
        });
    }, []);

    if (!(sessionStorage.getItem('login-status'))) {
        console.log("here")
        return <Redirect to='/' />
    }

    const submitDocs = () => {
        setOpen(false);
        if (docLink !== "") {
            Axios.post(apis.DOCS_ADD, {
                user: sessionStorage.getItem("user-id"),
                link: docLink,
                name: docName,
                doc_type: docType,
            }, {headers: {
                'Authorization' : `Bearer ${Access_token}`
            }
            }).then((response) => {
                if (response.data.error) {
                    //notifyError();
                } else {
                    setLoading(true);
                    Axios.get(apis.DOCS_FETCH, config_get)
                        .then((response) => {
                            setDocs(response.data.docs)
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                        .finally(() => {
                            setLoading(false);
                        });
                }
            });
        }

    };
    return (
        <>
            <SideNavBar />
            <NavBar />
            <div className="Conatiner-bg main-content">
                <div className="Add-Button">
                    <button className="button Add-button" onClick={handleClickOpen}>Add New Document</button>
                </div>
                <div className="DialogBox">
                    <Dialog aria-labelledby="customized-dialog-title" open={open}>
                        <MuiDialogTitle id="customized-dialog-title" onClose={handleClose}>
                            Add New Document
                        </MuiDialogTitle>
                        <MuiDialogContent dividers>
                            <input className="link-input"
                                type="text"
                                placeholder="Enter Document Name"
                                onChange={(event) => {
                                    setDocName(event.target.value);
                                }}
                            />
                            <hr />
                            <input className="link-input"
                                type="text"
                                placeholder="Enter Document Link"
                                onChange={(event) => {
                                    setDocLink(event.target.value);
                                }}
                            />
                            <div className="DropDown">
                                <div className="label">Doc Type:</div>
                                <select
                                    name="doc_type"
                                    id="doc_type"
                                    placeholder="Type"
                                    onChange={(event) => {
                                        setDocType(event.target.value);
                                    }}
                                >
                                    <option></option>
                                    <option value="1">PDF</option>
                                    <option value="2">Xsls</option>
                                    <option value="3">Ppt</option>
                                    <option value="5">Doc</option>
                                </select>
                            </div>
                        </MuiDialogContent>
                        <MuiDialogActions>
                            <Button autoFocus
                                onClick={handleClose}>
                                Discard
                            </Button>
                            <Button autoFocus
                                onClick={submitDocs} color="green">
                                Save
                            </Button>
                        </MuiDialogActions>
                    </Dialog>
                    <div
                        id="myGrid"
                        style={{
                            height: '700px',
                            width: '1500px',
                            position: 'relative',
                            right: '38%',
                            top: '10%'
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
                            frameworkComponents={{ goToLinK: goToLinK }}
                            onGridReady={onGridReady}
                            rowData={docs}
                            rowSelection="Single"
                        >
                            <AgGridColumn field="link" />
                            <AgGridColumn field="name"
                                headerName="Link Title"
                            />
                            <AgGridColumn field="first_name"
                                headerName="Created By" />
                            <AgGridColumn field="CreatedAt"
                                filter="agDateColumnFilter"
                                filterParams={dateFilterParams} />
                            <AgGridColumn field="Action" cellRenderer="goToLinK" />

                        </AgGridReact>
                    </div>
                </div>
            </div>
        </>
    )
}


export default Docs
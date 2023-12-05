


import React, {useState, useEffect} from 'react'
import { AgGridReact, AgGridColumn } from 'ag-grid-react'
import Axios from "axios";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { TextareaAutosize } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { ToastContainer, toast } from "react-toastify";
import {useParams } from "react-router-dom";

import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import 'ag-grid-community/dist/styles/ag-grid.css'

import { useHistory } from "react-router-dom"



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
            'Authorization' : `Bearer ${Access_token}`
        },
        params: {
            company_id: id
        }
    }







    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
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

        Axios.get(apis.TOUCHBASE_FETCH, config)
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


    const submitTouchBase = () => {
        setOpen(false);

        var next_touchbase = new Date(lastTouchBase);
        next_touchbase.setDate(next_touchbase.getDate() + 25)
        next_touchbase = next_touchbase.toISOString().slice(0, 19).replace('T', ' ')


        if (note != "") {
            Axios.post(apis.TOUCHBASE_ADD, {
                company_id: id,
                user: sessionStorage.getItem("user-id"),
                note: note,
                lastTouchBase: lastTouchBase,
                nextTouchBase: next_touchbase,
                actionItems: actionItems

            }, {
                headers: {
                    'Authorization' : `Bearer ${Access_token}`
                }
            }).then((response) => {
                if (response.data.error) {
                    //notifyError();
                } else {
                    setLoading(true);
                    Axios.get(apis.TOUCHBASE_FETCH, config).then((response) => {
                        //console.log(response.data)
                        setRowData(response.data)
        })
        .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            setLoading(false);
          });
                    //notifySuccess();
                }
            });
        }
    }

    



    return (
        <>
            <div
                id="myGrid"
                style={{
                    height: '500px',
                    width: '950px',
                    marginLeft : '1px'
                }}
                className="ag-theme-alpine"
            >
                <button class="button button1" onClick={handleClickOpen} >Add</button>

                <Dialog aria-labelledby="customized-dialog-title" open={open}>
                <MuiDialogTitle
                    id="customized-dialog-title"
                    onClose={handleClose}
                >
                    Add Note Text
                </MuiDialogTitle>
                <ToastContainer />
                <MuiDialogContent dividers>
                    <div className="Date">
                        <div className="label">Last TouchBase Date: </div>
                        <input
                        type="date"
                        id="date"
                        onChange={(event) => {
                            setCallDate(event.target.value);
                        }}
                        />
                    </div>
                    <div className="label">Note: </div>
                    <TextareaAutosize
                        className="note-input"
                        aria-label="maximum height"
                        rowsMin={10}
                        onChange={(event) => {
                            setNote(event.target.value);
                        }}
                    />
                     <div className="label">Action Items: </div>
                    <TextareaAutosize
                        className="actionItems-input"
                        aria-label="maximum height"
                        rowsMin={10}
                        onChange={(event) => {
                            setActionItems(event.target.value);
                        }}
                    />
                </MuiDialogContent>
                <MuiDialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Discard
                    </Button>
                    <Button autoFocus onClick={submitTouchBase} color="green">
                        Save
                    </Button>
                </MuiDialogActions>
            </Dialog>

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
                    <AgGridColumn field="last_touchbase"
                        headerName="Last TouchBase"
                        filter="agDateColumnFilter"
                        filterParams= {dateFilterParams}
                    />
                    <AgGridColumn field="next_touchbase"
                        headerName="Next TouchBase"
                        filter="agDateColumnFilter"
                        filterParams= {dateFilterParams}
                    />
                    <AgGridColumn field="notes"
                        headerName="Notes"
                    />
                    <AgGridColumn field="action_items"
                        headerName="Action Items"
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
import React, { useState, useEffect} from "react";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import Axios from "axios";
import {useParams } from "react-router-dom";

import { TextareaAutosize } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { ToastContainer, toast } from "react-toastify";
import './../res/css/NotesTable.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import 'ag-grid-community/dist/styles/ag-grid.css'

import { AgGridReact, AgGridColumn } from 'ag-grid-react'


function NotesTable() {
    const apis = require("../Config/API.json");
    const [open, setOpen] = useState(false);
    const [editopen, setEditOpen] = useState(false);
    const [noteText, setNoteText] = useState();
    const [showNoteText, setShowNoteText] = useState();
    const [showNoteId, setShowNoteId] = useState();
    const [loading, setLoading] = useState(false);
    const [notes, setNotes] = useState([]);
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
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

    
    var dateFilterParams = {
        comparator: function (filterLocalDateAtMidnight, cellValue) {
            var dateAsString = cellValue;
            if (dateAsString == null) return -1;
            var dateParts = dateAsString.split('-');
            //console.log(dateParts)
            var cellDate = new Date(
                Number(dateParts[0]),
                Number(dateParts[1]) - 1,
                Number(dateParts[2])
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




    
    useEffect(() => {
        setLoading(true);
    
        Axios.get(apis.NOTES_FETCH, config).then((response) => {
            console.log(response.data.notes)
            setNotes(response.data.notes)
            console.log(notes)
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

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleEditClose = () => {
        setEditOpen(false);
    };
    const editNote = (n_id, n_text) => {
        setEditOpen(true)
        setShowNoteId(n_id)
        setShowNoteText(n_text)
        console.log(showNoteId)
        console.log(showNoteText)
    }
    const updateNote = () => {
        setEditOpen(false)

        Axios.put(apis.NOTES_UPDATE, {
            id: showNoteId,
            note: showNoteText,
            user : sessionStorage.getItem("user-id"),
        }, {
            headers: {
                'Authorization' : `Bearer ${Access_token}`
            }
        }).then((response) => {
            setLoading(true);
            Axios.get(apis.NOTES_FETCH, config).then((response) => {
                console.log(response.data.notes)
                setNotes(response.data.notes)
                console.log(notes)
            })
            .catch((err) => {
                console.log(err);
              })
              .finally(() => {
                setLoading(false);
              });
        })
    }


    function cleanTheDate(dateStr) {
        return new Date(dateStr).toISOString().
            replace(/T/, ' ').
            replace(/\..+/, '')
    }

    const submitNote = () => {
        setOpen(false);
        if (noteText !== "") {
            console.log(noteText);
            console.log(id);
            console.log(sessionStorage.getItem("user-id"));

            Axios.post(apis.NOTES_UPDATE, {
                company_id: id,
                user: sessionStorage.getItem("user-id"),
                note_text: noteText,
            }, {
                headers: {
                    'Authorization' : `Bearer ${Access_token}`
                }
            }).then((response) => {
                if (response.data.error) {
                    //notifyError();
                } else {
                    setLoading(true);
        Axios.get(apis.NOTES_FETCH, config).then((response) => {
            console.log(response.data.notes)
            setNotes(response.data.notes)
            console.log(notes)
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
    };
    const deleteNote = () => {
        setEditOpen(false)
        console.log(showNoteId)

        console.log("in delete")
        Axios.post(apis.NOTES_DELETE, {
            id: showNoteId, 
            user : sessionStorage.getItem("user-id")
        }, {
            headers: {
                'Authorization' : `Bearer ${Access_token}`
            }
        }).then((response) => {
            setLoading(true);
            Axios.get(apis.NOTES_FETCH, config).then((response) => {
                console.log(response.data.notes)
                setNotes(response.data.notes)
                console.log(notes)
            })
            .catch((err) => {
                console.log(err);
              })
              .finally(() => {
                setLoading(false);
              });
        })
    }
    return (
        <div>
            <div className="add-notes-btn">
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleClickOpen}
                >
                    ADD Notes
                </Button>
            </div>
            <Dialog aria-labelledby="customized-dialog-title" open={open}>
                <MuiDialogTitle
                    id="customized-dialog-title"
                    onClose={handleClose}
                >
                    Add Note Text
                </MuiDialogTitle>
                <ToastContainer />
                <MuiDialogContent dividers>
                    <TextareaAutosize
                        className="note-input"
                        aria-label="maximum height"
                        rowsMin={10}
                        onChange={(event) => {
                            setNoteText(event.target.value);
                        }}
                    />
                </MuiDialogContent>
                <MuiDialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Discard
                    </Button>
                    <Button autoFocus onClick={submitNote} color="green">
                        Save Note
                    </Button>
                </MuiDialogActions>
            </Dialog>

            {/* Edit note */}
            <Dialog aria-labelledby="customized-dialog-title" open={editopen}>
                <MuiDialogTitle
                    id="customized-dialog-title"
                    onClose={handleEditClose}
                >
                    Edit Note Text
                </MuiDialogTitle>
                <ToastContainer />
                <MuiDialogContent dividers>
                    <TextareaAutosize
                        className="note-input"
                        aria-label="maximum height"
                        rowsMin={10}
                        value = {showNoteText}
                        onChange={(event) => {
                            setShowNoteText(event.target.value);
                        }}
                    />
                </MuiDialogContent>
                <MuiDialogActions>
                <Button className="delete-btn" autoFocus onClick={() => deleteNote()} color="red">
                        Delete
                    </Button>
                    <Button autoFocus onClick={handleEditClose}>
                        Discard
                    </Button>
                    <Button autoFocus onClick={updateNote} color="green">
                        Save Note
                    </Button>
                </MuiDialogActions>
            </Dialog>
            <div className='notes-table'
            // id="myGrid"
            // style={{
            //     height: '500px',
            //     width: '1000px',
            // }}
           // className="ag-theme-alpine"
        >
            {/* <AgGridReact
                defaultColDef={{
                    flex: 1,
                    minWidth: 200,
                    resizable: true,
                    filter: true,
                }}
                onGridReady={onGridReady}
                rowData={notes}
                rowSelection="Single"
            >
                <AgGridColumn field="Note" />
                <AgGridColumn field="CreatedBy" />
                <AgGridColumn field="CreatedAt" 
                filter="agDateColumnFilter"
                filterParams={dateFilterParams} />
            </AgGridReact> */}
                <thead>
                    <tr>
                        <th>Note</th>   
                        <th>CreatedBy</th>
                        <th>CreatedAt</th>
                    </tr>
                </thead>
                <tbody>
                    {notes.map((note) => (
                        // ToDo : handle on click company here
                        <tr key={note.ID} >
                            <td onClick={() => editNote(note.ID, note.Note)}>{note.Note }</td>
                            <td>{note.CreatedBy}</td>
                            <td>{cleanTheDate(note.CreatedAt)}</td>
                        </tr>
                    ))}
                </tbody>
            </div>
        </div>
    )
}

export default NotesTable

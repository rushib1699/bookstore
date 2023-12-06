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
   
  const [rentData, setRentData] = useState([]);
   
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
    useEffect(() => {
        Axios.get('https://api.patelauto.co/rentHistory', {
          params: {
            user_id: sessionStorage.getItem('user-id'),
        }
        }).then((response) => {
          setRentData(response.data);
        });
      }, []);
    
    // if (loading) {
    //     return <p>Data is loading...</p>;
    // }
    // const handleClickOpen = () => {
    //     setOpen(true);
    // };
    // const handleClose = () => {
    //     setOpen(false);
    // };
    // const btnActions = params => {
    //     const editRenewal = () =>
    //         window.open(params.data.Link, '_blank');
    //     const deleteRenewal = () =>
    //         Axios.put(apis.RENEWALS_DELETE, {
    //             id: params.data.id
    //         }).then((response) => {
    //             if (response.data.error) {
    //                 //notifyError();
    //             } else {
    //                 setLoading(true);
    //                 Axios.get(apis.RENEWALS_FETCH)
    //                     .then((response) => {
    //                         setRenewals(response.data.renewals);
    //                     })
    //                     .catch((err) => {
    //                         console.log(err);
    //                     })
    //                     .finally(() => {
    //                         setLoading(false);
    //                     });
    //             }
    //         })
    //     return <span><button onClick={editRenewal} className="btn btn-Action">Edit</button><button onClick={deleteRenewal} className="btn btn-Action">Delete</button></span>;
    // }
    // var dateFilterParams = {
    //     comparator: function (filterLocalDateAtMidnight, cellValue) {
    //         var dateAsString = cellValue;
    //         if (dateAsString == null) return -1;
    //         var dateParts = dateAsString.split('-');
    //         //console.log(dateParts)
    //         var cellDate = new Date(
    //             Number(dateParts[2]),
    //             Number(dateParts[1]) - 1,
    //             Number(dateParts[0])
    //         );
    //         //console.log(cellDate)
    //         if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
    //             return 0;
    //         }
    //         if (cellDate < filterLocalDateAtMidnight) {
    //             return -1;
    //         }
    //         if (cellDate > filterLocalDateAtMidnight) {
    //             return 1;
    //         }
    //     },
    //     browserDatePicker: true,
    //     minValidYear: 2000,
    // };
    // function contains(target, lookingFor) {
    //     return target && target.indexOf(lookingFor) >= 0;
    // }
    // var genericFilterParams = {
    //     filterOptions: ['contains'],
    //     textCustomComparator: function (_, value, filterText) {
    //         var filterTextLowerCase = filterText.toLowerCase();
    //         var valueLowerCase = value.toString().toLowerCase();
    //         var literalMatch = contains(valueLowerCase, filterTextLowerCase);
    //         return (
    //             literalMatch
    //         );
    //     },
    //     trimInput: true,
    //     debounceMs: 1000,
    // };
    // const submitRenewal = () => {
    //     setOpen(false);
    //     // console.log(sessionStorage.getItem("user-id"))
    //     // if (linkName !== "") {
    //     //     Axios.post("http://localhost:3002/links", {
    //     //         user: sessionStorage.getItem("user-id"),
    //     //         link: linkLink,
    //     //         name: linkName,
    //     //     }).then((response) => {
    //     //         if (response.data.error) {
    //     //             //notifyError();
    //     //         } else {
    //     //             setLoading(true);
    //     //             Axios.post("http://localhost:3002/links/fetch")
    //     //                 .then((response) => {
    //     //                     console.log(response.data.links)
    //     //                     setLinks(response.data.links)
    //     //                     console.log(links)
    //     //                 })
    //     //                 .catch((err) => {
    //     //                     console.log(err);
    //     //                 })
    //     //                 .finally(() => {
    //     //                     setLoading(false);
    //     //                 });
    //     //             //notifySuccess();
    //     //         }
    //     //     });
    //     // }
    // };
    return (
        <div>        
        <SideNavBar />
        <h1>Rent History</h1>
      <div className="purchase-history-container">
      
      <div>
        {rentData.map((rent, index) => (
          <div key={index} className="purchase-item">
            <img src={rent.tumbnail_url} alt={rent.Title} />
            <div className="purchase-details">
              <h2>{rent.Title}</h2>
              <p>Author: {rent.AuthorName}</p>
              <p>Genre: {rent.GenreName}</p>
              <p>Price: ${rent.Price}</p>
              {rent.isPaid === 1 && <span className="paid-label">Paid</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
    )
}

export default Renewals

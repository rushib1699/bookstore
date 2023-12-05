import React, { useEffect, useState } from "react";
import NavBar from "../Components/NavBar";
import SideNavBar from "../Components/SideNavBar";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import { TextareaAutosize } from "@material-ui/core";
import "./../res/css/Activity.css";
import "./../res/css/Button.css";
import "./../res/css/DashboardHeading.css";
import Axios from "axios";
import "./../res/css/CompanyTable.css";
import { AgGridReact, AgGridColumn } from "ag-grid-react";
import { ExportCSV } from "../../src/Components/ExportCSV";
import { Redirect, Link } from 'react-router-dom';
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-community/dist/styles/ag-grid.css";
import TextField from "@material-ui/core/TextField";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";

function Activity() {
  const apis = require("../Config/API.json");
  const [open, setOpen] = useState(false);
  const [callOrigin, setCallOrigin] = useState("");
  const [callerName, setCallerName] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const [callType, setCallType] = useState("");
  const [callDuration, setCallDuration] = useState("");
  const [callSentiment, setCallSentiment] = useState("");
  const [callAccount, setCallAccount] = useState("");
  const [callDate, setCallDate] = useState("");
  const [callAnswerBy, setcallAnswerBy] = useState("");
  const [callLogs, setcallLogs] = useState("");
  const [companyList, setCompanyList] = useState("");
  const [purchaseData, setPurchaseData] = useState([]);


  // const filterOptions = createFilterOptions({
  //   matchFrom: "start",
  //   stringify: (option) => option.name,
  // });

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };
  // const handleClose = () => {
  //   setOpen(false);
  // };

  // let Access_token = sessionStorage.getItem("token");
  // let config_get = {
  //   headers: {
  //     Authorization: `Bearer ${Access_token}`,
  //   },
  // };

  // const [gridApi, setGridApi] = useState(null);
  // const [gridColumnApi, setGridColumnApi] = useState(null);

  // const onGridReady = (params) => {
  //   setGridApi(params.api);
  //   setGridColumnApi(params.columnApi);
  // };

  // /*********************TABLE FILTERS*****************************************************/

  // var dateFilterParams = {
  //   comparator: function (filterLocalDateAtMidnight, cellValue) {
  //     var dateAsString = cellValue;
  //     if (dateAsString == null) return -1;
  //     var dateParts = dateAsString.split("-");
  //     //console.log(dateParts)
  //     var cellDate = new Date(
  //       Number(dateParts[2]),
  //       Number(dateParts[1]) - 1,
  //       Number(dateParts[0])
  //     );
  //     //console.log(cellDate)
  //     if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
  //       return 0;
  //     }
  //     if (cellDate < filterLocalDateAtMidnight) {
  //       return -1;
  //     }
  //     if (cellDate > filterLocalDateAtMidnight) {
  //       return 1;
  //     }
  //   },
  //   browserDatePicker: true,
  //   minValidYear: 2000,
  // };

  // /*********************TABLE FILTERS*****************************************************/

  useEffect(() => {
    Axios.get('http://localhost:3008/purchaseHistory', {
      user_id: sessionStorage.getItem('user-id'),
    }).then((response) => {
      setPurchaseData(response.data);
    });
  }, []);

  // useEffect(() => {
  //   Axios.get(apis.FETCH_COMPANYNAME_ID, config_get).then((response) => {
  //     console.log(response.data)
  //     setCompanyList(response.data);
  //   });
  // }, []);

  // if (!(sessionStorage.getItem('login-status'))) {
  //   console.log("here")
  //   return <Redirect to='/' />
  // }
  // const submitCallLog = () => {
  //   setOpen(false);
  //   //console.log(callAccount)

  //   Axios.post(
  //     apis.ACTIVITY_ADD,
  //     {
  //       callOrigin: callOrigin,
  //       callerName: callerName,
  //       descriptionText: descriptionText,
  //       callType: callType,
  //       callDuration: callDuration,
  //       callSentiment: callSentiment,
  //       callDate: callDate,
  //       callAccount: callAccount,
  //       callAnswerBy: sessionStorage.getItem("user-id"),
  //       userId: sessionStorage.getItem("user-id"),
  //     },
  //     {
  //       headers: {
  //         Authorization: `Bearer ${Access_token}`,
  //       },
  //     }
  //   )
  //     .then((response) => {
  //       if (response.data.error) {
  //       } else {
  //         Axios.get(apis.ACTIVITY_FETCH, config_get).then((response) => {
  //           setcallLogs(response.data);
  //         });
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };
  return (
    <div>        
      <SideNavBar />
      <h1>Purchase History</h1>
    <div className="purchase-history-container">
    
    <div>
      {purchaseData.map((purchase, index) => (
        <div key={index} className="purchase-item">
          <img src={purchase.tumbnail_url} alt={purchase.Title} />
          <div className="purchase-details">
            <h2>{purchase.Title}</h2>
            <p>Author: {purchase.AuthorName}</p>
            <p>Genre: {purchase.GenreName}</p>
            <p>Price: ${purchase.Price}</p>
            {purchase.isPaid === 1 && <span className="paid-label">Paid</span>}
          </div>
        </div>
      ))}
    </div>
  </div>
  </div>
  );
}

export default Activity;
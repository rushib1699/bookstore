import React, { useState, useEffect } from 'react'
import NavBar from '../Components/NavBar'
import SideNavBar from '../Components/SideNavBar'
import Button from "@material-ui/core/Button";
import './../res/css/MarketingServices.css'
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import Axios from "axios";
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import 'ag-grid-community/dist/styles/ag-grid.css'
import { Redirect } from 'react-router-dom';
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { TextareaAutosize } from "@material-ui/core";

import { AgGridReact, AgGridColumn } from 'ag-grid-react'


function MarkettingServices() {
  const apis = require("../Config/API.json");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [marketingServices, setMarketingServices] = useState([]);
  const [companyList, setCompanyList] = useState("");
  const [service, setService] = useState("");
  const [hideColumn, setHideCloumn] = useState(false);
  const [companyId, setCompanyID] = useState(),
    [stageId, setStageId] = useState(),
    [demoDate, setDemoDate] = useState(),
    [emailCampaign, setEmailCampaign] = useState(0),
    [website, setWebsite] = useState(0),
    [seo, setSeo] = useState(0),
    [webBooking, setWebBooking] = useState(0),
    [liveChat, setLiveChat] = useState(0),
    [socialMedia, setSocialMedia] = useState(0),
    [proposalAmount, setProposalAmount] = useState(),
    [closureAmount, setClosureAmount] = useState(),
    [expectedClosureDate, setExpectedClosureDate] = useState(),
    [proposalLink, setProposalLink] = useState(),
    [comments, setComments] = useState(),
    [region, setRegion] = useState(),
    [state, setState] = useState(),
    [closurePercentage, setClosurePercentage] = useState();

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };
  const btnActions = params => {
    const deleteLink = () =>
      Axios.put(apis.MARKETINGSERVICES_DELETE, {
        id: params.data.id
      }, {
        headers: {
          'Authorization': `Bearer ${Access_token}`
        }
      }).then((response) => {
        if (response.data.error) {
          //notifyError();
        } else {
          setLoading(true);
          Axios.get(apis.MARKETINGSERVICES_FETCH, config)
            .then((response) => {
              setMarketingServices(response.data.marketingservices)
            })
            .catch((err) => {
              console.log(err);
            })
            .finally(() => {
              setLoading(false);
            });
        }
      })
    const showDetails = () =>
      handleDetailsClickOpen();
    setService(params.data);
    console.log(service);
    return <span>
      <button onClick={showDetails} className="btn btn-Action">Show Details</button>
    </span>;
  }
  const filterOptions = createFilterOptions({
    matchFrom: "start",
    stringify: (option) => option.name,
  });

  const HideColumn = () => {
    gridColumnApi.setColumnVisible(['demo_date'], hideColumn)
    gridColumnApi.setColumnVisible(['email_campaign'], hideColumn)
    gridColumnApi.setColumnVisible(['website'], hideColumn)
    gridColumnApi.setColumnVisible(['seo'], hideColumn)
    gridColumnApi.setColumnVisible(['web_booking'], hideColumn)
    gridColumnApi.setColumnVisible(['livechat'], hideColumn)
    gridColumnApi.setColumnVisible(['social_media'], hideColumn)
    gridColumnApi.setColumnVisible(['rep'], hideColumn)
    gridColumnApi.setColumnVisible(['proposal_amount'], hideColumn)
    gridColumnApi.setColumnVisible(['closure_amount'], hideColumn)
    gridColumnApi.setColumnVisible(['expected_closure_date'], hideColumn)
    gridColumnApi.setColumnVisible(['closure_percentage'], hideColumn)
    gridColumnApi.setColumnVisible(['proposal_link'], hideColumn)
    gridColumnApi.setColumnVisible(['comments'], hideColumn)
    gridColumnApi.setColumnVisible(['created_by'], hideColumn)
    gridColumnApi.setColumnVisible(['region'], hideColumn)
    gridColumnApi.setColumnVisible(['state'], hideColumn)
    gridColumnApi.setColumnVisible(['created_at'], hideColumn)
    gridColumnApi.setColumnVisible(['updated_at'], hideColumn)
    gridColumnApi.setColumnVisible(['updated_by'], hideColumn)

    setHideCloumn(!hideColumn)

  }

  let Access_token = sessionStorage.getItem("token");
  let config_get = {
    headers: {
      Authorization: `Bearer ${Access_token}`,
    },
  };

  useEffect(() => {
    setLoading(true);
    Axios.get(apis.MARKETINGSERVICES_FETCH, config_get)
      .then((response) => {
        setMarketingServices(response.data.marketingservices)
        console.log(response.data.marketingservices)
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    Axios.get(apis.FETCH_COMPANYNAME_ID, config_get).then((response) => {
      console.log(response.data)
      setCompanyList(response.data);
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
  const handleDetailsClickOpen = () => {
    setDetailsOpen(true);
  };
  const handleDetailsClose = () => {
    setDetailsOpen(false);
  };


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



  const submitService = () => {
    if (companyId && demoDate && proposalLink && stageId
      && proposalAmount) {
      setOpen(false);
      console.log(companyId, demoDate, webBooking, seo, expectedClosureDate, comments, closureAmount, state)
      Axios.post(
        apis.MARKETINGSERVICES_ADD,
        {
          companyId: companyId,
          stageId: stageId,
          demoDate: demoDate,
          emailCampaign: emailCampaign,
          website: website,
          seo: seo,
          webBooking: webBooking,
          liveChat: liveChat,
          socialMedia: socialMedia,
          proposalAmount: proposalAmount,
          closureAmount: closureAmount,
          expectedClosureDate: expectedClosureDate,
          proposalLink: proposalLink,
          comments: comments,
          region: region,
          state: state,
          closurePercentage: closurePercentage,
          userId: parseInt(sessionStorage.getItem("user-id"))

        },
        {
          headers: {
            Authorization: `Bearer ${Access_token}`,
          },
        }
      )
        .then((response) => {
          if (response.data.error) {
          } else {
            Axios.get(apis.MARKETINGSERVICES_FETCH, config_get).then((response) => {
              setMarketingServices(response.data.marketingservices);
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }


  };
  return (
    <div>
      <NavBar />
      <SideNavBar />
      <div className='main-content'>
        <div className="dashboard-heading"> Marketing Services Dashboard</div>
        
        <div className="ms-add-btn">
          <Button
            class='button Add-button'
            onClick={handleClickOpen}
          >
            ADD
          </Button>
        </div>

        <Dialog aria-labelledby="customized-dialog-title" open={detailsOpen}>
          <MuiDialogTitle
            id="customized-dialog-title"
            onClose={handleClose}
          >
            {service.name}
          </MuiDialogTitle>
          <MuiDialogContent dividers>
            <div className="item-services">
              <div className="label2"> MRR($) :   </div>
              <div className="service-data"> {service.mrr}</div>
            </div>
            <br></br>
            <div className="item-services">
              <div className="label2"> AM Rep :   </div>
              <div className="service-data"> {service.rep}</div>
            </div>
            <br></br>
            <div className="item-services">
              <div className="label2"> Stage :   </div>
              <div className="service-data"> {service.marketing_proposal_stage}</div>
            </div>
            <br></br>
            <div className="item-services">
              <div className="label2"> Demo Date :   </div>
              <div className="service-data"> {service.demo_date}</div>
            </div>
            <br></br>
            <div className="item-services">
              <div className="label2"> Email Campaign :   </div>
              <div className="service-data"> {service.email_campaign}</div>
            </div>
            <div className="item-services">
              <div className="label2"> Website :   </div>
              <div className="service-data"> {service.website}</div>
            </div>
            <div className="item-services">
              <div className="label2"> SEO :   </div>
              <div className="service-data"> {service.seo}</div>
            </div>
            <div className="item-services">
              <div className="label2"> Web Booking :   </div>
              <div className="service-data"> {service.web_booking}</div>
            </div>
            <div className="item-services">
              <div className="label2"> Live Chat :   </div>
              <div className="service-data"> {service.livechat}</div>
            </div>
            <div className="item-services">
              <div className="label2"> Social Media :   </div>
              <div className="service-data"> {service.social_media}</div>
            </div>
            <br></br>
            <div className="item-services">
              <div className="label2"> Proposal Amount ($):   </div>
              <div className="service-data"> {service.proposal_amount}</div>
            </div>
            <br></br>
            <div className="item-services">
              <div className="label2"> Closure Amount ($) :   </div>
              <div className="service-data"> {service.closure_amount}</div>
            </div>
            <br></br>
            <div className="item-services">
              <div className="label2"> Expected Closure Date :   </div>
              <div className="service-data"> {service.expected_closure_date}</div>
            </div>
            <br></br>
            <div className="item-services">
              <div className="label2"> Closure Percentage (%) :   </div>
              <div className="service-data"> {service.closure_percentage}</div>
            </div>
            <br></br>
            <div className="item-services">
              <div className="label2"> Proposal Link :   </div>
              <div className="service-data"> <a href={service.proposal_link}>{service.proposal_link}</a></div>
            </div>
            <br></br>
            <div className="item-services">
              <div className="label2"> Comments : </div>
              <div className="service-data"> {service.comments}</div>
            </div>
            <br></br>
            <div className="item-services">
              <div className="label2"> Region :   </div>
              <div className="service-data"> {service.region}</div>
            </div>
            <br></br>
            <div className="item-services">
              <div className="label2"> State :   </div>
              <div className="service-data"> {service.state}</div>
            </div>
            <br></br>
            <div className="item-services">
              <div className="label2"> Created At :   </div>
              <div className="service-data"> {service.created_at}</div>
            </div>
          </MuiDialogContent>
          <MuiDialogActions>
            <Button autoFocus onClick={handleDetailsClose}>
              Close
            </Button>
          </MuiDialogActions>
        </Dialog>

        <Dialog aria-labelledby="customized-dialog-title" open={open}>
          <MuiDialogTitle
            id="customized-dialog-title"
            onClose={handleClose}
          >
            Add
          </MuiDialogTitle>
          <MuiDialogContent dividers>
            <div className="label">* please fill all the fields</div>
            <div className="DropDown">
              <Autocomplete
                onChange={(event, value) => setCompanyID(value.id)}
                id="company-filter"
                options={companyList}
                getOptionLabel={(option) => option.name}
                getOptionSelected={(option) => option}
                filterOptions={filterOptions}
                style={{ width: 200 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Company Name"
                    variant="outlined"
                  />
                )}
              />
            </div>
            <div className="DropDown">
              <div className="label">Stage:</div>
              <select
                name="Stage"
                id="stage"
                placeholder="Stage"
                required
                onChange={(event) => {
                  setStageId(parseInt(event.target.value));
                }}
              >
                <option></option>
                <option value="1">Qualification</option>
                <option value="2">Lead</option>
                <option value="3">Proposal</option>
                <option value="4">Closed</option>
                <option value="5">Pilot</option>
                <option value="6">Live</option>
                <option value="7">On Hold</option>
              </select>
            </div>
            <div className="Date">
              <div className="label">Demo Date: </div>
              <input
                type="date"
                id="date"
                onChange={(event) => {
                  setDemoDate(event.target.value);
                }}
              />
            </div>
            <div className="DropDown">
              <div className="label">Email Campaign:</div>
              <select
                name="email_campaign"
                id="email_campaign"
                placeholder="email_campaign"
                onChange={(event) => {
                  setEmailCampaign(parseInt(event.target.value));
                }}
              >
                <option></option>
                <option value="1">YES</option>
                <option value="0">NO</option>
              </select>
            </div>
            <div className="DropDown">
              <div className="label">Website:</div>
              <select
                name="Website"
                id="Website"
                placeholder="Website"
                onChange={(event) => {
                  setWebsite(parseInt(event.target.value));
                }}
              >
                <option></option>
                <option value="1">YES</option>
                <option value="0">NO</option>
              </select>
            </div>
            <div className="DropDown">
              <div className="label">SEO:</div>
              <select
                name="SEO"
                id="SEO"
                placeholder="SEO"
                onChange={(event) => {
                  setSeo(parseInt(event.target.value));
                }}
              >
                <option></option>
                <option value="1">YES</option>
                <option value="0">NO</option>
              </select>
            </div>
            <div className="DropDown">
              <div className="label">Web Booking:</div>
              <select
                name="webBooking"
                id="webBooking"
                placeholder="webBooking"
                onChange={(event) => {
                  setWebBooking(parseInt(event.target.value));
                }}
              >
                <option></option>
                <option value="1">YES</option>
                <option value="0">NO</option>
              </select>
            </div>
            <div className="DropDown">
              <div className="label">Live Chat:</div>
              <select
                name="liveChat"
                id="liveChat"
                placeholder="liveChat"
                onChange={(event) => {
                  setLiveChat(parseInt(event.target.value));
                }}
              >
                <option></option>
                <option value="1">YES</option>
                <option value="0">NO</option>
              </select>
            </div>
            <div className="DropDown">
              <div className="label">Social Media:</div>
              <select
                name="socialMedia"
                id="socialMedia"
                placeholder="socialMedia"
                onChange={(event) => {
                  setSocialMedia(parseInt(event.target.value));
                }}
              >
                <option></option>
                <option value="1">YES</option>
                <option value="0">NO</option>
              </select>
            </div>
            <div className="input-fields">
              <br></br>
              <div className="label">Proposal Amount:</div>
              <input
                type="number"
                step="any"
                onChange={(event) => {
                  setProposalAmount(parseInt(event.target.value));
                }}
              />
              <br></br>
            </div>
            <div className="input-fields">
              <div className="label">Closure Amount:</div>
              <input
                type="number"
                step="any"
                id="closureAmount"
                onChange={(event) => {
                  setClosureAmount(parseInt(event.target.value));
                }}
              />
              <br></br>
            </div>
            <div className="input-fields">
              <div className="label">Closure Percentage:</div>
              <input
                type="number"
                step="any"
                id="closureAmount"
                onChange={(event) => {
                  setClosurePercentage(parseFloat(event.target.value));
                }}
              />
              <br></br>
            </div>
            <div className="Date">
              <div className="label">Expected Closure Date:</div>
              <input
                type="date"
                id="expectedClosureDate"
                onChange={(event) => {
                  setExpectedClosureDate(event.target.value);
                }}
              />
              <br></br>
            </div>
            <div className="input-fields">
              <div className="label">Proposal Link</div>
              <input
                className="proposal_link"
                type="text"
                id="proposal_link"
                onChange={(event) => {
                  setProposalLink(event.target.value);
                }}
              />
            </div>
            <div className="input-fields">
              <div className="label">Region:</div>
              <input
                className="label"
                type="text"
                id="region"
                onChange={(event) => {
                  setRegion(event.target.value);
                }}
              />
            </div>
            <div className="input-fields">
              <div className="label">State:</div>
              <input
                className="label"
                type="text"
                id="state"
                onChange={(event) => {
                  setState(event.target.value);
                }}
              />
            </div>
            <div className="input-fields">
              <div className="label">Comments:</div>
              <TextareaAutosize
                aria-label="minimum height"
                rowsMin={5}
                onChange={(event) => {
                  setComments(event.target.value);
                }}
              />
            </div>




          </MuiDialogContent>
          <MuiDialogActions>
            <Button autoFocus onClick={handleClose}>
              Discard
            </Button>
            <Button autoFocus color="green" onClick={submitService} >
              ADD
            </Button>
          </MuiDialogActions>
        </Dialog>
        <div
          id="myGrid"
          style={{
            height: '700px',
            width: '1500px',
            position: 'relative',
            bottom: '8%',
            right: '1%'
          }}
          className="ag-theme-alpine"
        >
          <button class="button button1 ms-hide-btn" onClick={HideColumn}>Hide</button>

          <AgGridReact
            defaultColDef={{
              flex: 1,
              minWidth: 200,
              resizable: true,
              filter: true,
            }}
            frameworkComponents={{ btnActions: btnActions }}
            onGridReady={onGridReady}
            rowData={marketingServices}
            rowSelection="Single"
          >
            <AgGridColumn field="name"
              headerName="Name" />
            <AgGridColumn field="mrr"
              headerName="MRR($)" />
            <AgGridColumn field="marketing_proposal_stage"
              headerName="Stage"
            />
            <AgGridColumn field="demo_date"
              headerName="Demo Date"
              filter="agDateColumnFilter"
              filterParams={dateFilterParams} />

            <AgGridColumn field="email_campaign"
              headerName="Email Campaign" />
            <AgGridColumn field="website"
              headerName="Website" />

            <AgGridColumn field="seo"
              headerName="SEO" />
            <AgGridColumn field="web_booking"
              headerName="Web Booking" />
            <AgGridColumn field="livechat"
              headerName="Live Chat" />
            <AgGridColumn field="social_media"
              headerName="Social Media" />

            <AgGridColumn field="rep"
              headerName="AM rep" />

            <AgGridColumn field="proposal_amount"
              headerName="Proposal Amount ($)" />

            <AgGridColumn field="closure_amount"
              headerName="Closure Amount ($)" />

            <AgGridColumn field="expected_closure_date"
              headerName="Expected Closure Date" />

            <AgGridColumn field="closure_percentage"
              headerName="Closure Percentage (%)" />

            <AgGridColumn field="proposal_link"
              headerName="Proposal Link" />
            <AgGridColumn field="comments"
              headerName="Comments" />
            <AgGridColumn field="region"
              headerName="Region" />
            <AgGridColumn field="state"
              headerName="State" />

            <AgGridColumn field="created_at"
              headerName="Created At"
              filter="agDateColumnFilter"
              filterParams={dateFilterParams} />

            <AgGridColumn field="updated_at"
              headerName="Updated At"
              filter="agDateColumnFilter"
              filterParams={dateFilterParams}
            />

            <AgGridColumn field="created_by"
              headerName="Created By" />

            <AgGridColumn field="updated_by"
              headerName="Updated By" />
            <AgGridColumn field="Action" cellRenderer="btnActions" />

          </AgGridReact>
        </div>

      </div>
    </div>
  )
}

export default MarkettingServices

import React from "react";
import { useLocation, useParams, Redirect } from "react-router-dom";

import { Tabs } from "@yazanaabed/react-tabs";
import NavBar from "../Components/NavBar";
import SideNavBar from "../Components/SideNavBar";
import "./../res/css/CompanyHome.css";
import NotesTable from "../Components/NotesTable";
import TouchBase  from "../Components/TouchBase";
import Memos  from "../Components/Memos";
import FreshDesk from "../Components/Freshdesk";

function CompanyHome() {
    let { id } = useParams();
    const location = useLocation();

    if (!location.state.id) {
        alert("New Company ID not found")
        return <Redirect to='/home'/>
    }

    if (!(sessionStorage.getItem('login-status'))) {
        console.log("here")
        return <Redirect to='/' />
    }

    return (
        <div>
            <NavBar />
            <SideNavBar />

            <div className="account-heading">Account Details </div>
            <div className="company-home">
                <div className="company-detail-box">
                    <div className="item2">
                        <div className="label"> Company Name :</div>
                        <div className="data"> {location.state.name}</div>
                    </div>
                    <div className="item2">
                        <div className="label"> Support ID :</div>
                        <div className="data"> {location.state.support_email}</div>
                    </div>
                    <div className="item">
                        <div className="label"> ID : </div>
                        <div className="data"> {location.state.V3_id}</div>
                    </div>
                    <div className="item">
                        <div className="label"> Status : </div>
                        <div className="data"> {location.state.status}</div>
                    </div>
                    <div className="item">
                        <div className="label"> TimeZone : </div>
                        <div className="data"> {location.state.timezone}</div>
                    </div>
                    <div className="item">
                        <div className="label"> Live Date : </div>
                        <div className="data"> {location.state.live_date}</div>
                    </div>
                    <div className="item">
                        <div className="label"> Handoff Date :</div>
                        <div className="data"> {location.state.handoff_date}</div>
                    </div>
                    <div className="item">
                        <div className="label"> OM :</div>
                        <div className="data"> {location.state.om}</div>
                    </div>
                    <div className="item">
                        <div className="label"> AM :</div>
                        <div className="data"> {location.state.am}</div>
                    </div>
                    <div className="item">
                        <div className="label"> MRR :</div>
                        <div className="data"> {location.state.mrr}</div>
                    </div>
                    <div className="item">
                        <div className="label"> Contract :</div>
                        <div className="data"> {location.state.contract_type}</div>
                    </div>
                    <div className="item2">
                        <div className="label"> Previous Platform :</div>
                        <div className="data"> {location.state.previous_platform}</div>
                    </div>
                    <div className="item">
                        <div className="label"> QB :</div>
                        <div className="data"> {location.state.quickBooks}</div>
                    </div>
                    <div className="item">
                        <div className="label"> Payments :</div>
                        <div className="data"> {location.state.payment_partner}</div>
                    </div>
                    <br></br>
                    {/* <div className="item">
                    <button> Edit Details</button>
                    </div> */}
                </div>
                <div className="tabs">
                    <Tabs
                        activeTab={{
                            id: "freshdesk",
                        }}
                    >
                        <Tabs.Tab id="freshdesk" title="Freshdesk">
                            <div className="integrations">
                                <FreshDesk/>
                            </div>
                        </Tabs.Tab>
                        <Tabs.Tab id="usage" title="Usage">
                            <div className="integrations">Usage</div>
                        </Tabs.Tab>
                        <Tabs.Tab id="touchbase" title="Touchbase">
                            <div className="integrations">
                                <TouchBase/>
                            </div>

                        </Tabs.Tab>
                        <Tabs.Tab id="health" title="Health">
                            <div className="integrations">Health</div>
                        </Tabs.Tab>
                        <Tabs.Tab id="memos" title="Memos">
                            <div className="integrations">Memos</div>
                            <Memos/>
                        </Tabs.Tab>
                        <Tabs.Tab id="notes" title="Notes">
                            <div className="integrations">
                                <NotesTable/>
                            </div>
                        </Tabs.Tab>
                        <Tabs.Tab id="hubspot" title="Hubspot">
                            <div className="integrations">Hubspot</div>
                        </Tabs.Tab>
                    </Tabs>
                </div>
            </div>
        </div >
    );
}

export default CompanyHome;

import React from "react";
import { useState, useEffect } from 'react';
import Axios from 'axios';

import { useParams } from "react-router-dom";



import { Bar, Pie } from 'react-chartjs-2'


function FreshDesk() {
const apis = require('./../Config/API.json')
let [barData, setBarData] = useState({});
let [horizontalData, setHorizontalData] = useState({});




let { id } = useParams();

let Access_token = sessionStorage.getItem("token");

let config_get = {
  headers: {
    'Authorization': `Bearer ${Access_token}`
  },
  params: {
    company_id: id
  }
}





useEffect(() => {
  Axios.get(apis.FETCH_FRESHDESK_ID, config_get).then((response) => {

    Axios.request({
      url: apis.FRESHDESK.TICKETS + response.data.freshDesk_id[0].freshdesk_ids,
      method: 'get',
      auth: {
        username: "8rUsaERRfBqiyd1TLG",
        password: "X"
      }
    }).then((response) => {

      getCountTickets(response.data)
    })
      .catch((err) => {
        console.log(err);
      })

  })
    .catch((err) => {
      console.log(err);
    });

}, []);



const getCountTickets = (tickets) => {
  console.log(tickets)
  let problem = 0, featureReq = 0, serReq = 0, comm = 0, query = 0, other = 0, bugs = 0, open = 0, closed = 0, pending = 0, resolved = 0;
  for (var i in tickets) {

    var type = String(tickets[i].type)


    switch (type) {
      case 'Problem': problem += 1;
        break;
      case 'Feature Request': featureReq += 1;
        break;
      case 'Bug': bugs += 1;
        break;
      case 'Service Request': serReq += 1;
        break;
      case 'Communication': comm += 1;
        break;
      case 'Query': query += 1;
        break;
      default: other += 1;
        break;

    }

    switch (tickets[i].status) {
      case 2: open += 1;
        break;
      case 3: pending += 1;
        break;
      case 4: resolved += 1;
        break;
      case 5: closed += 1;
        break;
    }

  }

  setBarData(
    {
      labels: ['Bug', 'Service Request', 'Communication', 'Problem', 'Query', 'Feature Request', 'Other'],
      datasets: [
        {
          label: '# of Tickets',
          data: [bugs, serReq, comm, problem, query, featureReq, other],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 8, 0, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 8, 0, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1,
        },
      ],
    }

  )



  setHorizontalData(
    {
      labels: ['Open', 'Pending', 'Resolved', 'Closed'],
      datasets: [
        {
          label: '# of Tickets',
          data: [open, pending, resolved, closed],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 0, 0, 0.6)',
            'rgba(0, 166, 255, 0.6)',
            'rgba(0, 146, 0, 0.6)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(255, 0, 0, 1)',
            'rgba(0, 166, 255, 1)',
            'rgba(0, 146, 0, 1)'
          ],
          borderWidth: 1,
        },
      ],
    }

  )


}



const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

const optionsHorizontal = {
  indexAxis: 'y',

  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: 'right',
    },
    title: {
      display: true,
      text: 'Ticket Status',
    },
  },
};

return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: "800px",
        height: "500px",
        alignItems : "center",
        justifyContent: "center",
        marginTop: "70px",
        marginLeft: "70px"
      }}
    >
      <Bar data={barData} options={options} />
      <div
      style={
        {
        width: "500px",
        height: "300px",
        alignItems : "center",
        justifyContent: "center",
      
        }
      }
    >
      <Bar data={horizontalData} options={optionsHorizontal} />
    </div>
    </div>
)
}

export default FreshDesk

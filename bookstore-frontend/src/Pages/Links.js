import React, { useState, useEffect } from 'react'
import NavBar from '../Components/NavBar'
import SideNavBar from '../Components/SideNavBar'
import Button from "@material-ui/core/Button";
import './../res/css/Links.css'
import './../res/css/Button.css'
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import {Redirect} from 'react-router-dom'; 
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import Axios from "axios";
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import 'ag-grid-community/dist/styles/ag-grid.css'
import { AgGridReact, AgGridColumn } from 'ag-grid-react'


function Links() {
    const [loading, setLoading] = useState(false);
    const [deleteTrigger, setDeleteTrigger] = useState(false);
    const [open, setOpen] = useState(false);
    const [linkName, setLinkName] = useState();
    const [cart, setCart] = useState([]);
    const [links, setLinks] = useState([]);
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const onGridReady = (params) => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
    };

    let Access_token = sessionStorage.getItem("token")
    let config = {
        headers: {
            'Authorization' : `Bearer ${Access_token}`
        }
    }
    const apis = require("../Config/API.json");

    


    if (!(sessionStorage.getItem('login-status'))) {
        console.log("here")
        return <Redirect to='/' />
    }
    const fetchCart = () => {
        Axios.get('http://localhost:3008/cart', {
            params: {
                user_id: sessionStorage.getItem('user-id'),
            },
        })
          .then((response) => {
            setCart(response.data);
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            setLoading(false);
          });
      };

    useEffect(() => {
        fetchCart()
    }, []);

    const removeFromCart = async (itemId) => {
        // Implement the logic to remove the item from the cart
        // You can use Axios to make a DELETE request to your server endpoint
        // Update the cart state after successfully removing the item
        // Example:
        // Axios.post(`http://localhost:3008/deleteBookCart`, {
        //     cart_id: itemId
        // })
        //   .then((response) => {
        //     setCart(response.data);
        //     fetchCart()
        //   })
        //   .catch((error) => {
        //     console.error('Error removing item from cart:', error);
        //   });
        try {
            await Axios.post(`http://localhost:3008/deleteBookCart`, {
                cart_id: itemId
            });
    
            // Update the cart state after successfully removing the item
            // Fetch the updated cart data
            fetchCart();}catch (error) {
                console.error('Error removing item from cart:', error);
            }
      };
      const handleBuyNow = async () => {
        for (const book of cart) {
            try {
                // First request to create purchase history
                await Axios.post(`http://localhost:3008/createPurchasehistory`, {
                    user_id: sessionStorage.getItem('user-id'),
                    book_id: book.BookID
                });
                console.log(`Purchase history created for BookID: ${book.BookID}`);
    
                // Second request to delete book from cart
                await Axios.post(`http://localhost:3008/deleteBookCart`, {
                    cart_id: book.id
                });
                console.log(`Book deleted from cart for BookID: ${book.BookID}`);
            } catch (error) {
                console.error(`Error processing BookID: ${book.BookID}`, error);
                // Handle the error if needed
                // If you want to stop the loop on error, you can use "break;"
            }
        }
        fetchCart();
      };
    // if (loading) {
    //     return <p>Data is loading...</p>;
    // }
    // const handleClickOpen = () => {
    //     setOpen(true);
    // };
    // const handleClose = () => {
    //     setOpen(false);
    // };
    // const goToLinK = params => {
    //     const openLink = () => 
    //         window.open(params.data.link, '_blank');
    //     const deleteLink = () => 
    //     Axios.put(apis.LINKS_DELETE, {
    //         id: params.data.id
    //         }, {
    //             headers: {
    //             'Authorization' : `Bearer ${Access_token}`
    //             }
    //         }).then ((response) => {
    //         if (response.data.error) {
    //             //notifyError();
    //         } else {
    //             setLoading(true);
    //             Axios.get(apis.LINKS_FETCH, config)
    //                 .then((response) => {
    //                     setLinks(response.data.links)
    //                 })
    //                 .catch((err) => {
    //                     console.log(err);
    //                 })
    //                 .finally(() => {
    //                     setLoading(false);
    //                 });
    //         }
    //     })
    //     return <span><button onClick={openLink} className="btn btn-Action">Open Link</button><button onClick={deleteLink} className="btn btn-Action">Delete</button></span>;
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
    // const submitlink = () => {
    //     setOpen(false);
        
        
    //     if (linkName !== "") {
    //         Axios.post(apis.LINKS_ADD, {
    //             user: sessionStorage.getItem("user-id"),
    //             link: linkLink,
    //             name: linkName,
    //         }, {
    //             headers: {
    //                 'Authorization' : `Bearer ${Access_token}`
    //             }
    //         }).then((response) => {
    //             if (response.data.error) {
    //                 //notifyError();
    //             } else {
    //                 setLoading(true);
    //                 Axios.get(apis.LINKS_FETCH, config)
    //                     .then((response) => {
    //                         setLinks(response.data.links)
    //                     })
    //                     .catch((err) => {
    //                         console.log(err);
    //                     })
    //                     .finally(() => {
    //                         setLoading(false);
    //                     });
    //                 //notifySuccess();
    //             }
    //         });
    //     }
    // };
    return (
      <div >
        <SideNavBar />
        <aside className="cart">
            
        <h2>Shopping Cart</h2>
        <ul>
          {cart.map((item) => (
            <li key={item.id}>
              <img src={item.tumbnail_url} alt={item.Title} />
              <div className="cart-item-details">
                <h3>{item.Titleitle}</h3>
                <p>Price: ${item.Price}</p>
                <button onClick={() => removeFromCart(item.id)}>Remove from Cart</button>
              </div>
            </li>
          ))}
        </ul>
        <button onClick={handleBuyNow}>Buy Now</button>
      </aside>
      </div>
    )
}

export default Links

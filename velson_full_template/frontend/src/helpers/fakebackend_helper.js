import { APIClient } from "./api_helper";
import * as url from "./url_helper";

const api = new APIClient();
// Gets the logged in user data from local session


// Gets the logged in user data from local session
export const getLoggedInUser = () => {
  const user = localStorage.getItem("user");
  if (user) return JSON.parse(user);
  return null;
};

// //is user is logged in
export const isUserAuthenticated = () => {
  return getLoggedInUser() !== null;
};

// Register Method
export const postFakeRegister = (data) => {
  return api.create(url.POST_FAKE_REGISTER, data)
    .catch(err => {
      let message;
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 404:
            message = "Sorry! the page you are looking for could not be found";
            break;
          case 500:
            message = "Sorry! something went wrong, please contact our support team";
            break;
          case 401:
            message = "Invalid credentials";
            break;
          default:
            message = err[1];
            break;
        }
      }
      throw message;
    });
};

// Login Method
export const postFakeLogin = data => api.create(url.POST_FAKE_LOGIN, data);

// postForgetPwd
export const postFakeForgetPwd = data => api.create(url.POST_FAKE_PASSWORD_FORGET, data);

// Edit profile
export const postJwtProfile = data => api.create(url.POST_EDIT_JWT_PROFILE, data);

export const postFakeProfile = data => api.create(url.POST_EDIT_PROFILE, data);

// Register Method
export const postJwtRegister = (url, data) => {
  return api.create(url, data)
    .catch(err => {
      var message;
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 404:
            message = "Sorry! the page you are looking for could not be found";
            break;
          case 500:
            message = "Sorry! something went wrong, please contact our support team";
            break;
          case 401:
            message = "Invalid credentials";
            break;
          default:
            message = err[1];
            break;
        }
      }
      throw message;
    });
};
// Login Method
export const postJwtLogin = data => api.create(url.POST_FAKE_JWT_LOGIN, data);

// postForgetPwd
export const postJwtForgetPwd = data => api.create(url.POST_FAKE_JWT_PASSWORD_FORGET, data);

// postSocialLogin
export const postSocialLogin = data => api.create(url.SOCIAL_LOGIN, data);


// get Events
export const getEvents = () => api.get(url.GET_EVENTS);

// get Events
export const getCategories = () => api.get(url.GET_CATEGORIES);

// get Upcomming Events
export const getUpCommingEvent = () => api.get(url.GET_UPCOMMINGEVENT);

// add Events
export const addNewEvent = event => api.create(url.ADD_NEW_EVENT, event);

// update Event
export const updateEvent = event => api.update(url.UPDATE_EVENT, event);

// delete Event
export const deleteEvent = event => api.delete(url.DELETE_EVENT, { headers: { event } });

// get Contact
export const getDirectContact = () => api.get(url.GET_DIRECT_CONTACT);

// get messages
export const getMessages = roomId => api.get(`${url.GET_MESSAGES}/${roomId}`, { params: { roomId } });

//add message
export const addMessage = message => api.create(url.ADD_MESSAGE, message);

// get Channels
export const getChannels = () => api.get(url.GET_CHANNELS);

//project list 
export const getProjectList = () => api.get(url.GET_PROJECT_LIST);
//Ecommerce

// get Products
export const getProducts = () => api.get(url.GET_PRODUCTS);
// get Orders
export const getOrders = () => api.get(url.GET_ORDERS);

// add order
export const addNewOrder = order => api.create(url.ADD_NEW_ORDER, order);

// update order
export const updateOrder = order => api.update(url.UPDATE_ORDER, order);

// delete order
export const deleteOrder = order => api.delete(url.DELETE_ORDER, { headers: { order } });

// get Sellers
export const getSellers = () => api.get(url.GET_SELLERS);


// get Task
export const getTaskList = () => api.get(url.GET_TASK_LIST);

// add Task
export const addNewTask = task => api.create(url.ADD_NEW_TASK, task);

// update Task
export const updateTask = task => api.update(url.UPDATE_TASK, task);

// delete Task
export const deleteTask = task => api.delete(url.DELETE_TASK, { headers: { task } });


// get Customers
export const getCustomers = () => api.get(url.GET_CUSTOMERS);

// add CUSTOMER
export const addNewCustomer = customer => api.create(url.ADD_NEW_CUSTOMER, customer);

// update CUSTOMER
export const updateCustomer = customer => api.update(url.UPDATE_CUSTOMER, customer);

// delete CUSTOMER
export const deleteCustomer = customer => api.delete(url.DELETE_CUSTOMER, { headers: { customer } });

//Crypto
export const getTransationList = () => api.get(url.GET_TRANSATION_LIST);
export const getOrderList = () => api.get(url.GET_ORDRER_LIST);


// Support Tickets 
export const getTicketsList = () => api.get(url.GET_TICKETS_LIST);

// add Support Tickets 
export const addNewTicket = ticket => api.create(url.ADD_NEW_TICKET, ticket);

// update Support Tickets 
export const updateTicket = ticket => api.update(url.UPDATE_TICKET, ticket);

// delete Support Tickets 
export const deleteTicket = ticket => api.delete(url.DELETE_TICKET, { headers: { ticket } });

//Crm

// get Contacts
export const getContacts = () => api.get(url.GET_CONTACTS);

// add Contact
export const addNewContact = contact => api.create(url.ADD_NEW_CONTACT, contact);

// update Contact
export const updateContact = contact => api.update(url.UPDATE_CONTACT, contact);

// delete Contact
export const deleteContact = contact => api.delete(url.DELETE_CONTACT, { headers: { contact } });

// get Companies
export const getCompanies = () => api.get(url.GET_COMPANIES);

// add Companies
export const addNewCompanies = company => api.create(url.ADD_NEW_COMPANIES, company);

// update Companies
export const updateCompanies = company => api.update(url.UPDATE_COMPANIES, company);

// delete Companies
export const deleteCompanies = company => api.delete(url.DELETE_COMPANIES, { headers: { company } });

// get Deals
export const getDeals = () => api.get(url.GET_DEALS);

// get leads
export const getLeads = () => api.get(url.GET_LEADS);

// add Lead
export const addNewLead = lead => api.create(url.ADD_NEW_LEAD, lead);

// update Lead
export const updateLead = lead => api.update(url.UPDATE_LEAD, lead);

// delete Lead
export const deleteLead = lead => api.delete(url.DELETE_LEAD, { headers: { lead } });


//get invoice
export const getInvoices = () => api.get(url.GET_INVOICES);

// add Invoice
export const addNewInvoice = invoice => api.create(url.ADD_NEW_INVOICE, invoice);

// update Invoice
export const updateInvoice = invoice => api.update(url.UPDATE_INVOICE, invoice);

// delete Invoice
export const deleteInvoice = invoice => api.delete(url.DELETE_INVOICE, { headers: { invoice } });

//get mail
export const getMailDetails = () => api.get(url.GET_MAIL_DETAILS);

//delete mail
export const deleteMail = forId => api.delete(url.DELETE_MAIL, { headers: { forId } });

//product
export const deleteProducts = product => api.delete(url.DELETE_PRODUCT, { headers: { product } });
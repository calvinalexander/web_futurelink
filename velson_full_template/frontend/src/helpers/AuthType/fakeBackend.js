import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import * as url from "../url_helper";
import accessToken from "../jwt-token-access/accessToken";

import {
  calenderDefaultCategories,
  events,
  defaultevent,
  direactContact,
  messages,
  channelsList,
  projectList,
  productsData,
  orders,
  sellersList,
  allTask,
  transactions,
  CryptoOrders,
  ticketsTable,
  customerList,
  crmcontacts,
  companies,
  leads,
  deals,
  invoiceTable,
  mailbox,
} from "../../common/data";

let users = [
  {
    uid: 1,
    username: "admin",
    role: "admin",
    password: "123456",
    email: "admin@themesbrand.com",
  },
];

const fakeBackend = () => {
  // This sets the mock adapter on the default instance
  const mock = new MockAdapter(axios, { onNoMatch: "passthrough" });

  mock.onPost(url.POST_FAKE_REGISTER).reply(config => {
    const user = JSON.parse(config["data"]);
    users.push(user);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([200, user]);
      });
    });
  });

  mock.onPost("/post-fake-login").reply(config => {
    const user = JSON.parse(config["data"]);
    const validUser = users.filter(
      usr => usr.email === user.email && usr.password === user.password
    );

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (validUser["length"] === 1) {
          resolve([200, validUser[0]]);
        } else {
          reject([
            "Username and password are invalid. Please enter correct username and password",
          ]);
        }
      });
    });
  });

  mock.onPost("/fake-forget-pwd").reply(config => {
    // User needs to check that user is eXist or not and send mail for Reset New password

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([200, "Check you mail and reset your password."]);
      });
    });
  });

  mock.onPost("/post-jwt-register").reply(config => {
    const user = JSON.parse(config["data"]);
    users.push(user);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([200, user]);
      });
    });
  });

  mock.onPost("/post-jwt-login").reply(config => {
    const user = JSON.parse(config["data"]);
    const validUser = users.filter(
      usr => usr.email === user.email && usr.password === user.password
    );

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (validUser["length"] === 1) {
          // You have to generate AccessToken by jwt. but this is fakeBackend so, right now its dummy
          const token = accessToken;

          // JWT AccessToken
          const tokenObj = { accessToken: token }; // Token Obj
          const validUserObj = { ...validUser[0], ...tokenObj }; // validUser Obj

          resolve([200, validUserObj]);
        } else {
          reject([
            400,
            "Username and password are invalid. Please enter correct username and password",
          ]);
        }
      });
    });
  });

  mock.onPost("/post-jwt-profile").reply(config => {
    const user = JSON.parse(config["data"]);

    const one = config.headers;

    let finalToken = one.Authorization;

    const validUser = users.filter(usr => usr.uid === user.idx);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Verify Jwt token from header.Authorization
        if (finalToken === accessToken) {
          if (validUser["length"] === 1) {
            let objIndex;

            //Find index of specific object using findIndex method.
            objIndex = users.findIndex(obj => obj.uid === user.idx);

            //Update object's name property.
            users[objIndex].username = user.username;

            // Assign a value to locastorage
            localStorage.removeItem("authUser");
            localStorage.setItem("authUser", JSON.stringify(users[objIndex]));

            resolve([200, "Profile Updated Successfully"]);
          } else {
            reject([400, "Something wrong for edit profile"]);
          }
        } else {
          reject([400, "Invalid Token !!"]);
        }
      });
    });
  });

  mock.onPost("/post-fake-profile").reply(config => {
    const user = JSON.parse(config["data"]);

    const validUser = users.filter(usr => usr.uid === user.idx);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (validUser["length"] === 1) {
          let objIndex;

          //Find index of specific object using findIndex method.
          objIndex = users.findIndex(obj => obj.uid === user.idx);

          //Update object's name property.
          users[objIndex].username = user.username;

          // Assign a value to locastorage
          localStorage.removeItem("authUser");
          localStorage.setItem("authUser", JSON.stringify(users[objIndex]));

          resolve([200, "Profile Updated Successfully"]);
        } else {
          reject([400, "Something wrong for edit profile"]);
        }
      });
    });
  });

  mock.onPost("/jwt-forget-pwd").reply(config => {
    // User needs to check that user is eXist or not and send mail for Reset New password

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([200, "Check you mail and reset your password."]);
      });
    });
  });

  mock.onPost("/social-login").reply(config => {
    const user = JSON.parse(config["data"]);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (user && user.token) {
          // You have to generate AccessToken by jwt. but this is fakeBackend so, right now its dummy
          const token = accessToken;

          // JWT AccessToken
          const tokenObj = { accessToken: token }; // Token Obj
          const validUserObj = { ...user[0], ...tokenObj }; // validUser Obj

          resolve([200, validUserObj]);
        } else {
          reject([
            400,
            "Username and password are invalid. Please enter correct username and password",
          ]);
        }
      });
    });
  });


  mock.onGet(url.GET_EVENTS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (events) {
          // Passing fake JSON data as response
          const data = [...events, ...defaultevent];
          resolve([200, data]);
        } else {
          reject([400, "Cannot get events"]);
        }
      });
    });
  });

  mock.onGet(url.GET_CATEGORIES).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (calenderDefaultCategories) {
          // Passing fake JSON data as response
          resolve([200, calenderDefaultCategories]);
        } else {
          reject([400, "Cannot get categories"]);
        }
      });
    });
  });

  mock.onGet(url.GET_UPCOMMINGEVENT).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (defaultevent) {
          // Passing fake JSON data as response
          resolve([200, defaultevent]);
        } else {
          reject([400, "Cannot get upcomming events"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_EVENT).reply((event) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (event && event.data) {
          // Passing fake JSON data as response
          resolve([200, event.data]);
        } else {
          reject([400, "Cannot add event"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_EVENT).reply((event) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (event && event.data) {
          // Passing fake JSON data as response
          resolve([200, event.data]);
        } else {
          reject([400, "Cannot update event"]);
        }
      });
    });
  });

  mock.onDelete(url.DELETE_EVENT).reply((config) => {
    alert();
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.event]);
        } else {
          reject([400, "Cannot delete event"]);
        }
      });
    });
  });

  mock.onGet(url.GET_DIRECT_CONTACT).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (direactContact) {
          // Passing fake JSON data as response
          resolve([200, direactContact]);
        } else {
          reject([400, "Cannot get direct contact"]);
        }
      });
    });
  });

  mock.onGet(new RegExp(`${url.GET_MESSAGES}/*`)).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (messages) {
          // Passing fake JSON data as response
          const { params } = config;
          const filteredMessages = messages.filter(
            msg => msg.roomId === params.roomId
          );

          resolve([200, filteredMessages]);
        } else {
          reject([400, "Cannot get messages"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_MESSAGE).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (config.data) {
          // Passing fake JSON data as response
          resolve([200, config.data]);
        } else {
          reject([400, "Cannot add message"]);
        }
      });
    });
  });

  mock.onGet(url.GET_CHANNELS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (channelsList) {
          // Passing fake JSON data as response
          resolve([200, channelsList]);
        } else {
          reject([400, "Cannot get Channels"]);
        }
      });
    });
  });

  mock.onGet(url.GET_PROJECT_LIST).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (projectList) {
          // Passing fake JSON data as response
          resolve([200, projectList]);
        } else {
          reject([400, "Cannot get project list data"]);
        }
      });
    });
  });

  mock.onGet(url.GET_PRODUCTS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (productsData) {
          // Passing fake JSON data as response
          resolve([200, productsData]);
        } else {
          reject([400, "Cannot get products"]);
        }
      });
    });
  });

  mock.onDelete(url.DELETE_PRODUCT).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.product]);
        } else {
          reject([400, "Cannot delete product"]);
        }
      });
    });
  });

  mock.onGet(url.GET_ORDERS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (orders) {
          // Passing fake JSON data as response
          resolve([200, orders]);
        } else {
          reject([400, "Cannot get orders"]);
        }
      });
    });
  });

  mock.onGet(url.GET_CUSTOMERS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (customerList) {
          // Passing fake JSON data as response
          resolve([200, customerList]);
        } else {
          reject([400, "Cannot get customers"]);
        }
      });
    });
  });

  mock.onGet(url.GET_SELLERS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (sellersList) {
          // Passing fake JSON data as response
          resolve([200, sellersList]);
        } else {
          reject([400, "Cannot get sellers"]);
        }
      });
    });
  });

  mock.onGet(url.GET_TASK_LIST).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (allTask) {
          // Passing fake JSON data as response
          resolve([200, allTask]);
        } else {
          reject([400, "Cannot get Task List Data"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_TASK).reply(task => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (task && task.data) {
          // Passing fake JSON data as response
          resolve([200, task.data]);
        } else {
          reject([400, "Cannot add task"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_TASK).reply(task => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (task && task.data) {
          // Passing fake JSON data as response
          resolve([200, task.data]);
        } else {
          reject([400, "Cannot update task"]);
        }
      });
    });
  });

  mock.onDelete(url.DELETE_TASK).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.task]);
        } else {
          reject([400, "Cannot delete task"]);
        }
      });
    });
  });

  mock.onGet(url.GET_CONTACTS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (crmcontacts) {
          // Passing fake JSON data as response
          resolve([200, crmcontacts]);
        } else {
          reject([400, "Cannot get Contacts"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_CONTACT).reply(contact => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (contact && contact.data) {
          // Passing fake JSON data as response
          resolve([200, contact.data]);
        } else {
          reject([400, "Cannot add Contact"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_CONTACT).reply(contact => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (contact && contact.data) {
          // Passing fake JSON data as response
          resolve([200, contact.data]);
        } else {
          reject([400, "Cannot update Contact"]);
        }
      });
    });
  });

  mock.onDelete(url.DELETE_CONTACT).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.contact]);
        } else {
          reject([400, "Cannot delete Contact"]);
        }
      });
    });
  });

  mock.onGet(url.GET_TRANSATION_LIST).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (transactions) {
          // Passing fake JSON data as response
          resolve([200, transactions]);
        } else {
          reject([400, "Cannot get Transactions Data"]);
        }
      });
    });
  });

  mock.onGet(url.GET_ORDRER_LIST).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (CryptoOrders) {
          // Passing fake JSON data as response
          resolve([200, CryptoOrders]);
        } else {
          reject([400, "Cannot get Order Data"]);
        }
      });
    });
  });
  mock.onGet(url.GET_COMPANIES).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (companies) {
          // Passing fake JSON data as response
          resolve([200, companies]);
        } else {
          reject([400, "Cannot get Companies"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_COMPANIES).reply(company => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (company && company.data) {
          // Passing fake JSON data as response
          resolve([200, company.data]);
        } else {
          reject([400, "Cannot add Company"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_COMPANIES).reply(company => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (company && company.data) {
          // Passing fake JSON data as response
          resolve([200, company.data]);
        } else {
          reject([400, "Cannot update Company"]);
        }
      });
    });
  });

  mock.onDelete(url.DELETE_COMPANIES).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.company]);
        } else {
          reject([400, "Cannot delete Company"]);
        }
      });
    });
  });

  mock.onGet(url.GET_DEALS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (deals) {
          // Passing fake JSON data as response
          resolve([200, deals]);
        } else {
          reject([400, "Cannot get Deals"]);
        }
      });
    });
  });

  mock.onGet(url.GET_TICKETS_LIST).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (ticketsTable) {
          // Passing fake JSON data as response
          resolve([200, ticketsTable]);
        } else {
          reject([400, "Cannot get Tickets Data"]);

        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_TICKET).reply(ticket => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (ticket && ticket.data) {
          // Passing fake JSON data as response
          resolve([200, ticket.data]);
        } else {
          reject([400, "Cannot add Tickets"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_TICKET).reply(ticket => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (ticket && ticket.data) {
          // Passing fake JSON data as response
          resolve([200, ticket.data]);
        } else {
          reject([400, "Cannot update Tickets"]);
        }
      });
    });
  });

  mock.onDelete(url.DELETE_TICKET).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.ticket]);
        } else {
          reject([400, "Cannot delete Tickets"]);
        }
      });
    });
  });


  mock.onGet(url.GET_LEADS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (leads) {
          // Passing fake JSON data as response
          resolve([200, leads]);
        } else {
          reject([400, "Cannot get Leads"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_LEAD).reply(lead => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (lead && lead.data) {
          // Passing fake JSON data as response
          resolve([200, lead.data]);
        } else {
          reject([400, "Cannot add Lead"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_LEAD).reply(lead => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (lead && lead.data) {
          // Passing fake JSON data as response
          resolve([200, lead.data]);
        } else {
          reject([400, "Cannot update Lead"]);
        }
      });
    });
  });

  mock.onDelete(url.DELETE_LEAD).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.lead]);
        } else {
          reject([400, "Cannot delete Lead"]);
        }
      });
    });
  });

  mock.onGet(url.GET_INVOICES).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (invoiceTable) {
          // Passing fake JSON data as response
          resolve([200, invoiceTable]);
        } else {
          reject([400, "Cannot get Invoices"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_INVOICE).reply(invoice => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (invoice && invoice.data) {
          // Passing fake JSON data as response
          resolve([200, invoice.data]);
        } else {
          reject([400, "Cannot add Invoice"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_INVOICE).reply(invoice => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (invoice && invoice.data) {
          // Passing fake JSON data as response
          resolve([200, invoice.data]);
        } else {
          reject([400, "Cannot update Invoice"]);
        }
      });
    });
  });

  mock.onDelete(url.DELETE_INVOICE).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.invoice]);
        } else {
          reject([400, "Cannot delete Invoice"]);
        }
      });
    });
  });

  mock.onGet(url.GET_MAIL_DETAILS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (mailbox) {
          // Passing fake JSON data as response
          resolve([200, mailbox]);
        } else {
          reject([400, "Cannot get mail details"]);
        }
      });
    });
  });

  mock.onDelete(url.DELETE_MAIL).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.forId]);
        } else {
          reject([400, "Cannot delete order"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_ORDER).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot add mail"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_ORDER).reply(order => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (order && order.data) {
          // Passing fake JSON data as response
          resolve([200, order.data]);
        } else {
          reject([400, "Cannot update order"]);
        }
      });
    });
  });

  mock.onDelete(url.DELETE_ORDER).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.order]);
        } else {
          reject([400, "Cannot delete order"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_CUSTOMER).reply(customer => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (customer && customer.data) {
          // Passing fake JSON data as response
          resolve([200, customer.data]);
        } else {
          reject([400, "Cannot add customer"]);
        }
      });
    });
  });

  mock.onPut(url.UPDATE_CUSTOMER).reply(customer => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (customer && customer.data) {
          // Passing fake JSON data as response
          resolve([200, customer.data]);
        } else {
          reject([400, "Cannot update customer"]);
        }
      });
    });
  });

  mock.onDelete(url.DELETE_CUSTOMER).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.customer]);
        } else {
          reject([400, "Cannot delete customer"]);
        }
      });
    });
  });

  mock.onDelete(url.DELETE_PRODUCT).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.product]);
        } else {
          reject([400, "Cannot delete product"]);
        }
      });
    });
  });
};

export default fakeBackend;
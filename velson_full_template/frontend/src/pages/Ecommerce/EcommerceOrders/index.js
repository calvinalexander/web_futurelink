import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
  Row,
  Modal,
  ModalHeader,
  Form,
  ModalBody,
  Label,
  Input,
  FormFeedback
} from "reactstrap";
import * as moment from "moment";
import { Link } from "react-router-dom";
import Select from "react-select";
import classnames from "classnames";
import Flatpickr from "react-flatpickr";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { isEmpty } from "lodash";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

//redux
import { useSelector, useDispatch } from "react-redux";

//Import actions
import {
  getOrders as onGetOrders,
  addNewOrder as onAddNewOrder,
  updateOrder as onUpdateOrder,
  deleteOrder as onDeleteOrder,
} from "../../../store/ecommerce/action";

const EcommerceOrders = () => {
  const [orderStatus, setorderStatus] = useState(null);
  const [orderPayement, setorderPayement] = useState(null);

  const [modal, setModal] = useState(false);
  const [activeTab, setActiveTab] = useState("1");

  const dispatch = useDispatch();
  const { orders } = useSelector((state) => ({
    orders: state.Ecommerce.orders,
  }));

  const [orderList, setOrderList] = useState([]);
  const [order, setOrder] = useState([]);

  const orderstatus = [
    {
      options: [
        { label: "Status", value: "Status" },
        { label: "All", value: "All" },
        { label: "Pending", value: "Pending" },
        { label: "Inprogress", value: "Inprogress" },
        { label: "Cancelled", value: "Cancelled" },
        { label: "Pickups", value: "Pickups" },
        { label: "Returns", value: "Returns" },
        { label: "Delivered", value: "Delivered" },
      ],
    },
  ];

  const orderpayement = [
    {
      options: [
        { label: "Select Payment", value: "Select Payment" },
        { label: "All", value: "All" },
        { label: "Mastercard", value: "Mastercard" },
        { label: "Paypal", value: "Paypal" },
        { label: "Visa", value: "Visa" },
        { label: "COD", value: "COD" },
      ],
    },
  ];

  const productname = [
    {
      options: [
        { label: "Product", value: "Product" },
        { label: "Puma Tshirt", value: "Puma Tshirt" },
        { label: "Adidas Sneakers", value: "Adidas Sneakers" },
        {
          label: "350 ml Glass Grocery Container",
          value: "350 ml Glass Grocery Container",
        },
        {
          label: "American egale outfitters Shirt",
          value: "American egale outfitters Shirt",
        },
        { label: "Galaxy Watch4", value: "Galaxy Watch4" },
        { label: "Apple iPhone 12", value: "Apple iPhone 12" },
        { label: "Funky Prints T-shirt", value: "Funky Prints T-shirt" },
        {
          label: "USB Flash Drive Personalized with 3D Print",
          value: "USB Flash Drive Personalized with 3D Print",
        },
        {
          label: "Oxford Button-Down Shirt",
          value: "Oxford Button-Down Shirt",
        },
        {
          label: "Classic Short Sleeve Shirt",
          value: "Classic Short Sleeve Shirt",
        },
        {
          label: "Half Sleeve T-Shirts (Blue)",
          value: "Half Sleeve T-Shirts (Blue)",
        },
        { label: "Noise Evolve Smartwatch", value: "Noise Evolve Smartwatch" },
      ],
    },
  ];

  const [isEdit, setIsEdit] = useState(false);

  function handleorderStatus(orderStatus) {
    setorderStatus(orderStatus);
  }

  function handleorderPayement(orderPayement) {
    setorderPayement(orderPayement);
  }

  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = (order) => {
    setOrder(order);
    setDeleteModal(true);
  };

  const handleDeleteOrder = () => {
    if (order.id) {
      dispatch(onDeleteOrder(order));
      setDeleteModal(false);
    }
  };

  useEffect(() => {
    setOrderList(orders);
  }, [orders]);

  useEffect(() => {
    dispatch(onGetOrders());
  }, [dispatch]);

  useEffect(() => {
    if (!isEmpty(orders)) setOrderList(orders);
  }, [orders]);

  const toggleTab = (tab, type) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      let filteredOrders = orders;
      if (type !== "all") {
        filteredOrders = orders.filter((order) => order.status === type);
      }
      setOrderList(filteredOrders);
    }
  };

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      orderId: (order && order.orderId) || '',
      customer: (order && order.customer) || '',
      productname: (order && order.productname) || '',
      orderDate: (order && order.orderDate) || '',
      // ordertime: (order && order.ordertime) || '',
      amount: (order && order.amount) || '',
      payment: (order && order.payment) || '',
      status: (order && order.status) || '',
    },
    validationSchema: Yup.object({
      orderId: Yup.string().required("Please Enter order Id"),
      customer: Yup.string().required("Please Enter Customer Name"),
      productname: Yup.string().required("Please Enter Product Name"),
      // orderDate: Yup.string().required("Please Enter Order Date"),
      // ordertime: Yup.string().required("Please Enter Order Time"),
      amount: Yup.string().required("Please Enter Total Amount"),
      payment: Yup.string().required("Please Enter Payment Method"),
      status: Yup.string().required("Please Enter Delivery Status")
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateOrder = {
          id: order ? order.id : 0,
          orderId: values.orderId,
          customer: values.customer,
          productname: values.productname,
          orderDate: date,
          // ordertime: values.ordertime,
          amount: values.amount,
          payment: values.payment,
          status: values.status
        };
        // update order
        dispatch(onUpdateOrder(updateOrder));
        // setDate(dateFormat());
        validation.resetForm();
      } else {
        const newOrder = {
          id: Math.floor(Math.random() * (30 - 20)) + 20,
          orderId: values["orderId"],
          customer: values["customer"],
          productname: values["productname"],
          orderDate: date,
          // ordertime: values["ordertime"],
          amount: values["amount"],
          payment: values["payment"],
          status: values["status"]
        };
        // save new order
        dispatch(onAddNewOrder(newOrder));
        // setDate(dateFormat());
        validation.resetForm();
      }
      toggle();
    },
  });

  useEffect(() => {
    if (orders && !orders.length) {
      dispatch(onGetOrders());
    }
  }, [dispatch, orders]);

  useEffect(() => {
    setOrder(orders);
  }, [orders]);

  useEffect(() => {
    if (!isEmpty(orders)) {
      setOrder(orders);
      setIsEdit(false);
    }
  }, [orders]);


  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setOrder(null);
    } else {
      setModal(true);
      setDate(dateFormat());
    }
  }, [modal]);

  const handleOrderClicks = () => {
    setOrder("");
    setIsEdit(false);
    toggle();
  };

  const handleOrderClick = useCallback((arg) => {
    const order = arg;
    setOrder({
      id: order.id,
      orderId: order.orderId,
      customer: order.customer,
      productname: order.productname,
      orderDate: order.orderDate,
      ordertime: order.ordertime,
      amount: order.amount,
      payment: order.payment,
      status: order.status
    });

    setIsEdit(true);
    toggle();
  }, [toggle]);


  // Customber Column
  const columns = useMemo(
    () => [
      {
        Header: "#",
        Cell: () => {
          return <input type="checkbox" />;
        },
      },
      {
        Header: "Order Id",
        accessor: "orderId",
        filterable: false,
        Cell: (cell) => {
          return <Link to="/apps-ecommerce-order-details" className="fw-medium link-primary">{cell.value}</Link>;
        },
      },
      {
        Header: "Customer",
        accessor: "customer",
        filterable: false,
      },
      {
        Header: "Product",
        accessor: "productname",
        filterable: false,
      },
      {
        Header: "Order Date",
        accessor: "orderDate",
        Cell: (order) => (
          <>
            {order.row.original.orderDate}
            {/* <small className="text-muted">{order.row.original.ordertime}</small> */}
          </>
        ),
      },
      {
        Header: "Amount",
        accessor: "amount",
        filterable: false,
      },
      {
        Header: "Payment Method",
        accessor: "payment",
        filterable: false,
      },
      {
        Header: 'Delivery Status',
        accessor: 'status',
        Cell: (cell) => {
          switch (cell.value) {
            case "Pending":
              return <span className="badge text-uppercase badge-soft-warning"> {cell.value} </span>;
            case "Cancelled":
              return <span className="badge text-uppercase badge-soft-danger"> {cell.value} </span>;
            case "Inprogress":
              return <span className="badge text-uppercase badge-soft-secondary"> {cell.value} </span>;
            case "Pickups":
              return <span className="badge text-uppercase badge-soft-info"> {cell.value} </span>;
            case "Returns":
              return <span className="badge text-uppercase badge-soft-primary"> {cell.value} </span>;
            case "Delivered":
              return <span className="badge text-uppercase badge-soft-success"> {cell.value} </span>;
            default:
              return <span className="badge text-uppercase badge-soft-warning"> {cell.value} </span>;
          }
        }
      },

      {
        Header: "Action",
        Cell: (cellProps) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item">
                <Link
                  to="apps-ecommerce-order-details"
                  className="text-primary d-inline-block"
                >
                  <i className="ri-eye-fill fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item edit">
                <Link
                  to="#"
                  className="text-primary d-inline-block edit-item-btn"
                  onClick={() => {
                    const orderData = cellProps.row.original;
                    handleOrderClick(orderData);
                  }}
                >
                  <i className="ri-pencil-fill fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item">
                <Link
                  to="#"
                  className="text-danger d-inline-block remove-item-btn"
                  onClick={() => {
                    const orderData = cellProps.row.original;
                    onClickDelete(orderData);
                  }}
                >
                  <i className="ri-delete-bin-5-fill fs-16"></i>
                </Link>
              </li>
            </ul>
          );
        },
      },
    ],
    [handleOrderClick]
  );

  const dateFormat = () => {
    let d = new Date(),
      months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      let h = (d.getHours() % 12) || 12;
      let ampm = d.getHours() < 12 ? "AM" : "PM";
    return ((d.getDate() + ' ' + months[d.getMonth()] + ', ' + d.getFullYear() + ", " + h + ":" + d.getMinutes() + " " + ampm).toString());
  };


  const [date, setDate] = useState(dateFormat());

  const dateformate = (e) => {
    const dateString = e.toString().split(" ");

    let time = dateString[4];
    let H = +time.substr(0, 2);
    let h = (H % 12) || 12;
    h = (h <= 9) ? h = ("0" + h) : h;
    let ampm = H < 12 ? "AM" : "PM";
    time = h + time.substr(2, 3) + " " + ampm;

    const date = dateString[2] + " " + dateString[1] + ", " + dateString[3];
    const orderDate = (date + ", " + time).toString();
    setDate(orderDate);
  };

  document.title = "Orders | Velzon - React Admin & Dashboard Template";
  return (
    <div className="page-content">
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteOrder}
        onCloseClick={() => setDeleteModal(false)}
      />
      <Container fluid>

        <BreadCrumb title="Orders" pageTitle="Ecommerce" />
        <Row>
          <Col lg={12}>
            <Card id="orderList">
              <CardHeader className="card-header border-0">
                <div className="d-flex align-items-center">
                  <h5 className="card-title mb-0 flex-grow-1">Order History</h5>
                  <div className="flex-shrink-0">
                    <button
                      type="button"
                      className="btn btn-success add-btn"
                      id="create-btn"
                      onClick={() => { setIsEdit(false); toggle(); }}
                    >
                      <i className="ri-add-line align-bottom me-1"></i> Create
                      Order
                    </button>{" "}
                    <button type="button" className="btn btn-info">
                      <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                      Import
                    </button>
                    {" "}
                    <button className="btn btn-soft-danger"
                    // onClick="deleteMultiple()"
                    ><i
                      className="ri-delete-bin-2-line"></i></button>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="border border-dashed border-end-0 border-start-0">
                <form>
                  <Row className="g-3">
                    <Col sm={6} className="col-xxl-5">
                      <div className="search-box">
                        <input
                          type="text"
                          className="form-control search"
                          placeholder="Search for order ID, customer, order status or something..."
                        />
                        <i className="ri-search-line search-icon"></i>
                      </div>
                    </Col>

                    <Col sm={6} className="col-xxl-2">
                      <div>
                        <Flatpickr
                          className="form-control"
                          id="datepicker-publish-input"
                          placeholder="Select a date"
                          options={{
                            altInput: true,
                            altFormat: "F j, Y",
                            mode: "multiple",
                            dateFormat: "d.m.y",
                          }}
                        />
                      </div>
                    </Col>

                    <Col sm={4} className="col-xxl-2">
                      <div>
                        <Select
                          value={orderStatus}
                          onChange={() => {
                            handleorderStatus();
                          }}
                          options={orderstatus}
                          name="choices-single-default"
                          id="idStatus"
                        ></Select>
                      </div>
                    </Col>

                    <Col sm={4} className="col-xxl-2">
                      <div>
                        <Select
                          value={orderPayement}
                          onChange={() => {
                            handleorderPayement();
                          }}
                          options={orderpayement}
                          name="choices-payment-default"
                          id="idPayment"
                        ></Select>
                      </div>
                    </Col>

                    <Col sm={4} className="col-xxl-1">
                      <div>
                        <button type="button" className="btn btn-primary w-100">
                          {" "}
                          <i className="ri-equalizer-fill me-1 align-bottom"></i>
                          Filters
                        </button>
                      </div>
                    </Col>
                  </Row>
                </form>
              </CardBody>
              <CardBody className="pt-0">
                <div>
                  <Nav
                    className="nav-tabs nav-tabs-custom nav-success mb-3"
                    role="tablist"
                  >
                    <NavItem>
                      <NavLink
                        className={classnames(
                          { active: activeTab === "1" },
                          "fw-semibold"
                        )}
                        onClick={() => {
                          toggleTab("1", "all");
                        }}
                        href="#"
                      >
                        <i className="ri-store-2-fill me-1 align-bottom"></i>{" "}
                        All Orders
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames(
                          { active: activeTab === "2" },
                          "fw-semibold"
                        )}
                        onClick={() => {
                          toggleTab("2", "Delivered");
                        }}
                        href="#"
                      >
                        <i className="ri-checkbox-circle-line me-1 align-bottom"></i>{" "}
                        Delivered
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames(
                          { active: activeTab === "3" },
                          "fw-semibold"
                        )}
                        onClick={() => {
                          toggleTab("3", "Pickups");
                        }}
                        href="#"
                      >
                        <i className="ri-truck-line me-1 align-bottom"></i>{" "}
                        Pickups{" "}
                        <span className="badge bg-danger align-middle ms-1">
                          2
                        </span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames(
                          { active: activeTab === "4" },
                          "fw-semibold"
                        )}
                        onClick={() => {
                          toggleTab("4", "Returns");
                        }}
                        href="#"
                      >
                        <i className="ri-arrow-left-right-fill me-1 align-bottom"></i>{" "}
                        Returns
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames(
                          { active: activeTab === "5" },
                          "fw-semibold"
                        )}
                        onClick={() => {
                          toggleTab("5", "Cancelled");
                        }}
                        href="#"
                      >
                        <i className="ri-close-circle-line me-1 align-bottom"></i>{" "}
                        Cancelled
                      </NavLink>
                    </NavItem>
                  </Nav>

                  <TableContainer
                    columns={columns}
                    data={orderList}
                    isGlobalFilter={false}
                    isAddUserList={false}
                    customPageSize={8}
                    divClass="table-responsive table-card mb-1"
                    tableClass="align-middle table-nowrap"
                    theadClass="table-light text-muted text-uppercase"
                    handleOrderClick={handleOrderClicks}
                  />
                </div>
                <Modal id="showModal" isOpen={modal} toggle={toggle} centered>
                  <ModalHeader className="bg-light p-3" toggle={toggle}>
                    {!!isEdit ? "Edit Order" : "Add Order"}
                  </ModalHeader>
                  <Form onSubmit={(e) => {
                    e.preventDefault();
                    validation.handleSubmit();
                    return false;
                  }}>
                    <ModalBody>
                      <input type="hidden" id="id-field" />

                      <div className="mb-3">
                        <Label
                          htmlFor="id-field"
                          className="form-label"
                        >
                          Order Id
                        </Label>
                        <Input
                          name="orderId"
                          id="id-field"
                          className="form-control"
                          placeholder="Enter Order Id"
                          type="text"
                          validate={{
                            required: { value: true },
                          }}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.orderId || ""}
                          invalid={
                            validation.touched.orderId && validation.errors.orderId ? true : false
                          }
                        />
                        {validation.touched.orderId && validation.errors.orderId ? (
                          <FormFeedback type="invalid">{validation.errors.orderId}</FormFeedback>
                        ) : null}

                      </div>

                      <div className="mb-3">
                        <Label
                          htmlFor="customername-field"
                          className="form-label"
                        >
                          Customer Name
                        </Label>
                        <Input
                          name="customer"
                          id="customername-field"
                          className="form-control"
                          placeholder="Enter Name"
                          type="text"
                          validate={{
                            required: { value: true },
                          }}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.customer || ""}
                          invalid={
                            validation.touched.customer && validation.errors.customer ? true : false
                          }
                        />
                        {validation.touched.customer && validation.errors.customer ? (
                          <FormFeedback type="invalid">{validation.errors.customer}</FormFeedback>
                        ) : null}

                      </div>

                      <div className="mb-3">
                        <Label
                          htmlFor="productname-field"
                          className="form-label"
                        >
                          Product
                        </Label>

                        <Input
                          name="productname"
                          type="select"
                          className="form-select"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={
                            validation.values.productname || ""
                          }
                        >
                          {productname.map((item, key) => (
                            <React.Fragment key={key}>
                              {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                            </React.Fragment>
                          ))}
                        </Input>
                        {validation.touched.productname &&
                          validation.errors.productname ? (
                          <FormFeedback type="invalid">
                            {validation.errors.productname}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label htmlFor="date-field" className="form-label">
                          Order Date
                        </Label>

                        <Flatpickr
                          name="orderDate"
                          className="form-control"
                          id="datepicker-publish-input"
                          placeholder="Select a date"
                          options={{
                            enableTime: true,
                            altInput: true,
                            altFormat: "d M, Y, G:i K",
                            dateFormat: "d M, Y, G:i K",
                          }}
                          onChange={(e) =>
                            dateformate(e)
                          }
                          value={validation.values.orderDate || ""}
                        />

                        {validation.touched.orderDate && validation.errors.orderDate ? (
                          <FormFeedback type="invalid">{validation.errors.orderDate}</FormFeedback>
                        ) : null}
                      </div>

                      {/* <div className="mb-3">
                        <Label htmlFor="date-field" className="form-label">
                          Order Time
                        </Label>

                        <Input
                          name="ordertime"
                          type="time"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.ordertime || ""}
                          invalid={
                            validation.touched.ordertime && validation.errors.ordertime ? true : false
                          }
                        />

                        {validation.touched.ordertime && validation.errors.ordertime ? (
                          <FormFeedback type="invalid">{validation.errors.ordertime}</FormFeedback>
                        ) : null}
                      </div> */}

                      <div className="row gy-4 mb-3">
                        <div className="col-md-6">
                          <div>
                            <Label
                              htmlFor="amount-field"
                              className="form-label"
                            >
                              Amount
                            </Label>
                            <Input
                              name="amount"
                              type="text"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.amount || ""}
                              invalid={
                                validation.touched.amount && validation.errors.amount ? true : false
                              }
                            />
                            {validation.touched.amount && validation.errors.amount ? (
                              <FormFeedback type="invalid">{validation.errors.amount}</FormFeedback>
                            ) : null}

                          </div>
                        </div>
                        <div className="col-md-6">
                          <div>
                            <Label
                              htmlFor="payment-field"
                              className="form-label"
                            >
                              Payment Method
                            </Label>

                            <Input
                              name="payment"
                              type="select"
                              className="form-select"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={
                                validation.values.payment || ""
                              }
                            >
                              {orderpayement.map((item, key) => (
                                <React.Fragment key={key}>
                                  {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                </React.Fragment>
                              ))}
                            </Input>
                            {validation.touched.payment &&
                              validation.errors.payment ? (
                              <FormFeedback type="invalid">
                                {validation.errors.payment}
                              </FormFeedback>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor="delivered-status"
                          className="form-label"
                        >
                          Delivery Status
                        </Label>

                        <Input
                          name="status"
                          type="select"
                          className="form-select"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={
                            validation.values.status || ""
                          }
                        >
                          {orderstatus.map((item, key) => (
                            <React.Fragment key={key}>
                              {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                            </React.Fragment>
                          ))}
                        </Input>
                        {validation.touched.status &&
                          validation.errors.status ? (
                          <FormFeedback type="invalid">
                            {validation.errors.status}
                          </FormFeedback>
                        ) : null}

                      </div>
                    </ModalBody>
                    <div className="modal-footer">
                      <div className="hstack gap-2 justify-content-end">
                        <button
                          type="button"
                          className="btn btn-light"
                          onClick={() => {
                            setModal(false);
                          }}
                        >
                          Close
                        </button>

                        <button type="submit" className="btn btn-success">
                          {!!isEdit
                            ? "Update"
                            : "Add Customer"}
                        </button>
                      </div>
                    </div>
                  </Form>
                </Modal>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EcommerceOrders;



import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Col,
  Container,
  Row,
  Card,
  CardHeader,
  CardBody,
  Input,
  ModalHeader,
  ModalBody,
  Label,
  ModalFooter,
  Modal,
  Form,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  FormFeedback,
} from "reactstrap";
import Select from "react-select";
import Flatpickr from "react-flatpickr";

import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { isEmpty } from "lodash";

// Import Images
import dummyImg from "../../../assets/images/users/user-dummy-img.jpg";

//Import actions
import {
  getLeads as onGetLeads,
  addNewLead as onAddNewLead,
  updateLead as onUpdateLead,
  deleteLead as onDeleteLead,
} from "../../../store/actions";
//redux
import { useSelector, useDispatch } from "react-redux";
import TableContainer from "../../../Components/Common/TableContainer";
import DeleteModal from "../../../Components/Common/DeleteModal";
import CrmFilter from "./CrmFilter";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

const CrmLeads = () => {
  const dispatch = useDispatch();
  const { leads } = useSelector((state) => ({
    leads: state.Crm.leads,
  }));

  useEffect(() => {
    if (leads && !leads.length) {
      dispatch(onGetLeads());
    }
  }, [dispatch, leads]);

  useEffect(() => {
    dispatch(onGetLeads());
  }, [dispatch]);

  useEffect(() => {
    setLead(leads);
  }, [leads]);

  useEffect(() => {
    if (!isEmpty(leads)) {
      setLead(leads);
      setIsEdit(false);
    }
  }, [leads]);

  const [isEdit, setIsEdit] = useState(false);
  const [lead, setLead] = useState([]);

  //delete lead
  const [deleteModal, setDeleteModal] = useState(false);
  const [modal, setModal] = useState(false);

  const [isInfoDetails, setIsInfoDetails] = useState(false);

  // const tags = ["Exiting", "Lead", "Long-term", "Partner"];

  const [tag, setTag] = useState([]);

  function handlestag(tags) {
    setTag(tags);
  }

  const tags = [
    { label: "Exiting", value: "Exiting" },
    { label: "Lead", value: "Lead" },
    { label: "Long-term", value: "Long-term" },
    { label: "Partner", value: "Partner" }
  ];

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setLead(null);
    } else {
      setModal(true);
      setDate(dateFormat());
    }
  }, [modal]);

  // Delete Data
  const handleDeleteLead = () => {
    if (lead.id) {
      dispatch(onDeleteLead(lead));
      setDeleteModal(false);
    }
  };

  const onClickDelete = (lead) => {
    setLead(lead);
    setDeleteModal(true);
  };

  // Add Data
  const handleLeadClicks = () => {
    setLead("");
    setIsEdit(false);
    toggle();
  };

  const toggleInfo = () => {
    setIsInfoDetails(!isInfoDetails);
  };

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      // leadsId: (lead && lead.leadsId) || '',
      // img: (lead && lead.img) || '',
      name: (lead && lead.name) || '',
      company: (lead && lead.company) || '',
      score: (lead && lead.score) || '',
      phone: (lead && lead.phone) || '',
      location: (lead && lead.location) || '',
      date: (lead && lead.date) || '',
      tags: (lead && lead.tags) || '',
    },
    validationSchema: Yup.object({
      // leadsId: Yup.string().required("Please Enter leads Id"),
      name: Yup.string().required("Please Enter Name"),
      company: Yup.string().required("Please Enter Company"),
      score: Yup.string().required("Please Enter Score"),
      phone: Yup.string().required("Please Enter Phone"),
      location: Yup.string().required("Please Enter Location"),
      // date: Yup.string().required("Please Enter Date"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateLead = {
          id: lead ? lead.id : 0,
          // leadsId: values.leadsId,
          // img: values.img,
          name: values.name,
          company: values.company,
          score: values.score,
          phone: values.phone,
          location: values.location,
          date: date,
          tags: [...tag],
        };
        // update Company
        dispatch(onUpdateLead(updateLead));
        validation.resetForm();
        setTag([]);
      } else {
        const newLead = {
          id: Math.floor(Math.random() * (30 - 20)) + 20,
          // leadsId: values["leadsId"],
          // img: values["img"],
          name: values["name"],
          company: values["company"],
          score: values["score"],
          phone: values["phone"],
          location: values["location"],
          date: date,
          tags: [...tag],
        };
        // save new Lead
        dispatch(onAddNewLead(newLead));
        validation.resetForm();
        setTag([]);
      }
      toggle();
    },
  });

  // Update Data
  const handleLeadClick = useCallback((arg) => {
    const lead = arg;

    setLead({
      id: lead.id,
      // leadsId: lead.leadsId,
      // img: lead.img,
      name: lead.name,
      company: lead.company,
      score: lead.score,
      phone: lead.phone,
      location: lead.location,
      date: lead.date,
      tags: lead.tags,
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
          return (
            <div className="form-check">
              <input className="form-check-input" type="checkbox" name="checkAll" value="option1" />
            </div>
          );
        },
      },
      {
        Header: "Name",
        accessor: "name",
        filterable: false,
        Cell: (leads) => (
          <>
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                {leads.row.original.img ? <img
                  src={leads.row.original.img}
                  alt=""
                  className="avatar-xxs rounded-circle"
                /> :
                  <div className="flex-shrink-0 avatar-xs me-2">
                    <div className="avatar-title bg-soft-success text-success rounded-circle fs-13">
                      {leads.row.original.name.charAt(0)}
                    </div>
                  </div>
                  // <img src={dummyImg} alt="" className="avatar-xxs rounded-circle" />
                }
              </div>
              <div className="flex-grow-1 ms-2 name">
                {leads.row.original.name}
              </div>
            </div>
          </>
        ),
      },
      {
        Header: "Company",
        accessor: "company",
        filterable: false,
      },
      {
        Header: "Leads Score",
        accessor: "score",
        filterable: false,
      },
      {
        Header: "Phone",
        accessor: "phone",
        filterable: false,
      },
      {
        Header: "Location",
        accessor: "location",
        filterable: false,
      },
      {
        Header: "Tags",
        Cell: (leads) => (
          <>
            {leads.row.original.tags.map((item, key) => (<span className="badge badge-soft-primary me-1" key={key}>{item.value}</span>))}
          </>
        ),
      },
      {
        Header: "Create Date",
        accessor: "date",
        filterable: false,
      },
      {
        Header: "Action",
        Cell: (cellProps) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item edit" title="Call">
                <Link
                  to="#"
                  className="text-muted d-inline-block"
                // onClick={toggle}
                >
                  <i className="ri-phone-line fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item edit" title="Message">
                <Link to="#" className="text-muted d-inline-block">
                  <i className="ri-question-answer-line fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="View">
                <Link to="#">
                  <i className="ri-eye-fill align-bottom text-muted"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="Edit">
                <Link className="edit-item-btn" to="#"
                  onClick={() => { const LeadData = cellProps.row.original; handleLeadClick(LeadData); }}
                >
                  <i className="ri-pencil-fill align-bottom text-muted"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="Delete">
                <Link
                  className="remove-item-btn"
                  onClick={() => { const LeadData = cellProps.row.original; onClickDelete(LeadData); }}
                  to="#"
                >
                  <i className="ri-delete-bin-fill align-bottom text-muted"></i>
                </Link>
              </li>
            </ul>
          );
        },
      },
    ],
    [handleLeadClick]
  );

  const dateFormat = () => {
    let d = new Date(),
      months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return ((d.getDate() + ' ' + months[d.getMonth()] + ', ' + d.getFullYear()).toString());
  };

  const [date, setDate] = useState(dateFormat());

  const dateformate = (e) => {
    const date = e.toString().split(" ");
    const joinDate = (date[2] + " " + date[1] + ", " + date[3]).toString();
    setDate(joinDate);
  };

  document.title = "Leads | Velzon - React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteLead}
          onCloseClick={() => setDeleteModal(false)}
        />

        <Container fluid>
          <BreadCrumb title="Leads" pageTitle="CRM" />
          <Row>
            <Col lg={12}>
              <Card id="leadsList">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    <Col sm={3}>
                      <div className="search-box">
                        <Input
                          type="text"
                          className="form-control search"
                          placeholder="Search for..."
                        />
                        <i className="ri-search-line search-icon"></i>
                      </div>
                    </Col>
                    <div className="col-sm-auto ms-auto">
                      <div className="hstack gap-2">
                        <button className="btn btn-soft-danger"
                        // onClick="deleteMultiple()"
                        ><i className="ri-delete-bin-2-line"></i></button>
                        <button type="button" className="btn btn-info" onClick={toggleInfo}>
                          <i className="ri-filter-3-line align-bottom me-1"></i>{" "}
                          Fliters
                        </button>
                        <button
                          type="button"
                          className="btn btn-success add-btn"
                          id="create-btn"
                          onClick={() => { setIsEdit(false); toggle(); }}
                        >
                          <i className="ri-add-line align-bottom me-1"></i> Add
                          Leads
                        </button>
                        <UncontrolledDropdown>
                          <DropdownToggle
                            className="btn btn-soft-info btn-icon fs-14"
                            type="button"
                            id="dropdownMenuButton1"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <i className="ri-settings-4-line"></i>
                          </DropdownToggle>
                          <DropdownMenu
                          >
                            <li>
                              <DropdownItem>
                                Copy
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem>
                                Move to pipline
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem>
                                Add to exceptions
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem>
                                Switch to common form view
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem>
                                Reset form view to default
                              </DropdownItem>
                            </li>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </div>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div>
                    <TableContainer
                      columns={columns}
                      data={leads}
                      isGlobalFilter={false}
                      isAddUserList={false}
                      customPageSize={10}
                      className="custom-header-css"
                      divClass="table-responsive table-card mb-3"
                      tableClass="align-middle table-nowrap"
                      theadClass="table-light"
                      handleLeadClick={handleLeadClicks}
                    />
                  </div>

                  <Modal id="showModal" isOpen={modal} toggle={toggle} centered>
                    <ModalHeader className="bg-light p-3" toggle={toggle}>
                      {!!isEdit ? "Edit Lead" : "Add Lead"}
                    </ModalHeader>
                    <Form onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}>
                      <ModalBody>
                        <Input type="hidden" id="id-field" />
                        <Row className="g-3">
                          <Col lg={12}>
                            <div className="text-center">
                              <div className="position-relative d-inline-block">
                                <div className="position-absolute bottom-0 end-0">
                                  <Label htmlFor="lead-image-input" className="mb-0">
                                    <div className="avatar-xs cursor-pointer">
                                      <div className="avatar-title bg-light border rounded-circle text-muted">
                                        <i className="ri-image-fill"></i>
                                      </div>
                                    </div>
                                  </Label>
                                  <Input className="form-control d-none" id="lead-image-input" type="file"
                                    accept="image/png, image/gif, image/jpeg"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.img || ""}
                                    invalid={
                                      validation.touched.img && validation.errors.img ? true : false
                                    }
                                  />
                                </div>
                                <div className="avatar-lg p-1">
                                  <div className="avatar-title bg-light rounded-circle">
                                    <img src={dummyImg} alt="dummyImg" id="lead-img" className="avatar-md rounded-circle object-cover" />
                                  </div>
                                </div>
                              </div>
                              <h5 className="fs-13 mt-3">Lead Image</h5>
                            </div>
                            <div>
                              <Label
                                htmlFor="name-field"
                                className="form-label"
                              >
                                Name
                              </Label>
                              <Input
                                name="name"
                                id="customername-field"
                                className="form-control"
                                placeholder="Enter Name"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.name || ""}
                                invalid={
                                  validation.touched.name && validation.errors.name ? true : false
                                }
                              />
                              {validation.touched.name && validation.errors.name ? (
                                <FormFeedback type="invalid">{validation.errors.name}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="company_name-field"
                                className="form-label"
                              >
                                Company Name
                              </Label>
                              <Input
                                name="company"
                                id="company_name-field"
                                className="form-control"
                                placeholder="Enter Company Name"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.company || ""}
                                invalid={
                                  validation.touched.company && validation.errors.company ? true : false
                                }
                              />
                              {validation.touched.company && validation.errors.company ? (
                                <FormFeedback type="invalid">{validation.errors.company}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div>
                              <Label
                                htmlFor="leads_score-field"
                                className="form-label"
                              >
                                Leads Score
                              </Label>
                              <Input
                                name="score"
                                id="company_name-field"
                                className="form-control"
                                placeholder="Enter Score"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.score || ""}
                                invalid={
                                  validation.touched.score && validation.errors.score ? true : false
                                }
                              />
                              {validation.touched.score && validation.errors.score ? (
                                <FormFeedback type="invalid">{validation.errors.score}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div>
                              <Label
                                htmlFor="phone-field"
                                className="form-label"
                              >
                                Phone
                              </Label>
                              <Input
                                name="phone"
                                id="phone-field"
                                className="form-control"
                                placeholder="Enter Phone Number"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.phone || ""}
                                invalid={
                                  validation.touched.phone && validation.errors.phone ? true : false
                                }
                              />
                              {validation.touched.phone && validation.errors.phone ? (
                                <FormFeedback type="invalid">{validation.errors.phone}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="location-field"
                                className="form-label"
                              >
                                Location
                              </Label>
                              <Input
                                name="location"
                                id="location-field"
                                className="form-control"
                                placeholder="Enter Location"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.location || ""}
                                invalid={
                                  validation.touched.location && validation.errors.location ? true : false
                                }
                              />
                              {validation.touched.location && validation.errors.location ? (
                                <FormFeedback type="invalid">{validation.errors.location}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="taginput-choices"
                                className="form-label"
                              >
                                Tags
                              </Label>

                              <Select
                                isMulti
                                value={tag}
                                onChange={(e) => {
                                  handlestag(e);
                                }}
                                className="mb-0"
                                options={tags}
                                id="taginput-choices"
                              >
                              </Select>

                              {validation.touched.tags &&
                                validation.errors.tags ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.tags}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="date-field"
                                className="form-label"
                              >
                                Created Date
                              </Label>

                              <Flatpickr
                                name="date"
                                id="datepicker-publish-input"
                                className="form-control"
                                placeholder="Select a date"
                                options={{
                                  altInput: true,
                                  altFormat: "d M, Y",
                                  dateFormat: "d M, Y",
                                }}
                                onChange={(e) =>
                                  dateformate(e)
                                }
                                value={validation.values.date || ""}
                              />
                              {validation.touched.date && validation.errors.date ? (
                                <FormFeedback type="invalid">{validation.errors.date}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                        </Row>
                      </ModalBody>
                      <ModalFooter>
                        <div className="hstack gap-2 justify-content-end">
                          <button type="button" className="btn btn-light" onClick={() => { setModal(false); }} > Close </button>
                          <button type="submit" className="btn btn-success" id="add-btn"> {!!isEdit ? "Update" : "Add Lead"} </button>
                        </div>
                      </ModalFooter>
                    </Form>
                  </Modal>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <CrmFilter
        show={isInfoDetails}
        onCloseClick={() => setIsInfoDetails(false)}
      />
    </React.Fragment>
  );
};

export default CrmLeads;
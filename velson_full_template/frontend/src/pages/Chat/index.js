import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  Button,
  UncontrolledTooltip,
  Input,
  DropdownToggle,
  DropdownMenu,
  Dropdown,
  DropdownItem,
  Row,
  Col,
  Card,
  CardBody,
  UncontrolledDropdown
} from "reactstrap";
import { Link } from "react-router-dom";
import { isEmpty, map } from "lodash";
import SimpleBar from "simplebar-react";

//Import Icons
import FeatherIcon from "feather-icons-react";
import PersonalInfo from "./PersonalInfo";

//redux
import { useSelector, useDispatch } from "react-redux";
import {
  getDirectContact as onGetDirectContact,
  getMessages,
  getChannels as onGetChannels,
  addMessage as onAddMessage,
} from "../../store/actions";

import avatar2 from "../../assets/images/users/avatar-2.jpg";
import userDummayImage from "../../assets/images/users/user-dummy-img.jpg";

//Import Scrollbar
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

const Chat = () => {
  document.title="Chat | Velzon - React Admin & Dashboard Template";

  const ref = useRef();
  const dispatch = useDispatch();
  const [isInfoDetails, setIsInfoDetails] = useState(false);
  const [Chat_Box_Username, setChat_Box_Username] = useState("Lisa Parker");
  const [Chat_Box_Image, setChat_Box_Image] = useState(avatar2);
  const [currentRoomId, setCurrentRoomId] = useState(1);
  const [messageBox, setMessageBox] = useState(null);
  const [curMessage, setcurMessage] = useState("");
  const [search_Menu, setsearch_Menu] = useState(false);
  const [settings_Menu, setsettings_Menu] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: "Henry Wells",
    isActive: true,
  });

  const { chats, messages, channels } = useSelector((state) => ({
    chats: state.chat.chats,
    messages: state.chat.messages,
    channels: state.chat.channels,
  }));
  //Toggle Chat Box Menus
  const toggleSearch = () => {
    setsearch_Menu(!search_Menu);
  };

  //Info details offcanvas
  const toggleInfo = () => {
    setIsInfoDetails(!isInfoDetails);
  };

  const toggleSettings = () => {
    setsettings_Menu(!settings_Menu);
  };
  useEffect(() => {
    dispatch(onGetDirectContact());
    dispatch(onGetChannels());
    dispatch(getMessages(currentRoomId));
  }, [dispatch, currentRoomId]);

  useEffect(() => {
    ref.current.recalculate();
  });


  //Use For Chat Box
  const userChatOpen = (id, name, status, roomId, image) => {
    setChat_Box_Username(name);
    setCurrentRoomId(roomId);
    setChat_Box_Image(image);
    dispatch(getMessages(roomId));
  };

  const addMessage = (roomId, sender) => {
    const message = {
      id: Math.floor(Math.random() * 100),
      roomId,
      sender,
      message: curMessage,
      createdAt: new Date(),
    };
    setcurMessage("");
    dispatch(onAddMessage(message));
    scrollToBottom(message);
  };
  const scrollToBottom = (message) => {
    if (message) {
      message.scrollTop = message.scrollHeight + 1000;
    }
  };


  const onKeyPress = (e) => {
    const { key, value } = e;
    if (key === "Enter") {
      setcurMessage(value);
      addMessage(currentRoomId, currentUser.name);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>         
          <div className="chat-wrapper d-lg-flex gap-1 mx-n4 mt-n4 p-1">
            <div className="chat-leftsidebar">
              <div className="px-4 pt-4 mb-4">
                <div className="d-flex align-items-start">
                  <div className="flex-grow-1">
                    <h5 className="mb-4">Chats</h5>
                  </div>
                  <div className="flex-shrink-0">
                    <UncontrolledTooltip placement="bottom" target="addcontact">
                      Add Contact
                    </UncontrolledTooltip>

                    <Button
                      color=""
                      id="addcontact"
                      className="btn btn-soft-success btn-sm"
                    >
                      <i className="ri-add-line align-bottom"></i>
                    </Button>
                  </div>
                </div>
                <div className="search-box">
                  <input
                    type="text"
                    className="form-control bg-light border-light"
                    placeholder="Search here..."
                  />
                  <i className="ri-search-2-line search-icon"></i>
                </div>
              </div>

              <PerfectScrollbar
                className="chat-room-list"
              >
                <div className="d-flex align-items-center px-4 mb-2">
                  <div className="flex-grow-1">
                    <h4 className="mb-0 fs-12 text-muted text-uppercase">
                      Direct Messages
                    </h4>
                  </div>
                  <div className="flex-shrink-0">
                    <UncontrolledTooltip placement="bottom" target="addnewmsg">
                      New Message
                    </UncontrolledTooltip>

                    <button
                      type="button"
                      id="addnewmsg"
                      className="btn btn-soft-success btn-sm"
                    >
                      <i className="ri-add-line align-bottom"></i>
                    </button>
                  </div>
                </div>

                <div className="chat-message-list">
                  <ul
                    className="list-unstyled chat-list chat-user-list"
                    id="userList"
                  >
                    {(chats || []).map((chat) => (
                      <li
                        key={chat.id + chat.status}
                        className={
                          currentRoomId === chat.roomId ? "active" : ""
                        }
                      >
                        <Link
                          to="#"
                          onClick={(e) => {
                            userChatOpen(
                              chat.id,
                              chat.name,
                              chat.status,
                              chat.roomId,
                              chat.image
                            );
                          }}
                        >
                          <div className="d-flex align-items-center">
                            <div className="flex-shrink-0 chat-user-img online align-self-center me-2 ms-0">
                              <div className="avatar-xxs">
                                {chat.image ? (
                                  <img
                                    src={chat.image}
                                    className="rounded-circle img-fluid userprofile"
                                    alt=""
                                  />
                                ) : (
                                  <div
                                    className={
                                      "avatar-title rounded-circle bg-" +
                                      chat.bgColor +
                                      " userprofile"
                                    }
                                  >
                                    {chat.name.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <span className="user-status"></span>
                            </div>
                            <div className="flex-grow-1 overflow-hidden">
                              <p className="text-truncate mb-0">{chat.name}</p>
                            </div>
                            {chat.badge && <div className="flex-shrink-0">
                              <span className="badge badge-soft-dark rounded p-1">{chat.badge}</span>
                            </div>}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="d-flex align-items-center px-4 mt-4 pt-2 mb-2">
                  <div className="flex-grow-1">
                    <h4 className="mb-0 fs-12 text-muted text-uppercase">
                      Channels
                    </h4>
                  </div>
                  <div className="flex-shrink-0">
                    <UncontrolledTooltip
                      placement="bottom"
                      target="createnewmsg"
                    >
                      Create group
                    </UncontrolledTooltip>
                    <Button
                      color=""
                      id="createnewmsg"
                      className="btn btn-soft-success btn-sm"
                    >
                      <i className="ri-add-line align-bottom"></i>
                    </Button>
                  </div>
                </div>

                <div className="chat-message-list">
                  <ul
                    className="list-unstyled chat-list chat-user-list mb-0"
                    id="channelList"
                  >
                    {channels.map((channel, key) => (
                      <React.Fragment key={key}>
                        <li>
                          <Link to="#" className="unread-msg-user">
                            <div className="d-flex align-items-center">
                              <div className="flex-shrink-0 chat-user-img online align-self-center me-2 ms-0">
                                <div className="avatar-xxs">
                                  <div className="avatar-title bg-light rounded-circle text-body">
                                    #
                                  </div>
                                </div>
                              </div>
                              <div className="flex-grow-1 overflow-hidden">
                                <p className="text-truncate mb-0">
                                  {channel.name}
                                </p>
                              </div>
                              {channel.unReadMessage && (
                                <div className="flex-shrink-0">
                                  <span className="badge badge-soft-dark rounded p-1">
                                    {channel.unReadMessage}
                                  </span>
                                </div>
                              )}
                            </div>
                          </Link>
                        </li>
                      </React.Fragment>
                    ))}
                  </ul>
                </div>
              </PerfectScrollbar>
            </div>

            <div className="user-chat w-100 overflow-hidden">
              <div className="chat-content d-lg-flex">
                <div className="w-100 overflow-hidden position-relative">
                  <div className="position-relative">
                    <div className="p-3 user-chat-topbar">
                      <Row className="align-items-center">
                        <Col sm={4} xs={8}>
                          <div className="d-flex align-items-center">
                            <div className="flex-shrink-0 d-block d-lg-none me-3">
                              <Link
                                to="#"
                                className="user-chat-remove fs-18 p-1"
                              >
                                <i className="ri-arrow-left-s-line align-bottom"></i>
                              </Link>
                            </div>
                            <div className="flex-grow-1 overflow-hidden">
                              <div className="d-flex align-items-center">
                                <div className="flex-shrink-0 chat-user-img online user-own-img align-self-center me-3 ms-0">
                                  {Chat_Box_Image === undefined ? (
                                    <img
                                      src={userDummayImage}
                                      className="rounded-circle avatar-xs"
                                      alt=""
                                    />
                                  ) : (
                                    <img
                                      src={Chat_Box_Image}
                                      className="rounded-circle avatar-xs"
                                      alt=""
                                    />
                                  )}
                                  <span className="user-status"></span>
                                </div>
                                <div className="flex-grow-1 overflow-hidden">
                                  <h5 className="text-truncate mb-0 fs-16">
                                    <a
                                      className="text-reset username"
                                      data-bs-toggle="offcanvas"
                                      href="#userProfileCanvasExample"
                                      aria-controls="userProfileCanvasExample"
                                    >
                                      {Chat_Box_Username}
                                    </a>
                                  </h5>
                                  <p className="text-truncate text-muted mb-0 userStatus">
                                    <span>Online</span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col sm={8} xs={4}>
                          <ul className="list-inline user-chat-nav text-end mb-0">
                            <li className="list-inline-item m-0">
                              <Dropdown
                                isOpen={search_Menu}
                                toggle={toggleSearch}
                              >
                                <DropdownToggle
                                  className="btn btn-ghost-secondary btn-icon"
                                  tag="button"
                                >
                                  <FeatherIcon
                                    icon="search"
                                    className="icon-sm"
                                  />
                                </DropdownToggle>
                                <DropdownMenu className="p-0 dropdown-menu-end dropdown-menu-lg">
                                  <div className="p-2">
                                    <div className="search-box">
                                      <Input
                                        type="text"
                                        className="form-control bg-light border-light"
                                        placeholder="Search here..."
                                        id="searchMessage"
                                      />
                                      <i className="ri-search-2-line search-icon"></i>
                                    </div>
                                  </div>
                                </DropdownMenu>
                              </Dropdown>
                            </li>

                            <li className="list-inline-item d-none d-lg-inline-block m-0">
                              <button
                                type="button"
                                className="btn btn-ghost-secondary btn-icon"
                                onClick={toggleInfo}
                              >
                                <FeatherIcon icon="info" className="icon-sm" />
                              </button>
                            </li>

                            <li className="list-inline-item m-0">
                              <Dropdown
                                isOpen={settings_Menu}
                                toggle={toggleSettings}
                              >
                                <DropdownToggle
                                  className="btn btn-ghost-secondary btn-icon"
                                  tag="button"
                                >
                                  <FeatherIcon
                                    icon="more-vertical"
                                    className="icon-sm"
                                  />
                                </DropdownToggle>
                                <DropdownMenu>
                                  <DropdownItem
                                    href="#"
                                    className="d-block d-lg-none user-profile-show"
                                  >
                                    <i className="ri-user-2-fill align-bottom text-muted me-2"></i>{" "}
                                    View Profile
                                  </DropdownItem>
                                  <DropdownItem href="#">
                                    <i className="ri-inbox-archive-line align-bottom text-muted me-2"></i>{" "}
                                    Archive
                                  </DropdownItem>
                                  <DropdownItem href="#">
                                    <i className="ri-mic-off-line align-bottom text-muted me-2"></i>{" "}
                                    Muted
                                  </DropdownItem>
                                  <DropdownItem href="#">
                                    {" "}
                                    <i className="ri-delete-bin-5-line align-bottom text-muted me-2"></i>{" "}
                                    Delete
                                  </DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                            </li>
                          </ul>
                        </Col>
                      </Row>
                    </div>

                    <div className="position-relative" id="users-chat">
                      <SimpleBar
                        ref={ref}
                        className="chat-conversation p-3 p-lg-4 "
                        id="chat-conversation"
                      >
                        <ul
                          className="list-unstyled chat-conversation-list"
                          id="users-conversation"
                        >
                          {messages &&
                            map(messages, (message, key) => (
                              <li
                                className={
                                  message.sender === Chat_Box_Username
                                    ? " chat-list left"
                                    : "chat-list right"
                                }
                                key={key}
                              >
                                <div className="conversation-list">
                                  {message.sender === Chat_Box_Username && (
                                    <div className="chat-avatar">
                                      {Chat_Box_Image === undefined ?
                                        <img
                                          src={userDummayImage}
                                          alt=""
                                        />
                                        :
                                        <img
                                          src={Chat_Box_Image}
                                          alt=""
                                        />
                                      }
                                    </div>
                                  )}

                                  <div className="user-chat-content">
                                    <div className="ctext-wrap">
                                      <div className="ctext-wrap-content">
                                        <p className="mb-0 ctext-content">
                                          {message.message}
                                        </p>
                                      </div>
                                      <UncontrolledDropdown className="align-self-start message-box-drop">
                                        <DropdownToggle
                                          href="#"
                                          className="btn nav-btn"
                                          tag="i"
                                        >
                                          <i className="ri-more-2-fill"></i>
                                        </DropdownToggle>
                                        <DropdownMenu>
                                          <DropdownItem href="#" className="reply-message">
                                            <i className="ri-reply-line me-2 text-muted align-bottom"></i>
                                            Reply
                                          </DropdownItem>
                                          <DropdownItem href="#">
                                            <i className="ri-share-line me-2 text-muted align-bottom"></i>
                                            Forward
                                          </DropdownItem>
                                          <DropdownItem href="#">
                                            <i className="ri-file-copy-line me-2 text-muted align-bottom"></i>
                                            Copy
                                          </DropdownItem>
                                          <DropdownItem href="#">
                                            <i className="ri-bookmark-line me-2 text-muted align-bottom"></i>
                                            Bookmark
                                          </DropdownItem>
                                          <DropdownItem href="#">
                                            <i className="ri-delete-bin-5-line me-2 text-muted align-bottom"></i>
                                            Delete
                                          </DropdownItem>
                                        </DropdownMenu>
                                      </UncontrolledDropdown>
                                    </div>
                                    <div className="conversation-name">
                                      <small className="text-muted time">
                                        09:07 am
                                      </small>{" "}
                                      <span className="text-success check-message-icon">
                                        <i className="ri-check-double-line align-bottom"></i>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                        </ul>
                      </SimpleBar>
                      <div
                        className="alert alert-warning alert-dismissible copyclipboard-alert px-4 fade show "
                        id="copyClipBoard"
                        role="alert"
                      >
                        Message copied
                      </div>
                    </div>

                    <div className="chat-input-section p-3 p-lg-4">
                      <form id="chatinput-form">
                        <Row className="g-0 align-items-center">
                          <div className="col-auto">
                            <div className="chat-input-links me-2">
                              <div className="links-list-item">
                                <button
                                  type="button"
                                  className="btn btn-link text-decoration-none emoji-btn"
                                  id="emoji-btn"
                                >
                                  <i className="bx bx-smile align-middle"></i>
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="col">
                            <div className="chat-input-feedback">
                              Please Enter a Message
                            </div>
                            <input
                              type="text"
                              value={curMessage}
                              onKeyPress={onKeyPress}
                              onChange={e => setcurMessage(e.target.value)}
                              className="form-control chat-input bg-light border-light"
                              id="chat-input"
                              placeholder="Type your message..."
                            />
                          </div>
                          <div className="col-auto">
                            <div className="chat-input-links ms-2">
                              <div className="links-list-item">
                                <Button
                                  type="button"
                                  color="success"
                                  onClick={() =>
                                    addMessage(currentRoomId, currentUser.name)
                                  }
                                  className="chat-send waves-effect waves-light"
                                >
                                  <i className="ri-send-plane-2-fill align-bottom"></i>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Row>
                      </form>
                    </div>

                    <div className="replyCard">
                      <Card className="mb-0">
                        <CardBody className="py-3">
                          <div className="replymessage-block mb-0 d-flex align-items-start">
                            <div className="flex-grow-1">
                              {/* <h5 className="conversation-name"></h5> */}
                              <p className="mb-0"></p>
                            </div>
                            <div className="flex-shrink-0">
                              <button
                                type="button"
                                id="close_toggle"
                                className="btn btn-sm btn-link mt-n2 me-n3 fs-18"
                              >
                                <i className="bx bx-x align-middle"></i>
                              </button>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <PersonalInfo
        show={isInfoDetails}
        onCloseClick={() => setIsInfoDetails(false)}
        currentuser={Chat_Box_Username}
        cuurentiseImg={Chat_Box_Image}
      />
    </React.Fragment>
  );
};

export default Chat;

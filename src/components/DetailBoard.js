import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SiCashapp } from "react-icons/si";
import styled from "styled-components";
import { Button, Card, Modal } from "react-bootstrap";
import noImage from "../img/noImage.svg";
import { BsFillCaretRightFill, BsPinFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { FaDollarSign } from "react-icons/fa";
import { GrView } from "react-icons/gr";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import ReplyPagination from "./ReplyPagination";
import BoardListPagination from "./BoardListPagination";
import axios from "axios";
import Cookies from "universal-cookie";

const DetailBoard = (props) => {
  let navigate = useNavigate();

  let dispatch = useDispatch();

  // cookie

  let csrf = new Cookies().get("XSRF-TOKEN");
  console.log(csrf);

  // end cookie

  const readList = async () => {
    await axios.get("http://localhost:3000/readList").then((res) => {
      console.log("success");
      console.log(res.data);
      dispatch({
        type: "readList",
        payload: res.data,
      });
    });
  };

  let API_URL = "http://localhost:3000";

  const getMyInfo = async () => {
    await axios
      .get(API_URL + "/userinfo")
      .then((result) => {
        console.log(result.data);
        SetInfo(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  let [userInfo, SetInfo] = useState("");

  const readReplyList = async () => {
    await axios({
      url: "http://localhost:8181/ReadReplyList",
      params: {
        bno: bno,
      },
    }).then((res) => {
      console.log(res.data);
      dispatch({
        type: "readReply",
        payload: res.data,
      });
    });
  };

  const readValueList = async () => {
    await axios({
      url: "http://localhost:8181/log",
      params: {
        bno: bno,
      },
    }).then((res) => {
      console.log("success valuelog");
      console.log(res.data);
      dispatch({
        type: "valuelog",
        payload: res.data,
      });
    });
  };

  const readCalculateValue = async () => {
    await axios({
      url: "http://localhost:8181/cal",
      params: {
        bno: bno,
      },
    }).then((res) => {
      console.log("success cal");
      console.log(res.data);
      SetcalculateValue(res.data);
    });
  };

  const upreadCount = async () => {
    await axios({
      url: "http://localhost:8181/rcount",
      params: {
        bno: bno,
      },
    }).then(async (res) => {
      console.log("success rcount");

      await readList();
    });
  };

  useEffect(() => {
    resetBoolean();
    readList();
    getMyInfo();
    readReplyList();
    readValueList();
    readCalculateValue();
    upreadCount();
  }, []);

  let { bno } = useParams();
  console.log(bno);

  let state = useSelector((state) => {
    return state;
  });

  let boardState = state.boardReducer;

  let findItemBoard =
    boardState === ""
      ? null
      : boardState.find((item) => {
          return item.bno === parseInt(bno);
        });

  console.log(findItemBoard);

  let item = findItemBoard;

  let valueState = state.valueReducer;

  let [calculateValue, SetcalculateValue] = useState("");

  // modal control

  const resetBoolean = () => {};

  const [warnvalueshow, setwarnvalueShow] = useState(false);

  const handleWarnClose = () => setwarnvalueShow(false);
  const handleWarnShow = () => setwarnvalueShow(true);

  const [loginShow, setloginShow] = useState(false);

  const handleLoginClose = () => setloginShow(false);
  const handleLoginShow = () => setloginShow(true);

  const [warn, Setwarn] = useState(false);
  const [warnDuplication, SetwarnDuplication] = useState(false);
  // modal control end

  // resize screen

  let currentWidth = document.documentElement.clientWidth;

  let [flexdir, Setflexdir] = useState("row wrap");

  useEffect(() => {
    if (currentWidth > 990) {
      Setflexdir("row wrap");
    }
    if (currentWidth <= 990) {
      Setflexdir("column wrap");
    }
  }, [flexdir, currentWidth]);

  window.addEventListener("resize", () => {
    let screenWidth = document.documentElement.clientWidth;

    if (screenWidth <= 990) {
      Setflexdir("column wrap");
    }

    if (screenWidth > 990) {
      Setflexdir("row wrap");
    }
  });

  ///end resize screen

  // styled component
  let TopTitle = styled("p")`
    font-size: 48px;
  `;

  let Line = styled("div")`
    width: 80%;
    height: 5px;
    background-color: #2d4059;
    margin: 0 auto;
  `;
  let Warn = styled("p")`
    color: red;
  `;
  // end styled component
  return (
    <div>
      <div className="cotainer-lg">
        <div
          className="row d-flex justify-content-center"
          style={{ width: "100%", paddingTop: "50px" }}
        >
          <div
            className="col-lg-1"
            onClick={() => {
              navigate("/");
            }}
            style={{ marginBottom: "20px", cursor: "pointer" }}
          >
            <SiCashapp
              style={{ color: "#EA5455", fontSize: "70px", margin: "0 20px" }}
            />
          </div>
          <div className="col-lg-9">
            <TopTitle>Wait you feed back !!</TopTitle>
          </div>
        </div>
      </div>
      <Line></Line>
      <div className="container-lg" style={{ marginTop: "30px" }}>
        <div className="row d-flex justify-content-end">
          <div
            className="col-3 d-flex justify-content-evenly"
            style={{ flexFlow: flexdir }}
          >
            <Button
              style={{ marginBottom: "10px" }}
              onClick={() => {
                navigate("/boardmain/");
              }}
            >
              ?????????
            </Button>
            {!(userInfo && item) ? null : !(
                userInfo.nick === item.writer
              ) ? null : (
              <Button
                style={{ marginBottom: "10px" }}
                onClick={() => {
                  navigate("/modify/" + item.bno);
                  console.log(item);
                }}
              >
                ?????????
              </Button>
            )}
            {!(userInfo && item) ? null : !(
                userInfo.nick === item.writer
              ) ? null : (
              <Button
                onClick={async () => {
                  await axios({
                    url: "/delete",
                    method: "delete",
                    params: {
                      bno: item.bno,
                      writer: item.writer,
                    },
                  })
                    .then((res) => {
                      navigate("/boardmain");
                      console.log(res.data);
                      dispatch({
                        type: "deleteBoard",
                        payload: res.data,
                      });
                    })
                    .catch((err) => {
                      console.log(err);
                      navigate("/login");
                    });
                }}
                style={{ marginBottom: "10px" }}
              >
                ?????????
              </Button>
            )}
          </div>
        </div>
      </div>
      {/* detail card */}
      <div
        className="container-lg d-flex justify-content-center"
        style={{ marginTop: "50px" }}
      >
        <Card style={{ width: "800px", color: "white", padding: "10px" }}>
          {item === null ? null : item.imageList === null ? (
            <Card.Img
              variant="top"
              src={noImage}
              style={{ border: "2px solid #2D4059" }}
            />
          ) : (
            item.imageList.map((item, index) => {
              return (
                <Card.Img
                  variant="top"
                  src={item}
                  key={index}
                  style={{ border: "2px solid #2D4059", marginBottom: "10px" }}
                />
              );
            })
          )}
          <Card.Body style={{ padding: "1rem 0" }}>
            <div style={{ display: "flex" }}>
              <Card.Title
                style={{
                  MaxWidth: "700px",
                  height: "40px",
                  textAlign: "left",
                  backgroundColor: "#2D4059",
                  borderRadius: "5px",
                  padding: "10px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {item == null ? null : item.title}
              </Card.Title>
            </div>
            <div style={{ display: "flex" }}>
              <p
                style={{
                  maxWidth: "700px",
                  height: "40px",
                  backgroundColor: "#2D4059",
                  borderRadius: "5px",
                  padding: "10px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {item == null ? null : item.writer}
              </p>
            </div>

            <Card.Text
              style={{
                backgroundColor: "#2D4059",
                borderRadius: "5px",
                padding: "10px",
              }}
            >
              {item == null ? null : item.content}
            </Card.Text>
            <div style={{ marginTop: "30px", textAlign: "center" }}>
              {item == null
                ? null
                : item.tag === "not"
                ? null
                : item.tagList.map((item, index) => {
                    return (
                      <span
                        style={{
                          display: "inline-block",
                          maxWidth: "700px",
                          height: "40px",
                          backgroundColor: "#2D4059",
                          borderRadius: "5px",
                          padding: "10px",
                          marginBottom: "0",
                          marginRight: "10px",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                        key={index}
                      >
                        #{item}
                      </span>
                    );
                  })}
            </div>
          </Card.Body>
        </Card>
      </div>
      {/* end detail card */}

      {/* start price */}
      <div className="container-lg">
        <div className="row">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "150px",
            }}
          >
            <p
              style={{
                width: "100px",
                height: "50px",
                backgroundColor: "#F07B3F",
                borderRadius: "5px",
                padding: "10px",
                marginTop: "17px",
                fontSize: "24px",
              }}
            >
              ?????????
            </p>
            <BsFillCaretRightFill
              style={{ color: "#2D4059", fontSize: "32px" }}
            />
            <div
              style={{
                color: "black",
                width: "400px",
                fontSize: "24px",
                borderBottom: "2px solid #2D4059",
              }}
            >
              {item == null
                ? null
                : item.suggestion
                ? item.suggestion + " ???"
                : "??????"}
            </div>
          </div>
        </div>
        <div className="row">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "50px",
            }}
          >
            <p
              style={{
                width: "100px",
                height: "50px",
                backgroundColor: "#FFD460",
                borderRadius: "5px",
                padding: "10px",
                marginTop: "17px",
                fontSize: "24px",
              }}
            >
              ?????????
            </p>
            <BsFillCaretRightFill
              style={{ color: "#2D4059", fontSize: "32px" }}
            />
            <div
              style={{
                color: "black",
                width: "400px",
                fontSize: "24px",
                borderBottom: "2px solid #2D4059",
              }}
            >
              {!calculateValue.min ? "??????" : calculateValue.min + " ???"}
            </div>
          </div>
        </div>
        <div className="row">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "50px",
            }}
          >
            <p
              style={{
                width: "100px",
                height: "50px",
                backgroundColor: "#EA5455",
                borderRadius: "5px",
                padding: "10px",
                marginTop: "17px",
                fontSize: "24px",
              }}
            >
              ?????????
            </p>
            <BsFillCaretRightFill
              style={{ color: "#2D4059", fontSize: "32px" }}
            />
            <div
              style={{
                color: "black",
                width: "400px",
                fontSize: "24px",
                borderBottom: "2px solid #2D4059",
              }}
            >
              {!calculateValue.max ? "??????" : calculateValue.max + " ???"}
            </div>
          </div>
        </div>
      </div>
      {/* end price */}

      {/* start value log */}
      <div
        className="container-lg d-flex justify-content-center"
        style={{ marginTop: "50px" }}
      >
        <div style={{ width: "800px", marginTop: "30px", textAlign: "left" }}>
          <p style={{ fontSize: "24px", borderBottom: "2px solid #2D4059" }}>
            <span>????????????</span>
          </p>
          {valueState === "" ? (
            <span>?????? ????????? ????????? ?????? ???????????????.</span>
          ) : valueState.length <= 0 ? (
            <span>?????? ????????? ????????? ?????? ???????????????.</span>
          ) : (
            valueState.map((item, index) => {
              return (
                <span
                  style={{
                    display: "inline-block",
                    maxWidth: "700px",
                    height: "40px",
                    backgroundColor: "#EA5455",
                    borderRadius: "5px",
                    padding: "10px",
                    marginBottom: "0",
                    marginRight: "10px",
                    overflow: "hidden",
                  }}
                  key={index}
                >
                  {item.rater} ??? {item.price} ???{" "}
                  {String(
                    new Date(+new Date(item.vdate) + 3240 * 10000)
                      .toISOString()
                      .replace("T", " ")
                      .replace(/\..*/, "")
                  )}
                </span>
              );
            })
          )}
        </div>
      </div>
      {/* end value log */}

      {/* start value input */}
      <div
        className="container-lg d-flex justify-content-center"
        style={{ marginTop: "100px" }}
      >
        <div
          style={{
            width: "75%",
            height: "500px",
            backgroundColor: "#FFD460",
            display: "flex",
            flexFlow: "column wrap",
            justifyContent: "space-around",
            alignItems: "center",
            borderRadius: "7px",
          }}
        >
          <div
            style={{
              width: "80%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <FaDollarSign style={{ fontSize: "32px", color: "#EA5455" }} />
            <div
              style={{
                color: "black",
                width: "400px",
                fontSize: "24px",
                borderBottom: "2px solid #EA5455",
              }}
            >
              {!calculateValue.avg ? "??????" : calculateValue.avg + " ???"}
            </div>
            <span style={{ fontSize: "32px" }}>???</span>
          </div>
          <div style={{ fontSize: "24px" }}>
            {!userInfo.nick ? "??????" : userInfo.nick} ?????? <br />
            ??????????????? ... ?
          </div>
          <div style={{ width: "80%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <BsPinFill style={{ fontSize: "32px", color: "#EA5455" }} />
              <div style={{ borderBottom: "2px solid #EA5455", width: "60%" }}>
                <input
                  id="price"
                  style={{
                    color: "black",
                    width: "70%",
                    fontSize: "24px",
                    borderStyle: "none",
                    backgroundColor: "transparent",
                    textAlign: "center",
                  }}
                />
              </div>
              <span style={{ fontSize: "32px" }}>???</span>
            </div>
            {warn ? (
              <Warn>
                ?????? ???????????? ???????????? ????????? ?????? ????????? ????????????. ??????
                ??????????????????.
              </Warn>
            ) : null}
            {warnDuplication ? (
              <Warn>?????? ????????? ??????????????????. ?????? ???????????? ??????????????????!</Warn>
            ) : null}
            <Button
              onClick={async () => {
                let number = /[0-9]/; // ?????? ??????
                let price = document.getElementById("price");

                if (!price.value || !number.test(price.value)) {
                  console.log("no value");
                  Setwarn(true);
                  return;
                } else {
                  Setwarn(false);
                }

                if (!userInfo) {
                  handleLoginShow();
                  return;
                }

                handleWarnShow();
              }}
              style={{
                marginTop: "30px",
                backgroundColor: "#EA5455",
                borderStyle: "none",
              }}
            >
              ????????????
            </Button>
          </div>
        </div>
      </div>
      <div className="container-lg d-flex justify-content-center">
        <div style={{ display: "flex", width: "800px", justifyContent: "end" }}>
          <div style={{ fontSize: "24px" }}>
            <GrView />
            <span style={{ padding: "0 10px" }}>
              {item == null ? null : item.rcount}
            </span>
            <AiFillLike style={{ color: "#EA5455", cursor: "pointer" }} />
            <span style={{ padding: "0 10px" }}>
              {item == null ? null : item.blike}
            </span>
            <AiFillDislike style={{ color: "#F07B3F", cursor: "pointer" }} />
            <span style={{ padding: "0 10px" }}>
              {item == null ? null : item.bdislike}
            </span>
          </div>
        </div>
      </div>
      {/* end value input */}

      {/* start reply box */}
      <ReplyPagination />
      <div className="container-lg d-flex justify-content-center">
        <div style={{ width: "100%" }}>
          <textarea
            id="rcontent"
            placeholder="????????? ???????????????"
            style={{ width: "70%", height: "100px", resize: "none" }}
          />
          <div style={{ display: "flex", justifyContent: "end", width: "85%" }}>
            <Button
              onClick={async () => {
                let rcontent = document.getElementById("rcontent");

                await axios({
                  url: "http://localhost:3000/InsertReply",
                  method: "post",
                  data: {
                    mno: userInfo.mno,
                    bno: item.bno,
                    replyer: userInfo.nick ? userInfo.nick : "anonymous",
                    rcontent: rcontent.value,
                  },
                  headers: {
                    "XSRF-TOKEN": csrf,
                  },
                }).then((res) => {
                  console.log(res);
                  dispatch({
                    type: "insertReply",
                    payload: res.data,
                  });
                  rcontent.value = "";
                });
              }}
              style={{ backgroundColor: "#EA5455", borderStyle: "none" }}
            >
              ????????????
            </Button>
          </div>
        </div>
      </div>
      {/* end reply box */}

      {/* start board list box */}
      <BoardListPagination />
      {/* end reply box */}

      {/* warn value modal start */}
      <Modal show={warnvalueshow} onHide={handleWarnClose}>
        <Modal.Header>
          <Modal.Title>?????? ?????? ??????</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ????????? ??? ???????????? ?????????????????????????
          <br />
          ???????????? ????????? ?????? ????????? ??? ????????????.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleWarnClose}>
            ??????
          </Button>
          <Button
            variant="primary"
            onClick={async () => {
              let price = document.getElementById("price");

              await axios({
                url: "/RegisterValue",
                method: "POST",
                data: {
                  bno: item.bno,
                  price: price.value,
                },
              }).then((res) => {
                if (res.data === "") {
                  console.log("same user");
                  SetwarnDuplication(true);
                  readValueList();
                } else {
                  console.log(res.data);
                  dispatch({
                    type: "valuelog",
                    payload: res.data,
                  });
                }
              });

              await readCalculateValue();

              price.value = "";

              handleWarnClose();
            }}
          >
            ????????????
          </Button>
        </Modal.Footer>
      </Modal>
      {/* warn value modal end */}

      {/* login modal start */}
      <Modal show={loginShow} onHide={handleLoginShow}>
        <Modal.Header>
          <Modal.Title>?????? ???????????? ????????? ??????????????????! ??????</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ????????? ???????????? ???????????? ???????????????.
          <br />
          ???????????? ???????????? ????????? ??????????????? ???????????? ??? ?????? ??????????????????.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleLoginClose}>
            ??????
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleLoginClose();
              navigate("/login");
            }}
          >
            ??????????????? ??????
          </Button>
        </Modal.Footer>
      </Modal>
      {/* login modal end */}
    </div>
  );
};

export default DetailBoard;

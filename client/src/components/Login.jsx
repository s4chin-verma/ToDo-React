import { useEffect, useState } from "react";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import NavBar from "../components/NavBar";
import { host, loginRoute } from "../utils/APIRoutes";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBInput,
  MDBIcon,
} from "mdb-react-ui-kit";

export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    password: "",
  });
  console.log(host);
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      navigate("/todolist");
    }
  }, [token]);

  const clearLocalStorageAfterInterval = (interval) => {
    console.log("Your token will be expire after 1 hour");

    setTimeout(() => {
      alert("Your token had been expired please login again");
      console.log("Inside setTimeout, clearing local storage");
      localStorage.removeItem("token");
      localStorage.removeItem("Todo-user");
      navigate("/");
    }, interval);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { username, password } = values;
      setValues({
        ...values,
        username: username.trim(),
      });

      try {
        const { data } = await axios.post(loginRoute, {
          username: username.trim(),
          password,
        });

        if (data.status === true) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("Todo-user", JSON.stringify(data.user));
          navigate("/todolist");
          clearLocalStorageAfterInterval(3600000);
        }
      } catch (error) {
        toast.error(error.response.data.msg, toastOptions);
        console.error("Error sending data to the server:", error);
      }
    }
  };

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    style: {
      backgroundColor: "#fff",
      color: "#333",
      fontSize: "16px",
      border: "1px solid #555",
      borderRadius: "8px",
      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
    },
  };

  const handleValidation = () => {
    const { username, password } = values;

    if (username === undefined || username.trim().length === 0) {
      toast.error("Please Enter username", toastOptions);
      return false;
    }

    if (password === undefined || password.trim().length === 0) {
      toast.error("Please Enter Password", toastOptions);
      return false;
    }

    return true;
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  return (
    <>
      <NavBar />
      <MDBContainer fluid>
        <MDBCard className="text-black mt-5" style={{ borderRadius: "25px" }}>
          <MDBCardBody>
            <MDBRow>
              <MDBCol
                md="10"
                lg="6"
                className="order-2 order-lg-1 d-flex flex-column align-items-center"
              >
                <form onSubmit={(event) => handleSubmit(event)}>
                  <div className="d-flex justify-content-center align-items-center mt-2 mb-4">
                    <p className="h1 fw-bold mx-1 mx-md-4">Log In</p>
                  </div>
                  <div className="d-flex flex-row align-items-center mb-4 ">
                    <MDBIcon fas icon="user me-3" size="lg" />
                    <MDBInput
                      label="Username"
                      id="form1"
                      type="text"
                      className="w-100"
                      name="username"
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                  <div className="d-flex flex-row align-items-center mb-4">
                    <MDBIcon fas icon="lock me-3" size="lg" />
                    <MDBInput
                      label="Password"
                      id="form3"
                      type="password"
                      name="password"
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                  <div className="d-flex justify-content-center align-items-center flex-column text-center">
                    <MDBBtn className="m-2 pl-pr-5" size="lg" type="submit">
                      Login
                    </MDBBtn>
                    <span className="mt-3">
                      <p>Don&apos;t have an account?</p>{" "}
                      <Link to="/register">Register</Link>
                    </span>
                  </div>
                </form>
              </MDBCol>
              <MDBCol
                md="10"
                lg="6"
                className="order-1 order-lg-2 d-flex align-items-center"
              >
                <MDBCardImage
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                  fluid
                />
              </MDBCol>
            </MDBRow>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
      <ToastContainer />
    </>
  );
}

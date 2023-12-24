import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { registerRoute } from '../utils/APIRoutes';
import NavBar from './NavBar';
import {
  MDBBtn, MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardImage, MDBInput, MDBIcon,
} from 'mdb-react-ui-kit';

export default function Register() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { username, email, password } = values;
      try {
        const { data } = await axios.post(registerRoute, {
          username,
          email,
          password,
        });
        if (data.status === true) {
          localStorage.setItem("Todo-user", JSON.stringify(data.user));
          navigate("/");
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
    const { username, email, password, confirmPassword } = values;

    if (email.trim() === "" || username.trim() === "" || password.trim() === "") {
      toast.error("Please enter a valid username, email, and password", toastOptions);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address", toastOptions);
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password should be the same", toastOptions);
      return false;
    }

    if (password.length < 8) {
      toast.error("Password length must be at least 8 characters", toastOptions);
      return false;
    }

    const commonPasswords = ["12345678", "password", "qwerty", "111111"];
    if (commonPasswords.some(commonPassword => password.toLowerCase().includes(commonPassword))) {
      toast.error("Please choose a stronger password", toastOptions);
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
        <MDBCard className='text-black m-5' style={{ borderRadius: '25px' }}>
          <MDBCardBody>
            <MDBRow>
              <MDBCol md='10' lg='6' className='order-2 order-lg-1 d-flex flex-column align-items-center'>
                <form onSubmit={(event) => handleSubmit(event)}>
                  <div className='d-flex justify-content-center align-items-center mb-3'>
                    <p className="h1 fw-bold mx-1 mx-md-4">Register</p>
                  </div>

                  <div className="d-flex flex-row align-items-center mb-4 ">
                    <MDBIcon fas icon="user me-3" size='lg' />
                    <MDBInput label='Username' id='form1' type='text' className='w-100' name='username' onChange={(e) => handleChange(e)} />
                  </div>

                  <div className="d-flex flex-row align-items-center mb-4">
                    <MDBIcon fas icon="envelope me-3" size='lg' />
                    <MDBInput label='Your Email' id='form2' type='email' name='email' onChange={(e) => handleChange(e)} />
                  </div>

                  <div className="d-flex flex-row align-items-center mb-4">
                    <MDBIcon fas icon="lock me-3" size='lg' />
                    <MDBInput label='Password' id='form3' type='password' name='password' onChange={(e) => handleChange(e)} />
                  </div>

                  <div className="d-flex flex-row align-items-center mb-4">
                    <MDBIcon fas icon="key me-3" size='lg' />
                    <MDBInput label='Repeat your password' id='form4' type='password' name='confirmPassword' onChange={(e) => handleChange(e)} />
                  </div>

                  <div className='d-flex justify-content-center align-items-center flex-column text-center'>
                    <MDBBtn className='m-2 pl-pr-5' size='lg' type="submit">Register</MDBBtn>
                    <span className='mt-3'>
                      have an account? <Link to='/'>Login</Link>
                    </span>
                  </div>
                </form>
              </MDBCol>

              <MDBCol md='10' lg='6' className='order-1 order-lg-2 d-flex align-items-center'>
                <MDBCardImage src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp' alt='sa' fluid />
              </MDBCol>

            </MDBRow>
          </MDBCardBody>
        </MDBCard>

      </MDBContainer>
      <ToastContainer />
    </>
  );
}


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import NavBar2 from '../components/NavBar';
import { createTaskRoute, deleteTaskRoute, getAllTasksRoute, isCompleted } from "../utils/APIRoutes";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCheckbox,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem,
  MDBRow,
  MDBTooltip,
} from "mdb-react-ui-kit";

export default function TodoList() {
  const navigate = useNavigate();
  const [taskText, setTaskText] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const sortedTasks = tasks.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const userName = JSON.parse(localStorage.getItem('Todo-user')).username;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      text: taskText,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(createTaskRoute, data, {
        headers: {
          "x-auth-token": token,
        },
      });

      if (response.data.status === true) {
        fetchData();
        setTaskText("");
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("i got triggered")
        navigate("/");
        return;
      }

      const response = await axios.get(getAllTasksRoute, {
        headers: {
          "x-auth-token": token,
        },
      });

      if (response.data.status === true) {
        setTasks(response.data.tasks);
      } else {
        console.error("Error fetching tasks:", response.data.msg);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };


  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${deleteTaskRoute}/${taskId}`, {
        headers: {
          "x-auth-token": token,
        },
      });

      if (response.status === 204) {
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const markTaskAsCompleted = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${isCompleted}/${taskId}`, null, {
        headers: {
          "x-auth-token": token,
        },
      });

      if (response.data.status === true) {
        fetchData();
      }
    } catch (error) {
      console.error("Error marking task as completed:", error);
    }
  };


  function formatDate(dateString) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("Todo-user"));
    if (!userData) {
      navigate("/");
    } else {
      if (!isInitialized) {
        fetchData();
        setIsInitialized(true);
      }
    }
  }, [navigate, isInitialized]);


  return (
    <>
      <NavBar2 />
      <MDBContainer className="py-5">
        <MDBRow className="d-flex justify-content-center align-items-center h-100">
          <MDBCol>
            <MDBCard
              id="list1"
              style={{ borderRadius: ".75rem", backgroundColor: "#eff1f2" }}
            >
              <MDBCardBody className="py-4 px-4 px-md-5">
                <p className="h1 text-center mt-3 mb-4 pb-3 text-primary">
                  <MDBIcon fas icon="check-square" className="me-1" />
                  <u>My Todo-s</u>
                </p>
                <div className="pb-2">
                  <MDBCard>
                    <MDBCardBody>
                      <form onSubmit={handleSubmit}>
                        <div className="d-flex flex-row align-items-center">
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            id="exampleFormControlInput1"
                            placeholder={`Hello ${userName}, add your tasks here`}
                            value={taskText}
                            onChange={(e) => setTaskText(e.target.value)}
                          />
                          <div>
                            <MDBBtn type="submit">Add</MDBBtn>
                          </div>
                        </div>
                      </form>
                    </MDBCardBody>
                  </MDBCard>
                </div>
                <hr className="my-4" />

                {sortedTasks.map((task) => (
                  <MDBListGroup horizontal className="rounded-0 bg-transparent" key={task._id}>
                    <MDBListGroupItem className="d-flex align-items-center ps-0 pe-3 py-1 rounded-0 border-0 bg-transparent">
                      <MDBCheckbox
                        name="flexCheck"
                        value=""
                        id="flexCheckChecked"
                        defaultChecked={task.isChecked}
                        onClick={() => markTaskAsCompleted(task._id)}
                      />
                    </MDBListGroupItem>
                    <MDBListGroupItem className="px-3 py-1 d-flex align-items-center flex-grow-1 border-0 bg-transparent">
                      <p
                        className={`lead fw-normal mb-0 ${task.isChecked ? 'text-decoration-line-through text-danger' : ''}`}
                      >
                        {task.text}
                      </p>
                    </MDBListGroupItem>
                    <MDBListGroupItem className="ps-3 pe-0 py-1 rounded-0 border-0 bg-transparent">
                      <div className="d-flex flex-row justify-content-end mb-1">
                        <MDBTooltip tag="a" title="Delete todo">
                          <MDBIcon fas icon="trash-alt" color="danger" onClick={() => handleDeleteTask(task._id)} />
                        </MDBTooltip>
                      </div>
                      <div className="text-end text-muted">
                        <MDBTooltip tag="t" title="Created date">
                          <p className="small text-muted mb-0">
                            <MDBIcon fas icon="info-circle" className="me-2" />
                            {formatDate(task.createdAt)}
                          </p>
                        </MDBTooltip>
                      </div>
                    </MDBListGroupItem>
                  </MDBListGroup>
                ))}
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </>
  );
}
import { useState, useEffect } from "react";
import {
  Table,
  Container,
  Row,
  Col,
  Button,
  ButtonGroup,
  Form,
  Navbar,
} from "react-bootstrap";
import "./App.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const initialState = {
  name: "",
  email: "",
  contact: "",
  address: "",
};
const api = " http://localhost:5000/users";
function App() {
  const [data, setData] = useState([]);
  const [state, setState] = useState(initialState);
  const [userId,setUserId]=useState(null);
  const [editMode, setEditMode]=useState(false);

  const { name, email, contact, address } = state;

  useEffect(() => {
    loadUsers();
  }, []);
  const loadUsers = async () => {
    const response = await axios.get(api);

    setData(response.data);
  };

  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(!name || !email || !address || !contact){
      toast.error("please fill all input field")
    }else{
      if(!editMode){
        await axios.post(api,state);
      toast.success("address successfully")
      setState({name:"",email:"",address:"",contact:""});
      setTimeout(() => {
        loadUsers();
      }, 500);
      }
      else{
        await axios.put(`${api}/${userId}`,state);
        toast.success("updated successfully");
        setState({name:"",email:"",address:"",contact:""});
        setTimeout(() => {
        loadUsers();
      }, 500);
      setUserId(null);
      setEditMode(false)
      }
    
    }

  }


  const handleChange=(e)=>{
    const {name,value}=e.target;

    setState({...state,[name]:value})

  }

  const handleDelete=async(id)=>{

    if(window.confirm("Are you wanted to delete that use ?"))
    await axios.delete(`${api}/${id}`);
    toast.success("deleted successfully")

    loadUsers();

  }

  const handleUpdate=async (id)=>{
    const singleUser=data.find((item)=>item.id==id);
    setState({...singleUser})
    setUserId(id);
    setEditMode(true)


  }

  return (
    <>
      <ToastContainer />
      <Navbar bg="primary" variant="dark" className="justify-content-center">
        <Navbar.Brand>
          Build And Deploy react using json server on heroku
        </Navbar.Brand>
      </Navbar>
      <Container style={{ marginTop: "70px" }}>
        <Row>
          <Col md={4}>
            <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label style={{ textAlign: "left" }}>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter your Name" name="name" value={name} onChange={handleChange}/>

              </Form.Group>
              <Form.Group>
              <Form.Label style={{ textAlign: "left" }}>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter your Email" name="email" value={email} onChange={handleChange}/>

              </Form.Group>
            
              <Form.Group>
              <Form.Label style={{ textAlign: "left" }}>contact</Form.Label>
              <Form.Control type="text" placeholder="Enter your contact" name="contact" value={contact} onChange={handleChange}/>

              </Form.Group>
              <Form.Group>
              <Form.Label style={{ textAlign: "left" }}>Address</Form.Label>
              <Form.Control type="text" placeholder="Enter your Address" name="address" value={address} onChange={handleChange}/>

              </Form.Group>

              <div className="d-grid gap-2 mt-2">
                <Button type="submit" variant="primary" size="lg">{editMode?"Update":"Submit"}</Button>
              </div>
              
            </Form>
          </Col>

          <Col md={8}>
            <h2>Tabel</h2>
            <Table bordered hover>
              <thead>
                <tr>
                  <td>No</td>
                  <td>Name</td>
                  <td>Email</td>
                  <td>Contact</td>
                  <td>Address</td>
                  <td>Action</td>
                </tr>
              </thead>
              {data &&
                data.map((item, index) => (
                  <tbody key={index}>
                    <tr>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.address}</td>
                      <td>{item.contact}</td>
                      <td>
                        <ButtonGroup>
                          <Button
                            style={{ marginRight: "5px" }}
                            variant="secondary"
                            onClick={()=>handleUpdate(item.id)}
                          >
                            Update
                          </Button>
                          <Button
                            style={{ marginRight: "5px" }}
                            variant="danger"
                            onClick={()=>handleDelete(item.id)}
                          >
                            Delete
                          </Button>
                        </ButtonGroup>
                      </td>
                    </tr>
                  </tbody>
                ))}
            </Table>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;

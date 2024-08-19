import { Navbar } from "react-bootstrap";
import { FaTools } from "react-icons/fa";
import './style.css'

const TitleBar = () => {

  return (
    <Navbar className="bg-nav mb-1" collapseOnSelect expand="md" variant="dark" sticky="top">
      <Navbar.Brand><FaTools  className="mx-4" />ADD TEST-TOOLS</Navbar.Brand>
    </Navbar>
  )
}

export default TitleBar;
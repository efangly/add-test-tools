import { Container } from "react-bootstrap";
import TitleBar from "./components/NavBar";
import ShelfList from "./components/ShelfList";
import QueueList from "./components/QueueList";

const App = () => {
  return (
    <>
      <TitleBar />
      <Container fluid>
        <QueueList />
        <ShelfList />
      </Container>
    </>
  )
}

export default App;

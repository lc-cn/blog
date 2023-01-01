import routes from './routes'
import './App.css'
import {useRoutes} from "react-router-dom";

function App() {
  const elements=useRoutes(routes)
  return elements
}

export default App

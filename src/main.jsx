import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import Input from './Input.jsx'
import PersonalPage from './Personal_page.jsx';
import PersonalTeamPage from './Personal_team_page.jsx';
// import Edit from './edit.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/Input",
    element: <Input/>,
  },
  {
    path: "/personal",
    element: <PersonalPage/>,
  },
  {
    path: "/team",
    element: <PersonalTeamPage/>,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)

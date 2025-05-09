import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import App from "../App";
import Home from "../components/Home";
import About from "../components/About";
import Services from "../components/Services";
import Contacts from "../components/Contacts";
import Login from "../components/Login";
import Signup from "../components/Signup";
import AllBooks from "../components/AllBooks";
import DashboardLayout from "../admin/DashboardLayout";
import Dashboard from "../admin/Dashboard";
import Upload from "../admin/Upload";
import Manage from "../admin/Manage";
import EditBooks from "../admin/EditBooks";
import SingleBook from "../components/SingleBook";
import UserPanel from "../user/UserPanel"
import Reminder from "../admin/Reminder";
import AllUsers from "../admin/AllUsers";
import UpdateUserBooks from "../admin/UpdateUserBooks";

const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
      children: [
        {
            path: '/',
            element: <Home/>
        },
        {
            path: '/about',
            element: <About/>
        },
        {
            path: 'services',
            element: <Services/>
        },
        {
            path: 'contacts',
            element: <Contacts/>
        },
        {
            path: 'login',
            element: <Login/>
        },
        {
            path: 'register',
            element: <Signup/>
        },
        {
            path: '/books',
            element: <AllBooks/>
        },
        {
            path: '/books/:id',
            element: <SingleBook/>,
            loader: ({params}) => fetch(`https://localhost:3000/all-books/${params.id}`)
        },
       
      ]
    },
    {
        path: '/admin/dashboard',
        element: <DashboardLayout/>,
        children: [
            {
                path: '/admin/dashboard',
                element: <Dashboard/>
            },
            {
                path: '/admin/dashboard/upload',
                element: <Upload/>
            },
            {
                path: '/admin/dashboard/manage',
                element: <Manage/>
            },
            {
                path: '/admin/dashboard/reminder',
                element: <Reminder/>
            },
            {
                path: '/admin/dashboard/users',
                element: <AllUsers/>
            },
            {
                path: '/admin/dashboard/edit/:id',
                element: <EditBooks/>,
                loader: ({params}) => fetch(`https://localhost:3000/all-books/${params.id}`)
            },
            {
                path: '/admin/dashboard/users/:id',
                element: <UpdateUserBooks/>,
                loader: ({params}) => fetch(`https://localhost:3000/all-users/${params.id}`)
            }
        ]
    },
    {
       path: "/user",
        element: <UserPanel/>
    }
           
    
    
]);

export default router;
import React from 'react'
import Signup from '../components/Signup'
import Login from '../components/Login'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import Dashboard from "../pages/Dashboard";
import RegisterStudent from '../components/RegisterStudent';
import StudentList from '../components/StudentList';
import Course from '../components/Course';
import ClassList from '../components/ClassList';
import Board from "../components/Board"
import { useSelector } from 'react-redux';
import Authentication from '../components/Authentication';
import FeeCollection from '../components/FeeCollection';
import RegisterUser from '../components/RegisterUser';
import EditStudent from '../components/EditStudent';
import Tranactions from '../components/Transactions';





const Routing = () => {
    let isLoggedIn = localStorage.getItem("idToken");

  return (
    <Router>
        
        <Routes>
            <Route index path='/' element={<Login />} />
            <Route path='/Signup' element={<Signup />} />
            <Route path='/Login' element={<Login />} />
            
            <Route path='/dashboard' element={<Dashboard />}>
                 <Route path='board' element={<Board />} />
                 <Route path='RegisterUser' element={<RegisterUser />} />
                 <Route path='register-stud' element={<RegisterStudent />} />
                 <Route path='StudentList' element={<StudentList />}/>
                 <Route path='Course' element={<Course />}>
                 <Route path=':id' element={<Course />}/>
                 </Route>
                 <Route path='ClassList' element={<ClassList />}/>
                 
                 <Route path='EditStudent/:studentId' element={<EditStudent />}/>
                 <Route path='FeeCollection' element={<FeeCollection />}/>
                <Route path='Transactions' element = {<Tranactions />} />
               
            </Route> 
        </Routes>
    </Router>
  )
}

export default Routing
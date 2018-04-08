import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter, Route } from 'react-router-dom'
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import './css/main.css';
import rootReducer from './rootReducer'
import App from './App';
import SignupPage from "./signup/signup";
import Logout from "./signup/logout";
import Dashboard from "./dashboard/dashboard";
import StudentList from "./dashboard/student_list/student-list";
import Timings from "./dashboard/timing/timing";
import CombineCourses from "./dashboard/combine/combine";
import ListGroup from "./dashboard/student/list_groups";
import CourseList from "./dashboard/student/course_list";
import AddStaff from "./dashboard/staff_enroll/add_staff";
import GroupCourses from "./dashboard/group";
import Report from "./dashboard/report";
import ForgotPassword from "./signup/forgot";
import DepartmentDashboard from "./dashboard/department";
import DepReport from "./dashboard/department/report";
import DepStudentList from "./dashboard/department/student_list/student-list";
import DepartManager from "./dashboard/department_manager";
import ChangePassword from "./signup/change_pass";
import SetSecurityQuest from "./signup/set_security";

const stores = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk))
);


ReactDOM.render(<BrowserRouter >
    <Provider store={stores}>
        <div>
            <Route component={App}/>
            <div>
                <Route exact path='/' component={SignupPage}/>
                <Route path='/logout' component={Logout}/>
                <Route path='/change_password' component={ChangePassword}/>
                <Route path='/set_security' component={SetSecurityQuest}/>
                <Route exact path='/dashboard' component={Dashboard}/>
                <Route exact path='/department_portal' component={DepartmentDashboard}/>
                <Route path='/dashboard/students-list' component={StudentList}/>
                <Route path='/department_portal/students-list' component={DepStudentList}/>
                <Route path='/dashboard/timings' component={Timings}/>
                <Route path='/dashboard/combine_courses' component={CombineCourses}/>
                <Route path='/dashboard/group_courses' component={GroupCourses}/>
                <Route exact path='/student_portal' component={ListGroup}/>
                <Route path='/student_portal/courses' component={CourseList}/>
                <Route path='/dashboard/add_staff' component={AddStaff}/>
                <Route path='/dashboard/report' component={Report}/>
                <Route path='/dashboard/department' component={DepartManager}/>
                <Route path='/department_portal/report' component={DepReport}/>
                <Route exact path={"/forgot"} component={ForgotPassword}/>
            </div>
        </div>
    </Provider>
</BrowserRouter>, document.getElementById('root'));
registerServiceWorker();

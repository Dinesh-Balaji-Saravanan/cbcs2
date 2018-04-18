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
import asyncComponent from "./AsyncComponent";
import Export from "./dashboard/report/printpdf";

const AsyncApp = asyncComponent(()=>import('./App'));
const AsyncSignupPage = asyncComponent(()=>import('./signup/signup'));
const AsyncLogout = asyncComponent(()=>import('./signup/logout'));
const AsyncDashboard = asyncComponent(()=>import('./dashboard/dashboard'));
const AsyncStudentList = asyncComponent(()=>import('./dashboard/student_list/student-list'));
const AsyncTimings = asyncComponent(()=>import('./dashboard/timing/timing'));
const AsyncCombineCourses = asyncComponent(()=>import('./dashboard/combine/combine'));
const AsyncListGroup = asyncComponent(()=>import('./dashboard/student/list_groups'));
const AsyncCourseList = asyncComponent(()=>import('./dashboard/student/course_list'));
const AsyncAddStaff = asyncComponent(()=>import('./dashboard/staff_enroll/add_staff'));
const AsyncGroupCourses = asyncComponent(()=>import('./dashboard/group'));
const AsyncReport = asyncComponent(()=>import('./dashboard/report'));
const AsyncForgotPassword = asyncComponent(()=>import('./signup/forgot'));
const AsyncDepartmentDashboard = asyncComponent(()=>import('./dashboard/department'));
const AsyncDepReport = asyncComponent(()=>import('./dashboard/department/report'));
const AsyncDepStudentList = asyncComponent(()=>import('./dashboard/department/student_list/student-list'));
const AsyncDepartManager = asyncComponent(()=>import('./dashboard/department_manager'));
const AsyncChangePassword = asyncComponent(()=>import('./signup/change_pass'));
const AsyncSetSecurityQuest = asyncComponent(()=>import('./signup/set_security'));
const AsyncAbout = asyncComponent(()=>import('./about'));


const stores = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk))
);


ReactDOM.render(<BrowserRouter >
    <Provider store={stores}>
        <div>
            <Route component={AsyncApp}/>
            <div>
                <Route exact path='/' component={AsyncSignupPage}/>
                <Route path='/logout' component={AsyncLogout}/>
                <Route path='/change_password' component={AsyncChangePassword}/>
                <Route path='/set_security' component={AsyncSetSecurityQuest}/>
                <Route exact path='/dashboard' component={AsyncDashboard}/>
                <Route exact path='/department_portal' component={AsyncDepartmentDashboard}/>
                <Route path='/dashboard/students-list' component={AsyncStudentList}/>
                <Route path='/department_portal/students-list' component={AsyncDepStudentList}/>
                <Route path='/dashboard/timings' component={AsyncTimings}/>
                <Route path='/dashboard/combine_courses' component={AsyncCombineCourses}/>
                <Route path='/dashboard/group_courses' component={AsyncGroupCourses}/>
                <Route exact path='/student_portal' component={AsyncListGroup}/>
                <Route path='/student_portal/courses' component={AsyncCourseList}/>
                <Route path='/dashboard/add_staff' component={AsyncAddStaff}/>
                <Route path='/dashboard/report' component={AsyncReport}/>
                <Route path='/dashboard/department' component={AsyncDepartManager}/>
                <Route path='/department_portal/report' component={AsyncDepReport}/>
                <Route exact path={"/forgot"} component={AsyncForgotPassword}/>
                <Route exact path={"/about"} component={AsyncAbout}/>
                <Route exact path={"/exp"} component={Export}/>
            </div>
        </div>
    </Provider>
</BrowserRouter>, document.getElementById('root'));
registerServiceWorker();

import React from 'react';
import '../css/main.css';
import Card from "./card";
import {
    faChartBar, faClock, faFileAlt,faTasks, faUser,
    faUserCircle
} from "@fortawesome/fontawesome-free-solid/index.es";

class DashCont extends React.Component {
    render(){
        return(
            <div id={"padding-all"}>
                <div className={"row justify-content-md-center"}>
                    <Card cardTitle={"Department Users"} srcImg={faUserCircle} linkURL={"/dashboard/department"} Imgheight={"3x"}/>
                    <Card cardTitle={"Students List"} srcImg={faUser} linkURL={"/dashboard/students-list"} Imgheight={"3x"}/>
                    <Card cardTitle={"Set Timing"} srcImg={faClock} linkURL={"/dashboard/timings"} Imgheight={"3x"}/>
                    <Card cardTitle={"Add Staff"} srcImg={faUserCircle} linkURL={"/dashboard/add_staff"} Imgheight={"3x"}/>
                    <Card cardTitle={"Group Courses"} srcImg={faFileAlt} linkURL={"/dashboard/group_courses"} Imgheight={"3x"}/>
                    <Card cardTitle={"Combine Courses"} srcImg={faTasks} linkURL={"/dashboard/combine_courses"} Imgheight={"3x"}/>
                    <Card cardTitle={"Report"} srcImg={faChartBar} linkURL={"/dashboard/report"} Imgheight={"3x"}/>
                </div>
            </div>
        );
    }
}

export default DashCont;
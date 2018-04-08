import React from 'react';
import '../../css/main.css';
import Card from "./card";
import {
    faChartBar, faUser,
} from "@fortawesome/fontawesome-free-solid/index.es";

class DashCont extends React.Component {
    render(){
        return(
            <div id={"padding-all"}>
                <div className={"row justify-content-md-center"}>
                    <Card cardTitle={"Students List"} srcImg={faUser} linkURL={"/department_portal/students-list"} Imgheight={"3x"}/>
                    <Card cardTitle={"Report"} srcImg={faChartBar} linkURL={"/department_portal/report"} Imgheight={"3x"}/>
                </div>
            </div>
        );
    }
}

export default DashCont;
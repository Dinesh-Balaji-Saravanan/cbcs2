import React from 'react';
import {Redirect} from "react-router";
import '../css/main.css';
import DashCont from "./dash_content";
import Route from "react-router/es/Route";

class Dashboard extends React.Component {
    render(){
        if (sessionStorage.getItem('user') === "") {
        return (<Redirect push to="/" />);
    }
        return(
            <div id={"padding1"} className={"container "}>
                <div className={"row card border border-top-0 border-bottom-0 border-light bg-light" }>
                    <div id={"padding-all"} className={"col-12"}>
                        <h4 className={"card-body display-4"} align="center">Admin Portal
                            <hr/></h4>
                        <Route exact path={"/dashboard"} component={DashCont}  />
                    </div>
                </div>
                <br/>
            </div>
        );
    }
}

export default Dashboard;
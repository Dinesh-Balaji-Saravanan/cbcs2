import React from 'react';
import {Redirect} from "react-router";
import '../css/main.css';
import DashCont from "./dash_content";
import Route from "react-router/es/Route";

class Dashboard extends React.Component {
    componentWillMount(){
        sessionStorage.setItem('report','');
    }
    render(){
        if (sessionStorage.getItem('user') === "" && sessionStorage.getItem('user') ===null) {
        return (<Redirect push to="/" />);
    }
        return(
            <div id={"padding1"} className={"container"}>
                <div id={"padding-all"} className={"row card border border-top-0 border-bottom-0 border-light bg-light" }>
                    <div className={"col-lg-12 col-md-12 card-body"}>
                        <h4 className={"display-4"} align="center">Admin Portal
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
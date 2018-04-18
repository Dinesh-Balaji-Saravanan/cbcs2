import React from 'react';
import {Redirect} from "react-router";
import '../../css/main.css';
import DashCont from "./dash_content";

class DepartmentDashboard extends React.Component {

    async componentWillMount(){
        sessionStorage.setItem('report','');
        const response = await fetch(`/api/dep_login`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            method:"post",
            body:JSON.stringify({
                username:sessionStorage.getItem('user').toUpperCase()
            })
        }).catch((err) => {
            console.log(err.message);
        });
        try{
            const data = await response.json();
            sessionStorage.setItem('dep_id',JSON.stringify(data[0].dep_id));
            console.log(data[0].dep_id)
        }catch (e){
            console.log(e);
        }
    }

    render(){
        if (sessionStorage.getItem('user') === "") {
            return (<Redirect push to="/" />);
        }
        return(
            <div id={"padding1"} className={"container "}>
                <div className={"row card border border-top-0 border-bottom-0 border-light bg-light" }>
                    <div id={"padding-all"} className={"col-12"}>
                        <h4 className={"card-body display-4"} align="center"> Department Portal
                            <hr/></h4>
                        <DashCont/>
                    </div>
                </div>
                <br/>
            </div>
        );
    }
}

export default DepartmentDashboard;
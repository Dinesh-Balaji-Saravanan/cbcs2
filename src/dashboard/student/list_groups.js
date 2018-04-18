import React from 'react';
import {faUser} from "@fortawesome/fontawesome-free-solid/index.es";
import Loader from "../loader/loader";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import DashContStud from "./student_dashboard";
import Redirect from "react-router-dom/es/Redirect";

class ListGroup extends React.Component {
    state ={
    };
    async componentWillMount(){
        this.setState({isLoading:false});

        if (sessionStorage.getItem('user') !== ''){
            if (sessionStorage.getItem('user')==='admin') {
                return (
                    <Redirect to={"/dashboard"}/>
                );
            } else {
                return (
                    <Redirect to={"/student_portal"}/>
                );
            }
        }else{
            return (
                <Redirect to={"/logout"}/>
            );
        }

    }
    render() {
        const { isLoading } = this.state;
        if(sessionStorage.getItem('user') === "" || sessionStorage.getItem('user') ===null){
            return( <Redirect push to={'/'} /> );
        }
        return (
            <div id={"padding-all"}>
                {isLoading && <Loader/>}
                <div id={"padding1"} align="center">
                    <div className={" container row justify-content-md-center card border border-top-0 border-bottom-0 border-light bg-light" }>
                        <div id={"padding-all"} className={"col-12"}>
                            <h3 className={"card-body"} align="center">
                                <div className={"row justify-content-md-center"}><div className={"col-lg-6 col-md-12"}>
                                    <em><FontAwesomeIcon icon={faUser}/> Student Portal</em><hr/>
                                </div></div>
                            </h3>
                            <div >
                                <DashContStud/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ListGroup;
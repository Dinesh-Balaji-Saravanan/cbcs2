import React from 'react';
import SignupForm from './signupForm';
import Redirect from "react-router-dom/es/Redirect";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import {faSignInAlt} from "@fortawesome/fontawesome-free-solid";

class SignupPage extends React.Component {

    render(){
        if(sessionStorage.getItem('user') !== ""){
            if (sessionStorage.getItem('user').toUpperCase() ==='ADMIN') {
                sessionStorage.setItem('dashboard','dashboard');
                return (
                    <Redirect to={"/dashboard"}/>
                );
            }else if(sessionStorage.getItem('user').charAt(0) === "1") {
                sessionStorage.setItem('dashboard','student_portal');
                return (
                    <Redirect to={"/student_portal"}/>
                );
            }else {
                sessionStorage.setItem('dashboard','department_portal');
                return (
                    <Redirect to={"/department_portal"}/>
                );
            }
        }
        return(
            <div className={"container"}>
                <div className='row justify-content-md-center'>
                    <div id='signup-card' className='col-lg-6 col-md-8'>
                        <div className="card bg-dark text-dark">

                            <div className="card-body">
                                <h1 className="card-header text-light lead  text-center ">Choice Based Course Selection</h1>
                                <br/>
                                <SignupForm />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SignupPage;

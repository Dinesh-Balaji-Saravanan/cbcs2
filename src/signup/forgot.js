import React from 'react';
import {faSignInAlt, faUserCircle} from "@fortawesome/fontawesome-free-solid/index";
import AlertNotify from "../dashboard/alert";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import Loader from "../dashboard/loader/loader";
import {
    faCheck,
    faExclamationTriangle, faInfoCircle, faKey, faQuestion,
    faTicketAlt
} from "@fortawesome/fontawesome-free-solid/index.es";
import {Redirect} from "react-router-dom";
import Link from "react-router-dom/es/Link";

class ForgotPassword extends React.Component {
    state={
        username:"",
        confirmPassword:"",
        securityQuest:"",
        secAnswer:"",
        actual:{
            password:"",
            securityQuest:"",
            secAnswer:""
        },
        ConfPass:"",
        pass:"",
        dataFound:false,
        redirect:false,
        errors:{
            title:"",
            message:"",
            type:"",
            icon:""
        }
    };
    onChange = (e) =>{
        e.preventDefault();
        if(e.target.name === "seQuest"){
            this.setState({securityQuest:e.target.value});
        }else if(e.target.name === "seAnswer"){
            this.setState({secAnswer:e.target.value});
        }else if(e.target.name === "username"){
            this.setState({username:e.target.value});
        }else if(e.target.name === "ConfPass"){
            this.setState({ConfPass:e.target.value});
        }else if(e.target.name === "pass"){
            this.setState({pass:e.target.value});
        }else if(e.target.name === "check_user"){
            if (this.state.username !== '') {
                this.myCall(e.target.name);
            }else{
                this.setState({
                    errors: {
                        title: "Oops !!",
                        message: "Some field is empty",
                        type: "danger",
                        icon: faExclamationTriangle
                    }
                });
            }
        }else if(e.target.name === "resetPass"){
            if (this.state.pass !== '' && this.state.ConfPass !=='') {
                if (this.state.pass === this.state.ConfPass) {
                    if (this.state.pass !== this.state.actual.password) {
                        this.myCall(e.target.name);
                    } else {
                        this.setState({
                            errors: {
                                title: "Oops !!",
                                message: "Your password is matches the old password, Please try other password",
                                type: "danger",
                                icon: faExclamationTriangle
                            }
                        });
                    }
                } else {
                    this.setState({
                        errors: {
                            title: "Oops !!",
                            message: "Both Passwords are not Same.",
                            type: "danger",
                            icon: faExclamationTriangle
                        }
                    });
                }
            } else {
                this.setState({
                    errors: {
                        title: "Oops !!",
                        message: "Some field is empty",
                        type: "danger",
                        icon: faExclamationTriangle
                    }
                });
            }
        }else if(e.target.name === "check_answer"){
            if (this.state.secAnswer!=='') {
                if (this.state.actual.secAnswer === this.state.secAnswer) {
                    this.setState({dataFound: true});
                    this.setState({
                        errors: {
                            title: "Super !!",
                            message: "Please create a new password",
                            type: "info",
                            icon: faTicketAlt
                        }
                    });
                } else {
                    this.setState({
                        errors: {
                            title: "Oops !!",
                            message: "Your Answer is wrong, Please try another answer.",
                            type: "danger",
                            icon: faExclamationTriangle
                        }
                    });
                }
            }else{
                this.setState({
                    errors: {
                        title: "Oops !!",
                        message: "Some field is empty",
                        type: "danger",
                        icon: faExclamationTriangle
                    }
                });
            }
        }
    };
    async myCall(name){
        if (name === 'check_user') {
            const response = await fetch(`/api/user`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                method: "post",
                body: JSON.stringify({
                    username: this.state.username.toUpperCase()
                })
            }).catch((err) => {
                console.log(err.message);
            });

            try {
                const data = await response.json();
                if (data[0].password !== 'kongu@2018') {
                    if (data[0].question !== '' && data[0].answer !== '') {
                        this.setState({
                            actual: {
                                securityQuest: data[0].question,
                                password: data[0].password,
                                secAnswer: data[0].answer
                            }
                        });
                        this.setState({
                            errors:{
                                title:"We found Your Account !!",
                                message:"Enter Your Answer",
                                type:"success",
                                icon:faCheck
                            }
                        });
                    }
                }else{
                    this.setState({
                        errors:{
                            title:"Wait !!",
                            message:"Your Password is default, You Did not changed yet",
                            type:"info",
                            icon:faInfoCircle
                        }
                    });
                }
            } catch (e) {
                console.log("FAILED");
            }
        } else if(name === 'resetPass') {
            const response = await fetch(`/api/resetPass`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                method: "post",
                body: JSON.stringify({
                    username: this.state.username.toUpperCase(),
                    password: this.state.pass,
                })
            }).catch((err) => {
                console.log(err.message);
            });

            try {
                if(response.status){
                    this.setState({redirect:true});
                }

            } catch (e) {
                console.log("FAILED");
            }
        }
    }


    render() {
        const {isLoading,errors,redirect} = this.state;
        if(redirect){
            return(
                <Redirect push to={"/"}/>
            );
        }
        if(sessionStorage.getItem('user') !== "") {
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
        return (
            <div className={"container"}>
                <div className='row justify-content-md-center'>
                    <div id='signup-card' className='col-lg-8 col-md-12'>
                        <div className="card bg-dark text-dark">
                            <h1 className="card-header text-light lead  text-center "><FontAwesomeIcon icon={faSignInAlt}/> Forgot password</h1>
                            <div className="card-body">
                                <br/>
                                <div>
                                {errors.title !== "" && <AlertNotify icon={errors.icon} title={errors.title} type={errors.type} message={errors.message} />}
                                <form align="center">
                                    {isLoading && <Loader/>}
                                    {this.state.dataFound ?
                                        <div className={"row justify-content-md-center"} align="center">
                                            <div className="input-group mb-4 col-md-12 col-lg-8">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text" id="basic-addon1"><FontAwesomeIcon
                                                        icon={faKey}/></span>
                                                </div>
                                                <input type="password" className="form-control " placeholder="New password"
                                                       name="pass"
                                                       onChange={this.onChange}
                                                       required
                                                />
                                            </div>
                                            <div className="input-group mb-4 col-md-12 col-lg-8">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text" id="basic-addon1"><FontAwesomeIcon
                                                        icon={faKey}/></span>
                                                </div>
                                                <input type="password" className="form-control "
                                                       placeholder="Confirm Password" name="ConfPass"
                                                       onChange={this.onChange}
                                                       required
                                                />
                                            </div>
                                        </div>

                                        : <div>{this.state.actual.securityQuest === "" ?
                                            <div className={"row justify-content-md-center"} align="center">
                                                <div className="input-group mb-4 col-md-12 col-lg-8">
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text" id="basic-addon1"><FontAwesomeIcon icon={faUserCircle} /></span>
                                                    </div>
                                                    <input type="text" className="form-control " placeholder="Enter Username" name="username"
                                                           onChange={this.onChange}
                                                           required
                                                    />
                                                </div>
                                            </div>
                                            :
                                            <div className={"row justify-content-md-center"} align="center">
                                                <div className="input-group mb-4 col-md-12 col-lg-8">
                                                    <div className="input-group-prepend">
                                                    <span className="input-group-text" id="basic-addon1">
                                                        <FontAwesomeIcon icon={faQuestion} />
                                                    </span>
                                                    </div>
                                                    <input className="form-control" type="text" value={this.state.actual.securityQuest} readonly/>
                                                </div>
                                                <div className="input-group mb-4 col-md-12 col-lg-8">
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text" id="basic-addon1"><FontAwesomeIcon icon={faKey} /></span>
                                                    </div>
                                                    <input type="password" className="form-control " placeholder="Enter Answer" name="seAnswer"
                                                           onChange={this.onChange}
                                                           required
                                                    />
                                                </div>
                                            </div>}</div>
                                    }


                                    <br/>
                                    <Link to={"/"} className={"text-help pull-right"}>or Login</Link>
                                    <hr/>
                                    {this.state.dataFound ?
                                        <button type="submit" onClick={this.onChange} name="resetPass" className="btn btn-outline-success pull-right">Ok</button>
                                        :
                                        <div>{this.state.actual.securityQuest === "" ?
                                        <button type="submit" onClick={this.onChange} name="check_user" className="btn btn-outline-primary pull-right">Check</button>
                                        :
                                        <button type="submit" onClick={this.onChange} name="check_answer" className="btn btn-outline-primary pull-right">Check</button>
                                    }</div>
                                    }

                                </form>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default ForgotPassword;
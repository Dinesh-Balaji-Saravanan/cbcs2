import React from 'react';
import {faSignInAlt, faUserCircle} from "@fortawesome/fontawesome-free-solid/index";
import AlertNotify from "../dashboard/alert";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import Loader from "../dashboard/loader/loader";
import {faCheck, faExclamationTriangle, faKey, faQuestion} from "@fortawesome/fontawesome-free-solid/index.es";
import {Redirect} from "react-router-dom";

class ChangePassword extends React.Component {
    state={
        username:"",
        actual:null,
        securityQuest:false,
        old:"",
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
         if(e.target.name === "old"){
            this.setState({old:e.target.value});
        }else if(e.target.name === "ConfPass"){
            this.setState({ConfPass:e.target.value});
        }else if(e.target.name === "pass"){
            this.setState({pass:e.target.value});
        }else if(e.target.name === "resetPass"){
             if (this.state.actual.password === this.state.old) {
                 if (this.state.pass === this.state.ConfPass) {
                     this.myCall(e.target.name);
                 }else{
                     this.setState({
                         errors:{
                             title:"Oops !!",
                             message:"Both Passwords are not Same.",
                             type:"danger",
                             icon:faExclamationTriangle
                         }
                     });
                 }
             }else{
                 this.setState({
                     errors:{
                         title:"Oops !!",
                         message:"Old Password does not Matches",
                         type:"danger",
                         icon:faExclamationTriangle
                     }
                 });
             }
        }
    };
    async myCall(name){
        if(name === 'resetPass') {
            const response = await fetch(`/api/resetPass`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                method: "post",
                body: JSON.stringify({
                    username: sessionStorage.getItem('user'),
                    password: this.state.pass,
                })
            }).catch((err) => {
                console.log(err.message);
            });

            try {
                if(response.status){
                    this.setState({
                        redirect:true
                    })
                }

            } catch (e) {
                console.log("FAILED");
            }
        }
    }
    async componentWillMount(){
        const response = await fetch(`/api/user`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            method: "post",
            body: JSON.stringify({
                username: sessionStorage.getItem('user')
            })
        }).catch((err) => {
            console.log(err.message);
        });

        try {
            if(response.status){
                const data = await response.json();
                this.setState({
                    actual:data[0]
                });
                if(data[0].question === ''){
                    this.setState({securityQuest:true})
                }
            }

        } catch (e) {
            console.log("FAILED");
        }
    }
    render() {
        const {isLoading,errors,redirect} = this.state;
        if(redirect){
            return( <Redirect push to={'/'} /> );
        }
        if(sessionStorage.getItem('user') === ""){
            return( <Redirect push to={'/'} /> );
        }
        if(this.state.securityQuest){
            return( <Redirect push to={'/set_security'} /> );
        }
        return (
            <div className={"container"}>
                <br/><br/>
                <div className='row justify-content-md-center'>
                    <div id='signup-card' className='col-lg-8 col-md-12'>
                        <div className="card bg-dark text-light">
                            <h1 className="card-header text-light lead  text-center "><FontAwesomeIcon icon={faKey}/> Change Password </h1>
                            <div className="card-body">
                                <br/>
                                <div>
                                    {errors.title !== "" && <AlertNotify icon={errors.icon} title={errors.title} type={errors.type} message={errors.message} />}
                                    <form align="center">
                                        {isLoading && <Loader/>}
                                        <div className={"row justify-content-md-center"} align="center">
                                            <div className={"mb-4 mb-4 col-md-12 col-lg-8"}><p>Old Password</p></div>
                                            <div className="input-group mb-4 col-md-12 col-lg-8">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text" id="basic-addon1"><FontAwesomeIcon
                                                        icon={faKey}/></span>
                                                </div>
                                                <input type="password" className="form-control " placeholder="old password"
                                                       name="old"
                                                       onChange={this.onChange}
                                                       required
                                                />
                                            </div>
                                            <div className={"mb-4 mb-4 col-md-12 col-lg-8"}><p>New Password</p></div>
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
                                        <hr/>
                                        <button onClick={this.onChange} name="resetPass" className="btn btn-outline-success pull-right">Change Password</button>
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

export default ChangePassword;
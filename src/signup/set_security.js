import React from 'react';
import {faSignInAlt, faUserCircle} from "@fortawesome/fontawesome-free-solid/index";
import AlertNotify from "../dashboard/alert";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import Loader from "../dashboard/loader/loader";
import {
    faCheck, faExclamationTriangle, faInfoCircle, faKey, faQuestion,
    faUserSecret
} from "@fortawesome/fontawesome-free-solid/index.es";
import {Redirect} from "react-router-dom";

class SetSecurityQuest extends React.Component {
    state={
        username:"",
        actual:null,
        seQuest:"",
        seAnswer:"",
        old:"",
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
        }else if(e.target.name === "seQuest"){
            this.setState({seQuest:e.target.value});
        }else if(e.target.name === "seAnswer"){
            this.setState({seAnswer:e.target.value});
        }else if(e.target.name === "setSecurity"){
            console.log(this.state.old+" "+this.state.seAnswer+" "+this.state.seQuest);
            if (this.state.old !== '' && this.state.seAnswer !=='' && this.state.seQuest !== '') {
                if (this.state.actual.password === this.state.old) {
                    this.myCall(e.target.name);
                } else {
                    this.setState({
                        errors: {
                            title: "Oops !!",
                            message: "Old Password does not Matches",
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
        }
    };
    async myCall(name){
        if(name === 'setSecurity') {
            const response = await fetch(`/api/setSecurity`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                method: "post",
                body: JSON.stringify({
                    username: sessionStorage.getItem('user'),
                    question: this.state.seQuest,
                    answer: this.state.seAnswer,
                })
            }).catch((err) => {
                console.log(err.message);
            });

            try {
                if(response.status){
                    window.history.back();
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
                if(data[0].question===''){
                    this.setState({
                        errors: {
                            title: "Wait !!",
                            message: "You did not set any security Question yet and your password is default password",
                            type: "info",
                            icon: faInfoCircle
                        }
                    });
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
        return (
            <div className={"container"}>
                <br/><br/>
                <div className='row justify-content-md-center'>
                    <div id='signup-card' className='col-lg-8 col-md-12'>
                        <div className="card bg-dark text-light">
                            <h1 className="card-header text-light lead  text-center "><FontAwesomeIcon icon={faUserSecret}/> Set Security Question </h1>
                            <div className="card-body">
                                <br/>
                                <div>
                                    {errors.title !== "" && <AlertNotify icon={errors.icon} title={errors.title} type={errors.type} message={errors.message} />}
                                    <form align="center">
                                        {isLoading && <Loader/>}
                                        <div className={"row justify-content-md-center"} align="center">
                                            <div className={"mb-4 mb-4 col-md-12 col-lg-8"}><p>Password</p></div>
                                            <div className="input-group mb-4 col-md-12 col-lg-8">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text" id="basic-addon1"><FontAwesomeIcon
                                                        icon={faKey}/></span>
                                                </div>
                                                <input type="password" className="form-control " placeholder="Password"
                                                       name="old"
                                                       onChange={this.onChange}
                                                       required
                                                />
                                            </div>
                                            <div className={"mb-4 mb-4 col-md-12 col-lg-8"}><p>Question</p></div>
                                            <div className="input-group mb-4 col-md-12 col-lg-8">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text" id="basic-addon1"><FontAwesomeIcon icon={faQuestion} /></span>
                                                </div>
                                                <select  name="seQuest" onChange={this.onChange} className ="form-control" required >
                                                    <option value="">Select any Security Question</option>
                                                    <option >What is your nick name?</option>
                                                    <option >Which city/town you born in?</option>
                                                    <option >What was the name of the childhood bestfriend?</option>
                                                    <option >Who is your favuorite author?</option>
                                                    <option>What is the name of your pet?</option>
                                                </select>
                                            </div>
                                            <div className="input-group mb-4 col-md-12 col-lg-8">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text" id="basic-addon1"><FontAwesomeIcon icon={faUserSecret} /></span>
                                                </div>
                                                <input type="password" className="form-control " placeholder="Enter Answer" name="seAnswer"
                                                       onChange={this.onChange}
                                                       required
                                                />
                                            </div>
                                        </div>
                                        <hr/>
                                        <button onClick={this.onChange} name="setSecurity" className="btn btn-outline-success pull-right">Set Security Question</button>
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

export default SetSecurityQuest;
import React from 'react';
import {Redirect} from 'react-router';
import Loader from "../dashboard/loader/loader";
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import {faUserCircle} from "@fortawesome/fontawesome-free-solid";
import {faCheck, faExclamationTriangle, faKey} from "@fortawesome/fontawesome-free-solid/index.es";
import AlertNotify from "../dashboard/alert";
import {Link} from "react-router-dom";

class SignupForm extends React.Component {

    state = {
        data: {
            username:"",
            password:""
        },
        fetchJson:"",
        redirect:false,
        errors:{
            title:"",
            message:"",
            type:"",
            icon:""
        }
    };

    onChange = e =>
        this.setState({
            data:{...this.state.data, [e.target.name] : e.target.value}
        });
componentWillMount(){
    if (sessionStorage.getItem('user') !== ''){
        this.setState({redirect:true});
    }
}
    async myCall(){

        const response = await fetch(`/api/user/uname`, {
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            method: 'post',
            body: JSON.stringify(this.state.data)
        }).catch( (err) =>{
            console.log(err.message);
        });

        try {
            const data = await response.json();
            this.setState({fetchJson: data[0].cnt});
            this.setState({isLoading: false});
            if(data[0].cnt !== 0){
                sessionStorage.setItem('user', this.state.data.username);
                this.setState({
                    errors: {
                        title: "Success",
                        message: "Login Successful !!",
                        type: "success",
                        icon: faCheck
                    }
                });
                this.setState({redirect: true});
            }else{
                this.setState({isLoading:false});
                this.setState({
                    errors:{
                        title:"Login Failed",
                        message:"Username or Password Wrong !!",
                        type:"danger",
                        icon:faExclamationTriangle
                    }
                });
            }

        } catch (e) {
            this.setState({
                errors:{
                    title:"Login Failed",
                    message:"Username or Password Wrong !!",
                    type:"danger",
                    icon:faExclamationTriangle
                }
            });
            this.setState({isLoading:false});
            console.log("FAILED");
        }


    }

    onSubmit = (e) => {
        e.preventDefault();
        this.setState({
            errors:{
                title:"",
                message:"",
                type:""
            }
        });
        this.setState({isLoading:true});
        this.myCall();

    };

    render(){
        const { data,isLoading,errors,redirect } = this.state;
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
        if(redirect){
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
            <div>
                {errors.title !== "" && <AlertNotify icon={errors.icon} title={errors.title} type={errors.type} message={errors.message} />}
                <form onSubmit={this.onSubmit} align="center">
                    {isLoading && <Loader/>}
                    <div className={"row justify-content-md-center"}>
                    <div className="input-group mb-4 col-lg-10 col-md-12">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1"><FontAwesomeIcon icon={faUserCircle} /></span>
                        </div>
                        <input type="text" className="form-control " placeholder="Enter Username" name="username"
                               onChange={this.onChange}
                               value ={data.username}
                               autoFocus required
                        />
                    </div>

                    <div className="input-group mb-4 col-lg-10 col-md-12">
                        <div className="input-group-prepend">
                            <span className="input-group-text " id="basic-addon1"><FontAwesomeIcon icon={faKey} /></span>
                        </div>
                        <input type="password" className="form-control text-dark "  placeholder="Password" name="password"
                                value ={data.password}
                               onChange={this.onChange}
                               required
                                />

                    </div>

                </div>
                    <Link to={"/forgot"} className={"text-help pull-right"}>Forgot Password</Link>
                    <hr/>
                    <button className="btn btn-outline-light pull-right">Login</button>
                </form>
            </div>
        );
    }
}

export default SignupForm;
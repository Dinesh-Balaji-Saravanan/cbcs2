import React from 'react';
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import {
    faEdit, faHourglassEnd, faHourglassStart, faPlusCircle, faTrash, faUserCircle
} from "@fortawesome/fontawesome-free-solid/index.es";
import Loader from "../loader/loader";
import AlertNotify from "../alert";
import TimingTable from "./dep_table";



class DepartManager extends React.Component {

    state = {
        depUsers:[],
        depart:[],
        dep_id:"",
        username:"",
        password:"",
        timing_id:[],
        errors:{
            title:"",
            message:"",
            type:"",
            icon:""
        }
    };
    onSubmit2 = (e) => {
        e.preventDefault();
        if(e.target.name === 'submit'){
            this.myCall('nothing','insert');
        }else if(e.target.name === 'delete'){
            this.myCall('nothing',e.target.name);
        }
    };

    onChange = e =>{
        if(e.target.name === 'depart'){
            this.setState({dep_id:e.target.value});
        }else if(e.target.name === 'name'){
            this.setState({username:e.target.value});
        }else if(e.target.name === 'password'){
            this.setState({password:e.target.value});
        }
    };
    onChange2 = e =>{
        if (this.selectedCheckboxes.has(e.target.value)) {
            this.selectedCheckboxes.delete(e.target.value);
        } else {
            this.selectedCheckboxes.add(e.target.value);
        }
        console.log(this.selectedCheckboxes);
    };

    async myCall(value='',name){

        this.setState({isLoading:true});
        if (name === 'insert'){
            const response = await fetch(`/api/AddDepartmentUsers`, {
                headers : {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                method:"post",
                body:JSON.stringify({
                    dep_id:this.state.dep_id,
                    username:this.state.username,
                    password:this.state.password
                })
            }).catch( (err) =>{
                console.log(err.message);
            });

            try {
                if(response.status){
                    const response = await fetch(`/api/DepartmentUsers`, {
                        headers : {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        }
                    }).catch( (err) =>{
                        console.log(err.message);
                    });

                    try {
                        const data = await response.json();
                        localStorage.setItem('depUsers',JSON.stringify(data));
                        this.setState({depUsers:JSON.parse(localStorage.getItem('depUsers'))});
                        this.setState({isLoading:false});
                    } catch (e) {
                        this.setState({isLoading:false});
                        console.log("FAILED");
                    }
                }
            } catch (e) {

                this.setState({isLoading:false});
                console.log("FAILED");
            }

        }else if(name === 'delete'){
            const response = await fetch(`/api/DeleteDepartmentUsers`, {
                headers : {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                method:"post",
                body:JSON.stringify({
                    uid:Array.from(this.selectedCheckboxes)
                })
            }).catch( (err) =>{
                console.log(err.message);
            });
            try{
                if(response.status){
                    window.location.reload();
                }
            }catch (e){
                console.log(e);
            }
        }
    }
    async componentWillMount(){
        this.setState({isLoading:true});
        const response = await fetch(`/api/DepartmentUsers`, {
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        }).catch( (err) =>{
            console.log(err.message);
        });

        try {
            const data = await response.json();
            localStorage.setItem('depUsers',JSON.stringify(data));
            this.setState({depUsers:JSON.parse(localStorage.getItem('depUsers'))});
            this.setState({isLoading:false});
        } catch (e) {
            this.setState({isLoading:false});
            console.log("FAILED");
        }
        const response2 = await fetch(`/api/department`, {
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        }).catch( (err) =>{
            console.log(err.message);
        });

        try {
            const data = await response2.json();
            this.setState({depart:data});
            this.setState({isLoading:false});
        } catch (e) {
            this.setState({isLoading:false});
            console.log("FAILED");
        }
        this.selectedCheckboxes = new Set();
    }

    render(){
        const {isLoading,errors,depUsers} = this.state;
        return(
            <div>{isLoading && <Loader/>}
                <div id={"padding1"} className={"container "}>
                    <div className={"row card border border-top-0 border-bottom-0 border-light bg-light" }>
                        <div id={"padding-all"} className={"col-12"}>
                            <h4 className={"card-body display-4"} align="center"> <FontAwesomeIcon icon={faUserCircle}/> Department Manager
                            </h4>
                            <div id={"padding-all"} >
                                {errors.title !== "" && <AlertNotify icon={errors.icon} title={errors.title} type={errors.type} message={errors.message} />}
                                <div id={"padding-all"} className={"card "}>
                                    <h4 id={"padding-all"} className="card-title text-center"><FontAwesomeIcon icon={faPlusCircle}/> Add New Timing</h4>
                                    <form >
                                        <div id={"padding-all"} className={" row justify-content-md-center container"}>
                                            <div className={"col-3"}>
                                                <div className="input-group mb-3">
                                                    <input type="text" className={"form-control"} onChange={this.onChange} placeholder="Staff Name" name="name"/>
                                                </div>
                                            </div>
                                            <div className={"col-3"}>
                                                <div className="input-group mb-3">
                                                    <input type="text" className={"form-control"} onChange={this.onChange} placeholder="Password" name="password"/>
                                                </div>
                                            </div>
                                            <div className={"col-3"}>
                                                <div id={"department"} className="input-group mb-3">
                                                    <select className="custom-select" name="depart" onChange={this.onChange}>
                                                        <option value="">Department</option>
                                                        {this.state.depart.map((dap =>{
                                                            return <option value={dap.dep_id}>{dap.dep_name}</option>
                                                        }))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className={"col-2 mb-3"}>
                                                <button onClick={this.onSubmit2} name="submit" className={"btn btn-success"}><FontAwesomeIcon icon={faPlusCircle}/> Add User</button>
                                            </div>
                                        </div>
                                    </form>
                                    <hr/>
                                    <div id={"padding-all"} className={"row justify-content-md-center"}>
                                        <form>
                                            <h4 id={"padding-all"} className="card-title text-center"><FontAwesomeIcon icon={faEdit}/> Update Timing</h4>
                                            <div className={'col-12'} align="center">
                                                <TimingTable depUsers={depUsers} onUserInputChange={this.onChange2} key={depUsers.uid} />
                                                <br/>
                                                <div className={'col-6'}>
                                                    <div className="row justify-content-md-center">
                                                        <div className={"col-6 "}>
                                                            <button name="delete" onClick={this.onSubmit2} className={"btn btn-danger"}><FontAwesomeIcon icon={faTrash}/> Delete</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <br/>
                </div>
            </div>
        );
    }
}

export default DepartManager;
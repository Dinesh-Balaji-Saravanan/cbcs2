import React from 'react';
import {
    faCheck, faEdit, faPlusCircle,
    faTimes, faTrash, faUserCircle
} from "@fortawesome/fontawesome-free-solid/index.es";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import Loader from "../loader/loader";
import AlertNotify from "../alert";
import StaffTable from "./staff_table";
import StaffAssignTable from "./staff_assign_table";

class AddStaff extends React.Component {
    state = {
        errors:{
            title:"",
            message:"",
            type:"",
            icon:""
        },
        depart:[],
        coursesOfDep:[],
        min:"",
        max:"",
        course_id:"",
        add:{
            depart:"",
            name:""
        },
        staffsAll:[],
        staffsAssigned:[],
        checks_staffs:[],
        dep_id:"",
        semester:"",
        elect:"",
        sem:[]
    };
    onChange = e => {
        this.setState({
            add:{...this.state.add, [e.target.name] : e.target.value}
        });
    };
    onChange2 = e =>{
        if(e.target.name === 'depart2'){
            this.setState({dep_id:e.target.value});
            this.myCall('load',e.target.value);
            this.myCall('semester',e.target.value);
        }else if(e.target.name === 'depart3'){
            this.setState({dep_id:e.target.value});
        }else if(e.target.name === 'course'){
            this.setState({course_id:e.target.value});
            this.myCall('minmax',e.target.value);
        }else if(e.target.name === 'sem'){
            this.setState({semester:e.target.value});
        }else if(e.target.name === 'elect'){
            this.myCall('combine_list',e.target.value);
        }
    };
    onClick = e =>{
        e.preventDefault();
        this.setState({isLoading:true});
        if (e.target.name === 'add') {
            this.myCall(e.target.name)
        }else if(e.target.name ==='assign'){
            this.myCall(e.target.name);
        }else if(e.target.name ==='delete'){
            this.myCall(e.target.name);
        }else if(e.target.name ==='deleteStaff'){
            this.myCall(e.target.name);
        }else if(e.target.name ==='deleteStaff'){
            this.myCall(e.target.name);
        }
        this.checkBoxes.clear();
        this.checkBoxes2.clear();
        window.location.reload();
    };

    onClick2 = e =>{
        e.preventDefault();
        if(e.target.name ==='ok'){
            this.myCall('load2',this.state.dep_id);
        }
    };

    async myCall(name,value=''){
        if(name === 'add'){
            await fetch(`/api/${name}_staff`, {
                headers : {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                method:"post",
                body:JSON.stringify(this.state.add)
            }).catch( (err) =>{
                console.log(err.message);
            });

            try {
                this.setState({
                    errors:{
                        title:"Success !!",
                        message:"Staff Details have been added",
                        type:"success",
                        icon:faCheck
                    }
                });
                this.staffList();
                this.setState({isLoading:false});
            } catch (e) {
                this.setState({
                    errors:{
                        title:"Failed !!",
                        message:"Staff Details cannot be added",
                        type:"danger",
                        icon:faTimes
                    }
                });
                this.setState({isLoading:false});
                console.log("FAILED");
            }
        }else if (name === 'semester'){
            const response = await fetch(`/api/${name}`, {
                headers : {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                method:"post",
                body:JSON.stringify({dep_id:value})
            }).catch( (err) =>{
                console.log(err.message);
            });

            try {
                const data = await response.json();
                this.setState({sem: data});
                this.setState({isLoading:false});
            } catch (e) {

                this.setState({isLoading:false});
                console.log("FAILED");
            }

        }else if(name === 'combine_list'){
            const response = await fetch(`/api/courses_list`, {
                headers : {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                method:"post",
                body:JSON.stringify({
                    dep_id:this.state.dep_id,
                    sem:this.state.semester,
                    elect:value
                })
            }).catch( (err) =>{
                console.log(err.message);
            });

            try {
                const data = await response.json();
                this.setState({coursesOfDep: data});
                this.setState({isLoading:false});
            } catch (e) {
                this.setState({isLoading:false});
                console.log("FAILED");
            }
        }
        else if(name === 'minmax'){

            this.setState({isLoading:true});
            const response = await fetch(`/api/minMaxCourse`, {
                headers : {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                method:'post',
                body:JSON.stringify({
                    course_id:value
                })
            }).catch( (err) =>{
                console.log(err.message);
            });

            try {
                const data = await response.json();
                this.setState({min:data[0].min_lim,max:data[0].max_lim});
                this.setState({isLoading:false});
            } catch (e) {
                this.setState({isLoading:false});
                console.log("FAILED");
            }
        }
        else if(name === 'load'){

            this.setState({isLoading:true});
            const response = await fetch(`/api/staffsOfDep`, {
                headers : {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                method:'post',
                body:JSON.stringify({
                    dep_id:value
                })
            }).catch( (err) =>{
                console.log(err.message);
            });

            try {
                const data = await response.json();
                this.setState({staffsAll:data});
                this.setState({isLoading:false});
            } catch (e) {
                this.setState({isLoading:false});
                console.log("FAILED");
            }
        }
        else if(name === 'load2'){

            this.setState({isLoading:true});
            const response = await fetch(`/api/staffsAssigned`, {
                headers : {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                method:'post',
                body:JSON.stringify({
                    dep_id:value
                })
            }).catch( (err) =>{
                console.log(err.message);
            });

            try {
                const data = await response.json();
                this.setState({staffsAssigned:data});
                this.setState({isLoading:false});
            } catch (e) {
                this.setState({isLoading:false});
                console.log("FAILED");
            }
        }
        else if(name === 'assign'){

            this.setState({isLoading:true});
            await fetch(`/api/assignToStaff`, {
                headers : {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                method:'post',
                body:JSON.stringify({
                    course_id:this.state.course_id,
                    min:this.state.min,
                    max:this.state.max,
                    staff_id:Array.from(this.checkBoxes)
                })
            }).catch( (err) =>{
                console.log(err.message);
            });

            try {
                this.setState({
                    errors: {
                        title: "Success !!",
                        message: "Staff Assignment have been added",
                        type: "success",
                        icon: faCheck
                    }
                });
                this.setState({isLoading: false});
            } catch (e) {
                this.setState({
                    errors:{
                        title:"Failed !!",
                        message:"Staff Assignment not added",
                        type:"success",
                        icon:faCheck
                    }
                });
                this.setState({isLoading:false});
                console.log("FAILED");
            }
        }
        else if(name === 'delete'){

            this.setState({isLoading:true});
            await fetch(`/api/delete_staffAssign`, {
                headers : {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                method:'post',
                body:JSON.stringify({
                    assign_id:Array.from(this.checkBoxes2)
                })
            }).catch( (err) =>{
                console.log(err.message);
            });

            try {
                this.setState({
                    errors: {
                        title: "Success !!",
                        message: "Staff Assignment have been Delete",
                        type: "success",
                        icon: faCheck
                    }
                });
                this.setState({isLoading: false});
                this.setState({staffsAssigned:[]});
            } catch (e) {
                this.setState({
                    errors:{
                        title:"Failed !!",
                        message:"Staff Assignment not Deleted",
                        type:"danger",
                        icon:faCheck
                    }
                });
                this.setState({isLoading:false});
                console.log("FAILED");
            }
        }
        else if(name === 'deleteStaff'){

            this.setState({isLoading:true});
            await fetch(`/api/delete_staff`, {
                headers : {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                method:'post',
                body:JSON.stringify({
                    staff_id:Array.from(this.checkBoxes)
                })
            }).catch( (err) =>{
                console.log(err.message);
            });

            try {
                this.setState({
                    errors: {
                        title: "Success !!",
                        message: "Staff have been Delete",
                        type: "success",
                        icon: faCheck
                    }
                });
                this.setState({isLoading: false});
                const response2 = await fetch(`/api/staffs`, {
                    headers : {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    }
                }).catch( (err) =>{
                    console.log(err.message);
                });

                try {
                    const data = await response2.json();
                    this.setState({staffsAll:data});
                } catch (e) {
                    console.log("FAILED");
                }
            } catch (e) {
                this.setState({
                    errors:{
                        title:"Failed !!",
                        message:"Staff not Deleted",
                        type:"danger",
                        icon:faCheck
                    }
                });
                this.setState({isLoading:false});
                console.log("FAILED");
            }
        }
    }
    async staffList(){
        const response = await fetch(`/api/staffs`, {
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            method:"get"
        }).catch( (err) =>{
            console.log(err.message);
        });

        try {
            const data = await response.json();
            this.setState({staffsAll:data});
        } catch (e) {
            console.log("FAILED");
        }
    }
    async componentWillMount(){
        const response = await fetch(`/api/department`, {
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        }).catch( (err) =>{
            console.log(err.message);
        });

        try {
            const data = await response.json();
            this.setState({depart:data});
        } catch (e) {
            console.log("FAILED");
        }
        const response2 = await fetch(`/api/staffs`, {
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        }).catch( (err) =>{
            console.log(err.message);
        });

        try {
            const data = await response2.json();
            this.setState({staffsAll:data});
        } catch (e) {
            console.log("FAILED");
        }

        this.checkBoxes = new Set();
        this.checkBoxes2 = new Set();
    }

    onChange3 = e => {
        let value = e.target.value;
        let name = e.target.name;

        if (name === 'check') {
            if (!this.checkBoxes.has(value)) {
                this.checkBoxes.add(value);
            } else {
                this.checkBoxes.delete(value);
            }
        }if (name === 'check2') {
            if (!this.checkBoxes2.has(value)) {
                this.checkBoxes2.add(value);
            } else {
                this.checkBoxes2.delete(value);
            }
        }
        this.setState({checks_staffs:Array.from(this.checkBoxes)});

    };

    render() {
        const {isLoading,errors} = this.state;
        return (
            <div>{isLoading && <Loader/>}
                <div id={"padding1"} className={"container "}>
                    <div className={"row card border border-top-0 border-bottom-0 border-light bg-light" }>
                        <div id={"padding-all"} className={"col-12"}>
                            <h4 className={"card-body display-4"} align="center"> <FontAwesomeIcon icon={faUserCircle}/> Staff
                            </h4>
                            <div id={"padding-all"} >
                                {errors.title !== "" && <AlertNotify icon={errors.icon} title={errors.title} type={errors.type} message={errors.message} />}
                                <div id={"padding-all"} className={"card "}>
                                    <h4 id={"padding-all"} className="card-title text-center"><FontAwesomeIcon icon={faPlusCircle}/> Add New Staff</h4>
                                    <form  >
                                        <div id={"padding-all"} className={"row justify-content-md-center container"}>
                                            <div className={"col-5"}>
                                                <div className="form-group">
                                                    <label for="exampleInputEmail1">Staff Name</label>
                                                    <input type="text" className="form-control" onChange={this.onChange} name="name" placeholder="Name"/>
                                                </div>
                                            </div>
                                            <div className={"col-5"}>
                                                <div className="form-group">
                                                    <label for="exampleInputEmail1">Department</label>
                                                    <select className="custom-select" name="depart" onChange={this.onChange}>
                                                        <option value="">Department</option>
                                                        {this.state.depart.map((dap =>{
                                                            return <option value={dap.dep_id}>{dap.dep_name}</option>
                                                        }))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-2">
                                                <br/>
                                                <button onClick={this.onClick} name="add" className="btn btn-success"><FontAwesomeIcon icon={faPlusCircle}/> Add</button>
                                            </div>
                                        </div>
                                    </form>
                                    <hr/>
                                    <div id={"padding-all"} >
                                        <form id={"staffListTable"}>
                                            <h4 id={"padding-all"} className="card-title text-center"><FontAwesomeIcon icon={faEdit}/> Assign Staff</h4>
                                            <div className={"row justify-content-md-center"}>
                                                <div className={'col-6'} align="center">
                                                    <div className="row">
                                                        <div className="col-12">
                                                            <div className="form-group">
                                                                <label for="exampleInputEmail1">Department</label>
                                                                <select className="custom-select" name="depart2" onChange={this.onChange2}>
                                                                    <option value="">Department</option>
                                                                    {this.state.depart.map((dap =>{
                                                                        return <option value={dap.dep_id}>{dap.dep_name}</option>
                                                                    }))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <br/>
                                                    <StaffTable staffs={this.state.staffsAll} onUserInputChange={this.onChange3} key={this.state.staffsAll.staff_id} />
                                                    <br/>
                                                </div>
                                                <div className={"col-6"}>
                                                    <div className="form-group mb-3">
                                                        <label for="exampleInputEmail1">Semester</label>
                                                        <select className="custom-select" name="sem" onChange={this.onChange2}>
                                                            <option value="">Sem</option>
                                                            {this.state.sem.map((dap =>{
                                                                return <option key={dap.sem} value={dap.sem}>{dap.sem}</option>
                                                            }))}
                                                        </select>
                                                    </div>
                                                    <div id={"semester"} className="form-group mb-3">
                                                        <label for="exampleInputEmail1">Elective Type</label>
                                                        <select className="custom-select" name="elect" onChange={this.onChange2}>
                                                            <option value="">Elective Type</option>
                                                            <option value="1">Professional Elective</option>
                                                            <option value="2">Open Elective</option>
                                                        </select>
                                                    </div>
                                                    <div className="form-group">
                                                        <label for="exampleInputEmail1">Courses</label>
                                                        <select className="custom-select" name="course" onChange={this.onChange2}>
                                                            <option value="">Select Courses</option>
                                                            {this.state.coursesOfDep.map((course =>{
                                                                return <option maximum={course.max_lim} minimum={course.min_lim} value={course.course_id}>{course.course_code+" "+course.course_name}</option>
                                                            }))}
                                                        </select>
                                                    </div>
                                                    <button name="assign" onClick={this.onClick} className={"btn btn-success"}><FontAwesomeIcon icon={faEdit}/> Assign Staff</button>
                                                    <br/><br/>
                                                    <div className={"form-group"}><button name="deleteStaff" onClick={this.onClick} className={"btn btn-danger"}><FontAwesomeIcon icon={faTrash}/> Delete Staff</button></div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <hr/>
                                    <div id={"padding-all"} >
                                        <form id={"staffAssignTable"}>
                                            <h4 id={"padding-all"} className="card-title text-center"><FontAwesomeIcon icon={faEdit}/> Assigned staffs</h4>
                                            <div className={"row justify-content-md-center"}>
                                                <div className={'col-12'} align="center">
                                                    <div className="row justify-content-md-center">
                                                        <div className={"col-3"}>
                                                            <div id={"department"} className="input-group mb-3">
                                                                <select className="custom-select" name="depart3" onChange={this.onChange2}>
                                                                    <option value="">Department</option>
                                                                    {this.state.depart.map((dap =>{
                                                                        return <option key={dap.dep_id} value={dap.dep_id}>{dap.dep_name}</option>
                                                                    }))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className={"col-2"}>
                                                            <div id={"semester"} className="input-group mb-3">
                                                                <button name="ok" onClick={this.onClick2} className={"btn btn-success"}>OK</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <br/>
                                                    <StaffAssignTable staffs={this.state.staffsAssigned} onUserInputChange={this.onChange3} key={this.state.staffsAssigned.assign_id} />
                                                    <br/>
                                                </div>
                                                <div className={"col-6 offset-4"}>
                                                    <button name="delete" onClick={this.onClick} className={"btn btn-danger"}><FontAwesomeIcon icon={faTrash}/> Delete</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddStaff;
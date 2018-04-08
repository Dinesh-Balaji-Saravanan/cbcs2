import React from 'react';
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import {
    faExclamationTriangle, faFileAlt
} from "@fortawesome/fontawesome-free-solid/index.es";
import Loader from "../loader/loader";
import AlertNotify from "../alert";
import CombineTable from "./table_timing";
import TableComb from "./table_combine";



class GroupCourses extends React.Component {

    state = {
        depart:[],
        groupings:[],
        sem:[],
        dep_id:"",
        dep_id2:"",
        semester:"",
        elect:"",
        elect_name:"",
        course_list:[],
        comb_name:"",
        department:"",
        errors:{
            title:"",
            message:"",
            type:"",
            icon:""
        },
        data:{
            start_date:"",
            end_date:""
        }
    };
    constructor() {
        super();
        this.onSubmit3 = this.onSubmit3.bind(this);
    }
    onSubmit = (e) => {
        e.preventDefault();
        this.myCall('nothing','combine_list');
    };
    onSubmit3 = (e) => {
        e.preventDefault();
        if (this.state.comb_name.length !== 0 && Array.from(this.selectedCheckboxes1).length !== 0) {

            this.myCall('insert_combination');
            window.location.reload();
        } else {
            this.setState({
                errors:{
                    title:"Insert Value",
                    message:"Value is Missing !!",
                    type:"danger",
                    icon:faExclamationTriangle
                }
            });
        }
    };
    onSubmit2 = (e) => {
        e.preventDefault();
        if(e.target.name === 'update'){
            this.myCall2(e.target.name);
            window.location.reload();
        }else if(e.target.name === 'delete'){
            this.myCall2(e.target.name);
            window.location.reload();
        }else if(e.target.name === 'ok'){
            this.myCall2(e.target.name);
        }
    };

    async myCall2(name){
        if(name === 'delete') {
            this.setState({isLoading: true});
            const response = await fetch(`/api/${name}_grp`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                method:"post",
                body:JSON.stringify({grp_name:Array.from(this.selectedCheckboxes2),dep_id:this.state.department})
            }).catch((err) => {
                console.log(err.message);
            });

            try {
                await response.json();
                this.setState({isLoading: false});
            } catch (e) {
                this.setState({groupings:[]});
                this.setState({isLoading: false});
                console.log("FAILED");
            }
            const response2 = await fetch(`/api/all_combinations`, {
                headers : {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            }).catch( (err) =>{
                console.log(err.message);
            });

            try {
                const data = await response2.json();
                this.setState({combinations:data});
            } catch (e) {
                console.log("FAILED");
            }

        }else if(name === 'ok') {
            this.setState({isLoading: true});
            const response = await fetch(`/api/groupingsOfDep`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                method:"post",
                body:JSON.stringify({dep_id:this.state.department})
            }).catch((err) => {
                console.log(err.message);
            });

            try {
                const data = await response.json();
                localStorage.setItem('groupings',JSON.stringify(data));
                this.setState({groupings:JSON.parse(localStorage.getItem('groupings'))});
                this.setState({isLoading: false});
            } catch (e) {
                this.setState({isLoading: false});
                console.log("FAILED");
            }
        }

    }

    onChange = e =>{
        this.setState({
            data:{...this.state.data, [e.target.name] : e.target.value}
        });
        if(e.target.name === 'depart'){
            this.setState({dep_id:e.target.value});
            this.myCall(e.target.value,'semester');
        }else if(e.target.name === 'depart2'){
            this.setState({dep_id2:e.target.value});
        }else if(e.target.name === 'sem'){
            this.setState({semester:e.target.value});
        }else if(e.target.name === 'elect'){
            this.setState({elect:e.target.value});
            if(e.target.value === '1' ){
                this.setState({elect_name:"Professional Elective"});
            }else{
                this.setState({elect_name:"Open Elective"});
            }
        }else if(e.target.name === 'comb_name'){
            this.setState({comb_name:e.target.value});
        }else if(e.target.name === 'department'){
            this.setState({department:e.target.value});
        }
    };
    onChange2 = e =>{

         if(e.target.name ==='check1[]'){
            if (this.selectedCheckboxes1.has(e.target.value)) {
                this.selectedCheckboxes1.delete(e.target.value);
            } else {
                this.selectedCheckboxes1.add(e.target.value);
            }
        }else if(e.target.name ==='check2[]'){
            if (this.selectedCheckboxes2.has(e.target.value)) {
                this.selectedCheckboxes2.delete(e.target.value);
            } else {
                this.selectedCheckboxes2.add(e.target.value);
            }
        }
    };

    async myCall(value='',name){

        this.setState({isLoading:true});
        if (name === 'semester'){
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

        } else if(name === 'combine_list'){
            const response = await fetch(`/api/courses_list`, {
                headers : {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                method:"post",
                body:JSON.stringify({
                    dep_id:this.state.dep_id,
                    sem:this.state.semester,
                    elect:this.state.elect
                })
            }).catch( (err) =>{
                console.log(err.message);
            });

            try {
                const data = await response.json();
                this.setState({course_list: data});
                this.setState({isLoading:false});
            } catch (e) {
                this.setState({isLoading:false});
                console.log("FAILED");
            }
        } else {
            await fetch(`/api/insert_group`, {
                headers : {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                method:"post",
                body:JSON.stringify({
                    check_course: Array.from(this.selectedCheckboxes1),
                    dep_id: this.state.dep_id2,
                    grp_name: this.state.comb_name
                })
            }).catch( (err) =>{
                console.log(err.message);
            });
            try {
                this.setState({
                    errors:{
                        title:"Successfully Inserted",
                        message:"Group is Created !!",
                        type:"success",
                        icon:faExclamationTriangle
                    }
                });

                this.setState({groupings:[]});
                this.setState({isLoading:false});
            } catch (e) {
                this.setState({isLoading:false});
                console.log("FAILED");
            }

        }
    }
    async componentWillMount(){
        this.setState({isLoading:true});
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

        this.selectedCheckboxes1 = new Set();
        this.selectedCheckboxes2 = new Set();
    }

    render(){
        const {isLoading,errors} = this.state;
        return(
            <div>{isLoading && <Loader/>}
                <div id={"padding1"} className={"container "}>
                    <div className={"row card border border-top-0 border-bottom-0 border-light bg-light" }>
                        <div id={"padding-all"} className={"col-12"}>

                            <h4 className={"card-body display-4"} align="center"> <FontAwesomeIcon icon={faFileAlt}/> Group Courses
                            </h4>
                            <div id={"padding-all"} >

                                <div id={"padding-all"} className={"card "}>
                                    <form onSubmit={this.onSubmit} >
                                        <div id={"padding-all"} className={" row justify-content-md-center container"}>
                                            <div className={"col-3"}>
                                                <div id={"department"} className="input-group mb-3">
                                                    <select className="custom-select" name="depart" onChange={this.onChange}>
                                                        <option value="">Department</option>
                                                        {this.state.depart.map((dap =>{
                                                            return <option key={dap.dep_id} value={dap.dep_id}>{dap.dep_name}</option>
                                                        }))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className={"col-3"}>
                                                <div id={"semester"} className="input-group mb-3">
                                                    <select className="custom-select" name="sem" onChange={this.onChange}>
                                                        <option value="">Sem</option>
                                                        {this.state.sem.map((dap =>{
                                                            return <option key={dap.sem} value={dap.sem}>{dap.sem}</option>
                                                        }))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className={"col-3"}>
                                                <div id={"semester"} className="input-group mb-3">
                                                    <select className="custom-select" name="elect" onChange={this.onChange}>
                                                        <option value="">Elective Type</option>
                                                        <option value="1">Professional Elective</option>
                                                        <option value="2">Open Elective</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className={"col-1 mb-3"}>
                                                <button type="submit"  className={"btn btn-success"}>OK</button>
                                            </div>
                                        </div>
                                    </form>
                                    <h4 id={"padding-all"} className="card-title text-center">Select courses and Department : {this.state.elect_name}</h4>
                                    {errors.title !== "" && <AlertNotify icon={errors.icon} title={errors.title} type={errors.type} message={errors.message} />}
                                    <form onSubmit={this.onSubmit3}>
                                        <div className={"row justify-content-md-center"}>
                                            <div className={'col-6'} align="center">
                                                <CombineTable table_data={this.state.course_list} onUserInputChange={this.onChange2} key={this.state.course_list.course_id} />

                                            </div>
                                            <div className={'col-6'} align="center">
                                                <div className="row justify-content-center">
                                                    <div className={"col-8"}>
                                                        <div id={"department"} className="input-group mb-3">
                                                            <select className="custom-select" name="depart2" onChange={this.onChange}>
                                                                <option value="">Department</option>
                                                                {this.state.depart.map((dap =>{
                                                                    return <option key={dap.dep_id} value={dap.dep_id}>{dap.dep_name}</option>
                                                                }))}
                                                            </select>
                                                        </div>
                                                        <div className={"mb-3"}><input type="text" name="comb_name" onChange={this.onChange} className="form-control" placeholder="Group Name"/></div>
                                                        <button type="submit" className={'btn btn-success'}>Group</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <hr/>
                                    </form>
                                    <h4  className="card-title text-center">Combinations</h4>
                                    <form>
                                        <div className={'row justify-content-md-center'} align="center">
                                            <div className={"col-3"}>
                                                <div id={"department"} className="input-group mb-3">
                                                    <select className="custom-select" name="department" onChange={this.onChange}>
                                                        <option value="">Department</option>
                                                        {this.state.depart.map((dap =>{
                                                            return <option key={dap.dep_id} value={dap.dep_id}>{dap.dep_name}</option>
                                                        }))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className={"col-2"}>
                                                <div id={"semester"} className="input-group mb-3">
                                                    <button name="ok" onClick={this.onSubmit2} className={"btn btn-success"}>OK</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={'row justify-content-md-center'} align="center">
                                            <div className={"col-8"}>
                                            <div  align="center">
                                                <TableComb table_data={this.state.groupings} onCheckBoxChange={this.onChange2} key={this.state.groupings.grp_id} />
                                                <br/>
                                            </div>
                                            </div>
                                            <div className={"col-6 mb-3"}>
                                                <button type="submit" onClick={this.onSubmit2} name="delete" className={"btn btn-danger"}>Delete</button>
                                            </div>
                                        </div>
                                    </form>
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

export default GroupCourses;
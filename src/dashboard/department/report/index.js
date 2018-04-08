import React from 'react';
import "../../../css/main.css"
import {faChartBar, faCheck, faExclamationTriangle} from "@fortawesome/fontawesome-free-solid/index.es";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import MediaListCourse from "./media_list";
import Loader from "../../loader/loader";
import * as XLSX from "xlsx";
import AlertNotify from "../../alert";

class DepReport extends React.Component {
    state= {
        depart:[],
        dep_id:"",
        sem:[],
        semester:"",
        course_id:"",
        errors:{
            title:"",
            message:"",
            type:"",
            icon:""
        },
        CoursesAvail:[],
        export:[]
    };
    onSubmit2 = (e) => {
        e.preventDefault();
        if(e.target.name === 'ok'){
            this.myCall(e.target.name);
        }if(e.target.name === 'export'){
            this.myCall('export');
        }
    };
    onChange = (e) =>{
        if(e.target.name === 'sem'){
            this.setState({semester:e.target.value});
        }else if(e.target.name === 'course'){
            this.setState({course_id:e.target.value});
        }
    };

    async myCall(name,value=''){
        if(name === 'ok') {
            this.setState({isLoading: true});
            const response = await fetch(`/api/coursesOfDepSem`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                method:"post",
                body:JSON.stringify({dep_id:this.state.dep_id,sem:this.state.semester})
            }).catch((err) => {
                console.log(err.message);
            });

            try {
                const data = await response.json();
                localStorage.setItem('CoursesAvail',JSON.stringify(data));
                this.setState({CoursesAvail:JSON.parse(localStorage.getItem('CoursesAvail'))});
                this.setState({isLoading: false});
            } catch (e) {
                this.setState({isLoading: false});
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

        }else if (name === 'export'){
            const response = await fetch(`/api/export`, {
                headers : {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                method:"post",
                body:JSON.stringify({
                    sem:this.state.semester,
                    course_id:this.state.course_id,
                    dep_id:this.state.dep_id
                })
            }).catch( (err) =>{
                console.log(err.message);
            });
            try {
                const data = await response.json();
                if (data.length !== 0) {
                    this.setState({
                        errors:{
                            title:"Super !!",
                            message:"You Can Download as Excel",
                            type:"info",
                            icon:faCheck
                        }
                    });
                    const xls = XLSX.utils.json_to_sheet(Array.from(data));
                    console.log(data);
                    const workbook = {Sheets: {'data': xls}, SheetNames: ['data']};
                    XLSX.writeFile(workbook, 'export.xlsx', {bookType: 'xlsx', type: 'binary'});
                }else{
                    this.setState({
                        errors:{
                            title:"Cannot Export",
                            message:"No Students have enrolled !!",
                            type:"danger",
                            icon:faExclamationTriangle
                        }
                    });
                }
                this.setState({isLoading:false});
            } catch (e) {

                this.setState({isLoading:false});
                console.log("FAILED");
            }
        }
    }
    async componentWillMount(){

        this.setState({dep_id:sessionStorage.getItem('dep_id')});
        this.myCall('semester',sessionStorage.getItem('dep_id'));
    }

    render() {
        const {CoursesAvail,errors} = this.state;
        return (
            <div id={"padding1"}>{this.state.isLoading && <Loader/>}
                <div id={"padding-all"} className={"card border border-top-0 border-bottom-0 border-light bg-light"}>
                    <div  className={"card-body"}>
                        <div className={"row justify-content-md-center " }>
                            <div id={"padding-all"} className={"col-12"} align="center">
                                <h2 className={"card-body"}><em><FontAwesomeIcon icon={faChartBar}/> Report </em></h2><hr/>
                            </div>
                        </div>
                        {errors.title !== "" && <AlertNotify icon={errors.icon} title={errors.title} type={errors.type} message={errors.message} />}
                        <div className={'row justify-content-md-center'} align="center">
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
                            <div className={"col-1"}>
                                <div id={"semester"} className="input-group mb-3">
                                    <button name="ok" onClick={this.onSubmit2} className={"btn btn-success"}>OK</button>
                                </div>
                            </div>
                            <div className={"col-4"}>
                                <div id={"semester"} className="input-group mb-3">
                                    <select className="custom-select" name="course" onChange={this.onChange}>
                                        <option value="">Courses</option>
                                        {CoursesAvail.map((courses =>{
                                            return <option key={courses.course_id} value={courses.course_id}>{courses.course_code+" "+courses.course_name}</option>
                                        }))}
                                    </select>
                                </div>
                            </div>
                            <div className={"col-2"}>
                                <div id={"semester"} className="input-group mb-3">
                                    <button name="export" onClick={this.onSubmit2} className={"btn btn-success"}>Export</button>
                                </div>
                            </div>
                        </div>
                            <div className={"row justify-content-md-center"}><div id={"padding-all"} className="row justify-content-md-center" align="center">
                                {CoursesAvail.map((courses)=>{
                                    return <MediaListCourse courses={courses} key={courses.course_id} onUserInputChange={this.handleUserInputChange} />
                                })}
                                <hr/>
                                <br/>
                            </div></div>
                    </div>
                </div>
                <br/>
            </div>
        );
    }
}

export default DepReport;
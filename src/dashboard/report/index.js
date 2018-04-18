import React from 'react';
import "../../css/main.css"
import {faChartBar, faCheck, faExclamationTriangle} from "@fortawesome/fontawesome-free-solid/index.es";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import MediaListCourse from "./media_list";
import Loader from "../loader/loader";
import * as XLSX from "xlsx";
import AlertNotify from "../alert";
import  * as jsPDF  from 'jspdf'
import * as html2canvas from "html2canvas";

class Report extends React.Component {
    state= {
        depart:[],
        dep_id:"",
        sem:[],
        sec:[],
        elect:"",
        section:"",
        student_count:"",
        semester:"",
        course_id:"",
        errors:{
            title:"",
            message:"",
            type:"",
            icon:""
        },
        CoursesAvail:[],
        export_detail:[],
        export:[],
        view:false,
        without:false
    };
    onSubmit2 = (e) => {
        e.preventDefault();
        if(e.target.name === 'ok'){
            this.myCall(e.target.name);
        }if(e.target.name === 'export'){
            this.myCall('export');
        }if(e.target.name === 'pdf'){
            this.setState({without:false});
            this.myCall('export','pdf');
        }if(e.target.name === 'pdf_without'){
            this.setState({without:true});
            this.myCall('without','pdf');
        }if(e.target.name === 'without'){
            this.myCall('without');
        }
    };
    onChange = (e) =>{
        if(e.target.name === 'depart'){
            this.setState({dep_id:e.target.value});
            this.myCall('semester',e.target.value);
        }else if(e.target.name === 'sem'){
            this.setState({semester:e.target.value});
            this.myCall('section',e.target.value);
        }else if(e.target.name === 'course'){
            this.setState({course_id:e.target.value});
        }else if(e.target.name === 'sec'){
            this.setState({section:e.target.value});
        }else if(e.target.name === 'elect'){
            this.setState({elect:e.target.value});
            if(e.target.value === '1' ){
                this.setState({elect_name:"Professional Elective"});
            }else{
                this.setState({elect_name:"Open Elective"});
            }
        }
    };

    async myCall(name,value=''){
        if(name === 'ok') {
            this.setState({isLoading: true});
            const response = await fetch(`/api/courses_list`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                method:"post",
                body:JSON.stringify({dep_id:this.state.dep_id,sem:this.state.semester,elect:this.state.elect})
            }).catch((err) => {
                console.log(err.message);
            });

            try {
                const data = await response.json();
                localStorage.setItem('CoursesAvail',JSON.stringify(data));
                this.setState({CoursesAvail:JSON.parse(localStorage.getItem('CoursesAvail'))});
                sessionStorage.setItem('report','load');

                const response2 = await fetch(`/api/StudCount`, {
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
                    const data2 = await response2.json();
                    console.log(data2[0]);
                    this.setState({student_count:data2[0].cnt});
                } catch (e) {
                    this.setState({isLoading: false});
                    console.log("FAILED");
                }

                this.setState({isLoading: false});
            } catch (e) {
                this.setState({isLoading: false});
                console.log("FAILED");
            }
        }else if (name === 'semester'){
            this.setState({isLoading: true});
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

        }else if(name === 'section') {
            this.setState({isLoading: true});
            const response = await fetch(`/api/${name}`, {
                headers : {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                method:"post",
                body:JSON.stringify({depid:this.state.dep_id,sem:value})
            }).catch( (err) =>{
                console.log(err.message);
            });

            try {
                const data = await response.json();
                this.setState({sec: data});
                this.setState({view: true});
                this.setState({isLoading:false});

            } catch (e) {

                console.log("FAILED");
            }
        }else if (name === 'export'){
            this.setState({isLoading: true});
            const response = await fetch(`/api/export`, {
                headers : {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                method:"post",
                body:JSON.stringify({
                    sem:this.state.semester,
                    course_id:this.state.course_id,
                    dep_id:this.state.dep_id,
                    sec:this.state.section,
                    elect:this.state.elect
                })
            }).catch( (err) =>{
                console.log(err.message);
            });
            try {
                const data = await response.json();
                if (data.length !== 0 && value !=='pdf') {
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
                    XLSX.writeFile(workbook, 'Export.xlsx', {bookType: 'xlsx', type: 'binary'});
                }if(data.length !== 0 && value ==='pdf'){
                    this.setState({
                        export_detail:data,
                    })
                }else{
                    this.setState({
                        errors:{
                            title:"Cannot Export",
                            message:"No Records Found !!",
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
        }else if (name === 'without'){
            this.setState({isLoading: true});
            const response = await fetch(`/api/export_without`, {
                headers : {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                method:"post",
                body:JSON.stringify({
                    sem:this.state.semester,
                    course_id:this.state.course_id,
                    dep_id:this.state.dep_id,
                    sec:this.state.section,
                    elect:this.state.elect
                })
            }).catch( (err) =>{
                console.log(err.message);
            });
            try {
                const data = await response.json();
                if (data.length !== 0 && value !=='pdf') {
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
                }if(data.length !== 0 && value ==='pdf'){
                    this.setState({
                        export_detail:data
                    })
                }else{
                    this.setState({
                        errors:{
                            title:"Cannot Export",
                            message:"No Records Found !!",
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

    onPrint = (e) =>{
        let pdf = new jsPDF('l', 'pt', 'a4');
        let source = document.getElementById('divToPrint');
        let specialElementHandlers = {
            '#bypassme': function(element, renderer){
                return true
            }
        };
        let margins = {
            top: 50,
            left: 50,
            width: 545
        };
        pdf.fromHTML(
            source // HTML string or DOM elem ref.
            , margins.left // x coord
            , margins.top // y coord
            , {
                'width': margins.width // max width of content on PDF
                , 'elementHandlers': specialElementHandlers
            },
            function (dispose) {
                // dispose: object with X, Y of the last line add to the PDF
                //          this allow the insertion of new lines after html
                pdf.save('html2pdf.pdf');
            }
        )
    };

    async componentWillMount(){
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
    }

    render() {
        const {CoursesAvail,errors} = this.state;
        return (
            <div id={"padding-all"}><div id={"padding1"} >{this.state.isLoading && <Loader/>}
                <div className={"card border border-top-0 border-bottom-0 border-light bg-light"}>
                    <div  className={"card-body"}>
                        <div className={"row justify-content-md-center " }>
                            <div id={"padding-all"} className={"col-12"} align="center">
                                <h2 className={"card-body"}><em><FontAwesomeIcon icon={faChartBar}/> Report </em></h2><hr/>
                            </div>
                        </div>
                        {errors.title !== "" && <AlertNotify icon={errors.icon} title={errors.title} type={errors.type} message={errors.message} />}
                        <div id={"this"} className={'row justify-content-md-center'} align="center">
                            <div className={"col-lg-3 col-md-12"}>
                                <div id={"department"} className="input-group mb-3">
                                    <select className="custom-select" name="depart" onChange={this.onChange}>
                                        <option value="">Department</option>
                                        {this.state.depart.map((dap =>{
                                            return <option key={dap.dep_id} value={dap.dep_id}>{dap.dep_name}</option>
                                        }))}
                                    </select>
                                </div>
                            </div>
                            <div className={"col-lg-2 col-md-12"}>
                                <div id={"semester"} className="input-group mb-3">
                                    <select className="custom-select" name="sem" onChange={this.onChange}>
                                        <option value="">Sem</option>
                                        {this.state.sem.map((dap =>{
                                            return <option key={dap.sem} value={dap.sem}>{dap.sem}</option>
                                        }))}
                                    </select>
                                </div>
                            </div>
                            <div className={"col-lg-3 col-md-12"}>
                                <div id={"semester"} className="input-group mb-3">
                                    <select className="custom-select" name="elect" onChange={this.onChange}>
                                        <option value="">Elective Type</option>
                                        <option value="1">Professional Elective</option>
                                        <option value="2">Open Elective</option>
                                    </select>
                                </div>
                            </div>
                            <div className={"col-lg-1 col-md-12"}>
                                <div id={"semester"} className="input-group mb-3">
                                    <button name="ok" onClick={this.onSubmit2} className={"btn btn-success"}>OK</button>
                                </div>
                            </div>
                        </div>
                            <div className={"row justify-content-md-center"}>
                                <div id={"section"} className="input-group mb-3 col-lg-2 col-md-12"  onChange={this.onChange}>
                                    <select className="custom-select" name="sec">
                                        <option value="">Section</option>
                                        {this.state.sec.map((dap =>{
                                            return <option value={dap.sec}>{dap.sec}</option>
                                        }))}
                                    </select>
                                </div>
                                <div className={"col-lg-3 col-md-12"}>
                                    <div id={"semester"} className="input-group mb-3">
                                        <select className="custom-select" name="course" onChange={this.onChange}>
                                            <option value="">Courses</option>
                                            {CoursesAvail.map((courses =>{
                                                return <option key={courses.course_id} value={courses.course_id}>{courses.course_code+" "+courses.course_name}</option>
                                            }))}
                                        </select>
                                    </div>
                                </div>
                                {sessionStorage.getItem('user').toUpperCase()==='ADMIN' && <div className={"col-lg-2 col-md-12"}>
                                    <div id={"semester"} className="input-group mb-3">
                                        <button name="export" onClick={this.onSubmit2} className={"btn btn-success"}>Export With Staff</button>
                                    </div>
                                </div>}
                                {sessionStorage.getItem('user').toUpperCase()==='ADMIN' && <div className={"col-lg-2 col-md-12"}>
                                    <div id={"semester"} className="input-group mb-3">
                                        <button name="without" onClick={this.onSubmit2} className={"btn btn-success"}>Export Without Staff</button>
                                    </div>
                                </div>}
                            </div>
                        {this.state.student_count && <div className={"row justify-content-md-center"}>
                            <div className={"col-lg-2 col-md-12"}>
                                <div id={"semester"} className="input-group mb-3">
                                    <button name="pdf_without" onClick={this.onSubmit2}
                                            data-toggle="modal" data-target="#example" className={"btn btn-primary"}>
                                        PDF without Staff
                                    </button>
                                </div>
                            </div>
                            <div className={"col-lg-2 col-md-12"}>
                                <div id={"semester"} className="input-group mb-3">
                                    <button name="pdf" onClick={this.onSubmit2}
                                            data-toggle="modal" data-target="#example" className={"btn btn-primary"}>
                                        PDF with Staff
                                    </button>
                                </div>
                            </div>
                            {this.state.student_count && <div className={"col-lg-12 col-md-12"} align="center">
                                <h3>Total Students Count: {this.state.student_count}</h3></div>}
                        </div>}
                        <div className="modal fade bd-example-modal-lg"  id={"example"} tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-lg" style={{maxWidth:'1000px'}}>
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Modal title</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    {this.state.export_detail.length !==0 && <div className="modal-body">
                                        <div id="divToPrint" >
                                            {this.state.without ?
                                                <table className="table table-sm table-bordered" >
                                                    <thead>
                                                        <tr className="h6">
                                                            <th scope="col">Reg. No.</th>
                                                            <th scope="col">Student name</th>
                                                            <th scope="col">Section</th>
                                                            <th scope="col">Student Department</th>
                                                            <th scope="col">Course Code</th>
                                                            <th scope="col">Course Name</th>
                                                            <th scope="col">Course Department</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    {this.state.export_detail.map((rows)=>{
                                                        return(
                                                            <tr className="h6">
                                                                <td>{rows["Reg. No."]}</td>
                                                                <td>{rows["Student name"]}</td>
                                                                <td>{rows["Section"]}</td>
                                                                <td>{rows["Student Department"]}</td>
                                                                <td>{rows["Course Code"]}</td>
                                                                <td>{rows["Course Name"]}</td>
                                                                <td>{rows["Course Department"]}</td>
                                                            </tr>
                                                        )
                                                    }) }
                                                    </tbody>
                                                </table> :
                                                <table  className="table table-sm table-bordered" >
                                                    <thead>
                                                    <tr className="h6">
                                                        <th scope="col">Reg. No.</th>
                                                        <th scope="col">Student Name</th>
                                                        <th scope="col">Section</th>
                                                        <th scope="col">Course Code</th>
                                                        <th scope="col">Course Name</th>
                                                        <th scope="col">Department</th>
                                                        <th scope="col">Staff Name</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.state.export_detail.map((rows)=>{
                                                            return(
                                                                <tr className="h6">
                                                                    <td>{rows["Reg. No."]}</td>
                                                                    <td>{rows["Student name"]}</td>
                                                                    <td>{rows["Section"]}</td>
                                                                    <td>{rows["Course Code"]}</td>
                                                                    <td>{rows["Course Name"]}</td>
                                                                    <td>{rows["Department"]}</td>
                                                                    <td>{rows["Staff Name"]}</td>
                                                                </tr>
                                                            )
                                                        }) }
                                                    </tbody>
                                                </table>}
                                        </div>
                                    </div>}
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                        <button type="button" data-dismiss="modal" onClick={this.onPrint} className="btn btn-primary">Print</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row justify-content-center" align="center">
                                {CoursesAvail.map((courses)=>{
                                    return <MediaListCourse courses={courses} key={courses.course_id} onUserInputChange={this.handleUserInputChange} />
                                })}
                                <hr/>
                                <br/>
                            </div>
                    </div>
                </div>
                <br/>
            </div></div>
        );
    }
}

export default Report;
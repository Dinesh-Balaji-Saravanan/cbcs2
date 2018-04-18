import React from 'react';
import '../../css/main.css';
import CardStud from "./card";
import {
    faCodeBranch, faExclamationTriangle, faInfoCircle, faLink,
} from "@fortawesome/fontawesome-free-solid/index.es";
import Loader from "../loader/loader";
import Redirect from "react-router-dom/es/Redirect";
import AlertNotify from "../alert";
import ReactLoading from 'react-loading';
import FontAwesomeIcon from "@fortawesome/react-fontawesome";

class DashContStud extends React.Component {

    state = {
        student_details:null,
        pro:[],
        open:[],
        redirect:false,
        chosen:[],
        chosenCourse:[],
        departmentStudentCount:"",
        isEnrolledCnt:"",
        departmentEnrolledCount:"",
        isVisible:true,
        enrollmentDetails:[],
        errors:{
            title:"",
            message:"",
            type:"",
            icon:""
        },
    };

    async componentWillMount(){
        this.setState({isLoading:true});
        localStorage.setItem('courses_selected',null);
        localStorage.setItem('courseToLoad','');
        localStorage.clear();
        this.chosenGrp = new Set();
        const response5 = await fetch(`/api/chosenByStud`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            method:"post",
            body:JSON.stringify({
                username:sessionStorage.getItem('user')
            })
        }).catch((err) => {
            console.log(err.message);
        });

        try {
            const data = await response5.json();
            this.setState({chosenCourse:data});
        } catch (e) {
            console.log("FAILED");
        }
        const response3 = await fetch(`/api/whats_chosen`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            method:"post",
            body:JSON.stringify({
                username:sessionStorage.getItem('user')
            })
        }).catch((err) => {
            console.log(err.message);
        });

        try {
            const data = await response3.json();
            this.setState({chosen:data});
        } catch (e) {
            console.log("FAILED");
        }

        for (let grp in this.state.chosen) {
            if (this.state.chosen.hasOwnProperty(grp)) {
                if (!this.chosenGrp.has(this.state.chosen[grp].grp_name)) {
                    this.chosenGrp.add(this.state.chosen[grp].grp_name);
                }
            }
        }
        const response4 = await fetch(`/api/isEnrolled`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            method:"post",
            body:JSON.stringify({
                username:sessionStorage.getItem('user')
            })
        }).catch((err) => {
            console.log(err.message);
        });

        try {
            const data = await response4.json();
            this.setState({isEnrolledCnt:data.length});
            this.setState({enrollmentDetails:data});
        } catch (e) {
            console.log("FAILED");
        }

        const response = await fetch(`/api/student_details`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            method:"post",
            body:JSON.stringify({
                username:sessionStorage.getItem('user').toUpperCase()
            })
        }).catch((err) => {
            console.log(err.message);
        });

        try {
            const data = await response.json();
            localStorage.setItem('student_details',JSON.stringify(data[0]));
            this.setState({student_details:JSON.parse(localStorage.getItem('student_details'))});

            if (response.status) {
                const response = await fetch(`/api/CheckTiming`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    method: "post",
                    body: JSON.stringify({
                        dep_id: data[0].dep_id,
                        sem: data[0].sem
                    })
                }).catch((err) => {
                    console.log(err.message);
                });
                try {
                    if (response.status) {
                        const data = await response.json();
                        if (data[0]) {
                            this.setState({
                                errors:{
                                    title:"Attention !",
                                    message:`Course will be available till ${data[0].end_date.substring(0,16).replace("T"," ")}`,
                                    type:"info",
                                    icon:faInfoCircle
                                }
                            });
                            if (data[0].elect === 'Both' || data[0].elect === 'Professional Elective') {
                                const response2 = await fetch(`/api/student_elect_list`, {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Accept': 'application/json',
                                    },
                                    method: "post",
                                    body: JSON.stringify({
                                        dep_id: this.state.student_details.dep_id,
                                        sem: this.state.student_details.sem,
                                        type: "PROFESSIONAL"
                                    })
                                }).catch((err) => {
                                    console.log(err.message);
                                });

                                try {
                                    const data = await response2.json();
                                    this.setState({pro: data});
                                } catch (e) {
                                    console.log("FAILED");
                                }
                            }
                            if (data[0].elect === 'Both' || data[0].elect === 'Open Elective') {
                                const response3 = await fetch(`/api/student_elect_list`, {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Accept': 'application/json',
                                    },
                                    method: "post",
                                    body: JSON.stringify({
                                        dep_id: this.state.student_details.dep_id,
                                        sem: this.state.student_details.sem,
                                        type: "OPEN"
                                    })
                                }).catch((err) => {
                                    console.log(err.message);
                                });

                                try {
                                    const data = await response3.json();
                                    this.setState({open: data});
                                } catch (e) {
                                    console.log("FAILED");
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        } catch (e) {
            console.log("FAILED");
        }

        localStorage.setItem('CourseToLoad','');

        const total_groups = this.state.pro.length+this.state.open.length;
        if (this.state.pro.length !==0 && this.state.open.length !== 0 ) {
            if (total_groups === this.state.isEnrolledCnt && sessionStorage.getItem('status') ==='Enrolled') {
                this.setState({isVisible: true});
            } else {
                this.setState({isVisible: true});
            }
        }else {
            this.setState({isVisible: true});
        }
        this.setState({isLoading:false});
    }

    onClick = (e) =>{
        e.preventDefault();
        if(e.target.name === 'list_type_1'){
            localStorage.setItem('CourseToLoad',JSON.stringify({
                dep_id:this.state.student_details.dep_id,
                sem:this.state.student_details.sem,
                grp_name:e.target.value,
                username:this.state.student_details.username,
                type:"1"
            }));
        }else{
            localStorage.setItem('CourseToLoad',JSON.stringify({
                dep_id:this.state.student_details.dep_id,
                sem:this.state.student_details.sem,
                grp_name:e.target.value,
                username:this.state.student_details.username,
                type:"2"
            }));
        }
        this.setState({redirect:true});
        // console.log(localStorage.getItem('CourseToLoad'))
    };

    render(){
        const { isLoading,redirect,errors } = this.state;
        const total_groups = this.state.pro.length+this.state.open.length;
        if(redirect){
            return( <Redirect push to={'/student_portal/courses'} /> );
        }
        return(
            <p>{isLoading && <Loader/>}
                {errors.title !== "" && <AlertNotify icon={errors.icon} title={errors.title} type={errors.type} message={errors.message} />}
                {sessionStorage.getItem('redirect') === "true" && <AlertNotify icon={faExclamationTriangle} title={'Sorry !'} type={'danger'} message={'That course has been taken. Please Choose other course'} />}
                {this.state.isEnrolledCnt !==0 && total_groups !==0 &&<div className={'row justify-content-md-center'}>
                    <div className={"col"} align="center">
                        {this.state.chosenCourse.map((data =>{
                            return(
                                <div>
                                    <div><small><strong>{data.grp_name}</strong></small></div>
                                    <div><small> {data.course_code} - {data.course_name}</small></div>
                                </div>
                            )
                        }))}
                        <br/>
                    </div>
                </div>}
                <div className="row justify-content-md-center mb-3" align="center">
                    <div className={"col-lg-6 col-md-8"}><div className="card bg-light">
                        <div className="card-header bg-light" id="headingOne">
                            <h5 className="mb-0">
                                <a className="btn btn-link" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                    <p className={"text-danger"}><FontAwesomeIcon icon={faInfoCircle}/> For Schedule !! <small>Click here</small></p>
                                </a>
                            </h5>
                        </div>

                        <div id="collapseOne" className="collapse" aria-labelledby="headingOne" data-parent="#accordion">
                            <div className="card-body col-lg-8 col-md-12">
                                <p className={"text-primary"}>The online Elective Course Registration process for
                                    BE/B.Tech will be open as per the following schedule.</p><br/><br/>
                                1. 7 th Semester PROFESSIONAL ELECTIVE COURSE registration for
                                all BE/B.Tech branches except civil, mechanical, mechtronics,
                                automobile: 12.04.2018 (Thursday)– 4:30 pm to 10:00 pm. <br/><br/>

                                2. 7 th Semester OPEN ELECTIVE COURSE registration for all
                                BE/B.Tech branches: 13.04.2018 (Friday) – 4:30 pm to 10:00 pm.
                                Those who have registered on 10.04.2018 are also needs
                                to register again. The registration process carried out on
                                10.04.2018 will not be considered Due to the technical
                                issue. <br/><br/>

                                3. 5 th Semester PROFESSIONAL ELECTIVE COURSE registration for
                                all BE/B.Tech branches: 16.04.2018 (Monday) - 4:30 pm to
                                10:00 pm. <br/><br/>
                            </div>
                        </div>
                    </div></div>
                </div>
                <div className="row justify-content-md-center mb-3" align="center">
                    <div className={"col-lg-6 col-md-8"}>
                        <h6 className={"text-primary"}><em><strong>Hint: </strong>If you are in Waiting List, Your chosen course have not meet the MINIMUM STUDENT ELIGIBILITY STRENGTH. Refresh page or choose any other course otherwise your course will not be confirmed</em></h6>
                    </div>
                </div>
                {isLoading &&
                <div className={'row justify-content-md-center'}>
                    <div className={"col"} align="center">
                        <ReactLoading type={'bars'} delay={0} color={'#2980b9'}/>
                        <h4>Loading...</h4>
                    </div>
                </div>  }
                {(this.state.isVisible) ?
                        <div className={"row justify-content-md-center"}>
                            <CardStud cardTitle={"Professional Elective"} set={this.chosenGrp} type={'1'} data={this.state.pro} srcImg={faLink} onHandleClick={this.onClick} Imgheight={"3x"}/>
                            <CardStud cardTitle={"Open Elective"} type={'2'} set={this.chosenGrp} data={this.state.open} srcImg={faCodeBranch} onHandleClick={this.onClick}  Imgheight={"3x"}/>
                        </div> :
                    <div align="center" className={"card border-0 bg-light"}>
                        {/*ToBe Changed*/}
                        <div className="card-body">
                            <img height="100px" src={require("../../images/twittertick.png")} alt="Thanks"/>
                            <div className={"card-title"}><h2 className={"text-primary"}><em>Thanks !!</em></h2></div>
                            <div className={"col-6"}>
                                <blockquote className={"blockquote"}>
                                    <p className={"mb-0"}>Your Courses have been confirmed.</p>
                                </blockquote>
                            </div>
                        </div>
                    </div>
                }
            </p>
        );
    }
}

export default DashContStud;
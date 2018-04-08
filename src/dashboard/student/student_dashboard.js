import React from 'react';
import '../../css/main.css';
import CardStud from "./card";
import {
    faCodeBranch, faExclamationTriangle, faLink,
} from "@fortawesome/fontawesome-free-solid/index.es";
import Loader from "../loader/loader";
import Redirect from "react-router-dom/es/Redirect";
import AlertNotify from "../alert";
import ReactLoading from 'react-loading';

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
                        console.log(data[0]);
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
                } catch (e) {
                    console.log(e);
                }
            }
        } catch (e) {
            console.log("FAILED");
        }

        localStorage.setItem('CourseToLoad','');

        const total_groups = this.state.pro.length+this.state.open.length;
        if (this.state.pro.length !==0 && this.state.open.length !== 0 && sessionStorage.getItem('status') !=='warning') {
            if (total_groups === this.state.isEnrolledCnt) {
                this.setState({isVisible: false});
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
                {errors.title !== "" && <AlertNotify icon={errors.icon} title={errors.title} type={errors.type} message={errors.message} />}
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
                                    <p className={"mb-0"}>Your Choice is submitted.</p>
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
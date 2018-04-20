import React from 'react';
import MediaListCourse from "./media_list";
import Loader from "../loader/loader";
import Redirect from "react-router-dom/es/Redirect";
import ModalContent from "./modal_content";
import ReactLoading from 'react-loading';

class CourseList extends React.Component {

    state = {
        data:null,
        CoursesAvail:[],
        CoursesAvailOther:[],
        selected:[],
        selectedId:[],
        count:0,
        redirect:false,
        student_details:JSON.parse(localStorage.getItem('student_details')),
    };
    handleUserInputChange = (e)=>{
        e.preventDefault();
        if (e.target.value !== '') {

            this.selectedCourses.clear();
            this.selectedCourses.add(e.target.value);
            this.selectedCoursesId.clear();
            this.selectedCoursesId.add(e.target.name);
            const len = Array.from(this.selectedCourses);
            localStorage.setItem('courses_selected',JSON.stringify(len.length));
            localStorage.setItem('selected',JSON.stringify(Array.from(this.selectedCoursesId)));
            this.setState({selected:Array.from(this.selectedCourses)});
            this.setState({selectedId:Array.from(this.selectedCoursesId)});

        }
    };

    onEveryThingsDone = (e) => {
        e.preventDefault();
        this.myFunc();
        this.setState({selected:[]});
        this.setState({selectedId:[]});
        sessionStorage.setItem('status','');
        this.selectedCourses.clear();
        this.selectedCoursesId.clear();
        localStorage.setItem('selected',null);
        window.localStorage.removeItem('selected');
        window.sessionStorage.removeItem('staff_id');
        localStorage.clear();
        this.setState({redirect:true});
    };

    setNull = (e)=>{
        this.setState({selected:[]});
        this.setState({selectedId:[]});
        localStorage.setItem('selected',null);
        window.localStorage.removeItem('selected');
        window.sessionStorage.removeItem('staff_id');
    };

    async myFunc(){
        sessionStorage.setItem('status','');
        this.setState({isLoading: true});
        let values = {
            username:sessionStorage.getItem('user'),
            course_id:Array.from(this.selectedCoursesId),
            grp_name:this.state.data.grp_name,
            type:this.state.data.type,
            dep_id:this.state.student_details.dep_id,
            staff_id:sessionStorage.getItem('staff_id')
        };
        const response_check = await fetch(`/api/check_maximum`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            method:"post",
            body:JSON.stringify({
                username:sessionStorage.getItem('user'),
                course_id:Array.from(this.selectedCoursesId),
                dep_id:this.state.student_details.dep_id,
                grp_name:this.state.data.grp_name,
            })
        }).catch((err) => {
            console.log(err.message);
        });

        try {
            const data_check = await response_check.json();
            if(data_check.length !== 0){
                await fetch(`/api/everyThings_done`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    method:"post",
                    body:JSON.stringify(values)
                }).catch((err) => {
                    console.log(err.message);
                });

                try {
                    localStorage.setItem('CourseToLoad','');
                    localStorage.setItem('course',null);
                    localStorage.setItem('selected',null);
                } catch (e) {
                    console.log(e);
                }
            }else{
                sessionStorage.setItem('redirect','true');
            }
        } catch (e) {
            console.log(e);
        }


        this.setState({isLoading: false});
    }
    async componentWillMount(){
        this.setState({isLoading: true});
        sessionStorage.setItem('redirect','');
        if(localStorage.getItem('CourseToLoad') === ''){
            this.setState({redirect:true});
        }else{
            this.setState({data:JSON.parse(localStorage.getItem('CourseToLoad'))});
        }
        this.selectedCourses = new Set();
        this.selectedCoursesId = new Set();

        const response_check = await fetch(`/api/check_warning`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            method:"post",
            body:JSON.stringify({
                grp_name:JSON.parse(localStorage.getItem('CourseToLoad')).grp_name,
                username:sessionStorage.getItem("user")
            })
        }).catch((err) => {
            console.log(err.message);
        });

        try {
            const data_chk = await response_check.json();
            if(!data_chk.length){
                await fetch(`/api/deleteMinimumWarning`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    method:"post",
                    body:JSON.stringify({
                        grp_name:JSON.parse(localStorage.getItem('CourseToLoad')).grp_name,
                        username:sessionStorage.getItem("user")
                    })
                }).catch((err) => {
                    console.log(err.message);
                });

                const response3 = await fetch(`/api/course_to_load`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    method:"post",
                    body:localStorage.getItem('CourseToLoad')
                }).catch((err) => {
                    console.log(err.message);
                });

                try {
                    const data = await response3.json();
                    this.setState({CoursesAvail:data});
                } catch (e) {
                    console.log("FAILED");
                }
                const response = await fetch(`/api/course_to_load_other`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    method:"post",
                    body:localStorage.getItem('CourseToLoad')
                }).catch((err) => {
                    console.log(err.message);
                });

                try {
                    const data = await response.json();
                    this.setState({CoursesAvailOther:data});
                } catch (e) {
                    console.log("FAILED");
                }
                this.setState({isLoading: false});
            }else{
                this.setState({redirect:true});
            }

        } catch (e) {
            console.log("FAILED");
        }


    }
    render() {
        const {isLoading,selected,CoursesAvail,CoursesAvailOther,redirect,data,selectedId} = this.state;
        if (!localStorage.getItem('CourseToLoad') || redirect){
            return <Redirect push to={'/student_portal'}/>
        }
        if(sessionStorage.getItem('user') === ""){
            return( <Redirect push to={'/'} /> );
        }
        return (
            <div className={"container"} >
                <div id={"padding1"}>
                {isLoading && <Loader/>}
                    <div className={"card"}>
                        <div className={'row justify-content-md-center'}>
                            <div className={"col-lg-12 col-md-12"}>
                                <div className={"card-body"}>
                                    <h3 className="card-title text-center"><em>List of Courses for {data.grp_name}</em><hr/></h3>
                                    <h5 className={"text-center text-danger"}>Courses in your Department</h5>
                                    <hr/>
                                    {isLoading &&
                                    <div className={'row justify-content-md-center'}>
                                        <div className={"col"} align="center">
                                            <ReactLoading type={'bars'} delay={0} color={'#2980b9'}/>
                                            <h4>Loading...</h4>
                                        </div>
                                    </div>  }
                                    <div className="row justify-content-md-center">
                                       {CoursesAvail.map((courses)=>{
                                            return <MediaListCourse courses={courses} key={courses.course_id} selected={selected} onUserInputChange={this.handleUserInputChange} />
                                        })}
                                        <hr/>
                                        <br/>
                                    </div>
                                    {CoursesAvailOther.length !==0 &&
                                    <div>
                                        <hr/>
                                        <h5 className={"text-center text-danger"}>Courses in Other Department</h5>
                                        <hr/>
                                    <div className="row justify-content-md-center">
                                        {CoursesAvailOther.map((courses)=>{
                                            return <MediaListCourse courses={courses} key={courses.course_id} onUserInputChange={this.handleUserInputChange} />
                                        })}
                                    </div></div>}
                                </div>
                            </div>
                            <div className="modal fade bd-example-modal-lg" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                                <div className="modal-dialog modal-lg">
                                    {selected.length === 1 && <ModalContent selected={selectedId} onSetNull={this.setNull} onDoneIt={this.onEveryThingsDone}  />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CourseList;
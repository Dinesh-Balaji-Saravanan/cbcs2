import React from 'react';
import ReactLoading from 'react-loading';

class ModalContent extends React.Component {

    state = {
    enrolled_percent:"",
    min_enrolled_percent:"",
    course_id:this.props.selected[0],
    course_dets:[],staffEnroll:"",
        staff_name:"",
    course_name:"",
    course_code:"",
    min:"", max:"", enrolled:"",

    };

    async myCall(course_id){
        const response = await fetch(`/api/CourseDetails`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            method:"post",
            body:JSON.stringify({
                course_id:course_id
            })
        }).catch((err) => {
            console.log(err.message);
        });

        try {
            const data = await response.json();
            this.setState({course_dets:data});
            if(data.length === 1){
                sessionStorage.setItem('staff_id',data[0].staff_id);
                this.setState({staff_name:data[0].staff_id});
            }
        } catch (e) {
            console.log("FAILED");
        }
        const response4 = await fetch(`/api/enrolledForStaff`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            method:"post",
            body:JSON.stringify({
                course_id:course_id,
                staff_id:sessionStorage.getItem('staff_id')
            })
        }).catch((err) => {
            console.log(err.message);
        });

        try {
            const data = await response4.json();
            this.setState({staffEnroll:data[0].Students});
        } catch (e) {
            console.log("FAILED");
        }
        const response3 = await fetch(`/api/minMaxCourse`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            method:"post",
            body:JSON.stringify({
                course_id:course_id
            })
        }).catch((err) => {
            console.log(err.message);
        });

        try {
            const data = await response3.json();
            this.setState({min:data[0].min_lim,max:data[0].max_lim,course_name:data[0].course_name,course_code:data[0].course_code});
        } catch (e) {
            console.log("FAILED");
        }
        const response2 = await fetch(`/api/course_enrolment_count`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            method:"post",
            body:JSON.stringify({course_id:course_id})
        }).catch((err) => {
            console.log(err.message);
        });

        try {
            const data = await response2.json();
            localStorage.setItem('course_enrolled',data[0].count);
            this.setState({enrolled:data[0].count});
        } catch (e) {
            console.log("FAILED");
        }

        const input = this.state.enrolled;
        const min = 0;
        const max = this.state.max;
        const val = ((input - min) * 100) / (max - min);
        if (val) {
            this.setState({enrolled_percent:val});
            const input = this.state.min;
            const min = 0;
            const max = this.state.max;
            const minimum = ((input - min) * 100) / (max - min);
            this.setState({min_enrolled_percent:minimum});

        }

    }

    async componentWillMount(){
        sessionStorage.setItem('staff_id','');
        if (localStorage.getItem('selected') !== null) {
            this.setState({course_id: JSON.parse(localStorage.getItem('selected'))});
            this.myCall(this.state.course_id);
        }
        // const interval = setInterval(()=>{
        // }, 2000);
        //
        // if (localStorage.getItem('selected') === null) {
        //     clearInterval(interval);
        // }

        // if (this.props.selected.length !== 0) {
        //     this.myCall();
        // }
    }

    onChange = (e) =>{
        sessionStorage.setItem('staff_id',e.target.value);
        this.setState({staff_name:e.target.value});
    };

    render() {
        const {course_dets} = this.state;
        return (
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Are You Sure</h5>
                </div>
                <div className="modal-body">
                    <div className={"col"}>
                        <div  className="card">
                            <div className="card-body">
                                <div className={"row justify-content-center"}>
                                    { this.state.course_name === "" ?
                                        <div className={'row col-12'}>
                                            <div className={"col"} align="center">
                                                <ReactLoading type={'bars'} delay={0} color={'#2980b9'}/>
                                                <h4>Loading...</h4>
                                            </div>
                                        </div>
                                        : <div className={"col-12"} align="center">
                                        <h5 className="mt-0 mb-1 text-primary">{this.state.course_code+" "+this.state.course_name}</h5>
                                        <hr/>{course_dets.length !==0 && this.state.enrolled !== this.state.max && <div className="row justify-content-md-center">
                                        <div className="col-12" align="center">
                                            {course_dets.length ===1 ?
                                                <div>
                                                    <h5 className={"text-primary"}>Course is Taken By</h5>
                                                    <h5>{course_dets[0].staff_name}</h5>
                                                </div>
                                                :
                                                <div>
                                                    <h5>-- Choose Any Staff you like --</h5>
                                                    <div className="col-8">
                                                        <select className={"form-control"} onChange={this.onChange} name="staff" >
                                                            <option value="">Select Staff</option>
                                                            {course_dets.map((staff)=>{
                                                                return  <option key={staff.staff_id} value={staff.staff_id}> {staff.staff_name}</option>
                                                            })
                                                            }</select>
                                                    </div>
                                                    {course_dets.map((staff)=>{
                                                        return (
                                                            <div key={staff.staff_id} className="col-6">
                                                                <small className={"text-primary"}>{staff.staff_name}: </small>
                                                                <small> Min:{staff.min} Max:{staff.max},Enrolled:{this.state.staffEnroll}</small>
                                                            </div>
                                                        )
                                                    })
                                                    }
                                                    <br/>
                                                </div>
                                            }
                                        </div>
                                        <hr/>
                                    </div>}

                                        <h5>Enrolled</h5><br/>
                                        <div className={"row justify-content-center"}  align="center">
                                            <div className="col-1" style={{paddingTop:'4px',paddingBottom:'0px',paddingRight:'0px'}}><h5>{this.state.enrolled}</h5></div>
                                            <div className={"col-6"} style={{paddingTop:'7px',paddingBottom:'0px',paddingLeft:'2px',paddingRight:'2px'}}>
                                                <div className="progress" >
                                                    <div className={`progress-bar bg-${this.state.min <= this.state.enrolled ? 'success' : 'warning' } progress-bar-striped progress-bar-animated`} role="progressbar" style={{ width: `${this.state.enrolled_percent}%` }} aria-valuenow={this.state.enrolled} aria-valuemin="0" aria-valuemax={this.state.max}> </div>
                                                </div>
                                            </div>
                                            <div className="col-1" style={{paddingTop:'4px',paddingLeft:'0px',paddingBottom:'0px',paddingRight:'0px'}}><h5>{this.state.max}</h5></div>
                                        </div>
                                        <hr/>
                                        <small>Minimum Eligibility: {this.state.min} & Maximum: {this.state.max}</small>
                                        <hr/>
                                        {this.state.min > this.state.enrolled && <div align="center"><h5 className={"text-warning"}>NOTE: This course did not reaches its minimum eligiblity. <br/> You will be in Waiting List</h5></div>}
                                        {
                                            (this.state.enrolled >= this.state.max && this.state.course_name !== "") &&
                                                <div align="center" className={'text-danger'}>
                                                    <h4>Ooops !!</h4>
                                                    <h5>This course is gone. Your friends have filled the seats !! Choose any other course</h5>
                                                </div>

                                        }
                                    </div>}
                                </div>
                            </div>
                        </div></div>
                </div>
                <div className="modal-footer">
                    <button type="button" onClick={this.props.onSetNull}  className="btn btn-danger" data-dismiss="modal">Cancel</button>
                    { ((this.state.enrolled <= this.state.max) && this.state.course_name === "") ?
                        <button type="submit" onClick={this.props.onDoneIt} className="btn btn-success" disabled>Confirm</button>
                        :
                        <p> {this.state.staff_name === "" ?
                            <button type="submit" onClick={this.props.onDoneIt} data-dismiss="modal"  className="btn btn-success" disabled>Confirm</button> :
                            <button type="submit" onClick={this.props.onDoneIt} data-dismiss="modal"  className="btn btn-success" >Confirm</button>
                        }</p>

                    }
                </div>
            </div>
        );
    }
}

export default ModalContent;
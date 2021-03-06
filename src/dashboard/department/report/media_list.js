import React from 'react';
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import {
    faInfoCircle
} from "@fortawesome/fontawesome-free-solid/index.es";
import "../../../css/main.css";
class MediaListCourse extends React.Component {

    state = {
        data: {
            url:""
        },
        fetchJson:"",
        redirect:false,
        errors:{},
        enrolled:"",
        enrolled_percent:""
    };

    async componentWillMount(){
        const response = await fetch(`/api/course_enrolment_count`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            method:"post",
            body:JSON.stringify({course_id:this.props.courses.course_id})
        }).catch((err) => {
            console.log(err.message);
        });

        try {
            const data = await response.json();
            localStorage.setItem('course_enrolled',data[0].count);
            this.setState({enrolled:data[0].count});
        } catch (e) {
            console.log("FAILED");
        }

        const input = this.state.enrolled;
        const min = 0;
        const max = this.props.courses.max_lim;
        const val = ((input - min) * 100) / (max - min);
        if (val) {
            this.setState({enrolled_percent:val})
        }
    }

    render() {
        const {courses} = this.props;
        return <div id={'padding-all'} className={"col-4"}>
            <div id={'card3'} className="card">
                <div className="card-body">
                    <div className={"row"}>
                        <div className={"col-12"}>
                            <h5 className="mt-0 mb-1 text-primary">{courses.course_name}</h5>
                            <hr/>
                            <div className={"row"}>
                                <div className="col-1"><FontAwesomeIcon icon={faInfoCircle}/></div>
                                <div className={"col-10"}>
                                    <h5> Course Code: {courses.course_code}</h5>
                                Prerequisites: <small className={"text-danger"}>{courses.prereq || 'Not Given'}</small><br/>
                                    <div className={"row"}>
                                        <div className={"col-9"}>Minimum Eligibility:</div>
                                        <div className={"col-3"}><p className={"text-danger"}>{courses.min_lim}</p></div>
                                    </div>
                                </div>
                            </div>
                            <hr/>
                            <div className={"row"}>
                                <div className="col-4" style={{paddingTop:'4px',paddingBottom:'0px',paddingRight:'0px'}}>Enrolled: {this.state.enrolled}</div>
                                <div className={"col-6"} style={{paddingTop:'7px',paddingLeft:'0px',paddingBottom:'0px',paddingRight:'3px'}}>
                                    <div className="progress" >
                                        <div className="progress-bar bg-success progress-bar-striped progress-bar-animated" role="progressbar" style={{ width: `${this.state.enrolled_percent}%` }} aria-valuenow={this.state.enrolled_percent} aria-valuemin="0" aria-valuemax={courses.max_lim}> </div>
                                    </div>
                                </div>
                                <div className="col-2" style={{paddingTop:'4px',paddingLeft:'0px',paddingBottom:'0px'}}>{courses.max_lim}</div>

                            </div>{this.state.enrolled === courses.max_lim && <small  className={'text-danger'}>Seats are Filled !!</small>}
                        </div>
                    </div>
                </div>
            </div></div>;
    }
}

export default MediaListCourse;
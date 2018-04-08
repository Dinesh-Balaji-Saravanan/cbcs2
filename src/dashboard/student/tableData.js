import React from 'react';
import {faCheck, faExclamationTriangle} from "@fortawesome/fontawesome-free-solid/index.es";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import ReactLoading from 'react-loading';

class TableData extends React.Component {
    state = {
        status:"",
        text:""
    };
    async componentWillMount(){
        this.setState({isLoading:true});
        if (this.props.set.has(this.props.data.grp_name)) {
            const response = await fetch(`/api/CheckStudentWaiting`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                method: "post",
                body: JSON.stringify({
                    grp_name: this.props.data.grp_name,
                    username: sessionStorage.getItem('user')
                })
            }).catch((err) => {
                console.log(err.message);
            });

            try {
                const data = await response.json();
                if (data.length === 1) {
                    this.setState({status: "success"});
                    this.setState({text: "Enrolled"});
                    sessionStorage.setItem('status', 'Enrolled');
                } else {
                    this.setState({status: "warning"});
                    this.setState({text: "Waiting List"});
                    sessionStorage.setItem('status', 'warning');
                }
            } catch (e) {
                console.log("FAILED");
            }
        }
        this.setState({isLoading:false});
    }

    render() {
        const {data,isLoading} = this.props;
        return (
            <tr align="center">
                <td><h5><em>{data.grp_name}</em></h5></td>
                {isLoading ?
                <div className={'row justify-content-md-center'}>
                    <div className={"col"} align="center">
                        <ReactLoading type={'bars'} delay={0} color={'#2980b9'}/>
                        <h4>Loading...</h4>
                    </div>
                </div> : <td> {this.props.set.has(data.grp_name) ?  <h5>{this.state.status === "warning" ?
                    <button key={data.grp_name}
                          value={data.grp_name}
                          onClick={this.props.onHandleClickLsnr}
                          name={`list_type_${this.props.type}`}
                          className={"btn btn-warning"}><FontAwesomeIcon icon={this.state.status ==="success" ? faCheck : faExclamationTriangle }/> Waiting List
                    </button> : <span className={`badge badge-${this.state.status} `}><FontAwesomeIcon icon={this.state.status ==="success" ? faCheck : faExclamationTriangle }/> <em>{this.state.text}</em>
                </span>}</h5> :
                    <button key={data.grp_name}
                          value={data.grp_name}
                          onClick={this.props.onHandleClickLsnr}
                          name={`list_type_${this.props.type}`}
                          className={"btn btn-primary"}>Enroll
                </button>}
                </td>}
            </tr>
        );
    }
}

export default TableData;
import React from 'react';
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import {
    faClock, faEdit,faHourglassEnd, faHourglassStart, faPlusCircle, faTrash
} from "@fortawesome/fontawesome-free-solid/index.es";
import Loader from "../loader/loader";
import AlertNotify from "../alert";
import TimingTable from "./table_timing";



class Timings extends React.Component {

    state = {
        timing:[],
        depart:[],
        sem:[],
        dep_id:"",
        semester:"",
        start:"",
        end:"",
        start_date:"",
        elect:"",
        end_date:"",
        timing_id:[],
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
    onSubmit = (e) => {
        e.preventDefault();
        this.myCall('nothing','check_timing');
    };
    onSubmit2 = (e) => {
        e.preventDefault();
        if(e.target.name === 'submit'){
            this.myCall2('update');
        }else if(e.target.name === 'delete'){
            this.myCall2(e.target.name);
        }
    };

    async myCall2(name){
        if (name === 'update') {
            this.setState({isLoading: true});
            const response = await fetch(`/api/timings_${name}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                method:"put",
                body:JSON.stringify({
                    timing_id:Array.from(this.selectedCheckboxes),
                    start_date:this.state.start_date,
                    end_date:this.state.end_date
                })
            }).catch((err) => {
                console.log(err.message);
            });

            try {
                await response.json();
                this.setState({isLoading: false});
            } catch (e) {
                this.setState({isLoading: false});
                console.log("FAILED");
            }
            const response3 = await fetch(`/api/timings`, {
                headers : {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            }).catch( (err) =>{
                console.log(err.message);
            });

            try {
                const data = await response3.json();
                localStorage.setItem('timing',JSON.stringify(data));
                this.setState({timing:JSON.parse(localStorage.getItem('timing'))});
            } catch (e) {
                console.log("FAILED");
            }
        } else if(name === 'delete') {
            this.setState({isLoading: true});
            const response = await fetch(`/api/timings_${name}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                method:"post",
                body:JSON.stringify({timing_id:Array.from(this.selectedCheckboxes)})
            }).catch((err) => {
                console.log(err.message);
            });

            try {
                await response.json();
                this.setState({isLoading: false});
            } catch (e) {
                this.setState({isLoading: false});
                console.log("FAILED");
            }
            const response3 = await fetch(`/api/timings`, {
                headers : {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            }).catch( (err) =>{
                console.log(err.message);
            });

            try {
                const data = await response3.json();
                localStorage.setItem('timing',JSON.stringify(data));
                this.setState({timing:JSON.parse(localStorage.getItem('timing'))});
            } catch (e) {
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
        }else if(e.target.name === 'sem'){
            this.setState({semester:e.target.value});
        }else if(e.target.name === 'start'){
            this.setState({start:e.target.value});
        }else if(e.target.name === 'end'){
            this.setState({end:e.target.value});
        }else if(e.target.name === 'start_date'){
            this.setState({start_date:e.target.value});
        }else if(e.target.name === 'end_date'){
            this.setState({end_date:e.target.value});
        }else if(e.target.name === 'elect'){
            this.setState({elect:e.target.value});
        }
    };
    onChange2 = e =>{
        if (this.selectedCheckboxes.has(e.target.value)) {
            this.selectedCheckboxes.delete(e.target.value);
        } else {
            this.selectedCheckboxes.add(e.target.value);
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

        } else if(name === 'delete'){

        } else{
            const response = await fetch(`/api/${name}`, {
                headers : {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                method:"post",
                body:JSON.stringify({
                    dep_id:this.state.dep_id,
                    sem:this.state.semester,
                    start:this.state.start,
                    end:this.state.end
                })
            }).catch( (err) =>{
                console.log(err.message);
            });
            try {
                const data1 = await response.json();
                if (data1.length !== 0){
                    await fetch(`/api/update_timing`, {
                        headers : {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        method:"put",
                        body:JSON.stringify({
                            dep_id:this.state.dep_id,
                            sem:this.state.semester,
                            start:this.state.start,
                            end:this.state.end
                        })
                    }).catch( (err) =>{
                        console.log(err.message);
                    });
                    try {
                        this.setState({isLoading:false});
                    } catch (e) {
                        this.setState({isLoading:false});
                        console.log("FAILED");
                    }
                }else{
                    await fetch(`/api/insert_timing`, {
                        headers : {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        method:"post",
                        body:JSON.stringify({
                            dep_id:this.state.dep_id,
                            sem:this.state.semester,
                            start:this.state.start,
                            end:this.state.end,
                            elect:this.state.elect
                        })
                    }).catch( (err) =>{
                        console.log(err.message);
                    });
                    try {
                        this.setState({isLoading:false});
                    } catch (e) {
                        this.setState({isLoading:false});
                        console.log("FAILED");
                    }
                }
            } catch (e) {
                this.setState({isLoading:false});
                console.log("FAILED");
            }

            this.setState({isLoading:false});
            const response3 = await fetch(`/api/timings`, {
                headers : {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            }).catch( (err) =>{
                console.log(err.message);
            });

            try {
                const data = await response3.json();
                localStorage.setItem('timing',JSON.stringify(data));
                this.setState({timing:JSON.parse(localStorage.getItem('timing'))});
            } catch (e) {
                console.log("FAILED");
            }
        }
    }
    async componentWillMount(){
        this.setState({isLoading:true});
        const response = await fetch(`/api/timings`, {
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        }).catch( (err) =>{
            console.log(err.message);
        });

        try {
            const data = await response.json();
            localStorage.setItem('timing',JSON.stringify(data));
            this.setState({timing:JSON.parse(localStorage.getItem('timing'))});
            this.setState({isLoading:false});
        } catch (e) {
            this.setState({isLoading:false});
            console.log("FAILED");
        }
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
        this.selectedCheckboxes = new Set();
    }

    render(){
        const {isLoading,errors} = this.state;
        return(
            <div>{isLoading && <Loader/>}
                <div id={"padding1"} className={"container "}>
                    <div className={"row card border border-top-0 border-bottom-0 border-light bg-light" }>
                        <div id={"padding-all"} className={"col-12"}>
                            <h4 className={"card-body display-4"} align="center"> <FontAwesomeIcon icon={faClock}/> Timing
                                </h4>
                            <div id={"padding-all"} >
                                {errors.title !== "" && <AlertNotify icon={errors.icon} title={errors.title} type={errors.type} message={errors.message} />}
                                <div id={"padding-all"} className={"card "}>
                                    <h4 id={"padding-all"} className="card-title text-center"><FontAwesomeIcon icon={faPlusCircle}/> Add New Timing</h4>
                                    <form onSubmit={this.onSubmit} >
                                        <div id={"padding-all"} className={" row justify-content-md-center container"}>
                                            <div className={"col-2"}>
                                                <div id={"department"} className="input-group mb-3">
                                                    <select className="custom-select" name="depart" onChange={this.onChange}>
                                                        <option value="">Department</option>
                                                        {this.state.depart.map((dap =>{
                                                            return <option value={dap.dep_id}>{dap.dep_name}</option>
                                                        }))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className={"col-2"}>
                                                <div id={"semester"} className="input-group mb-3">
                                                    <select className="custom-select" name="sem" onChange={this.onChange}>
                                                        <option value="">Sem</option>
                                                        {this.state.sem.map((dap =>{
                                                            return <option value={dap.sem}>{dap.sem}</option>
                                                        }))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className={"col-3"}>
                                                <div id={"elect"} className="input-group mb-3">
                                                    <select className="custom-select" name="elect" onChange={this.onChange}>
                                                        <option value="">Elective</option>
                                                        <option value="Both">Both</option>
                                                        <option value="Professional Elective">Professional Elective</option>
                                                        <option value="Open Elective">Open Elective</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className={"col-3"}>
                                                <div className="input-group mb-3">
                                                    <div className="input-group-prepend">
                                                        <label className="input-group-text" ><FontAwesomeIcon icon={faHourglassStart}/></label>
                                                    </div>
                                                    <input type="date" name="start" onChange={this.onChange} className="form-control" placeholder="Start Time"/>
                                                </div>
                                            </div>

                                            <div className={"col-3"}>
                                                <div className="input-group mb-3">
                                                    <div className="input-group-prepend">
                                                        <label className="input-group-text" ><FontAwesomeIcon icon={faHourglassEnd}/></label>
                                                    </div>
                                                    <input type="date" name="end" onChange={this.onChange} className="form-control" placeholder="End Time"/>
                                                </div>
                                            </div>
                                            <div className={"col-2 mb-3"}>
                                                <button type="submit"  className={"btn btn-success"}><FontAwesomeIcon icon={faPlusCircle}/> Add Timing</button>
                                            </div>
                                        </div>
                                    </form>
                                    <hr/>
                                    <div id={"padding-all"} className={"row justify-content-md-center"}>
                                    <form>
                                        <h4 id={"padding-all"} className="card-title text-center"><FontAwesomeIcon icon={faEdit}/> Update Timing</h4>
                                        <div className={'col-12'} align="center">
                                            <TimingTable timing={this.state.timing} onUserInputChange={this.onChange2} key={this.state.timing.timing_id} />
                                            <br/>
                                            <div className={'col-6'}>
                                                <div className="input-group mb-3">
                                                    <div className="input-group-prepend">
                                                        <label className="input-group-text" ><FontAwesomeIcon icon={faHourglassStart}/></label>
                                                    </div>
                                                    <input type="date" name="start_date" onChange={this.onChange} className="form-control" placeholder="Start Time"/>
                                                </div>
                                                <div className="input-group mb-3">
                                                    <div className="input-group-prepend">
                                                        <label className="input-group-text" ><FontAwesomeIcon icon={faHourglassEnd}/></label>
                                                    </div>
                                                    <input type="date" name="end_date" onChange={this.onChange} className="form-control" placeholder="End Time"/>
                                                </div>
                                                <div className="row justify-content-md-center">
                                                    <div className={"col-6"}>
                                                        <button name="submit" onClick={this.onSubmit2} className={"btn btn-success"}><FontAwesomeIcon icon={faEdit}/> Update Timing</button>
                                                    </div>
                                                    <div className={"col-4 "}>
                                                        <button name="delete" onClick={this.onSubmit2} className={"btn btn-danger"}><FontAwesomeIcon icon={faTrash}/> Delete</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
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

export default Timings;
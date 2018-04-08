import React from 'react';
import Table from "./table";
import Loader from "../loader/loader";

class StudentList extends React.Component {

    state = {
        data:"",
        depart:[],
        sem:[],
        sec:[],
        dep_id:"",
        semester:"",
        section:"",
        table:[]

    };

    onSubmit = (e) => {
        e.preventDefault();
        this.myCall('nothing','student');
        this.setState({isLoading:true});
    };

    onChange = e =>{
        if(e.target.name === 'depart'){
            this.setState({dep_id:e.target.value});
            this.myCall(e.target.value,'semester');
            this.setState({isLoading:true});
        }
        else if(e.target.name === 'sem'){
            this.setState({semester:e.target.value});
            this.myCall(e.target.value,'section');
            this.setState({isLoading:true});
        }else if(e.target.name === 'sec'){
            this.setState({section:e.target.value});
        }
    };

    async myCall(value='',name){
        if (name === 'semester') {
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

                console.log("FAILED");
            }

        } else if(name === 'section') {
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
                this.setState({isLoading:false});

            } catch (e) {

                console.log("FAILED");
            }
        }else{
            const response = await fetch(`/api/${name}`, {
                headers : {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                method:"post",
                body:JSON.stringify({depid:this.state.dep_id,sem:this.state.semester,sec:this.state.section})
            }).catch( (err) =>{
                console.log(err.message);
            });

            try {
                const data = await response.json();
                this.setState({table: data});
                this.setState({isLoading:false});
            } catch (e) {

                console.log("FAILED");
            }
        }
    }

    async componentWillMount(){
        const response = await fetch(`/api/department`, {
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        }).catch( (err) =>{
            console.log(err.message);
        });

        try {
            const data = await response.json();
            this.setState({depart:data});
        } catch (e) {

            console.log("FAILED");
        }
    }

    render(){
        const {isLoading} = this.state;
        return(
            <div>{isLoading && <Loader/>}
                <div id={"padding1"} className={"container "}>
                    <div className={"row card border border-top-0 border-bottom-0 border-light bg-light" }>
                        <div id={"padding-all"} className={"col-12"}>
                            <h4 className={"card-body display-4"} align="center">Student List<hr/></h4>
                            <form onSubmit={this.onSubmit}>
                                <div className={"row container"}>
                                    <div id={"department"} className="input-group mb-3 col-3">
                                        <select className="custom-select" name="depart" onChange={this.onChange}>
                                            <option value="">Department</option>
                                            {this.state.depart.map((dap =>{
                                                return <option value={dap.dep_id}>{dap.dep_name}</option>
                                            }))}
                                        </select>
                                    </div>
                                    <div id={"semester"} className="input-group mb-3 col-3">
                                        <select className="custom-select" name="sem" onChange={this.onChange}>
                                            <option value="">Semester</option>
                                            {this.state.sem.map((dap =>{
                                                return <option value={dap.sem}>{dap.sem}</option>
                                            }))}
                                        </select>
                                    </div>
                                    <div id={"section"} className="input-group mb-3 col-3"  onChange={this.onChange}>
                                        <select className="custom-select" name="sec">
                                            <option value="">Section</option>
                                            {this.state.sec.map((dap =>{
                                                return <option value={dap.sec}>{dap.sec}</option>
                                            }))}
                                        </select>
                                    </div>
                                    <div className={"col-3"}>
                                        <button type="submit" className="btn btn-success btn-block ">OK</button>
                                    </div>
                                </div>
                            </form>
                            {this.state.table && <Table list={this.state.table} key={this.state.table.uid} />}
                        </div>
                    </div>
                    <br/>
                </div>
            </div>
        );
    }
}

export default StudentList;
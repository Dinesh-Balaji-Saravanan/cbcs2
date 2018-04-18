import React from 'react';
import '../../css/main.css'

class TimingTable extends React.Component {


    render(){

        return(
            <div className={"container"}>
               <div id={'overflow'}>
                <table id="MyTable" className="table table-hover table-bordered" cellSpacing="0" width="100%">
                    <thead className={"thead-light"}>
                    <tr>
                        <th>Check</th>
                        <th>Department.</th>
                        <th>Semester</th>
                        <th>Elective</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.timing.map((timings =>{
                        return  (
                            <tr>
                                <td><input className="input-group" value={timings.timing_id} name="check[]" onChange={this.props.onUserInputChange} type="checkbox" /></td>
                                <td>{timings.dep_name}</td>
                                <td>{timings.sem}</td>
                                <td>{timings.elect}</td>
                                <td>{timings.start_date.substring(0,16).replace("T"," ")}</td>
                                <td>{timings.end_date.substring(0,16).replace("T"," ")}</td>
                            </tr>)
                    }))}
                    </tbody>
                </table>
                </div>
            </div>
        );
    }
}

export default TimingTable;
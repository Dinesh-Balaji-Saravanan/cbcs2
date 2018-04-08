import React from 'react';
import '../../css/main.css'

class StaffAssignTable extends React.Component {


    render(){

        return(
            <div className={"container"}>
                <div id={'overflow2'}>
                    <table id="staffAssignTable" className="table table-hover table-bordered" cellSpacing="0" width="100%">
                        <thead className={"thead-light"}>
                        <tr align="center">
                            <th>Check</th>
                            <th>Staff Name</th>
                            <th>Course Code</th>
                            <th>Course Name</th>
                            <th>Min</th>
                            <th>Max</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.props.staffs.map((staff =>{
                            return  (
                                <tr align="center">
                                    <td><input className="input-group" key={staff.assign_id} value={staff.assign_id} name="check2" onChange={this.props.onUserInputChange} type="checkbox" /></td>
                                    <td>{staff.staff_name}</td>
                                    <td>{staff.course_code}</td>
                                    <td>{staff.course_name}</td>
                                    <td>{staff.min}</td>
                                    <td>{staff.max}</td>
                                </tr>)
                        }))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default StaffAssignTable;
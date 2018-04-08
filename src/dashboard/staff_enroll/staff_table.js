import React from 'react';
import '../../css/main.css'

class StaffTable extends React.Component {


    render(){

        return(
            <div className={"container"}>
                <div id={'overflow2'}>
                    <table id="staffListTable" className="table table-hover table-bordered" cellSpacing="0" width="100%">
                        <thead className={"thead-light"}>
                        <tr align="center">
                            <th>Check</th>
                            <th>Staff Name</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.props.staffs.map((staff =>{
                            return  (
                                <tr>
                                    <td><input className="input-group" key={staff.staff_id} value={staff.staff_id} name="check" onChange={this.props.onUserInputChange} type="checkbox" /></td>
                                    <td>{staff.staff_name}</td>
                                </tr>)
                        }))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default StaffTable;
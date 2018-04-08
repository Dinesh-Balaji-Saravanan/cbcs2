import React from 'react';
import '../../css/main.css'

class TableComb extends React.Component {


    render(){

        return(
            <div  className={"container"}>
                <div id={'overflow'} className={"border border-secondary rounded"}>
                    <table id="MyTable" className="table table-hover table-bordered table-responsive" cellSpacing="0" width="100%">
                        <thead className={"thead-light"}>
                        <tr>
                            <th>Check</th>
                            <th>Combination Name</th>
                            <th>Course Code</th>
                            <th>Course name</th>
                            <th>Department</th>
                            <th>Semester</th>
                            <th>Update Semester</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.props.table_data.map((data =>{
                            return  (
                                <tr>
                                    <td><input className="input-group" value={data.course_comb_id} name="check2[]" onChange={this.props.onCheckBoxChange} type="checkbox" /></td>
                                    <td>{data.course_comb_name}</td>
                                    <td>{data.course_code}</td>
                                    <td>{data.course_name}</td>
                                    <td>{data.dep_name}</td>
                                    <td>{data.sem ===''  ? 'Not set' : data.sem }</td>
                                    <td><input type="text" className={"form-control"} name={data.course_comb_id} onChange={this.props.onUserInputChange} placeholder="semester" /></td>
                                </tr>)
                        }))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default TableComb;
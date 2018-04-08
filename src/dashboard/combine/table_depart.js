import React from 'react';
import '../../css/main.css'

class DepartTable extends React.Component {


    render(){

        return(
            <div className={"container"}>
                <div id={'overflow'} className={"border border-secondary rounded"}>
                    <table  className="table table-hover table-bordered" cellSpacing="0" width="100%">
                        <thead className={"thead-light"}>
                        <tr>
                            <th>Check</th>
                            <th>Department</th>
                            <th>Semester</th>
                        </tr>
                        </thead>
                        <tbody >
                        {this.props.table_data.map((data =>{
                            return(
                                <tr>
                                    <td><input className="form-control" value={data.dep_id} name="check[]" onChange={this.props.onCheckBoxChange}  type="checkbox" /></td>
                                    <td>{data.dep_name}</td>
                                    <td><input type="text" className={"form-control"} name={data.dep_id} onChange={this.props.onUserInputChange} placeholder="semester" /></td>
                                </tr>
                            )
                        }))}
                        </tbody>
                    </table>
                </div>

            </div>
        );
    }
}

export default DepartTable;
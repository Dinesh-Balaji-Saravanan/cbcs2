import React from 'react';
import "../../css/main.css"

class CombineTable extends React.Component {


    render(){

        return(
            <div  className={"container"} >
                <div id={"overflow2"}>
                <table id="MyTable" className="table table-hover table-bordered" cellSpacing="0" width="100%">
                    <thead className={"thead-light"}>
                    <tr>
                        <th>Check</th>
                        <th>Course Code</th>
                        <th>Course Name</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.table_data.map((data =>{
                        return  (
                            <tr>
                                <td><input className="input-group" value={data.course_id} name="check1[]" onChange={this.props.onUserInputChange} type="checkbox" /></td>
                                <td>{data.course_code}</td>
                                <td>{data.course_name}</td>
                            </tr>)
                    }))}
                    </tbody>
                </table>
                </div>
            </div>
        );
    }
}

export default CombineTable;
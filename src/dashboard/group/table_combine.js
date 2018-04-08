import React from 'react';
import '../../css/main.css'

class TableComb extends React.Component {


    render(){

        return(
            <div  className={"container"}>
                <div id={'overflow2'} className={"border border-secondary rounded"}>
                    <table id="MyTable" className="table table-hover table-bordered" cellSpacing="0" width="100%">
                        <thead className={"thead-light"}>
                        <tr>
                            <th>Check</th>
                            <th>Group Name</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.props.table_data.map((data =>{
                            return  (
                                <tr>
                                    <td><input className="input-group" value={data.grp_name} name="check2[]" onChange={this.props.onCheckBoxChange} type="checkbox" /></td>
                                    <td>{data.grp_name}</td>
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
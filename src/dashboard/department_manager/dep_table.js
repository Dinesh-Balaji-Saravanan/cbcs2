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
                        <th>Username</th>
                        <th>Department</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.depUsers.map((depUsers =>{
                        return  (
                            <tr>
                                <td><input className="input-group" value={depUsers.uid} name="check[]" onChange={this.props.onUserInputChange} type="checkbox" /></td>
                                <td>{depUsers.username}</td>
                                <td>{depUsers.dep_name}</td>
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
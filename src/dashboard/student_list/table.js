import React from 'react';
import '../../css/main.css'

class Table extends React.Component {


    render(){

        return(
            <div id={'padding-all'} className={"container"}>
                <div id={'overflow'} className={"border border-secondary rounded"}>
                    <table id="MyTable" className="table table-hover table-bordered" cellSpacing="0" width="100%">
                    <thead className={"thead-light"}>
                    <tr>
                        <th>RegNo.</th>
                        <th>Student Name</th>
                        <th>Semester</th>
                        <th>Sec</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.list.map((student =>{
                        return  (
                            <tr>
                            <td>{student.username}</td>
                            <td>{student.stud_name}</td>
                            <td>{student.sem}</td>
                            <td>{student.sec}</td>
                        </tr>)
                    }))}
                    </tbody>
                </table></div>
            </div>
        );
    }
}

export default Table;
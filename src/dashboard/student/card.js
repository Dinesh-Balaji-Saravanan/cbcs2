import React from 'react';
import '../../css/main.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import TableData from "./tableData";


class CardStud extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            cardTitle : props.cardTitle,
            srcImg : props.srcImg,
            Imgheight: props.Imgheight
        }
    }

    render(){
        const { cardTitle,srcImg,Imgheight } = this.state;
        return(
            <div className={"col-lg-6 col-md-12"}>
                <div className={"text-secondary card-link"}>
                    <div id={'card'}  className="card text-secondary bg-light mb-3 border-0" >
                        <div id={"padding-all"} className="" align="center">
                            <h4 id={"padding-all"}><em className="card-title text-primary">{cardTitle}</em></h4>
                            <div className={"text-primary"}><FontAwesomeIcon icon={srcImg} size={Imgheight} /></div>
                            <br/><br/>
                            {this.props.data.length !== 0 ? <table className="table table-hover">
                                <thead>
                                <tr align="center" className={"bg-primary text-light"}>
                                    <th colSpan="2" ><h5><em>Choose Elective Group</em></h5></th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.props.data.map((data =>{
                                    return(
                                       <TableData data={data} key={data.grp_name} set={this.props.set} onHandleClickLsnr={this.props.onHandleClick} type={this.props.type}/>
                                    )
                                }))}
                                </tbody>
                            </table> : <div><h5>Not available</h5></div>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CardStud;
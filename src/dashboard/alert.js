import React from 'react';
import FontAwesomeIcon from "@fortawesome/react-fontawesome";

class AlertNotify extends React.Component {
    render() {
        return (
            <div className={"container"} >
                <div className={`alert alert-${this.props.type} alert-dismissible fade show`} role="alert">
                    <strong><FontAwesomeIcon icon={this.props.icon}/> {this.props.title}</strong> {this.props.message}
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            </div>
        );
    }
}

export default AlertNotify;

import React from  "react";
import {Redirect} from "react-router";

class Logout extends React.Component {
    render() {
        localStorage.clear();
        sessionStorage.clear();
        return <Redirect push to="/"/>;
    }
}

export default Logout;
import React from 'react';
import Link from "react-router-dom/es/Link";

class About extends React.Component {
    render() {
        return (
            <div style={{paddingTop:'45px'}} className={"container"} align="center">
                <div className={"card bg-dark text-light"}>
                   <div className={"card-body"}>
                       <div className="card-title"><h3><em>About this Application</em></h3></div>
                       <img src={require("../images/facico.jpg")} height={'100'} alt="Logo" className={"rounded"} />
                        <h3>Choice Based Course Selection</h3>
                       <hr/>
                        <div className="row justify-content-center">
                            <div className="col-lg-8 col-md-10">
                                This application is Developed by <em>Department of Computer Applications</em> & Developed Using <em>React Js.</em> To learn more about the development <a href={"mailto:androbalajiupdated@gmail.com"}>Mail us</a>.
                                <h4><em>Thank You !!</em></h4>
                            </div>
                            <div className="col-6 mb-3">
                                <br/>
                                <Link to={`/`} role={"button"} className="btn btn-primary" >Login </Link>
                            </div>
                        </div>
                   </div>
                </div>
            </div>
        );
    }
}

export default About;
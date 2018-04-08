import React from 'react';
import { Link } from 'react-router-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faUserCircle} from "@fortawesome/fontawesome-free-solid";
import {faKey, faList, faPowerOff, faQuestion, faUserSecret} from "@fortawesome/fontawesome-free-solid/index.es";



class Navigation extends React.Component{


    render(){
        return(

            <div>
                {sessionStorage.getItem('user') === "" &&
                    <div className={"row justify-content-center text-light bg-dark"} style={{width:'100%',margin:'0px'}} >
                        <div id={"padding-all"} className={" col-lg-8 col-md-6 "} align="center">
                            <img src={require("../images/KONGU_BANNER.jpg")} style={{width:'100%'}} alt=""/>
                        </div>
                    </div>}
                <nav className={`navbar navbar-expand-md ${sessionStorage.getItem('user') !== "" && "fixed-top"} navbar-dark bg-primary`}>
                    <div className={"container"}>
                    <a className="navbar-brand mb-0 h1 text-light" >CBCS App</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"> </span>
                    </button>
                    <div className=' collapse navbar-collapse justify-content-md-center' id="navbarSupportedContent" >

                        {sessionStorage.getItem('user')!=="" &&
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item active">
                                    <Link to={`/${sessionStorage.getItem('dashboard')}`} className="nav-link" href="">Dashboard <span className="sr-only">(current)</span>
                                    </Link>
                                </li>
                                {/*<li className="nav-item active">*/}
                                    {/*<Link to='/sequrityQuestion' className="nav-link" ><FontAwesomeIcon icon={faQuestion}/> Set Security Question</Link>*/}
                                {/*</li>*/}
                                {/*<li className="nav-item active">*/}
                                    {/*<Link to='/changePassword' className="nav-link" ><FontAwesomeIcon icon={faKey}/> Change Password</Link>*/}
                                {/*</li>*/}
                            </ul>
                        }

                        {(sessionStorage.getItem('user')!=="" ) &&
                        <div className={"row"}>
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item dropdown" >
                                    <a className="nav-link dropdown-toggle" href="" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><FontAwesomeIcon icon={faUserCircle} /> {sessionStorage.getItem('user').toUpperCase()}
                                    </a>
                                    <div className="dropdown-menu " aria-labelledby="navbarDropdownMenuLink">
                                        <Link to='/set_security' className="dropdown-item"><FontAwesomeIcon icon={faUserSecret}/> Set Security Question</Link>
                                        <Link to='/change_password' className="dropdown-item"><FontAwesomeIcon icon={faKey}/> Change Password</Link>
                                        <Link to='/logout' className="dropdown-item"><FontAwesomeIcon icon={faPowerOff}/> Logout</Link>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        }
                    </div>
                    </div>
                </nav>
                <footer className="bg-dark text-white fixed-bottom">
                    <div className="container" style={{padding: '2px'}} align="center">
                        <small>Developed by <Link to="/about">MCA</Link> | © Copyright 2018 @ KEC</small>
                    </div>
                </footer>
            </div>
        );
    }
}

export default Navigation;
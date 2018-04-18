import React, { Component } from "react";
import ReactLoading from 'react-loading';

export default function asyncComponent(importComponent) {
    class AsyncComponent extends Component {
        constructor(props) {
            super(props);

            this.state = {
                component: null
            };
        }

        async componentDidMount() {
            this.setState({isLoading:true});
            const { default: component } = await importComponent();

            this.setState({
                component: component
            });
            this.setState({isLoading:false});
        }

        render() {
            const C = this.state.component;
            if(this.state.isLoading){
                return <div id={"padding1"} className={"container"}><div className={'row col-12'}>
                    <div className={"col"} align="center">
                        <ReactLoading type={'bars'} delay={0} color={'#ffff'}/>
                        <h4 className={"text-light"}>Loading...</h4>
                    </div>
                </div></div>;
            }
            return C ? <C {...this.props} /> : <div id={"padding1"} className={"container"}><div className={'row col-12'}>
                <div className={"col"} align="center">
                    <ReactLoading type={'bars'} delay={0} color={'#ffff'}/>
                    <h4 className={"text-light"}>Loading...</h4>
                </div>
            </div></div>;
        }
    }

    return AsyncComponent;
}
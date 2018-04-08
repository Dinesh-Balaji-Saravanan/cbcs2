import React from 'react';
import TopBarProgress from "react-topbar-progress-indicator";

TopBarProgress.config({
    barColors: {
        "0": "#d63031",
        "1.0": "#d63031",
    },
    shadowBlur: 1,
});
class Loader extends React.Component {

    render(){
        return(
            <TopBarProgress />
        );
    }
}

export default Loader;
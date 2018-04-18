import React, {Component, PropTypes} from 'react';
import * as html2canvas from "html2canvas";
import  * as jsPDF  from 'jspdf'
import '../../css/main.css'

// download html2canvas and jsPDF and save the files in app/ext, or somewhere else
// the built versions are directly consumable
// import {html2canvas, jsPDF} from 'app/ext';


export default class Export extends Component {
    constructor(props) {
        super(props);
    }

    printDocument() {
        let pdf = new jsPDF('p', 'pt', 'letter');
        let source = document.getElementById('divToPrint');
        let specialElementHandlers = {
            '#bypassme': function(element, renderer){
                return true
            }
        };
        let margins = {
            top: 50,
            left: 60,
            width: 545
        };
        pdf.fromHTML(
            source // HTML string or DOM elem ref.
            , margins.left // x coord
            , margins.top // y coord
            , {
                'width': margins.width // max width of content on PDF
                , 'elementHandlers': specialElementHandlers
            },
            function (dispose) {
                // dispose: object with X, Y of the last line add to the PDF
                //          this allow the insertion of new lines after html
                pdf.save('html2pdf.pdf');
            }
        )
    }

    render() {
        return (<div id={'padding1'}>
            <div id="divToPrint" className="mt4" style={{
                backgroundColor: '#f5f5f5',
                width: '210mm',
                minHeight: '297mm',
                marginLeft: 'auto',
                marginRight: 'auto'
            }}>
                <button className={"btn btn-primary"}>Google</button>
            </div>
            <div className="mb5">
                <button className={""} onClick={this.printDocument}>Print</button>
            </div>
        </div>);
    }
}
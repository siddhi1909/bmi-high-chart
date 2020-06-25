import React, { Component } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import '../assets/App.css';

export class BmiCalculatorComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            person: '',
            height: 0,
            weight: 0,
            isFormValid: true,
            validationMessage: '',
            chartOptions: {
                title: {
                    text: 'BMI Chart'
                },
                xAxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
                },
                yAxis: {
                    title: {
                        text: 'BMI'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: [{
                    name: 'Person A',
                    data: []
                }, {
                    name: 'Person B',
                    data: []
                }]
            }
        }
        window.sessionStorage.removeItem('personA');
        window.sessionStorage.removeItem('personB');
    }

    onSubmit = async e => {
        const { person, height, weight, isFormValid, chartOptions } = this.state;
        let BMI = 0;
        try {
            e.preventDefault();
            if (person !== "" && height !== "" && weight !== "") {
                if (person === "personA" || person === "personB") {
                    let personVar = person;
                    /**Calculate BMI */
                    BMI = 703 * (weight / (height * height));
                    let oldBMIArray = window.sessionStorage.getItem(personVar) ? JSON.parse(window.sessionStorage.getItem(personVar)) : [];
                    let newBMIArray = [];

                    if (oldBMIArray.length < 7) {
                        newBMIArray = [...oldBMIArray, BMI];
                    } else {                    
                        newBMIArray = oldBMIArray.map(function(item, index) { return index === 0 ? BMI : item; });
                    }
                    window.sessionStorage.setItem(personVar, JSON.stringify(newBMIArray));
                    let seriesA = chartOptions.series[0]?chartOptions.series[0].data:[];                        
                    let seriesB = chartOptions.series[1]?chartOptions.series[1].data:[];
                    if(person === "personA"){
                        seriesA = newBMIArray;
                        this.setState({
                            person: '',height: '', weight: '',
                            chartOptions: {
                                series: [
                                    {
                                        name: 'Person A',
                                        data: seriesA
                                    }
                                ]
                            }
                        });
                    } else {
                        seriesB = newBMIArray;
                        this.setState({
                            person: '',height: '', weight: '',
                            chartOptions: {
                                series: [
                                    {
                                        name: 'Person B',
                                        data: seriesB
                                    }
                                ]
                            }
                        });
                    }
                    
                }
            } else {
                this.setState({
                    isFormValid: !isFormValid,
                    validationMessage: "Invalid height or weight!"
                })
            }
        } catch (error) {
            this.setState({
                isFormValid: !isFormValid,
                validationMessage: error.message
            })
        }
    }

    handleInputChange = event => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({ [name]: value, isFormValid: true, validationMessage: '' });
        if(value === 'both'){
            let seriesA = window.sessionStorage.getItem("personA") ? JSON.parse(window.sessionStorage.getItem("personA")) : [];
                    let seriesB = window.sessionStorage.getItem("personB") ? JSON.parse(window.sessionStorage.getItem("personB")) : [];
                    this.setState({
                        chartOptions: {
                            series: [
                                {
                                    name: 'Person A',
                                    data: seriesA
                                }, {
                                    name: 'Person B',
                                    data: seriesB
                                }
                            ]
                        }
                    });
        }
    }

    render() {
        const { person, height, weight, validationMessage, isFormValid, chartOptions } = this.state;
        let boxClass = ["form-box"];
        if (!isFormValid) {
            boxClass.push('was-validated');
        }
        return (
            <div className="App">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-6">
                            <form onSubmit={this.onSubmit} className={boxClass.join(' ')} id="login">
                                {(validationMessage) ?
                                    (<div className="alert alert-danger alert-dismissible fade show">
                                        <strong>Error!</strong> {validationMessage}
                                    </div>) : ''
                                }
                                <div className="form-group">
                                    <label htmlFor="person">Choose Person:</label>
                                    <select id="person" name="person"
                                        onChange={this.handleInputChange} value={person} required>
                                        <option value="">Person</option>
                                        <option value="personA">Person A</option>
                                        <option value="personB">Person B</option>
                                        <option value="both">Both</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="height">Height in Inches</label>
                                    <input type="number" name="height" className="form-control" id="height"
                                        placeholder="Height in Inches" min={0}
                                        required value={height} onChange={this.handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="weight">Weight in Pounds</label>
                                    <input type="number" name="weight" className="form-control" id="weight"
                                        placeholder="Weight in Pounds" min={0}
                                        required value={weight} onChange={this.handleInputChange} />
                                </div>
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </form>
                        </div>
                        <div className="col-md-6">
                            <div>
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={chartOptions}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default BmiCalculatorComponent;
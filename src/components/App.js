import React, { Component } from 'react'
import '../App.css';
import Main from './Main'

export default class App extends React.Component {
    componentDidMount() {
        console.log("App component mounted.")
    }

    componentWillUnmount() {
        console.log("App component will unmount.")
    }

    render() { 
        return(<Main/>) 
    }
}
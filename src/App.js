/**
 * root component
 */
import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import Notice         from '@/contains/notice';
import Home           from '@/contains/home';
import Example        from '@/contains/example';

class App extends Component {	
    render() {
        return (
			<Router basename='front'>
        		<Switch>
					<Route path="/meetId:meetId" component={Home} />
					<Route path="/example/:type" component={Example} />
					<Route path="/404" component={Notice}/>
					<Route render={()=><Redirect to="/404" />} />
	            </Switch>
            </Router>
        );
    }
}

export default App;

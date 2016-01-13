// add jQuery to Browserify's global object so plugins attach correctly.
global.jQuery = require("jquery");
require("bootstrap");

var React = require("react");
var ReactDOM = require("react-dom");
var Fluxxor = require("fluxxor");

var Router = require("react-router");
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var constants = require("./libs/constants");
var utilities = require("./libs/utilities");
var dispatcher = require("./stores/dispatcher.js");

var actions = {
  asset: require("./actions/AssetActions"),
  branch: require("./actions/BranchActions"),
  config: require("./actions/ConfigActions"),
  market: require("./actions/MarketActions"),
  network: require("./actions/NetworkActions"),
  report: require("./actions/ReportActions"),
  search: require("./actions/SearchActions")
};
var stores = {
  asset: new dispatcher.asset(),
  branch: new dispatcher.branch(),
  config: new dispatcher.config(),
  market: new dispatcher.market(),
  network: new dispatcher.network(),
  report: new dispatcher.report(),
  search: new dispatcher.search()
};

var AugurApp = require("./components/AugurApp");
var Overview = require("./components/Overview");
var Branch = require("./components/Branch");
var Market = require("./components/Market");
var Ballots = require("./components/Ballots");
var Outcomes = require("./components/Outcomes");

window.flux = new Fluxxor.Flux(stores, actions);

flux.on("dispatch", function (type, payload) {
  var debug = flux.store("config").getState().debug;
  if (debug) console.log("Dispatched", type, payload);
});

var routes = (
  <Route name="app" handler={ AugurApp } flux={ flux }>
    <DefaultRoute handler={ Overview } flux={ flux } />
    <Route name="overview" path="/" handler={ Overview } flux={ flux } title="Overview" />
    <Route name="markets" path="/markets" handler={ Branch } flux={ flux } title="Markets" />
    <Route name="marketsPage" path="/markets/:page" handler={ Branch } flux={ flux } title="Markets" />
    <Route name="market" path="/market/:marketId" handler={ Market } flux={ flux } />
    <Route name="ballots" path="/ballots" handler={ Ballots } flux={ flux } title="Ballots" />
  </Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler, state) {
  ReactDOM.render(<Handler flux={ flux } params={ state.params } />, document.getElementById("render-target"));
});

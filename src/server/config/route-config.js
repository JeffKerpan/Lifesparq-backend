(function (routeConfig) {

  'use strict';

  routeConfig.init = function (app) {

    // *** routes *** //
    const routes = require('../routes/index');
    const superRoutes = require('../routes/superusers');

    // *** register routes *** //
    app.use('/', routes);
    app.use('/super', superRoutes);

  };

})(module.exports);

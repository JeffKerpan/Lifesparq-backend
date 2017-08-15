(function (routeConfig) {

  'use strict';

  routeConfig.init = function (app) {

    // *** routes *** //
    const routes = require('../routes/index');
    const superRoutes = require('../routes/superusers');
    const mailRoutes = require('../routes/sendgrid');

    // *** register routes *** //
    app.use('/', routes);
    app.use('/super', superRoutes);
    app.use('/mail', mailRoutes);
  };

})(module.exports);

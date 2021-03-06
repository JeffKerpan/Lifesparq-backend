(function (routeConfig) {

  'use strict';

  routeConfig.init = function (app) {

    // *** routes *** //
    const routes = require('../routes/index');
    const superRoutes = require('../routes/superusers');
    const coachRoutes = require('../routes/coaches');
    const paymentRoutes = require('../routes/payment');
    const sproutRoutes = require('../routes/sprout');
    const cloudinaryRoutes = require('../routes/cloudinary')

    // *** register routes *** //
    app.use('/', routes);
    app.use('/super', superRoutes);
    app.use('/coaches', coachRoutes);
    app.use('/payment', paymentRoutes);
    app.use('/sprout', sproutRoutes);
    app.use('/cloudinary', cloudinaryRoutes);
  };

})(module.exports);

var Linkedin = require('node-linkedin')(),
    _ = require('lodash'),
    util = require('./util.js');

var pickInputs = {
        'id': 'id',
        'geos': 'geos',
        'companySizes': 'companySizes',
        'jobFunc': 'jobFunc',
        'industries': 'industries',
        'seniorities': 'seniorities'
    };

module.exports = {

    /**
     * Authorize module.
     *
     * @param dexter
     * @returns {*}
     */
    authModule: function (dexter) {
        var accessToken = dexter.environment('linkedin_access_token');

        if (accessToken)
            return Linkedin.init(accessToken);

        else
            return false;
    },


    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var linkedIn = this.authModule(dexter),
            inputs = util.pickStringInputs(step, pickInputs);

        if (!linkedIn)
            return this.fail('A [linkedin_access_token] environment need for this module.');

        linkedIn.companies.createCall('GET', 'companies/' + inputs.id + '/num-followers', _.omit(inputs, ['id']), function(err, data) {
            if (err)
                this.fail(err);

            else if (data.errorCode !== undefined)
                this.fail(data.message || 'Error Code'.concat(data.errorCode));

            else
                this.complete({followers: data});

        }.bind(this))(linkedIn.companies.config);
    }
};

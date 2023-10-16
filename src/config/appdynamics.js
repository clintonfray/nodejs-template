const appd = require('appdynamics');

appd.profile({
    controllerHostName: process.env.APPDYNAMICS_CONTROLLER_HOST_NAME,
    controllerPort: process.env.APPDYNAMICS_CONTROLLER_PORT, 
    controllerSslEnabled: process.env.APPDYNAMICS_CONTROLLER_SSL_ENABLED,  // Set to true if controllerPort is SSL
    accountName: process.env.APPDYNAMICS_ACCOUNT_NAME,
    accountAccessKey: process.env.APPDYNAMICS_ACCESS_KEY, //required
    applicationName: process.env.APPDYNAMICS_APPLICATION_NAME,
    tierName: process.env.APPDYNAMICS_TIER_NAME, 
    nodeName: process.env.APPDYNAMICS_AGENT_NODE_NAME,
    reuseNode: process.env.APPDYNAMICS_REUSE_NODE_NAME,
    reuseNodePrefix: process.env.APPDYNAMICS_AGENT_REUSE_NODE_NAME_PREFIX,
    logging: {
        'logfiles': [
          {
            'root_directory': '/tmp/appd',
           'filename': 'echo_%N.log',
            'level': 'DEBUG',
            'max_size': 5242880,
            'max_files': 10
          }, {       'root_directory': '/tmp/appd',
            'filename': 'protobuf_%N.log',
            'level': 'TRACE',
            'max_size': 5242880,
            'max_files': 10,
            'channel': 'protobuf'
            }
        ]
      }
});


module.exports = appd;




/**
 * Import Sequelize.
 */
const Sequelize = require("sequelize");
const appd = require('./appdynamics.js');

/**
 * Create a Sequelize instance. This can be done by passing
 * the connection parameters separately to the Sequelize constructor.
 */
const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: "mysql"
});

/**
 * AppDynamics Hook
 */

sequelize.addHook('afterConnect', function(conn, config) {
    var agent = appd.__agent;
    var thread = agent.thread;
    var profiler = agent.profiler;
 
    var findTransaction = function() {
       var threadId = thread.current();
       var txn = threadId && profiler.getTransaction(threadId);
       return txn && !txn.ignore && agent.customTransaction.join(null, txn);
    };
 
    var host = config.host;
    var port = config.port;
    var db = config.database;
    var name = host + ':' + port + '/' + db;
 
    var old = conn.addCommand;
    conn.addCommand = function(cmd) {
       if (!cmd.sql) {
          return old.call(this, cmd);
       }

       console.log('DATABASE QUERY STARTED');

 
       var txn = findTransaction();
       var ec = null;
 

       if (txn) {

          ec = txn.startExitCall({
             exitType: 'EXIT_DB',
             backendName: name,
             command: profiler.sanitize(cmd.sql),
             commandArgs: profiler.sanitize(cmd.values),
             isSql: true,
             identifyingProperties: {
                'HOST': host,
                'PORT': port,
                'DATABASE': db,
                'VENDOR': 'mysql2'
             }
          });
       }
 
       var old_onresult = cmd.onResult;
       cmd.onResult = function() {
          if (ec) {
             if (arguments[0]) {
                txn.endExitCall(ec, arguments[0]);
             } else {
                txn.endExitCall(ec);
             }
          }
          return old_onresult.apply(this, arguments);
       };
 
       return old.call(this, cmd);
    };
 });

/**
 * Export the Sequelize instance. This instance can now be 
 * used in the app.js file to authenticate and establish a database connection.
 */
module.exports = sequelize;
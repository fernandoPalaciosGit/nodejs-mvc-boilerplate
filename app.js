;(function () {
    'use strict';
    
    var cluster = require('cluster'),
        APP = {
            env : process.env.NODE_ENV,
            /**
             * Manage Master Cluster, Open and realive slaves clusters
             */
            setMasterCluester: function () {
                var MasterWorker = require('./workers/master.worker'),
                    masterWorker = new MasterWorker(cluster),
                    cpuCount = require('os').cpus().length;
                     
                /**
                 * Create a worker (with cluster) foreach cpu thread
                 */
                for (var i = 0; i < cpuCount; i++) {
                    masterWorker.createSlaveWorker();
                }
                
                /**
                 * Once the worker died, reactivate new one, then we got full working cpus
                 */
                cluster.on('exit', function (worker){
                    masterWorker.onWorkerExit(worker);
                });    
            },
            /**
             * Manage Slaves Cluster : Execute program in all clusters
             * For each this Worker we create and run our aplication 
             * We cannot debug into this kind aplications process (there are many http --debug ports)
             */
            initServer: function () {
                var SlaveWorker = require('./workers/slave.worker'),
                    appWorker = new SlaveWorker();
                
                appWorker.initalizeConnection();
            },
            /**
             * Manage Slave Worker for debug
             * We are not interesting in initalize the routing server, only export server.
             */
            exportTestingServer : function () {
                var SlaveWorker = require('./workers/slave.worker'),
                    appWorker = new SlaveWorker();
                    
                module.exports = appWorker.server;  
            }
        };
    
    // $set "NODE_ENV=testing" && mocha app
    if (APP.env === 'testing') {
        APP.exportTestingServer();
    
    // $set "NODE_ENV=production" && nodemon [--debug] app
    } else if (APP.env === 'production' && cluster.isMaster) {
        APP.setMasterCluester();
    
    // $set "NODE_ENV=development" && nodemon [--debug] app
    } else {
        APP.initServer();
    }
}());
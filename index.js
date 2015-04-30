var zmq = require('zmq')
  , sock = zmq.socket('sub');

var config = require(process.argv[2]);

function formConnectionString(config, channel) {
  var portDelimiter = ":";
  if (config.transport !== "tcp") {
    portDelimiter = "-";
  }
  
  return config.transport + "://" + config.ip + portDelimiter + config[channel + "_port"]; 
}

/**
 * @class Snupyter
 * @classdesc Snoops on messages from a Jupyter kernel
 * @param {Object} connectionJSON Connection information provided by Jupyter
 */
function Snupyter(connectionJSON) {
  	/**
     * Connection information provided by Jupyter
     * @member {Object}
     */
    this.connectionJSON = connectionJSON;
    
    /** IOPub socket
     * @member {module:zmq~Socket}
     */
     this.iopubSocket = zmq.socket("sub");
     this.iopubURL = formConnectionString(this.connectionJSON, "iopub");

     console.log('Connecting to ' + this.iopubURL);

     this.iopubSocket.connect(this.iopubURL);
     this.iopubSocket.subscribe('');
     
     this.iopubSocket.on("message", function (msg) {
       console.log(msg);
     });
    
}

var snupyter = new Snupyter(config);
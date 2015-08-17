var logDebugData = true;

function parseParams() {
  var result = {};
  var args = process.argv.slice(2);
  var counter = 0;

  var paramNameToPropertyName = {}
  paramNameToPropertyName["-id="] = 'sessionId';
  paramNameToPropertyName["-servicePath="] = 'servicePath';
  paramNameToPropertyName["-port="] = 'port';
  paramNameToPropertyName["-host="] = 'host';
  paramNameToPropertyName["-projectPath="] = 'projectPath';
  paramNameToPropertyName["-outPathTemplate="] = 'outPath';
  paramNameToPropertyName["-mainFilePath="] = 'mainFilePath';

  args.forEach(function (value, index, arr) {
    function isName(name) {
      return value.indexOf(name) === 0;
    }

    function getValue() {
      return value.split('=')[1];
    }

    Object.keys(paramNameToPropertyName).forEach(function (val) {
      if (isName(val)) {
        result[paramNameToPropertyName[val]] = getValue();
        counter++;
      }
    })
  });

  result.restArgs = args.slice(counter);

  return result;
}



function processCommand(inputBuffer, socket) {
  var sentObject = JSON.parse(inputBuffer.trim());
  var currentCommand = sentObject.command;

  if ('compile' == currentCommand) {
    try {
      loDataIfEnabled('Compile file: ' + sentObject.filesToCompile);
      var startTime = Date.now();
      var files = inputBuffer.trim().split('\n');
      socket.write(compilerWrapper.compileFile(sentObject));
      loDataIfEnabled('End compiling on server: ' + (Date.now() - startTime));
    }
    catch (e) {
      console.error('error while compiling: ' + e + ' ' + e.stack);
      socket.write(JSON.stringify({command: 'compile', error: 'Error has occurred in the compile process ' + e}));
    }
  }

  if ('clean' == currentCommand) {
    try {
      compilerWrapper.resetStore(sentObject);
      socket.write(JSON.stringify({command: 'clean'}));
    } catch (e) {
      socket.write(JSON.stringify({command: 'clean', error: 'Error cleaning in the compile process ' + e}));
    }
  }
}

function fireSoutCommand(command) {
  process.stdout.write(sessionId + ' ' + command + '\n');
}

function loDataIfEnabled(value) {
  if (logDebugData) console.log(value.trim());
}

function initSocket() {


  server = net.createServer({allowHalfOpen: true}, function (socket) {
    var startingSocketTime = Date.now();
    socket.allowHalfOpen = true;
    socket.setEncoding('utf8');
    var currentCommand = null;


    var validateCompilerState = function (chunk) {
      var end = chunk.split(' ')[1];
      if (end != 'end') throw new Error('Incorrect compiler state');
    };

    var isSystemCommand = function (chunk) {
      return chunk.indexOf(sessionId) == 0;
    };

    var actualChunk = '';

    function processChunk(chunk) {
      if (chunk.substring(chunk.length - 1) === '\n') {
        //terminal symbol
        var processedChunk = actualChunk + chunk;
        actualChunk = '';

        processedChunk.split('\n').forEach(processLine);

      }
      else {
        //just waiting terminal
        actualChunk += chunk;
      }
    }

    var inputBuffer = '';

    function processLine(line) {
      if (!isSystemCommand(line)) {
        inputBuffer += line + '\n';
        return;
      }

      validateCompilerState(line);
      processCommand(inputBuffer, socket);

      inputBuffer = '';
    }


    socket.on('data', function (data) {
      if (!data) return;

      var chunk = data.toString();
      if (chunk == null) return;
      processChunk(chunk);
    });
  });


  server.listen(parseInt(port), host);

  server.on('error', function (e) {
    if (e.code == 'EADDRINUSE') {
      log.error('Address in use, close server.');
      setTimeout(function () {
        server.close();
      }, 1000);
    }
  });

  server.on('connect', function (sc) {
    console.log('horray, connect!');
    sc.write('{ready:{}}');
  });
}


var compilerWrapper = require('./ts-compiler-host-impl');
var net = require('net');
var params = parseParams();
var servicePath = params.servicePath;
var sessionId = params.sessionId;
var port = params.port;
var host = params.host;
console.error('host ' + host);
console.error('port ' + port);
var withError;
try {
  var initCompilerErrors = compilerWrapper.initCompiler(servicePath, sessionId, params);
  if (initCompilerErrors) {
    var result = "";
    initCompilerErrors.forEach(function (e) {
      result += (result === "" ? "" : ", ") + e.messageText;
    });

    fireSoutCommand('error ' + result);
    withError = result;
  }
}
catch (e) {
  fireSoutCommand('error ' + e);
  withError = e;

}
if (!withError) {
  initSocket();
  fireSoutCommand('ready');
}
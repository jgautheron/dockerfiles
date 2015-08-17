var logDebugData = true;
var fs = require('fs');
var crypto = require('crypto');

function getStore(ts, sys, options, getCurrentDirectory) {

  var store = {
    //string path to object with data
    lastCompilerResult: {},

    getSourceFile: function (filename, languageVersion, onError, overrides) {
      if (ts.getRootLength(filename) === 0) {
        filename = ts.getNormalizedAbsolutePath(filename, getCurrentDirectory());
      }

      var overrideContent = overrides[filename];
      var compilerResult;
      if (overrideContent) {
        compilerResult = this.lastCompilerResult[filename];
        if (!compilerResult || !compilerResult.contentHash) {
          var result;
          //just save and compile
          return this.createCompileResultFromSourceAndStore(filename, overrideContent, languageVersion, null).sourceFile;
        }

        var overrideContentHash = calcHash(overrideContent);
        if (logDebugData) console.log('Hashcode for override content ' + overrideContentHash);
        if (overrideContentHash === compilerResult.contentHash) {
          //the same content so just return compiled file
          if (logDebugData) console.log('Used cached compiled file over hash');
          return compilerResult.sourceFile;
        }

        if (logDebugData) console.log('Compile using override content ' + filename);
        return this.createCompileResultFromSourceAndStore(filename, overrideContent, languageVersion, overrideContentHash).sourceFile;
      }

      //doesn't have override
      compilerResult = this.lastCompilerResult[filename];
      if (compilerResult) {
        //unfortunately we have to check file attributes for skiping compiling if file exist
        if (compilerResult.lastModified) {
          var lastModified = getLastModified(filename);
          if (!lastModified) {
            //cannot check
            //reset old value
            this.lastCompilerResult[filename] = null;
            return this.createCompileResultFromFile(filename, languageVersion, onError, lastModified).sourceFile;
          }

          if (lastModified == compilerResult.lastModified) {
            //yeh! file wasn't changed
            if (logDebugData) console.log('Used cached compiled file over lastModified ' + filename);
            return compilerResult.sourceFile;
          }

          this.lastCompilerResult[filename] = null;
          return this.createCompileResultFromFile(filename, languageVersion, onError, lastModified).sourceFile;
        }

        //we don't have compile lastModification
        //it means last compiling was possible over override
        if (!compilerResult.contentHash) {
          return this.createCompileResultFromFile(filename, languageVersion, onError, lastModified).sourceFile;
        }

        var sourceTextWithInfo = getSourceTextWithInfo(filename, languageVersion, onError, lastModified);
        if (sourceTextWithInfo) {
          var contentHash = calcHash(sourceTextWithInfo.text);
          if (logDebugData) console.log('Hashcode for override content ' + contentHash);
          if (compilerResult.contentHash === contentHash) {
            //hooray, can set flag
            compilerResult.lastModified = sourceTextWithInfo.lastModified;

            if (logDebugData) console.log('Used cached compiled file over contentHash '  + filename);
            return compilerResult.sourceFile;
          }

          var compileResultFromSource = this.createCompileResultFromSourceAndStore(filename, sourceTextWithInfo.text, languageVersion,
                                                                                   contentHash);
          compileResultFromSource.lastModified = sourceTextWithInfo.lastModified;
          return compileResultFromSource.sourceFile;
        }

        //clean old value
        this.lastCompilerResult[filename] = null;
        return undefined;
      }

      //just simple compiling
      return this.createCompileResultFromFile(filename, languageVersion, onError, lastModified).sourceFile;
    },

    createCompileResultFromSourceAndStore: function (filename, content, languageVersion, contentHash) {
      if (!contentHash) {
        contentHash = calcHash(content);
        if (logDebugData) console.log('Hashcode for file content ' + filename + ' is ' + contentHash);
      }

      var compilerResult = {};
      compilerResult.contentHash = contentHash;
      compilerResult.sourceFile = createSourceFile(filename, content, languageVersion);
      this.lastCompilerResult[filename] = compilerResult;

      return compilerResult;
    },

    createCompileResultFromFile: function (filename, languageVersion, onError, lastModified, contentHash) {
      var sourceTextWithInfo = getSourceTextWithInfo(filename, languageVersion, onError, lastModified);
      if (sourceTextWithInfo) {
        var compileResultFromSource = this.createCompileResultFromSourceAndStore(filename, sourceTextWithInfo.text, languageVersion,
                                                                                 contentHash);
        compileResultFromSource.lastModified = sourceTextWithInfo.lastModified;
        return compileResultFromSource;
      }
      var resultObject = {};
      resultObject.sourceFile = undefined;
      return resultObject;
    },

    reset: function(options) {
      if (logDebugData) console.log('Clean compile cache');
      this.lastCompilerResult = {};
    }

  }

  function getSourceTextWithInfo(filename, languageVersion, onError, lastModified) {
    var result = undefined;

    try {
      if (logDebugData) console.log('Read file from disk ' + filename);

      var text = sys.readFile(filename, options.charset);

      result = {};
      result.text = text;

      if (text === undefined) return undefined;

      result.lastModified = lastModified != null ? lastModified : getLastModified(filename);

      if (logDebugData) console.log('Last modified ' + result.lastModified + ' for ' + filename);

    }
    catch (e) {
      if (logDebugData) console.log('Error while read file: ' + filename);
      if (onError) {
        onError(e.message);
      }
    }
    return result;
  }

  function createSourceFile(filename, text, languageVersion) {
    if (logDebugData) console.log('Creating source (compiling file)');

    if (text !== undefined) return ts.createSourceFile(filename, text, languageVersion, "0");

    return undefined;
  }

  return store;
}

var calcHash = function (string) {var startTime;
  return crypto.createHash('md5').update(string).digest("hex");
}

function getLastModified(filename) {
  try {
    var statSync = fs.statSync(filename);
    if (statSync) {
      var mdate = statSync.mtime;
      var result = mdate != null ? mdate.getTime() : null;
      return result;
    }
  } catch(e) {}

  return undefined;
}

exports.getStore = getStore;
exports.getLastModified = getLastModified;






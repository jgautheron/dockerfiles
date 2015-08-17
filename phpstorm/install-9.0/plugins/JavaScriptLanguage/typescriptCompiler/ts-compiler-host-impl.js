var ts;
var options;
var typeScriptServiceDirectory;
var typeScriptServicePath;
var sessionId;
var logDebugData = true;
var logFileContent = false;
var sys;
var store;
var emitFilesArray;
var pathProcessor;
var compiledFileList;
var storeRequire;
var currentDirectory;

var contentRoot = null;
var sourceRoot = null;
var mainFile;
var configState;

function getCurrentDirectory() {
  if (!currentDirectory) {
    currentDirectory = sys.getCurrentDirectory();
  }

  return currentDirectory;
}

function normalizePathIfNeed(file) {
  if (ts.getRootLength(file) === 0) {
    return ts.getNormalizedAbsolutePath(file, getCurrentDirectory());
  }

  return file;
}

function initCompiler(lPathToTypeScriptService, lSessionId, params) {
  var args = params.restArgs;
  typeScriptServicePath = lPathToTypeScriptService;
  ts = initServicesContext().ts;
  sys = ts.sys;
  if (typeof sys === "undefined") return new Error('Cannot init sys');
  if (typeof sys.useCaseSensitiveFileNames === "undefined") return new Error('Cannot init sys properties');


  sessionId = lSessionId;
  typeScriptServiceDirectory = ts.getDirectoryPath(ts.normalizePath(typeScriptServicePath));
  storeRequire = require('./store.js');
  var getStore = storeRequire.getStore;

  var parseResult;
  var newConfig = false;
  if (ts.parseCommandLine) {
    parseResult = ts.parseCommandLine(args);
    newConfig = true;
  }
  else {
    parseResult = ts.parseCommandLineHost(args);
  }
  options = parseResult.options;

  if (newConfig) {
    configState = processConfig(parseResult);
  }

  if (configState) {
    options = ts.extend(options, configState.parseResult.options);
  }

  store = getStore(ts, sys, options, getCurrentDirectory);

  mainFile = params.mainFilePath;
  if (params.outPath) {
    var getPathProcessor = require('./out-path-process.js').getPathProcessor;
    pathProcessor = getPathProcessor(ts, sys, params);
  }

  if (parseResult.errors.length > 0) return parseResult.errors;
}

function processConfig(parseResult) {
  console.error("start parse config");
  if (parseResult.options.project) {
    var configFileName = "tsconfig.json";
    if (parseResult.options.project != "tsconfig.json") {
      configFileName = ts.normalizePath(ts.combinePaths(parseResult.options.project, "tsconfig.json"));
    }

    return getConfigState(configFileName);
  }

  return null;
}

function getConfigState(configFileName) {
  var result = ts.readConfigFile(configFileName);
  if (result.error) {
    throw new Error("Cannot read tsconfig");
  }

  var configParseResult;
  var configObject;
  //ts1.5beta - result , ts1.5 - result.config
  if (result.config) {
    configObject = result.config;
    configParseResult = ts.parseConfigFile(configObject, sys, ts.getDirectoryPath(configFileName));
  }
  else {
    configObject = result;
    configParseResult = ts.parseConfigFile(configObject, ts.getDirectoryPath(configFileName));
  }
  if (configParseResult.errors && configParseResult.errors.length > 0) {
    throw new Error("Parse tsconfig error " + JSON.stringify(configParseResult.errors));
  }

  return {
    config: configFileName,
    parseResult: configParseResult,
    lastMod: storeRequire.getLastModified(configFileName)
  }
}

var firstCreatedCompilerHost;
var program;


function resetStore(options) {
  if (configState && configState.lastMod) {
    configState.lastMod = -1;
  }
  store.reset(options);
}

function compileFile(sentObject) {
  compiledFileList = [];
  var filesToCompile = sentObject.filesToCompile;
  var sourceFiles = sentObject.unsavedFilesContent;
  contentRoot = sentObject.contentRoot;
  sourceRoot = sentObject.sourceRoot;
  if (filesToCompile == null || filesToCompile.length == 0) {
    return JSON.stringify({command: 'compile'});
  }

  var paths;
  if (mainFile) {
    paths = [mainFile];
  }
  else if (configState) {

    if (configState.lastMod) {
      var lastModified = storeRequire.getLastModified(configState.config);
      if (lastModified) {
        if (configState.lastMod != lastModified) {
          configState = getConfigState(configState.config);
        }
      }
    }
    paths = configState.parseResult.fileNames;

  }
  else {
    paths = filesToCompile;
  }


  var normalizedSourceFiles = {}
  Object.keys(sourceFiles).forEach(function (v) {
    normalizedSourceFiles[ts.normalizePath(v)] = sourceFiles[v];
  });

  var resultObject;
  if (program != null) {
    resultObject = recompile(paths, normalizedSourceFiles);
  }
  else {
    var createdHost = createCompilerHost(options, normalizedSourceFiles);
    program = ts.createProgram(paths, options, createdHost);
    firstCreatedCompilerHost = createdHost;
    resultObject = processResult(options);
  }

  if ((mainFile || configState) && compiledFileList) {
    var fileNameFunc;

    filesToCompile.forEach(function (currentFile) {
      var normalizedCurrentPath = ts.normalizePath(currentFile);
      //there is emit file
      var exist = false;
      compiledFileList.forEach(function (v) {
        var path = normalizePathIfNeed(ts.normalizePath(v));

        if (normalizedCurrentPath == path) {
          exist = true;
        }
      });

      if (!exist) {
        var diagnostic = {};
        diagnostic.filename = currentFile;
        diagnostic.category = "warning";
        diagnostic.message =
            "File was not compiled because there is no a reference" + (mainFile ? " from main file" : " from tsconfig.json");
        if (resultObject.dataArray && resultObject.dataArray.length > 0) {
          resultObject['dataArray'].unshift(diagnostic);
        }
        else {
          resultObject['dataArray'] = [diagnostic];
        }
      }
    });
  }
  if (sentObject.sendCompileFiles) {
    resultObject.compiledFiles = compiledFileList;
  }

  compiledFileList = {};
  return JSON.stringify(resultObject);
}

function processResult(compilerOptions) {
  var result = {};
  result.dataArray = [];
  result.command = 'compile';

  var emitFiles;
  emitFilesArray = [];
  if (program.getDiagnostics) {
    var errors = program.getDiagnostics();

    //todo use exit status
    //var exitStatus;
    if (errors.length) {
      //exitStatus = 1 /* AllOutputGenerationSkipped */;
    }
    else {
      var checker = program.getTypeChecker(true);
      var startTime;
      if (logDebugData) startTime = Date.now();
      emitFilesArray = [];
      var semanticErrors = checker.getDiagnostics();
      if (logDebugData) console.log('Get diagnostics files time ' + (Date.now() - startTime));
      var emitOutput = checker.emitFiles();
      var emitFiles = emitFilesArray;
      emitFilesArray = null;
      contentRoot = null;
      sourceRoot = null;
      var emitErrors = emitOutput.errors;
      //exitStatus = emitOutput.emitResultStatus;
      errors = ts.concatenate(semanticErrors, emitErrors);
    }

    reportDiagnostics(result, errors);
  }
  else {
    var diagnostics = program.getSyntacticDiagnostics();
    reportDiagnostics(result, diagnostics);

    // If we didn't have any syntactic errors, then also try getting the global and
    // semantic errors.
    if (diagnostics.length === 0) {
      var diagnostics = program.getGlobalDiagnostics();
      reportDiagnostics(result, diagnostics);

      if (diagnostics.length === 0) {
        var diagnostics = program.getSemanticDiagnostics();
        reportDiagnostics(result, diagnostics);
      }
    }

    // If the user doesn't want us to emit, then we're done at this point.
    if (compilerOptions.noEmit) {
      return result;
    }

    // Otherwise, emit and report any errors we ran into.
    var emitOutput = program.emit();
    reportDiagnostics(result, emitOutput.diagnostics);

    emitFiles = emitFilesArray;
    emitFilesArray = null;
  }


  result.emitFiles = emitFiles;
  if (logDebugData) console.log('Total process result time ' + (Date.now() - startTime));
  return result;
}

function recompile(changedFiles, sourceFiles) {
  var newCompilerHost = ts.clone(firstCreatedCompilerHost);
  newCompilerHost.getSourceFile = function (filename, languageVersion, onError) {
    if (compiledFileList) {
      compiledFileList.push(normalizePathIfNeed(filename));
    }
    return store.getSourceFile(filename, languageVersion, onError, sourceFiles);
  }

  program = ts.createProgram(changedFiles, options, newCompilerHost);
  return processResult(options);
}

function initServicesContext() {
  var fs = require('fs');
  var vm = require('vm');
  var pathToServicesFile = typeScriptServicePath;


  var fileData = fs.readFileSync(pathToServicesFile, 'utf-8');
  var context = vm.createContext();
  context.module = module;
  context.require = require;
  context.process = process;

  vm.runInNewContext(fileData, context);

  if (!context.ts) throw new Error('ERROR_BRIDGE: Cannot find typescript service implementation in the file ' + pathToServicesFile);

  commandLine(context.ts);
  return context;
}

function getCanonicalFileName(fileName) {
  return sys.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase();
}
function createCompilerHost(options, sourceFiles) {
  var existingDirectories = {};


  function writeFile(fileName, data, writeByteOrderMark, onError) {
    if (logDebugData) console.log('Default file path ' + fileName);
    function directoryExists(directoryPath) {
      if (ts.hasProperty(existingDirectories, directoryPath)) {
        return true;
      }
      if (sys.directoryExists(directoryPath)) {
        existingDirectories[directoryPath] = true;
        return true;
      }
      return false;
    }

    function ensureDirectoriesExist(directoryPath) {
      if (directoryPath.length > ts.getRootLength(directoryPath) && !directoryExists(directoryPath)) {
        var parentDirectory = ts.getDirectoryPath(directoryPath);
        ensureDirectoriesExist(parentDirectory);
        sys.createDirectory(directoryPath);
      }
    }

    if (pathProcessor) {
      fileName = pathProcessor.getExpandedPath(fileName, contentRoot, sourceRoot, onError);
    }

    try {
      ensureDirectoriesExist(ts.getDirectoryPath(ts.normalizePath(fileName)));
      if (emitFilesArray) {
        emitFilesArray.push(normalizePathIfNeed(fileName));
      }
      if (logDebugData) console.log('Write file ' + fileName);
      sys.writeFile(fileName, data, writeByteOrderMark);
    }
    catch (e) {
      if (onError) {
        onError(e.message);
      }
    }
  }

  function getSourceFile(filename, languageVersion, onError) {
    if (compiledFileList) {
      compiledFileList.push(normalizePathIfNeed(filename));
    }
    return store.getSourceFile(filename, languageVersion, onError, sourceFiles);
  }

  return {
    getSourceFile: getSourceFile,
    //ts1.4 method name
    getDefaultLibFilename: function () {
      return ts.combinePaths(ts.normalizePath(typeScriptServiceDirectory), options.target === 2 /* ES6 */ ? "lib.es6.d.ts" : "lib.d.ts");
    },
    //ts.1.5 method name
    getDefaultLibFileName: function () {
      return this.getDefaultLibFilename();
    },
    writeFile: writeFile,
    getCurrentDirectory: getCurrentDirectory,
    useCaseSensitiveFileNames: function () {
      return sys.useCaseSensitiveFileNames;
    },
    getCanonicalFileName: getCanonicalFileName,
    getNewLine: function () {
      return sys.newLine;
    }
  };
}


function reportDiagnostics(resultObject, diagnostics) {
  for (var i = 0; i < diagnostics.length; i++) {
    var diagnostic = diagnostics[i];
    var resultDiagnostic = {};
    if (diagnostic.file) {
      var file = diagnostic.file;

      //ts 1.4 filename ts 1.5 fileName
      if (file.filename) {
        resultDiagnostic.filename = normalizePathIfNeed(file.filename);
      }
      else {
        resultDiagnostic.filename = normalizePathIfNeed(file.fileName);
      }
      var loc;
      if (!file.getLineAndCharacterFromPosition) {
        loc = ts.getLineAndCharacterOfPosition(file, diagnostic.start);
        resultDiagnostic.line = loc.line + 1;
        resultDiagnostic.column = loc.character + 1;
      }
      else {
        loc = file.getLineAndCharacterFromPosition(diagnostic.start);
        resultDiagnostic.line = loc.line;
        resultDiagnostic.column = loc.character;
      }
    }
    resultDiagnostic.category = ts.DiagnosticCategory[diagnostic.category].toLowerCase();
    var textMessage = "";
    if (typeof diagnostic.messageText === "string") {
      textMessage = diagnostic.messageText;
    }
    else if (diagnostic.messageText != null && diagnostic.messageText.messageText != null) {
      textMessage = diagnostic.messageText.messageText;
    }

    resultDiagnostic.message = "TS" + diagnostic.code + ": " + textMessage;
    resultObject.dataArray.push(resultDiagnostic);
  }
  return resultObject;
}

var commandLine = (function (ts) {
  ts.optionDeclarationsInner = [
    {
      name: "charset",
      type: "string"
    },
    {
      name: "codepage",
      type: "number"
    },
    {
      name: "declaration",
      shortName: "d",
      type: "boolean",
      description: ts.Diagnostics.Generates_corresponding_d_ts_file
    },
    {
      name: "diagnostics",
      type: "boolean"
    },
    {
      name: "emitBOM",
      type: "boolean"
    },
    {
      name: "help",
      shortName: "h",
      type: "boolean",
      description: ts.Diagnostics.Print_this_message
    },
    {
      name: "locale",
      type: "string"
    },
    {
      name: "mapRoot",
      type: "string",
      description: ts.Diagnostics.Specifies_the_location_where_debugger_should_locate_map_files_instead_of_generated_locations,
      paramType: ts.Diagnostics.LOCATION
    },
    {
      name: "module",
      shortName: "m",
      type: {
        "commonjs": 1 /* CommonJS */,
        "amd": 2 /* AMD */
      },
      description: ts.Diagnostics.Specify_module_code_generation_Colon_commonjs_or_amd,
      paramType: ts.Diagnostics.KIND,
      error: ts.Diagnostics.Argument_for_module_option_must_be_commonjs_or_amd
    },
    {
      name: "noEmitOnError",
      type: "boolean",
      description: ts.Diagnostics.Do_not_emit_outputs_if_any_type_checking_errors_were_reported
    },
    {
      name: "noImplicitAny",
      type: "boolean",
      description: ts.Diagnostics.Warn_on_expressions_and_declarations_with_an_implied_any_type
    },
    {
      name: "noLib",
      type: "boolean"
    },
    {
      name: "noLibCheck",
      type: "boolean"
    },
    {
      name: "noResolve",
      type: "boolean"
    },
    {
      name: "out",
      type: "string",
      description: ts.Diagnostics.Concatenate_and_emit_output_to_single_file,
      paramType: ts.Diagnostics.FILE
    },
    {
      name: "outDir",
      type: "string",
      description: ts.Diagnostics.Redirect_output_structure_to_the_directory,
      paramType: ts.Diagnostics.DIRECTORY
    },
    {
      name: "preserveConstEnums",
      type: "boolean",
      description: ts.Diagnostics.Do_not_erase_const_enum_declarations_in_generated_code
    },
    {
      name: "removeComments",
      type: "boolean",
      description: ts.Diagnostics.Do_not_emit_comments_to_output
    },
    {
      name: "sourceMap",
      type: "boolean",
      description: ts.Diagnostics.Generates_corresponding_map_file
    },
    {
      name: "sourceRoot",
      type: "string",
      description: ts.Diagnostics.Specifies_the_location_where_debugger_should_locate_TypeScript_files_instead_of_source_locations,
      paramType: ts.Diagnostics.LOCATION
    },
    {
      name: "suppressImplicitAnyIndexErrors",
      type: "boolean",
      description: ts.Diagnostics.Suppress_noImplicitAny_errors_for_indexing_objects_lacking_index_signatures
    },
    {
      name: "target",
      shortName: "t",
      type: {"es3": 0 /* ES3 */, "es5": 1 /* ES5 */, "es6": 2 /* ES6 */},
      description: ts.Diagnostics.Specify_ECMAScript_target_version_Colon_ES3_default_ES5_or_ES6_experimental,
      paramType: ts.Diagnostics.VERSION,
      error: ts.Diagnostics.Argument_for_target_option_must_be_es3_es5_or_es6
    },
    {
      name: "version",
      shortName: "v",
      type: "boolean",
      description: ts.Diagnostics.Print_the_compiler_s_version
    },
    {
      name: "watch",
      shortName: "w",
      type: "boolean",
      description: ts.Diagnostics.Watch_input_files
    }
  ];
  var shortOptionNames = {};
  var optionNameMap = {};
  ts.forEach(ts.optionDeclarationsInner, function (option) {
    optionNameMap[option.name.toLowerCase()] = option;
    if (option.shortName) {
      shortOptionNames[option.shortName] = option.name;
    }
  });
  function parseCommandLineHost(commandLine) {
    // Set default compiler option values
    var options = {
      target: 0 /* ES3 */,
      module: 0 /* None */
    };
    var errors = [];
    parseStrings(commandLine);
    return {
      options: options,
      errors: errors
    };
    function parseStrings(args) {
      var i = 0;
      while (i < args.length) {
        var s = args[i++];
        if (s.charCodeAt(0) === 64 /* at */) {
          parseResponseFile(s.slice(1));
        }
        else if (s.charCodeAt(0) === 45 /* minus */) {
          s = s.slice(s.charCodeAt(1) === 45 /* minus */ ? 2 : 1).toLowerCase();
          if (ts.hasProperty(shortOptionNames, s)) {
            s = shortOptionNames[s];
          }
          if (ts.hasProperty(optionNameMap, s)) {
            var opt = optionNameMap[s];
            if (!args[i] && opt.type !== "boolean") {
              errors.push(ts.createCompilerDiagnostic(ts.Diagnostics.Compiler_option_0_expects_an_argument, opt.name));
            }
            switch (opt.type) {
              case "number":
                options[opt.name] = parseInt(args[i++]);
                break;
              case "boolean":
                options[opt.name] = true;
                break;
              case "string":
                options[opt.name] = args[i++] || "";
                break;
              default:
                var value = (args[i++] || "").toLowerCase();
                if (ts.hasProperty(opt.type, value)) {
                  options[opt.name] = opt.type[value];
                }
                else {
                  errors.push(ts.createCompilerDiagnostic(opt.error));
                }
            }
          }
          else {
            if (s == "project" ||
                s == "p") {
              throw new Error('Typescript 1.4 does not have tsconfig.json support');
            }
            //if option is unknown we cannot report error (may be a new parameter)
            if (args[i] && args[i].charCodeAt(0) !== 45) {
              options[s] = args[i++];
            }
            else {
              options[s] = true;
            }
          }
        }
      }
    }

    function parseResponseFile(filename) {
      var text = sys.readFile(filename);
      if (!text) {
        errors.push(ts.createCompilerDiagnostic(ts.Diagnostics.File_0_not_found, filename));
        return;
      }
      var args = [];
      var pos = 0;
      while (true) {
        while (pos < text.length && text.charCodeAt(pos) <= 32 /* space */) {
          pos++;
        }
        if (pos >= text.length) {
          break;
        }
        var start = pos;
        if (text.charCodeAt(start) === 34 /* doubleQuote */) {
          pos++;
          while (pos < text.length && text.charCodeAt(pos) !== 34 /* doubleQuote */) {
            pos++;
          }
          if (pos < text.length) {
            args.push(text.substring(start + 1, pos));
            pos++;
          }
          else {
            errors.push(ts.createCompilerDiagnostic(ts.Diagnostics.Unterminated_quoted_string_in_response_file_0, filename));
          }
        }
        else {
          while (text.charCodeAt(pos) > 32 /* space */) {
            pos++;
          }
          args.push(text.substring(start, pos));
        }
      }
      parseStrings(args);
    }
  }

  ts.parseCommandLineHost = parseCommandLineHost;
});


exports.createCompilerHost = createCompilerHost;
exports.compileFile = compileFile;
exports.initCompiler = initCompiler;
exports.resetStore = resetStore;

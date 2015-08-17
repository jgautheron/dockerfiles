var fileName = '$FileName$';
var fileDir = '$FileDir$';
var fileDirName = '$FileDirName$';
//relative to module content root
var fileDirRelativeToProjectRoot = '$FileDirRelativeToProjectRoot$'
var fileDirRelativeToSourcePath = '$FileDirRelativeToSourcepath$'
var fileRelativeDir = '$FileRelativeDir$'
var moduleFileDir = '$ModuleFileDir$'
var moduleSourcePath = '$ModuleFileDir$'
var sourcePath = '$Sourcepath$';

function getPathProcessor(ts, sys, params) {
  var projectPath = ts.normalizePath(params.projectPath);
  var outPath = ts.normalizePath(params.outPath);
  var outPathHasMacro = outPath.indexOf('$') >= 0;

  var separator = '/';

  /**
   * @param {string} path
   */
  function isAbsolute(path) {
    return path.indexOf('/') == 0 || path.indexOf(':') > 0;
  }

  var prefix = "";

  function getName(oldFileName) {
    return oldFileName.substring(oldFileName.lastIndexOf(separator) + 1);
  }

  var processor = {
    /**
     * @param {string} oldFileName
     * @param contentRoot
     * @param sourceRoot
     * @param onError
     */
    getExpandedPath: function (oldFileName, contentRoot, sourceRoot, onError) {
      console.log('Start suggestion path');
      try {
        oldFileName = ts.normalizePath(oldFileName);
        //oldFileName is absolute normalized path
        var newFileName = getName(oldFileName);

        var partWithoutName = outPath;
        if (outPathHasMacro) {
          partWithoutName = this.expandMacro(oldFileName, newFileName, contentRoot, sourceRoot);
        }

        var path = "";
        if (partWithoutName) {
          path += partWithoutName + '/';
        }
        path += newFileName;

        if (!isAbsolute(path)) {
          path = projectPath + '/' + path;
        }

        console.log('suggested path is ' + path);
        return path;
      }
      catch (e) {
        console.log('Suggester error ' + e);
        onError(e);
      }
    },

    /**
     *
     * @param {string} fullFileName
     * @param {string} onlyFileName
     * @param {string} contentRoot
     * @param {string} sourceRoot
     */
    expandMacro: function (fullFileName, onlyFileName, contentRoot, sourceRoot) {
      var expandValue = outPath;

      function hasMacro(m) {
        return expandValue.indexOf(m) >= 0;
      }

      function expand(m, value) {
        expandValue = expandValue.replace(m, value)
      }


      if (hasMacro(fileName)) {
        expand(fileName, onlyFileName);
      }

      if (hasMacro(fileDir)) {
        expand(fileDir, ts.getDirectoryPath(fullFileName));
      }

      if (hasMacro(fileDirName)) {
        expand(fileDirName, getName(ts.getDirectoryPath(fullFileName)))
      }

      if (hasMacro(fileRelativeDir)) {
        expand(fileRelativeDir, ts.getDirectoryPath(fullFileName.replace(projectPath + separator, "")));
      }

      if (hasMacro(fileDirRelativeToProjectRoot)) {
        expand(fileDirRelativeToProjectRoot, ts.getDirectoryPath(fullFileName.replace(ts.normalizePath(contentRoot) + separator, "")));
      }

      if (hasMacro(fileDirRelativeToSourcePath)) {
        expand(fileDirRelativeToSourcePath, ts.getDirectoryPath(fullFileName.replace(ts.normalizePath(sourceRoot) + separator, "")));
      }

      if (hasMacro(moduleFileDir)) {
        expand(moduleFileDir, ts.normalizePath(contentRoot));
      }

      if (hasMacro(moduleSourcePath)) {
        expand(moduleSourcePath, ts.normalizePath(sourceRoot));
      }

      if (hasMacro(sourcePath)) {
        expand(sourcePath, ts.normalizePath(sourceRoot));
      }

      return expandValue;
    }
  }

  return processor;
}

exports.getPathProcessor = getPathProcessor;
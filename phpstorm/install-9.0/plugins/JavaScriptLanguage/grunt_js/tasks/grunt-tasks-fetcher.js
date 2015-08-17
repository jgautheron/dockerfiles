'use strict';

var GRUNT_TASK_STRUCTURE_FETCHER_TASK_NAME = '_intellij_grunt_tasks_fetcher'
  , intellijUtil = require('../lib/grunt-intellij-util')
  , ALIAS_TASK_PREFIX = 'Alias for "';

module.exports = function (grunt) {

  grunt.registerTask(GRUNT_TASK_STRUCTURE_FETCHER_TASK_NAME, 'Prints grunt task structure', function () {
    var rawTasks = grunt.config.getRaw();
    var _tasks = grunt.task._tasks;

    if (rawTasks == null && _tasks == null) {
      return;
    }
    var aliasTasks = [];
    var coreTasks = [];

    Object.keys(_tasks).forEach(function (taskName) {
      var _task = _tasks[taskName];

      if (_task != null && intellijUtil.isString(_task.name) &&  _task.name !== GRUNT_TASK_STRUCTURE_FETCHER_TASK_NAME) {
        var ijTask = { name: taskName, info: _task.info };
        var filePath = getFilePath(_task);
        if (filePath != null) {
          ijTask.filePath = filePath;
        }
        if (_task.multi === true) {
          ijTask.multi = true;
        }
        if (isAliasTask(_task)) {
          ijTask.dependencies = getDependencies(_task);
          aliasTasks.push(ijTask);
        }
        else {
          ijTask.targets = [];
          var rawTask = rawTasks[taskName];
          if (rawTask != null) {
            for (var prop in rawTask) {
              if (Object.prototype.hasOwnProperty.call(rawTask, prop)) {
                // Multi task targets can't start with _ or be a reserved property (options).
                // Logic from grunt/lib/grunt/task.js (isValidMultiTaskTarget)
                if (prop !== 'options' && prop.indexOf('_') !== 0) {
                  var target = rawTask[prop];
                  if (intellijUtil.isObject(target) || Array.isArray(target)) {
                    ijTask.targets.push(prop);
                  }
                }
              }
            }
          }
          coreTasks.push(ijTask);
        }
      }
    });
    var resultJson = JSON.stringify({
      aliasTasks: aliasTasks,
      coreTasks: coreTasks
    });
    writeToStdOut(resultJson);
  });
};

function getFilePath(task) {
  var meta = task.meta;
  if (meta) {
    return meta.filepath;
  }
  return null;
}

function isAliasTask(task) {
  return intellijUtil.isString(task.info) && task.info.indexOf(ALIAS_TASK_PREFIX) === 0;
}

function getDependencies(task) {
  if (isAliasTask(task)) {
    var endInd = task.info.lastIndexOf('"');
    if (endInd <= 0) {
      return [];
    }
    var info = task.info.substring(ALIAS_TASK_PREFIX.length, endInd);
    return info.split('", "');
  }
  return [];
}

function canUseConsoleLog() {
  var r = /^v?0\.(\d+)\./.exec(process.version);
  if (!r) {
    return true;
  }
  var minor = parseInt(r[1], 10);
  return isNaN(minor) || minor <= 0 || minor >= 12;
}

function writeToStdOut(str) {
  if (canUseConsoleLog()) {
    console.log(str);
  }
  else {
    var buffer = new Buffer(str, 'utf8')
      , fs = require('fs');
    fs.writeSync(process.stdout.fd, buffer, 0, buffer.length, null);
  }
}

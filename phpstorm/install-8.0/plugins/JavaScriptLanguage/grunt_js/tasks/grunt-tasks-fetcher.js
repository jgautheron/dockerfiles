'use strict';

var GRUNT_TASK_STRUCTURE_FETCHER_TASK_NAME = '_intellij_grunt_tasks_fetcher'
  , intellijUtil = require('../lib/grunt-intellij-util');

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
        if (intellijUtil.isString(_task.info) && _task.info.indexOf('Alias for') === 0) {
          aliasTasks.push(taskName);
        }
        else {
          var coreTask = {
            name: taskName,
            targets: []
          };
          var rawTask = rawTasks[taskName];
          if (rawTask != null) {
            for (var prop in rawTask) {
              if (Object.prototype.hasOwnProperty.call(rawTask, prop)) {
                // Multi task targets can't start with _ or be a reserved property (options).
                // Logic from grunt/lib/grunt/task.js (isValidMultiTaskTarget)
                if (prop !== 'options' && prop.indexOf('_') !== 0) {
                  var target = rawTask[prop];
                  if (intellijUtil.isObject(target) || Array.isArray(target)) {
                    coreTask.targets.push(prop);
                  }
                }
              }
            }
          }
          coreTasks.push(coreTask);
        }
      }
    });
    var resultJson = JSON.stringify({
      aliasTasks: aliasTasks,
      coreTasks: coreTasks
    });
    writeSyncToStdOut(resultJson);
  });
};

function writeSyncToStdOut(str) {
  var buffer = new Buffer(str, 'utf8')
    , fs = require('fs');
  fs.writeSync(process.stdout.fd, buffer, 0, buffer.length, null);
}

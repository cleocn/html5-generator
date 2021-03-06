var mongoose = require('./getMongo').mongoose;
var q = require('q');

var projectKeys = { 
  email: String,
  name: String,
  title: String,
  desc: String,
  keywords: String,
  tags: String,
  css: String,
  javascript: String,
  additionalScriptCount: Number,
  additionalScripts: Array,
  createdTime: Date,
  modifiedTime: Date,
  pageCount: Number,
  pageHtmls: Array,
  items: {},
  curId: Number,
  pages: Array,
  links: Array
};

var projectSchema = mongoose.Schema(projectKeys);

var Project = mongoose.model('Project', projectSchema);
var getUserProjects = function(email){
  var deferred = q.defer();
  Project.where('email',email).sort('-modifiedTime').find(function(err,result){
    if(!err){
      deferred.resolve(result);
    }else{
      deferred.reject(err);
    }
  });
  return deferred.promise;
};

var loadProject = function(id){
  var deferred = q.defer();
  Project.where({_id:id}).findOne(function(err,result){
    if(!err){
      deferred.resolve(result);
    }else{
      deferred.reject(err);
    }
  });
  return deferred.promise;
};

var newUserProject = function(email,template){
  var deferred = q.defer();

  var p = new Project();
  if(template){
    for(var i in projectKeys){
      p.set(i,template[i]);
    }
  }
  p.createdTime = new Date();
  p.modifiedTime = new Date();
  p.email = email;
  p.save(function(err){
    if(!err){
      deferred.resolve(p);
    }else{
      deferred.reject(err);
    }
  });

  return deferred.promise;
};


var updateProject = function(project){  
  var deferred = q.defer();
  project.modifiedTime = new Date();
  Project.findOneAndUpdate({_id:project.id||project._id},project,function(err,result){
    if(!err){
      if(!result){
        deferred.reject('result is falsy');
        return deferred.promise;
      };
      for(var i in project){
        if(i in projectKeys){
          result.set(i,project[i]);
        }
      }
      deferred.resolve(result);
    }else{
      deferred.reject(err);
    }
  });
  return deferred.promise;
};

var removeProject = function(id){  
  var deferred = q.defer();
  Project.remove({_id:id},function(err){
    if(!err){
      deferred.resolve('success');
    }else{
      deferred.reject(err);
    }
  });
  return deferred.promise;
};

exports.getUserProjects = getUserProjects;
exports.newUserProject = newUserProject;
exports.loadProject = loadProject;
exports.updateProject = updateProject;
exports.removeProject = removeProject;
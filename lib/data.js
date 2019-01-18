/*
lib for storing data
*/
// dependencias
var fs      = require('fs');
var path    = require('path');
var lib = {};

// base directory
lib.baseDir = path.join(__dirname, '/../.data/');
// escrever dados num arquivo
lib.create = function(dir, file, data, callback){
    // abrir arquivo para escrita
    // wx é uma flag para indicar algo, ver na lib fs
    fs.open(lib.baseDir+dir+'/'+file+'.json', 'wx', function(err, fileDescriptor){
        if(!err && fileDescriptor){
            var strData = JSON.stringify(data);
            fs.writeFile(fileDescriptor, strData, function(err){
                if (!err){
                    fs.close(fileDescriptor, function(err){
                        if(!err){
                            callback(false);
                        }else{
                            callback("Erro ao fechar o novo arquivo");
                        }
                    });
                } else{
                    callback("Erro ao gravar o arquivo");
                }
            });
        }else{
            callback('Nao foi possivel criar o arquivo. Talvez ele ja exista.');
        }
    });
}
lib.read = function(dir , file, callback){
    fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf8', function(err,data){
        callback(err,data);
    } );
}

lib.update = function(dir, file, data, callback){
    fs.open(lib.baseDir+dir+'/'+file+'.json', 'r+', function(err, fileDescriptor){
        if(!err && fileDescriptor){
            var strData = JSON.stringify(data);
            fs.writeFile(fileDescriptor, strData, function(err){
                if (!err){
                    fs.truncate(fileDescriptor, function(err){
                        if(!err){
                            // write to the file anc close
                            fs.writeFile(fileDescriptor, strData, function(err){
                                if (!err){
                                    fs.close(fileDescriptor, function(err){
                                        if(!err){
                                            callback(false);
                                        }else{
                                            callback("Erro ao fechar o arquivo atualizado");
                                        }
                                    });
                                } else{
                                    callback("Erro ao atualizar o arquivo");
                                }
                            });
                        }else{
                            callback("Erro ao fechar o novo arquivo");
                        }
                    });
                } else{
                    callback("Erro ao apagar o arquivo");
                }
            });
        }else{
            callback('Nao foi possivel atualizar o arquivo. Talvez ele nao exista.');
        }
    });
}

lib.delete = function(dir, file, callback){
    fs.unlink(lib.baseDir+dir+'/'+file+'.json', function(err){
        if(!err){
            callback(false);
        }else{
            callback("Erro ao excluir o arquivo");
        }
    });
}
/* export the modulo */
module.exports = lib;
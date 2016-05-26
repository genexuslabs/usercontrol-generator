'use babel';

/*
	Usercontrol class
*/

import path from 'path';
import fs from 'fs-plus';
import uuid from 'node-uuid';
import utils from './utils';
import xml2js from 'xml2js';

module.exports = class Usercontrol{
	Path = "";
	Xml = null;

	constructor(_path, _callback) {
		if (fs.isFileSync(_path)){
			this.Path = _path;

			let _me = this;
			fs.readFile( this.Path, function(err, data) {
				let parser = new xml2js.Parser();
				parser.parseString(data, function (err, result) {
					_me.Xml = result;
					_callback();
				});
			});

		}
	}

	static getPath(){
		let _pathList = atom.project.getPaths();
		let _path = "";
		if (_pathList.length>0){
			_pathList = fs.listSync( _pathList[0], [".control"]);
			if (_pathList.length>0)
				_path = _pathList[0];
		}
		return _path;
	}

	static create( _name, _path){
		let uc = {
			name: _name.trim(),
			nameNorm: utils.normalize(_name.trim()),
			path: _path
		};

		uc.path = fs.normalize( path.join( uc.path, uc.nameNorm) );

		if (!uc.name)
			throw "Please, specify a valid usercontrol name";
		if (fs.existsSync(uc.path))
			throw "The path already exists";

		Usercontrol.initUC(uc);

		atom.open( {pathsToOpen: [uc.path]});
	}

	static getPackageBasePath(){
		return path.join(atom.packages.getPackageDirPaths()[0], "usercontrol-generator");
	}

	static initUC(uc){
		fs.makeTreeSync(uc.path);

		let tplpath = path.join(Usercontrol.getPackageBasePath(), "templates");
		fs.readdirSync(tplpath).forEach(function( file, index){
		    let fromPath = path.join( tplpath, file);

			 // newPath : Destination UC path
			 let toPath = path.join(uc.path, file.replace( "name", uc.nameNorm) );

			 // data : template file data
			 console.log("from: " + fromPath + " to: " + toPath );
			 if ((/^.*\.(control|xml|js|xsl)$/gi).test(file)){
				 let data = fs.readFileSync( fromPath, 'utf8');
   			 data = data.replace(/\{UC.Name\}/gi, uc.nameNorm);
   			 data = data.replace(/\{UC.UUID\}/gi, uuid.v4());

   			 fs.writeFileSync( toPath, data, 'utf-8');
			 }else {
				 fs.createReadStream(fromPath).pipe(fs.createWriteStream(toPath));
			 }


		});
	}

	getAttribute(attname){
		let value = "";

		if (attname=="Version")
			value = "0.00.01";

		if (this.Xml.ControlDefinition && this.Xml.ControlDefinition[attname] && this.Xml.ControlDefinition[attname].length > 0){
			value = this.Xml.ControlDefinition[attname][0];
		}

		return value;
	}
}

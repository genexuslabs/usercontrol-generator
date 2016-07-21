'use babel';

/*
	Usercontrol class
*/

import path from 'path';
import fs from 'fs-plus';
import uuid from 'uuid';
import utils from './utils';
import xml2js from 'xml2js';
import {BufferedProcess} from 'atom';

module.exports = class Usercontrol{
	Path = "";
	Xml = null;

	constructor(_path) {
		let isUC = false;
		if (fs.isFileSync(_path)){
			this.Path = _path;

			let data = fs.readFileSync( this.Path, 'utf8');
			let parser = new xml2js.Parser();
			parser.parseString(data, function (err, result) {
				if (result.ControlDefinition)
					isUC = true;
			});
		}
		if (!isUC)
			throw "This project is not a Usercontrol";
	}

	refresh(){
		let data = fs.readFileSync( this.Path, 'utf8');
		let parser = new xml2js.Parser();
		parser.parseString(data, (function (err, result) {
			this.Xml = result;
		}).bind(this));
	}

	static getProjectPath(){
		let _pathList = atom.project.getPaths();
		if ( _pathList.length>0 )
			return _pathList[0];
		else
			return "";
	}
	static getPath(){
		let _path = "";
		if (Usercontrol.getProjectPath()!=""){
			let _pathList = fs.listSync( path.join(Usercontrol.getProjectPath(), "src"), [".control"]);
			if (_pathList.length>0)
				_path = _pathList[0];
		}
		return _path;
	}

	static create( opts){
		opts.name = opts.name.trim();
		opts.nameNorm = utils.normalize(opts.name);
		opts.path = fs.normalize( path.join( opts.basepath, opts.nameNorm) );

		if (!opts.name)
			throw "Please, specify a valid usercontrol name";
		if (!opts.description)
			throw "Please, specify a valid usercontrol description";

		if (opts.platforms.length==0)
			throw "At least one platform must be defined";

		if (fs.existsSync(opts.path))
			throw "The path already exists";


		Usercontrol.initUC( opts );
		atom.open( {pathsToOpen: [opts.path]});
	}

	static getPackageBasePath(){
		return atom.packages.getLoadedPackage("genexus-usercontrol-generator").path;
	}

	static initUC(uc){
		let tplpath = path.join(Usercontrol.getPackageBasePath(), "templates");
		let srcpath = path.join( tplpath, "src");
		let modpath = path.join( tplpath, "node_modules");

		// Now, we are using Apm
		// fs.copySync(modpath, path.join(uc.path, "node_modules"));

		fs.makeTreeSync( uc.path );

		utils.scanTree(tplpath, function(err,fileInfo){
			if (fileInfo.fullpath.indexOf(modpath)!=-1) // excep node_modules (EMFiles)
				return;

			if (!fileInfo.isDir){
				let toPath = fileInfo.basepath.replace( tplpath, uc.path);
				console.log(toPath);

				fs.makeTreeSync( toPath);
				toPath = path.join( toPath, fileInfo.name.replace( "name", uc.nameNorm) );

				// data : template file data
				console.log("from: " + fileInfo.fullpath + " to: " + toPath );

				if ( fileInfo.basepath==srcpath && (/^.*\.(control|xml|js|xsl)$/gi).test(fileInfo.name)){
					let data = fs.readFileSync( fileInfo.fullpath, 'utf8');
					data = data.replace(/\{UC.Name\}/gi, uc.nameNorm);
					data = data.replace(/\{UC.Desc\}/gi, uc.description);
					data = data.replace(/\{UC.Resize\}/gi, uc.resize);
					data = data.replace(/\{UC.Info\}/gi, uc.info);

					let plats = "";
					for(let i=0; i<uc.platforms.length;i++)
						plats += `\t\t<Platform>${uc.platforms[i]}</Platform>`+(i==uc.platforms.length-1 ? "": "\n");
					data = data.replace(/\{UC.Platform\}/gi, plats);

					data = data.replace(/\{UC.UUID\}/gi, uuid());

					fs.writeFileSync( toPath, data, 'utf-8');
				}else {
			 		fs.createReadStream(fileInfo.fullpath).pipe(fs.createWriteStream(toPath));
				}
			}
			else{
				let toPath = fileInfo.fullpath.replace( tplpath, uc.path);
				console.log("creating: " + toPath);
				fs.makeTreeSync( toPath );
			}

		});
	}

	getAttribute(attname){
		this.refresh();
		let value = "";

		if (attname=="Version")
			value = "0.00.01";

		if (this.Xml.ControlDefinition && this.Xml.ControlDefinition[attname] && this.Xml.ControlDefinition[attname].length > 0){
			value = this.Xml.ControlDefinition[attname][0];
		}
		return value;
	}
	setAttribute(attname, value){
		this.refresh();
		if (this.Xml.ControlDefinition){
			this.Xml.ControlDefinition[attname] = value;
			var builder = new xml2js.Builder();
			var xml = builder.buildObject(this.Xml);
			fs.writeFileSync( Usercontrol.getPath(), xml, 'utf-8');
		}

	}

	static exec( command, args, cwd, stdout, stderr, onExit){
		if (this.process) {
			this.process.kill();
			this.process = null;
		}

		// Se ajusta el path para incluir node de Atom
		process.env.PATH = (function() {
			// atom.packages.getApmPath()
			let p = path.parse(atom.packages.getApmPath());
			let ppath = process.env.PATH;
			switch (process.platform) {
			  case 'win32':
			    return ppath + ";" + p.dir;
			  default:
			    return (ppath + ":") + p.dir;
			}
		})();
		console.log(process.env.PATH);

		options = {
			cwd: cwd,
			env: process.env
		};

		this.process = new BufferedProcess({
			command: command,
			args: args,
			options: options,
			stdout: stdout,
			stderr: stderr,
			exit: onExit
		});
	}
}

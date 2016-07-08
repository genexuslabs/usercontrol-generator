'use babel';

import Usercontrol from './usercontrol'
import BaseForm from './base-form';
import path from 'path';
import fs from 'fs-plus';
import {BufferedProcess} from 'atom';
import Convert from 'ansi-to-html';

export default class UsercontrolBuildView extends BaseForm{
	GXUC = null;
	baseVer = "";
	environment = "debug";
	convert = new Convert();

	constructor() {
		super();
	}

	attach(env){
		this.environment = env;

		try{
			this.GXUC = new Usercontrol(Usercontrol.getPath())
				this.clear();
				if (this.environment=="release"){
					this.addControl("input-text", "version", {label: "Version"});
					let v = this.GXUC.getAttribute("Version");
					this.baseVer = v;

					this.setValue( "version", v);
				}

				this.addControl("text", "text-console", {label: "Console", class: "console"});
				this.show();

				if (this.environment=="debug")
					setTimeout( ()=>this.confirm(), 500 );

		}catch(ex){
			// "The project is not a Genexus Usercontrol"
			return alert(ex);
		}
	}

	confirm(){
		this.gulpCwd = Usercontrol.getProjectPath();
		this.gulpFile = "gulpfile.js";

		let msg = `Please, confirm build on ${this.environment}`;

		let cb = (function(){
			if (this.environment=="release"){
				if (this.getValue("version")!=this.baseVer){
					this.GXUC.setAttribute("Version", this.getValue("version"));
				}
			}
			this.runGulp(this.environment);
		}).bind(this);

		atom.confirm({message: msg, buttons: {
				Confirm: cb,
				Cancel: null
		} })
	}

	runApm( task ){
		var args, command;
		command = atom.packages.getApmPath();

	 	console.log("command: " + command);

		args = [ 'install'];
		this.gulpOut("Installing gulp... please wait");
		Usercontrol.exec( command, args, Usercontrol.getProjectPath(), (out) => this.gulpOut(out), (out) => this.gulpErr(out), (function(code){
			this.runGulp( task );
			console.log( "exit: " + code);
		}).bind(this));
	}

	runGulp(task) {
		if (!fs.isDirectorySync(path.join( Usercontrol.getProjectPath(), "node_modules" ))){
			return require('dns').lookup( 'google.com', (function(err) {
				if (err && err.code == "ENOTFOUND"){
					alert( "Please, check your internet connection and try again" );
					this.hide();
				}
				else{
					this.runApm( task );
				}
			}).bind(this));
		}

		var args, command, localGulpPath, projpath;
		command = 'gulp';
		projpath = Usercontrol.getProjectPath(); // atom.project.getPaths()[0];

		console.log(`Using ${this.gulpCwd}/${this.gulpFile}`);

		localGulpPath = path.join( projpath, 'node_modules', '.bin', 'gulp');

		if (fs.existsSync(localGulpPath)) {
			command = localGulpPath;
		}

	 	console.log("command: " + command);

		args = [ task, '--color', '--target=' + task];

		Usercontrol.exec(command, args, this.gulpCwd, (out) => this.gulpOut(out), (out) => this.gulpErr(out), (code) => this.gulpExit(code) );
	}
	/*
	runGulp(task, stdout, stderr, exit) {
		var args, command, localGulpPath, options, projpath, tid;
		if (this.process) {
			this.process.kill();
			this.process = null;
		}

		command = 'gulp';
		projpath = atom.project.getPaths()[0];

		console.log(`Using ${this.gulpCwd}/${this.gulpFile}`);

		localGulpPath = path.join( projpath, 'node_modules', '.bin', 'gulp');

		if (fs.existsSync(localGulpPath)) {
			command = localGulpPath;
		}

	 	console.log("command: " + command);

    	args = [ task, '--color', '--target=' + task];

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
			cwd: this.gulpCwd,
			env: process.env
		};
		stdout || (stdout = (function(_this) {
			return function(output) {
			  return _this.gulpOut(output);
			};
		})(this));
		stderr || (stderr = (function(_this) {
			return function(code) {
			  return _this.gulpErr(code);
			};
		})(this));
		exit || (exit = (function(_this) {
			return function(code) {
			  return _this.gulpExit(code);
			};
		})(this));

		this.process = new BufferedProcess({
			command: command,
			args: args,
			options: options,
			stdout: stdout,
			stderr: stderr,
			exit: exit
		});
	}
	*/
	gulpOut(output) {
		ref = output.split('\n');
		for (var i = 0; i < ref.length; i++) {
			let line = ref[i];
			this.writeOutput( this.convert.toHtml(line) );
		}
	}

	gulpErr(output) {
		ref = output.split('\n');
		for (var i = 0; i < ref.length; i++) {
			let line = ref[i];
			this.writeOutput(this.convert.toHtml(line), 'error');
		}
	}

	gulpExit(code) {
		this.writeOutput("Exited with code " + code, "" + (code ? 'error' : ''));
		this.process = null;
	}

	writeOutput(text){
		this.appendValue("text-console", `<pre>${text}</pre>`);
	}
}

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

		let _path = Usercontrol.getPath();
		if (_path!=""){
			this.GXUC = new Usercontrol(Usercontrol.getPath(), (function(){
				this.clear();
				if (this.environment=="release"){
					this.addControl("label", "label-version", {value: "Version", class: "setting-title"});
					this.addControl("input-text", "version");
					let v = this.GXUC.getAttribute("Version");
					this.baseVer = v;

					this.setValue( "version", v);
				}

				this.addControl("label", "label-console", {value: "Console", class: "setting-title"});
				this.addControl("text", "text-console", {class: "console"});
				this.show();

				if (this.environment=="debug")
					setTimeout( ()=>this.confirm(), 500 );

			}).bind(this));

		}else{
			return alert("The project is not a Genexus Usercontrol");
		}
	}

	confirm(){
		this.gulpCwd = Usercontrol.getProjectPath();
		this.gulpFile = "gulpfile.js";

		let msg = `Please, confirm build on ${this.environment}`;
		// let v = this.getValue("version");
		//if (this.baseVer==v)
		//	msg = `Are you sure to keep usercontrol version ${v}?`;

		atom.confirm({message: msg, buttons: {
					Confirm: ()=>this.runGulp(this.environment),
					Cancel: null
		} })
	}

	runGulp(task, stdout, stderr, exit) {
		var args, command, localGulpPath, options, projpath, tid;
		if (this.process) {
			this.process.kill();
			this.process = null;
		}

		command = 'gulp';
		projpath = atom.project.getPaths()[0];

		// this.gulpCwd = this.getGulpCwd(projpath);

		console.log(`Using ${this.gulpCwd}/${this.gulpFile}`);

		localGulpPath = path.join( projpath, 'node_modules', '.bin', 'gulp');

		if (fs.existsSync(localGulpPath)) {
			command = localGulpPath;
		}

	 	console.log("command: " + command);

    	args = [ task, '--color', '--target=' + task];

		process.env.PATH = (function() {
			switch (process.platform) {
			  case 'win32':
			    return process.env.PATH;
			  default:
			    return (process.env.PATH + ":") + atom.config.get('gulp-control.nodePath');
			}
		})();

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

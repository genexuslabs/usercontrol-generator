'use babel';

import Usercontrol from './usercontrol'
import BaseForm from './base-form';
import Utils from './utils';
import path from 'path';
import fs from 'fs-plus';
import {BufferedProcess} from 'atom';
import Convert from 'ansi-to-html';
import ConfigClass from './config-class';


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

		if (this.environment=="release"){
			if (this.getValue("version")!=this.baseVer){
				this.GXUC.setAttribute("Version", this.getValue("version"));
			}
		}
		this.runGulp(this.environment);

		/*
		let msg = `Please, confirm build on ${this.environment}`;
		let cb = (function(){
			if (this.environment=="release"){
				if (this.getValue("version")!=this.baseVer){
					this.GXUC.setAttribute("Version", this.getValue("version"));
				}
			}
			this.runGulp(this.environment);
		}).bind(this);
		cb();
		atom.confirm({message: msg, buttons: {
				Confirm: cb,
				Cancel: null
		} })
		*/
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
		if (!Utils.pathExists(path.join( Usercontrol.getProjectPath(), "node_modules" ))){
			Utils.checkInternet( (function(err){
				if (err){
					alert( "Please, check your internet connection and try again" );
					this.hide();
				}
				else{
					this.runApm( task );
				}
			}).bind(this));
			return;
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

		args = [ task, '--color', '--target=' + task, '--ucname='+ this.GXUC.getAttribute("Name") ];

		Usercontrol.exec(command, args, this.gulpCwd, (out) => this.gulpOut(out), (out) => this.gulpErr(out), (code) => {this.gulpExit( code, false);} );
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
	
	gulpExit( code, updgx) {
		this.writeOutput("Exited with code " + code, "" + (code ? 'error' : ''));
		this.process = null;
	}

	writeOutput(text){
		this.appendValue("text-console", `<pre>${text}</pre>`);
	}
}

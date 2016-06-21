'use babel';

/*
	Create UC View
*/
import BaseForm from './base-form';
import path from 'path'
import fs from 'fs-plus'
import Usercontrol from './usercontrol'

export default class UsercontrolCreateView extends BaseForm{
	GXUC = null;
	baseVer = "";

	constructor() {
		super();
	}

	attach(){
		this.clear();

		this.addControl( "input-text", "name", {label: "Name"});
		this.addControl( "input-text", "description", {label: "Description"});
		this.addControl( "input-check", "resize", {label: "Can be resized"});
		this.addControl( "input-check", "info", {label: "Include control info"});
		this.addControl( "input-select", "platform", {
			label: "Platform",
			list: [ {label: "Web",value: "Web"}, {label: "WebLayout",value: "WebLayout"}, {label: "SmartDevices",value: "SmartDevices"} ]
		});
		this.addControl( "input-text", "path", {label: "Path"} );

		this.addControl( "block", "error", {class: "error-message"});
		this.addControl("text", "text-console");

		this.setValue( "name", "myUsercontrol");
		this.setValue( "description", "myUsercontrol");
		this.setValue( "path", this.getPackagesDirectory());
		this.toggle();
	}

	confirm(){
		this.block(true);

		var cb = (function(){
			try{
				Usercontrol.create( {
					name: this.getValue("name").trim(),
					description:  this.getValue("description").trim(),
					resize:  this.getValue("resize"),
					info:  this.getValue("info"),
					platform:  this.getValue("platform").trim(),
					basepath: this.getValue("path").trim()
				});
				this.hide();

			}catch(err){
				this.setValue("error", err);
				this.block(false);
			}
		}).bind(this);

		//process.nextTick( cb ); proces before block the form
		setTimeout( cb, 10 );
	}

	getPackagesDirectory(){
		return path.join(fs.getHomeDirectory(), 'usercontrols');
	}
}

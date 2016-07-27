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
		// this.addControl( "input-check", "resize", {label: "Can be resized"});
		// this.addControl( "input-check", "info", {label: "Include control info"});

		this.addControl( "input-select", "info", {label: "Type", list: [
			{label: "Common", value: ""},
			{label: "Grid", value: "grid"},
			{label: "Attribute & Variable", value: "attribute"}
		]});

		this.addControl("label", "text-platform", {value: "Supported Platforms"});
		this.addControl( "input-check", "plat-web", {label: "Web"});
		this.addControl( "input-check", "plat-sd", {label: "SmartDevices"});
		// this.addControl( "input-check", "plat-weblay", {label: "WebLayout"});

		this.addControl( "input-text", "path", {label: "Path"} );

		this.addControl( "block", "error", {class: "error-message"});
		this.addControl("text", "text-console");

		this.setValue( "name", "myUsercontrol");
		this.setValue( "description", "myUsercontrol");
		this.setValue( "path", this.getPackagesDirectory());
		this.toggle();
	}
	getPlatforms(){
		let plats = [];
		if (this.getValue("plat-web")){
			plats.push("Web");
			plats.push("WebLayout");
		}

		if (this.getValue("plat-sd"))
			plats.push("SmartDevices");
		return plats;
	}
	confirm(){
		this.block(true);

		var cb = (function(){
			try{
				Usercontrol.create( {
					name: this.getValue("name").trim(),
					description:  this.getValue("description").trim(),
					info:  this.getValue("info"),
					platforms: this.getPlatforms(),
					basepath: this.getValue("path").trim()
				});
				//	resize:  this.getValue("resize"),

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

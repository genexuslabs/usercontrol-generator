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

		this.addControl( "label", "label-name", { value: "Usercontrol Name", class: "setting-title"});
		this.addControl( "input-text", "name"); // width: 100%
		this.addControl( "label", "label-path", { value: "Path", class: "setting-title"});
		this.addControl( "input-text", "path" );
		this.addControl( "block", "error", {class: "error-message"});
	}

	attach(){
		this.setValue( "name", "myUsercontrol");
		this.setValue( "path", this.getPackagesDirectory());
		this.toggle();
	}

	confirm(){
		try{
			Usercontrol.create( this.getValue("name").trim(), this.getValue("path").trim());
			this.hide();
		}catch(err){
			this.setValue("error", err);
		}
	}

	getPackagesDirectory(){
		return atom.config.get('core.projectHome') || path.join(fs.getHomeDirectory(), 'usercontrols');
	}
}

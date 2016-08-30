'use babel';
import Usercontrol from './usercontrol'
import path from 'path';
import fs from 'fs-plus';

export default class ConfigClass {
	static get(){
		this.GXUC = new Usercontrol(Usercontrol.getPath())
		let cfile = path.join(Usercontrol.getProjectPath(), "config.json");

		// Complete object structure
		let cobj = {
			gxpath: "C:\\Program Files (x86)\\Artech\\GeneXus\\GeneXusXEv3\\",
			gxtestkb: ""
		};

		if (fs.existsSync(cfile)){
			let data = JSON.parse(fs.readFileSync( cfile, 'utf8'));

			// replace attributes with loaded data
			// for compatibility with previous versions
			cobj.gxpath = data.gxpath;
			cobj.gxtestkb = data.gxtestkb;

		}else {
			fs.writeFile(cfile, JSON.stringify(cobj), 'utf8', ()=>{} );
		}

		return cobj;
	}
}

'use babel';

import UsercontrolCreateView from './usercontrol-create-view';
import UsercontrolDeployView from './usercontrol-deploy-view';
import UsercontrolTagsView from './usercontrol-tags-view';
import provider from './autocomplete/provider';

import { CompositeDisposable } from 'atom';

export default {
	subscriptions: null,

	/*
	activate(){
		provider.loadCompletions();
	},
   */
   getProvider(){
		return provider;
	},

	activate(state) {
		// Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
		this.subscriptions = new CompositeDisposable();
		// atom.project.onDidChangePaths(function(){ console.log(arguments) } );

		// Register command that toggles this view
		this.subscriptions.add(atom.commands.add('atom-workspace', {
			'usercontrol-generator:create': this.usercontrolCreate,
			'usercontrol-generator:deploy': this.usercontrolDeploy,
			'usercontrol-generator:tags': this.usercontrolTags
		}));
		// Usercontrol
		this.usercontrolInit();
	},
	deactivate() {
		this.subscriptions.dispose();
		// this.usercontrolCreate.destroy();
	},
	usercontrolInit(){
		// Se asocia la extensión control a xml
		atom.grammars.onDidAddGrammar( function(g){
			if (g.scopeName === "text.xml")
				atom.grammars.grammarsByScopeName["text.xml"].fileTypes.push("control");
		});
	},

	usercontrolCreate() {
		if (!this.usercontrolCreate)
			this.usercontrolCreate = new UsercontrolCreateView();
		this.usercontrolCreate.attach();
	},

	usercontrolDeploy() {
		if (!this.usercontrolDeploy)
			this.usercontrolDeploy = new UsercontrolDeployView();
		this.usercontrolDeploy.attach();
	},

	usercontrolTags() {
		if (!this.usercontrolTags)
			this.usercontrolTags = new UsercontrolTagsView();
		this.usercontrolTags.show();
	}
};

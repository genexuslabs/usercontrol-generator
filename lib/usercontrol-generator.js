"use babel";

import provider from "./autocomplete/provider";
import UsercontrolCreateView from "./usercontrol-create-view";
import Usercontrol from "./usercontrol";
import UsercontrolBuildView from "./usercontrol-build-view";

import { CompositeDisposable } from "atom";

export default {
  subscriptions: null,

  getProvider() {
    return provider;
  },

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(
      atom.commands.add("atom-workspace", {
        "usercontrol-generator:create": this.usercontrolCreate,
        "usercontrol-generator:build-debug": () => this.build("debug"),
        "usercontrol-generator:build-release": () => this.build("release")
      })
    );

    // ----------------------------------------------------
    // Bind .control to xml
    let g = atom.grammars.grammarForScopeName("text.xml");
    if (g) {
      console.log("Grammar exists");
      this.addGrammar(g);
    } else {
      this.subscriptions.add(
        atom.grammars.onDidAddGrammar(this.addGrammar),
        atom.project.onDidChangePaths(() => provider.activate())
      );
    }

    // Autocomplete stuff
    provider.activate();
  },
  addGrammar(g) {
    if (g.scopeName !== "text.xml") return;

    for (let i = 0; i < g.fileTypes.length; i++) {
      if (g.fileTypes[i] == "control") return;
    }
    g.fileTypes.push("control");

    // Acctually opened
    let editors = atom.workspace.getTextEditors();
    for (let i = 0; i < editors.length; i++) {
      let editor = editors[i];
      if (editor.getPath() && editor.getPath().indexOf(".control") >= 0)
        editor.setGrammar(g);
    }
  },
  deactivate() {
    this.subscriptions.dispose();
  },
  usercontrolCreate() {
    if (!this.usercontrolCreate)
      this.usercontrolCreate = new UsercontrolCreateView();
    this.usercontrolCreate.attach();
  },
  build(env) {
    if (!this.usercontrolBuild)
      this.usercontrolBuild = new UsercontrolBuildView();
    this.usercontrolBuild.attach(env);
  }
};

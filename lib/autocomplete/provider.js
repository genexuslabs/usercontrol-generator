"use babel";
import xsd from "./xsd";
import xmlutils from "./xml-utils";
import path from "path";
import Usercontrol from "../usercontrol";

module.exports = {
  selector: ".text.xml",
  disableForSelector: "",
  inclusionPriority: 1,
  excludeLowerPriority: true,
  xmlpath: "",
  usercontrol: null,
  activate: function() {
    try {
      this.usercontrol = new Usercontrol(Usercontrol.getPath());
    } catch (ex) {
      console.log(ex);
      this.usercontrol = null;
    }
  },
  getSuggestions: function(options) {
    if (!this.usercontrol)
      // Check if is a UC
      return [];

    let schema = "";
    let filename = options.editor.getTitle();

    if (path.extname(filename) == ".control") schema = "control.xsd";
    else if (
      filename.toUpperCase() ==
      this.usercontrol.getAttribute("PropertiesDefinition").toUpperCase()
    )
      schema = "properties.xsd";
    //		else if (filename.toUpperCase()==this.usercontrol.getAttribute("DesignRender").toUpperCase())
    //			schema = "xslt.xsd";
    else return [];

    console.log("Schema: " + schema);

    let xpath = xmlutils.getXPath(
      options.editor.getBuffer(),
      options.bufferPosition,
      options.prefix
    );
    console.log("XPath: " + xpath);

    if (this.xmlpath == options.editor.getPath()) {
      return this.detectAndGetSuggestions(options);
    } else {
      var _this = this;
      return new Promise(function(resolve) {
        let _path = path.join(Usercontrol.getPackageBasePath(), schema);
        // console.log( `${_path}::${options.editor.getPath()}::${options.editor.getTitle()}` );
        xsd.load(options.editor.getPath(), _path, function() {
          _this.xmlpath = options.editor.getPath();
          return resolve(_this.detectAndGetSuggestions(options));
        });
      });
    }
  },
  detectAndGetSuggestions: function(options) {
    if (this.isTagName(options)) return this.getTagNameCompletions(options);
    else if (this.isCloseTagName(options))
      return this.getCloseTagNameCompletion(options);
    else if (this.isTagValue(options))
      return this.getValuesCompletions(options);
    else return [];
    /*
    else if @isCloseTagName options
      @getCloseTagNameCompletion options
    else if @isAttributeValue options
      @getAttributeValueCompletions options
    else if @isAttribute options
      @getAttributeCompletions options
    else if @isTagValue options
      @getValuesCompletions options
    else
      return [];
	 */
  },
  isTagName: function(arg) {
    var bufferPosition, column, editor, prefix, row, tagChars, tagPos;
    (editor = arg.editor),
      (bufferPosition = arg.bufferPosition),
      (prefix = arg.prefix);
    (row = bufferPosition.row), (column = bufferPosition.column);
    tagPos = column - prefix.length - 1;
    tagChars = editor.getTextInBufferRange([[row, tagPos], [row, tagPos + 1]]);
    return tagChars === "<" || prefix === "<";
  },
  isCloseTagName: function(arg) {
    var bufferPosition, column, editor, prefix, row, tagChars, tagClosePos;
    (editor = arg.editor),
      (bufferPosition = arg.bufferPosition),
      (prefix = arg.prefix);
    (row = bufferPosition.row), (column = bufferPosition.column);
    tagClosePos = column - prefix.length - 2;
    tagChars = editor.getTextInBufferRange([
      [row, tagClosePos],
      [row, tagClosePos + 2]
    ]);
    return tagChars === "</";
  },
  // Checks if the current cursor is about complete values.
  isTagValue: function(arg) {
    var scopeDescriptor;
    scopeDescriptor = arg.scopeDescriptor;
    return scopeDescriptor.getScopesArray().indexOf("text.xml") !== -1;
  },
  getTagNameCompletions: function(arg) {
    var bufferPosition, children, editor, prefix;
    (editor = arg.editor),
      (bufferPosition = arg.bufferPosition),
      (prefix = arg.prefix);
    children = xsd.getChildren(
      xmlutils.getXPath(editor.getBuffer(), bufferPosition, prefix)
    );
    return this.filterCompletions(children, prefix === "<" ? "" : prefix);
  },
  getCloseTagNameCompletion: function(arg) {
    var bufferPosition, editor, parentTag, prefix;
    (editor = arg.editor),
      (bufferPosition = arg.bufferPosition),
      (prefix = arg.prefix);
    parentTag = xmlutils.getXPath(
      editor.getBuffer(),
      bufferPosition,
      prefix,
      1
    );
    parentTag = parentTag[parentTag.length - 1];
    return [
      {
        text: parentTag + ">",
        displayText: parentTag,
        type: "tag",
        rightLabel: "Tag"
      }
    ];
  },
  getValuesCompletions: function(arg) {
    var bufferPosition, children, editor, prefix;
    (editor = arg.editor),
      (bufferPosition = arg.bufferPosition),
      (prefix = arg.prefix);
    children = xsd.getValues(
      xmlutils.getXPath(editor.getBuffer(), bufferPosition, "")
    );
    return this.filterCompletions(children, prefix);
  },
  // Filter the candidate completions by prefix.
  filterCompletions: function(sugs, pref) {
    var completions, i, len, ref, s;
    completions = [];
    pref = pref != null ? pref.trim() : void 0;
    for (i = 0, len = sugs.length; i < len; i++) {
      s = sugs[i];
      if (
        !pref ||
        ((ref = s.text) != null ? ref : s.snippet).indexOf(pref) !== -1
      ) {
        completions.push(this.buildCompletion(s));
      }
    }
    return completions;
  },
  // Build the completion from scratch. In this way the object doesn't
  // contain attributes from previous autocomplete-plus processing.
  buildCompletion: function(value) {
    return {
      text: value.text,
      snippet: value.snippet,
      displayText: value.displayText,
      description: value.description,
      type: value.type,
      rightLabel: value.rightLabel,
      leftLabel: value.leftLabel
    };
  },
  onDidInsertSuggestion: function(arg) {
    var editor, suggestion, triggerPosition;
    (editor = arg.editor),
      (triggerPosition = arg.triggerPosition),
      (suggestion = arg.suggestion);
  },
  dispose: function() {}
};

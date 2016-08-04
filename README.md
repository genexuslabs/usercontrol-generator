usercontrol-generator package
=============================
![Downloads](https://img.shields.io/github/downloads/genexuslabs/usercontrol-generator/total.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

Genexus User Control Generator is an Atom package that helps to create [User Controls](http://wiki.genexus.com/commwiki/servlet/wiki?5273,Category%3AUser+Controls) for GeneXus.

![A screenshot of your package](https://s3-sa-east-1.amazonaws.com/gprojexcache/public/screen.gif)

Table of Contents
-----------------
  * [Main Features](#features)
  * [Requirements](#requirements)
  * [Installation](#install)
  * [Using](#using)
  * [Architecture](#architecture)
  * [Contributing](#contributing)
  * [Support](#support)
  * [License](#license)  

## Main Features
With this package you get:

* User Control creation with main settings
* .control files syntax highlighting
* .control structure autocomplete
* Gulp building script

## Requirements

- [Atom](https://atom.io/)

## Installation
### Windows
1. Install & Run 'atom'
1. Go to File/Settings/Install
2. Search for "GeneXus Usercontrol Generator"
3. Press Install button

### macOS
1. Install & Run 'atom'
1. Go to Atom/Preferences/Install
2. Search for "GeneXus Usercontrol Generator"
3. Press Install button

## Using
### Create a new User Control
Follow below steps to create a new User Control:

1. Go to Packages/GeneXus/Create User control
2. Specify name, description, platform and other attributes and press enter
3. A new User Control project is created

#### Project's structure is generated
When you create a User Control from this package, the below structure will be created:

* \src: User Control source files
* \gulpfile.js: Gulp script for building (debug/release)
* \build\debug: Default debug build
* \build\release: Default release build

### Build process
This package uses gulp to build the user control.
You can do a debug or release build by click on the option Packages/GeneXus/Build/[Debug or Release]

You are free to modify your project's gulp script by editing the gulpscript.js file.

#### Updating your testing User Control KB
You will find the myTestKB variable on the gulpscript file. By setting this variable, the user control will be updated in your KB when you run a debug build.

Take care that you must specify the full path, for example:

Windows: C:/users/johndoe/kbs/mykb/web/myuc
Linux: /home/johndoe/usercontrols/targets/myuc

## Architecture
### Autocomplete
Atom uses [Autocomplete plus](https://github.com/atom/autocomplete-plus) for this feature.

Were write a specific autocomplete provider to add this feature in the control and properties file. You can check it on \lib\autocomplete\provider.js.

### User Control
usercontrol.js is a helper class that provides with some User Control features as creation, validation, read and write attributes and others.

This class will be used mainly for creating and building a User Control.

#### Creation
usercontrol-create-view is UI responsible for creating the User Control.

#### Build
For build process, we decided for [gulp](http://gulpjs.com/) (it's on javascript too).
"usercontrol-build-view" is responsible for the UI and run the gulp script located on the User Control root path.

### Grammar association
.control files are associated automatically to xml files using [grammars](https://atom.io/docs/api/v1.8.0/Grammar). This happens on the User Control activation (usercontrol-generator.activate()).

### Others
base-form.js is an abstract form helper to build our UI.

utils.js is a class with some useful functions.

## Contributing
This project adheres to the Contributor Covenant [code of conduct](CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code. Please report unacceptable behavior to jdiana@genexus.com.

### Some standards
[Writing a friendly readme](http://rowanmanning.com/posts/writing-a-friendly-readme/)

## Support
For user controls related issues, please use http://stackoverflow.com/tags/genexus.

For this package issues, please use github issue system.

### Known issues
In some versions of Windows, the UserControl folder can't be deleted.
For more information, please check next links:

https://github.com/nodejs/node-v0.x-archive/issues/6960#issuecomment-46704998

https://news.slashdot.org/story/16/05/31/0012222/microsoft-removes-260-character-path-length-limit-in-windows-10-redstone

## License
Copyright (c) 2016 Genexus

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

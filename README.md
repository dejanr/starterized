Starterized Command Line Interface
==================================

Easily work and scaffold starterized project.

Required software
-----------------

* Node
* Compass

Installation
------------

    $ npm install -g starterized-cli

Usage
-----

* **Initialize** a new project with starterized files and structure.

    $ starterized init

* **Start** from foundation of our modules by installing what you need
  for your project or module.

    $ npm install --save starterized-core starterized-grid

  And importing them inside your index sass file.

    @import 'starterized-core/index';
    @import 'starterized-grid/index';

* *We encourage* you to build your foundation of modules and be modular.

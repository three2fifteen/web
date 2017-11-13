=========================
Three2Fifteen - Front end
=========================

Prerequisites
=============

The server runs on Python 3.5+

Server
======

Copy config.template.cfg to config.cfg and update the values to fit your
environment.

Install the server:

.. code-block::

    $ pip install -e .

To start it, run:

.. code-block::

	$ env THREE2FIFTEEN_WEB_SETTINGS=/path/to/config.cfg three2fifteen-web

WebViews
========

The HTML views are in:

.. code-block::

	three2fifteen/templates/

Sass
====

To install sass in the project, run:

.. code-block::

	make sass-install

To start the sass watch, run:

.. code-block::

	make sass-watch

To manually compile the sass files in css, run:

.. code-block::

	make sass-run

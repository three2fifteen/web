#!/usr/bin/python
# -*- coding: utf-8 -*-

from setuptools import setup


setup(name='three2fifteen-web',
      version='0.0.1',
      description='Three2Fifteen web',
      url='http://github.com/Three2Fifteen/web',
      author='Ghislain Rodrigues',
      author_email='three2fifteen@ghislain-rodrigues.fr',
      license='MIT',
      packages=['three2fifteen'],
      long_description=open('README.rst').read(),
      install_requires=[
          'flask',
          'tornado'
      ],
      entry_points={
          'console_scripts': [
              'three2fifteen-web = three2fifteen.app:main'
          ],
      },
      classifiers=[
          'License :: OSI Approved :: MIT License',
          'Environment :: Console',
          'Programming Language :: Python',
          'Programming Language :: Python :: 3.6'
      ],
      zip_safe=True)

#!/bin/bash

function assert {
	if [ "$2" != "$1" ]
	then
		echo Failed
		echo Expected:
		printf "$1"
		echo
		echo Actual:
		printf "$2"
		echo
		exit 1
	fi
}

function testBabelInPath {
	echo "		Babel test"

	echo "module.exports = require(\"@devsnicket/plugin-discovery-create-repository\")();" > $1repository.js
	echo "require(\"./repository\").plugIn(\"test plug-in\");" > $1plugin.js
	mkdir $1pluginSubdirectory
	echo "require(\"../repository\").plugIn(\"test sub-directory plug-in of repository in parent directory\");" > $1pluginSubdirectory/pluginOfRepositoryInParentDirectory.js	

	assert "$(cat ../../test.repository.expected.js)" "$(npx babel $1repository.js)"
}

function testRuntimeInPath {
	echo "		runtime test"

	cp ../../test.repository.expected.js $1repository.js

	local getExpected="for (const plugin of require(\"$1repository.js\")) console.log(plugin);"

	assert $'test plug-in\ntest sub-directory plug-in of repository in parent directory' "$(node -e "${getExpected}")"
}

function testInPath {
	echo "	for respository in path \"$1\""

	testBabelInPath $1
	testRuntimeInPath ./$1
}

function testPackages {
	echo Running tests in $1 for packages $2

	mkdir $1
	cd $1

	echo "{ \"description\": \"test for $2\", \"license\": \"UNLICENSED\", \"repository\": \"none\" }" > package.json
	npm install $2
	npm install ../../../create-repository/output/devsnicket-plugin-discovery-create-repository-*.tgz

	echo "{ \"plugins\": [ [ \"../../index.js\", { \"log\": \"warnings\" } ] ] }" > .babelrc

	testInPath

	mkdir repositoryInSubdirectory
	testInPath repositoryInSubdirectory/

	cd ..
}

if [ -d "test" ]; then
	rm -r test
fi
mkdir test
cd test
testPackages babel-6 'babel-cli@6 babel-core@6'
testPackages babel-7 '@babel/cli@7 @babel/core@7'
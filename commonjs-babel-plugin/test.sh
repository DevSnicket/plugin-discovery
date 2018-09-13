#!/bin/bash

function testRepositoryInPath {
	echo "Running test for respository in path \"$1\""
	local actual="$(npx babel $1repository.js)"
	local expected="$(cat ../../test.expected.js)"
	if [ "$actual" == "$expected" ]
	then
		echo Success
	else
		echo Failed
		echo Expected:
		printf "$expected"
		echo
		echo Actual:
		printf "$actual"
		echo
		exit 1
	fi
}

function testPackages {
	local testDirectoryPath=test/$1
	echo "Running tests for packages $testDirectoryPath"
	rm -r $testDirectoryPath
	mkdir $testDirectoryPath
	cd $testDirectoryPath
	echo {} > package.json
	npm install $2
	npm install ../../../create-repository/output/devsnicket-plugin-discovery-create-repository*.tgz

	echo "{ \"plugins\": [ [ \"../../index.js\", { \"log\": \"warnings\" } ] ] }" > .babelrc

	echo "module.exports = require(\"@devsnicket/plugin-discovery-create-repository\")();" > repository.js
	echo "require(\"./repository\").plugin(\"test plug-in\");" > plugin.js
	mkdir subdirectory
	echo "require(\"../repository\").plugin(\"test sub-directory plug-in of repository in parent directory\");" > subdirectory/pluginOfRepositoryInParentDirectory.js	
	testRepositoryInPath

	cp {repository.js,plugin.js} subdirectory
	mkdir subdirectory/subdirectory
	cp subdirectory/pluginOfRepositoryInParentDirectory.js subdirectory/subdirectory
	testRepositoryInPath subdirectory/
}

testPackages babel-6 'babel-cli@6 babel-core@6'
testPackages babel-7 '@babel/cli@7 @babel/core@7'
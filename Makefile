install:
	npm ci

dev:
	npx webpack serve --mode development

build:
	rm -rf dist
	NODE_ENV=production npx webpack

clean:
	rm -rf dist/
	
lint:
	npx eslint .

lintfix:
	npx eslint --fix .

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8

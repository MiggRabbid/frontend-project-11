install:
	npm ci

lint:
	npx eslint .

lintfix:
	npx eslint --fix .

dev:
	npx webpack serve --mode development

clean:
	rm -rf dist/

build:
	NODE_ENV=production npx webpack

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8

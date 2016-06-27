var yo = require('yeoman-generator');
var yosay = require('yosay');
var pkg = require('../package.json');

module.exports = yo.Base.extend({
  constructor: function construct() {
    yo.Base.apply(this, arguments);
  },
  initializing: function initializing() {
    this.pkg = pkg;
  },
  prompting: function prompting() {
    var done = this.async();
    var prompts = [{
      type: 'checkbox',
      name: 'features',
      message: 'What shall I include?',
      choices: [{
        name: 'ESLint',
        value: 'includeEslint',
        checked: true
      }, {
        name: 'Editor Config',
        value: 'includeEditorconfig',
        checked: true
      }, {
        name: 'SCSS Lint',
        value: 'includeScss',
        checked: true
      }, {
        name: 'Gulp',
        value: 'includeGulp',
        checked: true
      }, {
        name: 'Git Ingore',
        value: 'includeGit',
        checked: true
      }]
    }, {
      type: 'list',
      name: 'ecmaversion',
      message: 'Which version of ECMAScript?',
      choices: [{
        name: 'ES6',
        value: 6
      }, {
        name: 'ES5',
        value: 5
      }],
      when: function when(answers) {
        return answers.features.indexOf('includeEslint') !== -1;
      }
    }];

    this.log(yosay('\'Allo \'allo! Config files coming right up...'));

    this.prompt(prompts, function handleAnswers(answers) {
      var features = answers.features;

      this.ecmaversion = answers.ecmaversion;

      function hasFeature(feat) {
        return features && features.indexOf(feat) !== -1;
      }

      this.includeEslint = hasFeature('includeEslint');
      this.includeEditorconfig = hasFeature('includeEditorconfig');
      this.includeScss = hasFeature('includeScss');
      this.includeGulp = hasFeature('includeGulp');
      this.includeGit = hasFeature('includeGit');

      done();
    }.bind(this));
  },
  writing: {
    global: function global() {
      if (this.includeEditorconfig) {
        this.fs.copyTpl(
          this.templatePath('.editorconfig'),
          this.destinationPath('.editorconfig')
        );
      }

      if (this.includeGit) {
        this.fs.copyTpl(
          this.templatePath('.gitignore'),
          this.destinationPath('.gitignore')
        );
      }

      if (this.includeScss) {
        this.fs.copyTpl(
          this.templatePath('.scss-lint.yml'),
          this.destinationPath('.scss-lint.yml')
        );
      }

      if (this.includeGulp) {
        this.fs.copyTpl(
          this.templatePath('gulpfile.babel.js'),
          this.destinationPath('gulpfile.babel.js')
        );
      }
    },
    versionDependent: function versionDependent() {
      if (this.includeEslint) {
        switch (this.ecmaversion) {
          case 6:
            this.fs.copyTpl(
              this.templatePath('es6/.eslintrc'),
              this.destinationPath('.eslintrc')
            );
            this.fs.copyTpl(
              this.templatePath('es6/.babelrc'),
              this.destinationPath('.babelrc')
            );
            break;
          default:
            this.fs.copyTpl(
              this.templatePath('es5/.eslintrc'),
              this.destinationPath('.eslintrc')
            );
            this.fs.copyTpl(
              this.templatePath('es5/.babelrc'),
              this.destinationPath('.babelrc')
            );
            break;
        }
      }
    }
  }
});

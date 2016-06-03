var yo = require('yeoman-generator');
var yosay = require('yosay');

module.exports = yo.Base.extend({
  constructor: function construct() {
    yo.Base.apply(this, arguments);
  },
  initializing: function () {
    this.pkg = require('../package.json');
  },
  prompting: function () {
    this.log(yosay('\'Allo \'allo! Config files coming right up...'));

    var done = this.async();

    var prompts = [{
      type: 'list',
      name: 'ecmaversion',
      message: 'Which version of ECMAScript?',
      choices: [{
        name: 'ES6',
        value: 6
      }, {
        name: 'ES5',
        value: 5
      }]
    }];

    this.prompt(prompts, function (answers) {
      this.ecmaversion = answers.ecmaversion;
      done();
    }.bind(this));

  },
  writing: {
    global: function () {
      this.fs.copyTpl(
        this.templatePath('.editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copyTpl(
        this.templatePath('.gitignore'),
        this.destinationPath('.gitignore')
      );
      this.fs.copyTpl(
        this.templatePath('.scss-lint.yml'),
        this.destinationPath('.scss-lint.yml')
      );
      this.fs.copyTpl(
        this.templatePath('package.json'),
        this.destinationPath('package.json'),
        { ecmaversion: this.ecmaversion }
      );
      this.fs.copyTpl(
        this.templatePath('gulpfile.babel.js'),
        this.destinationPath('gulpfile.babel.js')
      );
    },
    versionDependent: function () {
      switch (this.ecmaversion) {
        case 6:
          this.fs.copyTpl(this.templatePath('es6/.eslintrc.json'), this.destinationPath('.eslintrc.json'));
          this.fs.copyTpl(this.templatePath('es6/.babelrc'), this.destinationPath('.babelrc'));
        break;
        default:
          this.fs.copyTpl(this.templatePath('es5/.eslintrc.json'), this.destinationPath('.eslintrc.json'));
          this.fs.copyTpl(this.templatePath('es5/.babelrc'), this.destinationPath('.babelrc'));
        break;
      }
    }
  },
  end: function () {

  }
});

const path = require('path');
const replace = require('replace-in-file');
const remove = require('del');
const Listr = require('listr');

const srcPath = path.join(__dirname, '..', 'src');
const testPath = path.join(__dirname, '..', 'test');
const srcAndTestPath = `{${testPath},${srcPath}}`;
const routerPath = path.join(srcPath, 'interfaces', 'http', 'router.js');
const containerPath = path.join(srcPath, 'container.js');

const tasks = new Listr([
  {
    title: 'Remove UsersController routes',
    task() {
      return replace({
        files: routerPath,
        from: /\s*apiRouter.*UsersController'\)\);/,
        to: ''
      });
    }
  },
  {
    title: 'Remove example files from DI container',
    task() {
      return replace({
        files: containerPath,
        from: [
          /\s*const.*app\/user'\);/,
          /\s*const.*UsersRepository'\);/,
          /\, User: UserModel/,
          /\s*usersRepository.*\}\]/,
          /\,\s*UserModel/,
          /createUser.*\n/,
          /\s*getAllUsers.*GetAllUsers/,
        ],
        to: ''
      });
    }
  },
  {
    title: 'Delete example files and tests',
    task() {
      return remove([
        path.join(srcAndTestPath, 'app', 'user', '**'),
        path.join(srcAndTestPath, 'domain', 'user', '**'),
        path.join(srcAndTestPath, 'infra', 'user', '**'),
        path.join(srcPath, 'infra', 'database', 'migrate', '*.js'),
        path.join(srcPath, 'infra', 'database', 'seeds', '*.js'),
        path.join(srcPath, 'infra', 'database', 'models', 'User.js'),
        path.join(srcPath, 'interfaces', 'http', 'user', '**'),
        path.join(testPath, 'api', 'users', '**'),
        path.join(testPath, 'support', 'factories', '*.js')
      ]);
    }
  },
  {
    title: 'Remove cleanup script from package.json',
    task() {
      return replace({
        files: path.join(__dirname, '..', 'package.json'),
        from: /\,\s*\"cleanup.*cleanup\.js\"/,
        to: ''
      });
    }
  }
]);

tasks.run().catch((err) => {
  console.error(err);
});

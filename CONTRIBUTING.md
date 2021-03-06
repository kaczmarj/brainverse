Contributing to BrainVerse
========================
This document is adapted from [NICEMAN's CONTRIBUTING.md](https://github.com/ReproNim/niceman/blob/master/CONTRIBUTING.md). Thanks to NICEMAN team!

## Development environment
-----------------------
### Requirements
* [Node.js](https://nodejs.org/en/download/) (which comes with npm) installed on your computer.

* [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

This app is being developed and tested with NodeJS v8.9.1, npm 5.5.1 and git 2.11.0 on macOS Sierra version 10.12.6.

### To Begin
* To start contributing follow git set up instructions provided in either [Option 1](#option-1) or [Option 2](#option-2) from [Git set up](#git-set-up)

```bash
# For quick start clone the main repository
git clone https://github.com/ReproNim/brainverse.git

# Go into the directory containing the repository
cd brainverse

# Install devDependencies and dependencies listed in the package.json - e.g. electron, bootstrap and jQuery
npm install

# App Configuration
# Go to eapp/config
cd eapp/config

# Get clientId and secretKey from GitHub (see below)
# Fill in app-config.js using your favorite editor
# Note you should not commit app-config.js as it contains clientId and secretKey
vim app-config.js

# Run the app in development mode
npm start
```


### Building for multiple platforms

The BrainVerse application can be built for Linux and Windows within Docker. Build a macOS distributable on macOS, as code signing is not available for macOS within Docker. Run the following command in the root project directory to build BrainVerse for Linux and Windows.

```shell
docker run --rm \
  -v $(pwd):/project \
  electronuserland/builder:wine \
  bash -c "
    yarn --link-duplicates --pure-lockfile \
    && yarn dist --linux --win
  "
```


#### Get clientId and secretKey from GitHub by registering this App
* Go to this [link](https://developer.github.com/apps/building-integrations/setting-up-and-registering-oauth-apps/registering-oauth-apps/) and follow the steps.
* Use the following values:
  * Application Name: brainverse
  * Homepage URL: https://github.com/ReproNim/brainverse
  * Authorization callback URL: http://127.0.0.1:3000/auth/github/callback

### To use BrainVerse as Web app
- Type '127.0.0.1:3000/' in your browser
- Login using your GitHub credentials
- To access any html page in eapp/modules/module-name/html in your browser, type '127.0.0.1:3000/module-name/html/HTMLFileName.html'
- The REST API for the app is in the eapp/routes directory

## Files organization
------------------

- `eapp/` is the folder consisting of source code for the app and where major development is happening.
- `eapp/` is organized closely as an [Express](https://expressjs.com/en/starter/generator.html) web framework application folder structure:
    - `config/` - consists of the app configuration file
    - `modules/` - consists of user interface (UI) of modules that are being actively developed.
      - Each module source code resides in a separate folder under modules/ so that independent and modularized development can happen.
      - Current modules that are being actively developed:
        * `experiment-planner/`
        * `nda-editor/`
        * `term-search/`
        * `audit-trail/`
      - Deprecated modules (will be removed):
        * `project-planner/`
        * `nda/`
      - Each module is further organized as:
        * `html` - all html files relevant to the module
        *  `js` -  all javascript files relevant to the module
        * `css` - all CSS relevant files to the module
    - `public/` - consists of all files/assets/templates relevant to the app and common to the modules
    - `routes/` - consists of REST API of the BrainVerse app spread over different javascript files for modularization
    - `util/` - consists of utility files being used across different modules of the app
    - `views/` - consists of the pug files that the app loads on startup
    - `app.js` - This file is first executed by the app to set up express sever
- `tests/` - consists of deprecated files. We will be updating them soon.
- `src/`- deprecated. it will be removed
- `build/` - consists icons for the build
-  `main.js` - the entry point of the app
- `package.json` - the file consisting of all dependencies and build information
- `package-lock.json` - generated by npm version > 5. Needs to be committed in a separate commit.
- `yarn.lock` - generated by yarn during the built process.
- `.travis.yml` - configuration for TRAVIS CI


## Git set up
-----------------

The preferred way to contribute to the BrainVerse code base is
to fork the [main repository](https://github.com/ReproNim/brainverse) on GitHub.

### Option 1
1. Fork the [project repository](https://github.com/ReproNim/brainverse): click on the 'Fork' button near the top right of the page.  This creates a copy of the code base under your account on the GitHub server.

2. Clone the forked project repository as your remote `origin` in your local disk:
```bash
git clone https://github.com/YourLogin/brainverse.git
```

3. Check your git remote:

```bash
git remote -v
```
Note that it should display:

```bash
origin	https://github.com/YourLogin/brainverse.git (fetch)
origin	https://github.com/YourLogin/brainverse.git (push)
```

4. Add [main project repository](https://github.com/ReproNim/brainverse) as another remote `upstream`:

```bash
git remote add upstream https://github.com/ReproNim/brainverse.git
```
Now

```bash
git remote -v
```
will display

```bash
origin	https://github.com/YourLogin/brainverse.git (fetch)
origin	https://github.com/YourLogin/brainverse.git (push)
upstream	https://github.com/ReproNim/brainverse.git (fetch)
upstream	https://github.com/ReproNim/brainverse.git (push)
```

5. Create a branch (generally off the `origin/master`) to hold your changes:

```bash
git checkout -b feature-my-new-feature
```

and start making changes.

Ideally, use a prefix signaling the purpose of the branch:

* `feature-` for new features
* `enh-` for enhancements
* `bugfix-` for bug fixes
* `refactor-` for refactoring
* `doc-` for documentation contributions

We recommend to not work in the ``master`` branch!

6. Work on this copy on your computer using Git to do the version control. When
   you're done editing, do:

   ```bash
   git add modified_files
   git commit -m "your commit message"
   ```

   to record your changes in Git.  Ideally, prefix your commit messages with the
   `NF` for new feature, `ENH` for enhancement, `BF` for bug fix, `RF` for refactor, `DOC` for documentation update, but you could also use `TST` for commits concerned solely with tests, and `BK` to signal that the commit causes a breakage (e.g. of tests) at that point.  Multiple entries could be listed joined with a `+` (e.g. `rf+doc-`).  See `git log` for examples.  If a commit closes an existing BrainVerse issue, then add to the end of the message `(Closes#ISSUE_NUMER)`.

7. Push to GitHub with:

```bash
git push origin feature-my-new-feature
```

 Finally, go to the web page of your fork of the Brainverse repo, and click   'Pull request' (PR) to send your changes to the maintainers for review. This   will send an email to the committers.  You can commit new changes to this branch and keep pushing to your remote -- github automatically adds them to your   previously opened PR.

8. To obtain changes from main project repository `master` branch and merge to current branch:

```bash
git pull upstream master
```

### Option 2

0. Have a clone of our main [project repository](https://github.com/ReproNim/brainverse) as `origin` remote in your git:
```bash
git clone git://github.com/ReproNim/brainverse
```
1. Fork the [project repository](https://github.com/ReproNim/brainverse): click on the 'Fork'
   button near the top right of the page.  This creates a copy of the code
   base under your account on the GitHub server.

2. Add your forked clone as a remote to the local clone you already have on your
   local disk:

          git remote add gh-YourLogin git@github.com:YourLogin/brainverse.git
          git fetch gh-YourLogin

    For this SSH URLs to work, you have to [generate an SSH keypair](https://help.github.com/articles/connecting-to-github-with-ssh/) in your computer and add it to your GitHub account.

    To ease addition of other github repositories as remotes, here is
    a little bash function/script to add to your `~/.bashrc`:

        ghremote () {
                url="$1"
                proj=${url##*/}
                url_=${url%/*}
                login=${url_##*/}
                git remote add gh-$login $url
                git fetch gh-$login
        }

    thus you could simply run:

         ghremote git@github.com:YourLogin/brainverse.git

    to add the above `gh-YourLogin` remote.

3. [Same as Option1 - Step 5] Create a branch (generally off the `origin/master`) to hold your changes.

4. [Same as Option 1- Step 6] Work on this copy on your computer using Git to do the version control.

5. Push to GitHub with:

          git push -u gh-YourLogin feature-my-new-feature

   Finally, go to the web page of your fork of the Brainverse repo, and click
   'Pull request' (PR) to send your changes to the maintainers for review. This
   will send an email to the committers.  You can commit new changes to this branch and keep pushing to your remote -- github automatically adds them to your
   previously opened PR.

(If any of the above seems like magic to you, then look up the
[Git documentation](http://git-scm.com/documentation) on the web.)

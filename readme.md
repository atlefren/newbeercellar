New Beercellar
==============

A simple web app to keep track of beers.


Components
----------

1. A command line script to get the ratebeer dump file and insert to a postgres db
2. A simple Flask API in Python to search for beers/breweries and add bottles to a cellar
3. A Web Gui using React to display and add bottles to a cellar


Todos
-----
- Edit bottle
- search in cellar(s)
- create more cellars
- edit cellar
- edit profile
- delete/drink bottle
- fix ansible playbook to work for non-vagrant
- fix memory usage of import script
- add tags
- statistics
- bar code integration (crowdsourcing)
- add new beers
- import beers from vinmonopolet (name matching)
- TESTS (python and js)
- 

Setup
-----

0. Install ansible and vagrant

1. go to https://console.developers.google.com/project, create a new project, go to Credentials and "create new CLient id". Choose web application, and enter http://localhost:9080/oauth2callback as redirect uri

2. copy provisioning/settings.py.j2_example to provisioning/settings.py.j2, and fill in GOOGLE_LOGIN_CLIENT_ID, GOOGLE_LOGIN_CLIENT_SECRET and SECRET_KEY

3. run vagrant up dev

4. run vagrant ssh dev

5. run python manage.py loaddata to load data

6. run foreman start to launch app

7. app is now available at localhost:8090


Access db
---------
1. vagrant ssh
2. sudo su - postgres
3. psql -d beer


Set up jsx-build
----------------
    
    jsx --watch static/js/src/ static/js/src/gen/ -x jsx
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
- User handling (login via Google?)
- Edit bottle
- better search
- search in cellar(s)
- create more cellars
- delete/drink bottle
- fix setup routine!
- add tags

Setup
-----

1. Install bower and react-tools
    
    npm install -g react-tools
    npm install -g bower

2. Setup a python virtualenv
    
    virtualenv venv

3. Activate virtualenv

    venv/bin/activate

4. install python requirements
    
    pip install -r requirements.txt

5. install js requirements

    bower install

6. Setup a postgre-database 

7. copy newbeercellar/settings.py_template to newbeercellar/settings.py and fill in data

8. Import ratebeer data
    
    python read_rb.py

9. set up jsx-build
    
     jsx --watch static/js/src/ static/js/src/gen/ -x jsx

10. Run the app
    
    python runapp.py

11. Tell @atlefren that this is stupid, use some tool to simplify this!


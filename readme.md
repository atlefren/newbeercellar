New Beercellar
==============

A simple web app to keep track of beers.


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

6. Setup a postgre-database and export variable
    
    export DATABASE_URL=postgresql://user:pass@host:port/basename

7. Import ratebeer data
    
    python read_rb.py

8. set up jsx-build
    
     jsx --watch static/js/src/ static/js/src/gen/ -x jsx

9. Run the app
    
    python app.py

10. Tell @atlefren that this is stupid, use some tool to simplify this!


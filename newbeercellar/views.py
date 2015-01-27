# -*- coding: utf-8 -*-

import json

from flask import render_template

from newbeercellar import app
from util import get_cellar_data


@app.route('/cellar/<int:cellar_id>')
def view_cellar(cellar_id):
    cellar_data = get_cellar_data(cellar_id)
    return render_template(
        'cellar.html',
        bottles=json.dumps(cellar_data['bottles']),
        cellar_name=cellar_data['cellarName']
    )

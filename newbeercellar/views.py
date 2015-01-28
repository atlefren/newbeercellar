# -*- coding: utf-8 -*-

import json

from flask import render_template, abort

from newbeercellar import app
from util import get_cellar_data


@app.route('/cellar/<int:cellar_id>')
def view_cellar(cellar_id):
    cellar_data = get_cellar_data(cellar_id)
    if cellar_data:
        return render_template(
            'cellar.html',
            bottles=json.dumps(cellar_data['bottles']),
            cellar_name=cellar_data['cellarName']
        )
    abort(404)


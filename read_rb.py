# -*- coding: utf-8 -*-

import zipfile

import HTMLParser
from collections import defaultdict, OrderedDict
import requests

from base_write import write_rb_data


def read_ratebeer_file(filename):
    header = ["id", "name", "short_name", "brewery", "num1", "num2"]

    def to_dict(data, header):
        return {header[key]: value for (key, value) in enumerate(data)}

    zp = zipfile.ZipFile(filename)
    text = zp.read('beers.txt').decode('UTF-16')

    beers = []
    errors = []

    html_parser = HTMLParser.HTMLParser()

    for line in text.split("\n"):
        cols = [html_parser.unescape(col.strip())
                for col in line.split("\t") if col.strip() != ""]
        if len(cols) != 6:
            if len(cols) == 5:
                cols.append("")
            else:
                errors.append(line)
        else:
            beer = to_dict(cols, header)
            beers.append(beer)

    ordered = defaultdict(list)
    for beer in beers:
        ordered[beer["brewery"]].append(beer)

    ordered = OrderedDict(sorted(ordered.items(), key=lambda t: t[0]))
    return ordered, errors


def get_file():
    url = 'http://www.ratebeer.com/documents/downloads/beers.zip'
    r = requests.get(url, stream=True)
    filename = 'beers.zip'
    with open(filename, 'wb') as f:
        for chunk in r.iter_content(chunk_size=1024):
            if chunk:  # filter out keep-alive new chunks
                f.write(chunk)
                f.flush()
        return filename


if __name__ == '__main__':
    filename = get_file()
    data, errors = read_ratebeer_file(filename)
    write_rb_data(data)

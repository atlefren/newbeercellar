from read_rb import get_file, read_ratebeer_file
from base_write import write_rb_data


def update_rb_data(db):
    filename = get_file()
    data, errors = read_ratebeer_file(filename)
    write_rb_data(data, db)

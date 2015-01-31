from flask.ext.script import Manager
from flask.ext.migrate import Migrate, MigrateCommand

from newbeercellar import app, db
from data_import import update_rb_data

manager = Manager(app)

migrate = Migrate(app, db)

manager.add_command('db', MigrateCommand)


@manager.command
def loaddata():
    print "import"
    update_rb_data(db)


if __name__ == "__main__":
    manager.run()

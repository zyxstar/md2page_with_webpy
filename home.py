#!/usr/bin/env python
# -*- coding: UTF-8 -*-
import web
import os.path
from lib import handlers

app_root = os.path.dirname(__file__)

handlers.RES_BASE_URL_PATH = "/static"
# handlers.SAMPLE_NOTE_URL = "https://raw.githubusercontent.com/zyxstar/md_note/master/README.md"
handlers.SAMPLE_NOTE_URL = "https://code.aliyun.com/zyxstar2013/md_note/raw/master/README.md"
handlers.render = web.template.render(os.path.join(app_root,'static/templates'))

web.config.debug = True
web.webapi.internalerror = web.debugerror

app = web.application(handlers.urls, handlers.all_handlers)

if web.config.get('_session') is None:
    session = web.session.Session(app, web.session.DiskStore(os.path.join(app_root,'sessions')))
    web.config._session = session
else:
    session = web.config._session


if __name__ == "__main__":
    import sys
    if len(sys.argv) == 1:
        sys.argv.append('8059')
    # web.wsgi.runwsgi = lambda func, addr=None: web.wsgi.runfcgi(func, addr)
    app.run()

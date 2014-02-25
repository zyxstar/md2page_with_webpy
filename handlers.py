# -*- coding: UTF-8 -*-
import os
import web
import urllib
import urllib2
import markdown
import re
import traceback
import utils

SAMPLE_NOTE_URL = None
RES_BASE_URL_PATH = None
render = None

urls = ('/', 'index',
        '/usage','usage',
        '/echo', 'echo',
        '/gen_md', 'gen_md',
        '/popup/lang', 'poplang',
        '/popup/web', 'popweb',
        '/exec_lang', 'exec_lang',
        '/(.*)/', 'redirect')

all_handlers = globals()

class index:
    def GET(self):
        return gen_md().urlopen_md(src=SAMPLE_NOTE_URL, title="Manual", encoding='utf-8')

class usage:

    def GET(self):
        try:
            _sample_note = urllib2.urlopen(SAMPLE_NOTE_URL, timeout=10).read()
        except:
            _sample_note = ""
        return render.usage(_sample_note, RES_BASE_URL_PATH)


class poplang:

    def GET(self):
        return render.poplang(RES_BASE_URL_PATH)


class popweb:

    def GET(self):
        return render.popweb(RES_BASE_URL_PATH)


class redirect:

    def GET(self, path):
        web.seeother('/' + path)


class echo:

    def GET(self):
        return "echo"

    def POST(self):
        web.header('Content-Type', 'application/octet-stream')
        filename = web.input(filename="file.txt").filename
        web.header('Content-Disposition',
                   ' attachment; filename="%s"' % filename)
        return web.input(content="no data").content


class gen_md:

    def GET(self):
        _query = web.input(src='', title='', encoding='utf-8')
        if _query.src == '': raise web.seeother('/usage')

        _title = os.path.basename(_query.src).rsplit(
            '.',1)[0] if _query.title == '' else _query.title
        _title = urllib.unquote_plus(_title.encode('utf-8'))

        return self.urlopen_md(_query.src,_title,_query.encoding)


    def urlopen_md(self, src, title, encoding):
        try:
            _md_text = urllib2.urlopen(src, timeout=10).read()
            return self.render_md(unicode(_md_text, encoding), title, src)
        except:
            return traceback.format_exc()

    def POST(self):
        _query = web.input(note='', title='', based_url='')
        if _query.note == '': raise web.seeother('/usage')
        return self.render_md(_query.note, _query.title, _query.based_url)

    def render_md(self, md_text, title, based_url):
        _md_html = markdown.markdown(md_text)
        return render.gen_md(title, utils.fix_res_link(_md_html, based_url), RES_BASE_URL_PATH)


class exec_lang:

    def POST(self):
        _query = web.input(
            lang='', lang_alias='', exec_type='', code='', inputs='', args='')
        _headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.66 Safari/537.36",
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.8",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "http://www.compileonline.com",
            "Referer": "http://www.compileonline.com/execute_%s_online.php" % _query.lang,
            "X-Requested-With": "XMLHttpRequest"
        }
        if _query.lang_alias == "":
            _query.lang_alias = _query.lang
        if _query.exec_type == "":
            _query.exec_type = "compile"
        _data = {
            "lang": _query.lang_alias,
            "code": _query.code,
            "header": "", "support": "", "util": "", "inputs": _query.inputs, "args": _query.args, "stdinput": ""
        }
        try:
            _res = utils.http_request(
                "http://www.compileonline.com/%s_new.php" % _query.exec_type, _data, _headers)
            return _res.read()
        except:
            return traceback.format_exc()


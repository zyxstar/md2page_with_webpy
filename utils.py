# -*- coding: UTF-8 -*-

import re
import urllib
import urllib2

def fix_res_link(html, based_url):
    def replace_link(match_obj):
        _url = match_obj.group(2)
        _url_result = urllib2.urlparse.urlparse(_url)
        if _url_result.scheme == '' and _url_result.path != '':
            _url = urllib2.urlparse.urljoin(based_url, _url)

        return u"%s%s%s" % (match_obj.group(1), _url, match_obj.group(3))

    for _pattern in  [ur"""(<img.*?src=")(.*?)(".*?/>)""", ur"""(<a.*?href=")(.*?)(".*?>)"""]:
        html = re.sub(_pattern, replace_link, html)
    return html


def http_request(url, data=None, headers=None, is_proxy=False):
    # cookiefile = "e:\\cookiefile.txt"
    # cookieJar = cookielib.MozillaCookieJar(cookiefile)
    # cookieJar.load()
    # cookieJar.save()
    # _proxy_handler = urllib2.ProxyHandler({'http': '127.0.0.1:8080'})
    # _opener = urllib2.build_opener(_proxy_handler,urllib2.HTTPCookieProcessor(cookieJar))
    # urllib2.install_opener(_opener)

    _opener = urllib2.build_opener()
    _req = urllib2.Request(url, headers=headers)
    if is_proxy:
        _req.set_proxy('127.0.0.1:8080', 'http')
    if data != None:
        _req.add_data(urllib.urlencode(data))
    _res = _opener.open(_req)
    return _res  # .code .msg .url .headers .read()

def test_http_request():
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.66 Safari/537.36",
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.8",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Origin": "http://www.compileonline.com",
        "Referer": "http://www.compileonline.com/execute_python_online.php",
        "X-Requested-With": "XMLHttpRequest",
    }
    data = {
        "lang": "python",
        "code": "#!/usr/local/bin/python2.7\n\nprint \"Hello World!\";"
    }
    r = http_request("http://www.compileonline.com/execute_new.php",
                          data,
                          headers)

    print r.code, r.msg, r.url
    print r.headers
    print r.read()

def syntax_highlight(md_text):
    def repl(matchobj):
        _lang = matchobj.group(2).strip()
        if not len(_lang): _lang = "plain"
        _code = "    " + "\n    ".join(matchobj.group(3).split("\n"))
        return "\n<!--language: %s -->\n\n%s\n" % (_lang, _code)

    _pattern = re.compile(r"""(\n|^)```(.*?)\n(.*?)\n```""", re.DOTALL)
    return _pattern.sub(repl, md_text)

def test_syntax_highlight():
    _text = """

this is a test file
```
some code here
other code here
    and here
```
test
```python
some code here
other code here
    and here
```
    """
    print syntax_highlight(_text)


if __name__ == '__main__':
    # test_http_request()
    test_syntax_highlight()
    pass


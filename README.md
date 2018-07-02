
# 安装库

```shell
sudo apt-get install python-pip
sudo pip install web.py
sudo pip install markdown

sudo apt-get install spawn-fcgi
sudo pip install flup
```

# 修改nginx.conf

```
    server {
        listen       80;
        server_name  doc.pigfeet.cn;
        location / {
            include fastcgi_params;
            fastcgi_param SCRIPT_FILENAME $fastcgi_script_name;
            fastcgi_param PATH_INFO $fastcgi_script_name;
            fastcgi_pass http://127.0.0.1:8059;
        }
        location /static/ {
            if (-f $request_filename) {
            rewrite ^/static/(.*)$  /static/$1 break;
            }
        }
    }
```

# 运行

```shell
#权限
chmod +x home.py

#启动
spawn-fcgi -d /var/www/md2page_with_webpy -f /var/www/md2page_with_webpy/home.py -a 127.0.0.1 -p 8059

#关闭
kill `pgrep -f "python /var/www/md2page_with_webpy/home.py"`

# nohup python home.py 2>&1 &
```

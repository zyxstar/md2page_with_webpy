
# 安装库

```shell
sudo apt-get install python-pip
sudo pip install web.py
sudo pip install markdown

#sudo apt-get install spawn-fcgi
#sudo pip install flup

sudo apt-get install supervisor
```




# 修改supervisord.conf

```
#cat /etc/supervisord/supervisord.conf
sudo vim /etc/supervisor/conf.d/md2page.conf

; /etc/supervisor/conf.d/md2page.conf
[program:md2page.conf]

command     = /usr/bin/env python /var/www/md2page_with_webpy/home.py
directory   = /var/www/md2page_with_webpy
user        = www
startsecs   = 3

redirect_stderr         = true
stdout_logfile_maxbytes = 50MB
stdout_logfile_backups  = 10
stdout_logfile          = /var/www/md2page_with_webpy/app.log
```

# 修改nginx.conf

```
    server {
        listen       80;
        server_name  doc.pigfeet.cn;
        location / {
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header Host $http_host;
            proxy_set_header X-NginX-Proxy true;
            proxy_pass http://127.0.0.1:8059;
            proxy_redirect off;
        }
    }

#    server {
#        listen       80;
#        server_name  doc.pigfeet.cn;
#        location / {
#            include fastcgi_params;
#            fastcgi_param SCRIPT_FILENAME $fastcgi_script_name;
#            fastcgi_param PATH_INFO $fastcgi_script_name;
#            fastcgi_pass http://127.0.0.1:8059;
#        }
#        location /static/ {
#            if (-f $request_filename) {
#            rewrite ^/static/(.*)$  /static/$1 break;
#            }
#        }
#    }
```

# 运行

```shell
#权限
#chmod +x home.py

#启动
#spawn-fcgi -d /var/www/md2page_with_webpy -f /var/www/md2page_with_webpy/home.py -a 127.0.0.1 -p 8059

#关闭
#kill `pgrep -f "python /var/www/md2page_with_webpy/home.py"`

#nohup python home.py 2>&1 &

#sudo supervisord -c /etc/supervisor/supervisord.conf                       通过配置文件启动supervisor
#sudo supervisorctl -c /etc/supervisor/supervisord.conf status              查看状态
#sudo supervisorctl -c /etc/supervisor/supervisord.conf reload              重新载入配置文件
#sudo supervisorctl -c /etc/supervisor/supervisord.conf start [all]|[x]     启动所有/指定的程序进程
#sudo supervisorctl -c /etc/supervisor/supervisord.conf stop [all]|[x]      关闭所有/指定的程序进程

sudo supervisord -c /etc/supervisor/supervisord.conf 
sudo supervisorctl -c /etc/supervisor/supervisord.conf reload 

#sudo supervisorctl start md2page


```


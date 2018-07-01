
# 安装库

```shell
sudo apt-get install python-pip
sudo pip install web.py
sudo pip install markdown
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
```

# 运行

```shell
nohup python home.py 2>&1 &
```

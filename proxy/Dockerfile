FROM nginx:1.27-alpine

COPY nginx.conf        /etc/nginx/nginx.conf
COPY default.conf      /etc/nginx/conf.d/default.conf
COPY proxy_common.conf /etc/nginx/snippets/proxy_common.conf

EXPOSE 3030 8090

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O- http://127.0.0.1:3030/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]

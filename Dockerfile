FROM docker.io/library/alpine:latest AS builder
RUN apk add --no-cache make git yarn go jsonnet && \
    go get -v github.com/jsonnet-bundler/jsonnet-bundler/cmd/jb && \
    mv /root/go/bin/jb /usr/local/bin

WORKDIR /usr/src/app
COPY . /usr/src/app
RUN make build


FROM docker.io/grafana/grafana:7.5.8
COPY docker/root/etc/grafana/grafana.ini /etc/grafana/grafana.ini
COPY --from=builder /usr/src/app/dist /var/lib/grafana/plugins/performancecopilot-pcp-app

#!/bin/sh
CERT_DIR=$(dirname ${BASH_SOURCE[0]})/../docker-data/pound/cert/

if [ -f $CERT_DIR/localhost.key ]; then
	echo 'pound container already configured'
	exit 0
fi

mkdir -p $CERT_DIR

echo 'Start to configure pound container (generate ssl certificate)'

openssl genrsa -out $CERT_DIR/localhost.key 2048
openssl req -new -x509 -key $CERT_DIR/localhost.key -out $CERT_DIR/localhost.crt -days 3650 -subj /CN=avc.montage.local
openssl x509 -in $CERT_DIR/localhost.crt -out $CERT_DIR/localhost.pem
openssl rsa -in $CERT_DIR/localhost.key >> $CERT_DIR/localhost.pem

echo 'pound container configured'
exit 0
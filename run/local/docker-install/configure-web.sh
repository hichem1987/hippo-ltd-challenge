#!/bin/bash

if [ -f /installed ]; then
	echo 'web container already configured'
	exit 0
fi

echo 'Start to configure web container (install : xdebug, mod_proxy)'

# This script install xdebug on top of apache-php docker container 
if [ -f /var/lib/dpkg/lock ]; then 
	rm /var/lib/dpkg/lock
fi

export DEBIAN_FRONTEND=noninteractive \
 && apt-get update -qq \
 && apt-get -o Dpkg::Options::="--force-confold" install -yqq php7.0-xdebug php7.0-intl php7.0-zip \
 && service php7.0-fpm restart

#this enable mod_proxy to allow maildev to be serve via apache via /_tools/maildev url
a2enmod proxy
a2enmod proxy_http

# This override default common_tols conf file of the container to remove .htpasswd on local env.
echo 'Alias /_tools /var/www/_tools' > /etc/apache2/conf-enabled/common_tools.conf 

# restart apache
service apache2 restart

# create flag /installed to avoid new execution of the script
touch /installed

echo 'web container configured'
exit 0
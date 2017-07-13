#!/bin/sh

if [ -f /installed ]; then
	echo 'cli container already configured'
	exit 0
fi

echo 'Start to configure cli container (install : composer)'

# Install composer
EXPECTED_SIGNATURE=$(wget -q -O - https://composer.github.io/installer.sig)
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
ACTUAL_SIGNATURE=$(php -r "echo hash_file('SHA384', 'composer-setup.php');")

if [ "$EXPECTED_SIGNATURE" != "$ACTUAL_SIGNATURE" ]
then
    >&2 echo 'ERROR: Invalid installer signature'
    rm composer-setup.php
    exit 1
fi

php composer-setup.php --quiet --install-dir=/usr/bin
mv /usr/bin/composer.phar /usr/bin/composer
rm composer-setup.php

# create flag /installed to avoid new execution of the script
touch /installed

echo 'cli container configured'
exit 0
#!/bin/bash

function fig() {
	docker-compose -f run/local/docker-compose.yml -p $config_project_name $@
}

function up(){
	fig up -d --force-recreate

	# run install for pound : generate ssl cert
	bash $PWD/docker-install/configure-pound.sh

	# run install for apache/php : xdebug
	fig exec -T web bash /install.sh

	# run install for cli : composer and other dev requirements
	fig exec -T cli bash /install.sh

	# add project host to /etc/hosts file
	addhost

}

function start() {
	fig start
}

function stop() {
	fig stop
}

function rm(){
	# Stop all running container on docker instance
	docker stop $(docker ps -aq)

	# Remove all containers from docker
	docker rm $(docker ps -aq)

	# Remove project domain from host file
	removehost
}

function web() {
	fig exec web bash -i
}

function db() {
	fig exec db bash -i
}

function mysql() {
	fig exec db mysql -u root -pvagrant
}

function magerun() {
	fig exec --user easycom cli php bin/magento $@
}

function cli() {
	if [ $# -eq 1 ] && [ $@ = "--root" ]; then
		fig exec cli bash -i
	else
		fig exec --user easycom cli bash -i
	fi
}

function redis() {
	fig exec redis_$1 redis-cli
}

function composer() {
	fig exec --user easycom cli composer $@
}

function parse_yaml() {
	if [ ! -f $1 ]; then 
		exit 
	fi
   	local prefix=$2
   	local s='[[:space:]]*' w='[a-zA-Z0-9_]*' fs=$(echo @|tr @ '\034')
   	sed -ne "s|^\($s\)\($w\)$s:$s\"\(.*\)\"$s\$|\1$fs\2$fs\3|p" \
        -e "s|^\($s\)\($w\)$s:$s\(.*\)$s\$|\1$fs\2$fs\3|p"  $1 |
   	awk -F$fs '{
		indent = length($1)/2;
		vname[indent] = $2;
		for (i in vname) {if (i > indent) {delete vname[i]}}
		if (length($3) > 0) {
			vn=""; for (i=0; i<indent; i++) {vn=(vn)(vname[i])("_")}
			printf("%s%s%s=\"%s\"\n", "'$prefix'",vn, $2, $3);
		}
   	}'
}

function removehost() {
    echo "removing host";
    if [ -n "$(grep $config_project_host $config_project_hostfile)" ]
    then
        echo "$config_project_host Found in your $config_project_hostfile, Removing now...";
        sudo sed -i".bak" "/$config_project_host/d" $config_project_hostfile
    else
        echo "$config_project_host was not found in your $config_project_hostfile";
    fi
}

function addhost() {
    echo "adding host";
    HOSTS_LINE="$config_project_ip\t$config_project_host"
    if [ -n "$(grep $config_project_host $config_project_hostfile)" ]
        then
            echo "$config_project_host already exists : $(grep $config_project_host $config_project_hostfile)"
        else
            echo "Adding $config_project_host to your $config_project_hostfile";
            sudo -- sh -c -e "echo '$HOSTS_LINE' >> /etc/hosts";

            if [ -n "$(grep $config_project_host /etc/hosts)" ]
                then
                    echo "$config_project_host was added succesfully \n $(grep $config_project_host /etc/hosts)";
                else
                    echo "Failed to Add $config_project_host, Try again!";
            fi
    fi
}

PWD=$(dirname ${BASH_SOURCE[0]})
ROOT=$PWD/../../
can_continue=1
if [ ! -f project.yml ]; then
	echo 'project.yml configuration file is required to use local docker env.'
	can_continue=0
fi

eval $(parse_yaml $ROOT/project.yml "config_")

if [ -z $config_project_name ] || [ -z $config_project_host ]; then
	echo 'project.yml require project.name and project.host vars to be defined'
	can_continue=0
fi 
if [ -z $config_project_ip ]; then
	config_project_ip="127.0.0.1"
fi
if [ -z $config_project_hostfile ]; then
	config_project_hostfile="/etc/hosts"
fi

if [[ $# -lt 1 ]] || [[ $1 = "--help" ]] || [[ $1 = '-?' ]] | [[ $1 = '-h' ]]; then
	echo -e "Available methods are : "
	compgen -A function
    can_continue=0
fi

if [[ $can_continue -lt 1 ]]; then 
	exit 0 
fi

$@

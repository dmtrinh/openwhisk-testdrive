# openwhisk-testdrive

## Prequisites
0. For Windows users, install [Windows Subsystem for Linux (WSL) 2](https://docs.microsoft.com/en-us/windows/wsl/install-win10)
1. Install [Docker for Desktop](https://www.docker.com/products/docker-desktop)
2. Enable [Kubernetes in Docker for Desktop](https://docs.docker.com/desktop/kubernetes/)
3. Install [Helm](https://helm.sh/docs/intro/install/)

```
curl https://baltocdn.com/helm/signing.asc | sudo apt-key add -
sudo apt-get install apt-transport-https --yes
echo "deb https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

## Setting up a local OpenWhisk environment
1. Clone the [openwhisk-deploy-kube repo](https://github.com/apache/openwhisk-deploy-kube)

```
git clone https://github.com/apache/openwhisk-deploy-kube.git ../openwhisk-deploy-kube
```

2. Check your K8s node's InternalIP and also make sure port 31001 is available
```
kubectl describe nodes | grep "InternalIP"
sudo netstat -tulpn | grep 31001
```

3. Update [mycluster.yaml](mycluster.yaml) as appropriate 

4. Create a K8s namespace for OpenWhisk
```
kubectl create namespace openwhisk 
```

5. Set all nodes to be usable by OpenWhisk to execute containers
```
kubectl label nodes --all openwhisk-role=invoker
```

6. Deploy OpenWhisk
```
cd ../openwhisk-deploy-kube
helm install owdev ./helm/openwhisk -n openwhisk -f ../openwhisk-testdrive/mycluster.yaml
```

7. Make sure the `*install-packages` pod status is `Completed` before proceeding to the next step
```
---------- 14:57:12 (dmtrinh@G15) :~/Dev ---------- 
==> kubectl -n openwhisk get pod -w
NAME                                     READY   STATUS      RESTARTS   AGE
owdev-alarmprovider-5b86cb64ff-cmpfs     1/1     Running     1          34h
owdev-apigateway-bccbbcd67-njtrh         1/1     Running     1          34h
owdev-controller-0                       1/1     Running     1          34h
owdev-couchdb-584676b956-v4qp2           1/1     Running     1          34h
owdev-gen-certs-vrqx2                    0/1     Completed   0          34h
owdev-init-couchdb-wk9kl                 0/1     Completed   0          34h
owdev-install-packages-9cqxl             0/1     Completed   0          34h
owdev-invoker-0                          1/1     Running     1          34h
owdev-kafka-0                            1/1     Running     1          34h
owdev-kafkaprovider-5574d4bf5f-n6njv     1/1     Running     1          34h
owdev-nginx-86749d59cb-42g92             1/1     Running     1          34h
owdev-redis-d65649c5b-trpkk              1/1     Running     1          34h
owdev-wskadmin                           1/1     Running     1          34h
owdev-zookeeper-0                        1/1     Running     1          34h
wskowdev-invoker-00-1-prewarm-nodejs10   1/1     Running     0          26m
wskowdev-invoker-00-2-prewarm-nodejs10   1/1     Running     0          26m
```

8. Install [OpenWhisk CLI](https://github.com/apache/openwhisk-cli)
```
cd ..
curl -L -O https://github.com/apache/openwhisk-cli/releases/download/1.1.0/OpenWhisk_CLI-1.1.0-linux-amd64.tgz
mkdir wsk-cli
tar -xvzf OpenWhisk_CLI-1.1.0-linux-amd64.tgz -C wsk-cli
sudo ln -s $HOME/wsk-cli/wsk /usr/local/bin/wsk
```

9. Find authorization key for guest
```
---------- 15:42:55 (dmtrinh@G15) :~/Dev ---------- 
==> kubectl -n openwhisk -ti exec owdev-wskadmin -- wskadmin user list guest
23bc46b1-71f6-4ed5-8c54-816aa4f8c502:123zO3xZCLrMN6v2BKK1dXYFpXlPkccOFqm12CdAsMgRU4VrNZ9lyGVCGuMDGIwP   guest
```

10. Configure the OpenWhisk CLI
```
wsk -i property set --apihost localhost:31001
wsk -i property set --auth 23bc46b1-71f6-4ed5-8c54-816aa4f8c502:123zO3xZCLrMN6v2BKK1dXYFpXlPkccOFqm12CdAsMgRU4VrNZ9lyGVCGuMDGIwP
```

## Test drive
1. Try out the sample [helloWorldAction](helloWorldAction.js)
```
wsk -i action create helloWorldAction helloWorldAction.js --web true
wsk -i action invoke helloWorldAction --result --param name Ducmeister
```

2. Get a URL to the action so you can test it using something like Postman
```
wsk -i action get helloWorldAction --url
```

3. Now go and create your own [Actions](https://openwhisk.apache.org/documentation.html)!

## Cleanup
To remove OpenWhisk:
```
helm -n openwhisk delete owdev
kubectl -n openwhisk delete pod --all
kubectl label node docker-desktop openwhisk-role-
kubectl delete namespaces openwhisk

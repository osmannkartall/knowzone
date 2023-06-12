backup() {
    # database data
    docker exec -i knowzone-db-1 /usr/bin/mongodump --uri "mongodb://localhost:27017" --archive > ~/Desktop/mongodb.dump

    # images
    docker run --rm -v knowzone_uploads:/backup -v ~/Desktop:/target alpine tar -czvf /target/knowzone_uploads.tar.gz -C backup .
}

restore() {
    docker exec -i knowzone-db-1 /usr/bin/mongorestore --uri "mongodb://localhost:27017" --archive < ~/Desktop/mongodb.dump
    docker run --rm -v knowzone_uploads:/target -v ~/Desktop:/backup alpine tar -xzvf /backup/knowzone_uploads.tar.gz -C /target
}

if [ "$1" == "backup" ]; then
    backup
elif [ "$1" == "restore" ]; then
    restore
else
    echo "Invalid argument. Usage: ./backup-restore.sh [backup|restore]"
    exit 1
fi

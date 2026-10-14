# Importing existing collections via shell command.
# mongoimport is part of Mongo Tools which placed inside /bin folder.
# mongoimport syntax: mongoimport -d <database-name> -c <collection-name> --jsonArray --file <json-file>
# --jsonArray because each export file is one JSON array of documents:
/bin/mongoimport -d vacation-tracker -c users --jsonArray --file /docker-entrypoint-initdb.d/vacation-tracker.users.json
/bin/mongoimport -d vacation-tracker -c vacations --jsonArray --file /docker-entrypoint-initdb.d/vacation-tracker.vacations.json

# Print success message:
echo "Successfully imported users and vacations collections."

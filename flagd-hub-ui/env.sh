# Replace placeholders in index.html with environment variables
for file in /usr/share/nginx/html/*.js; do
  sed -i "s|%%REACT_APP_API_URL%%|${REACT_APP_API_URL}|g" $file
done
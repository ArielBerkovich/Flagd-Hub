# Replace placeholders in index.html with environment variables
for file in /usr/share/nginx/html/*.js; do
  sed -i "s|%%REACT_APP_API_URL%%|${FLAGD_HUB_API_URL}|g" $file
  sed -i "s|%%REACT_APP_IS_SECURED%%|${IS_SECURED}|g" $file
done

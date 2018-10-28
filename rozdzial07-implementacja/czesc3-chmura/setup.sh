#!/bin/bash          
## Ten plik zawieraj zestaw żądań cURL użytych w rozdziale 7. książki "Internet rzeczy. Budowa sieci z wykorzystaniem technologii webowych i Raspberry Pi"
SERVER="https://api.evrythng.com"
[ -z "$EVRYTHNG_API_KEY" ] && EVRYTHNG_API_KEY=$1

mkdir -p payloads

# Bardzo prosty skrypt do pobierania zawartości w formacie JSON
function parse_json()
{
    echo $1 | \
    sed -e 's/[{}]/''/g' | \
    sed -e 's/", "/'\",\"'/g' | \
    sed -e 's/" ,"/'\",\"'/g' | \
    sed -e 's/" , "/'\",\"'/g' | \
    sed -e 's/","/'\"---SEPARATOR---\"'/g' | \
    awk -F=':' -v RS='---SEPARATOR---' "\$1~/\"$2\"/ {print}" | \
    sed -e "s/\"$2\"://" | \
    tr -d "\n\t" | \
    sed -e 's/\\"/"/g' | \
    sed -e 's/\\\\/\\/g' | \
    sed -e 's/^[ \t]*//g' | \
    sed -e 's/^"//'  -e 's/"$//'
}


#####
##### Krok 0 - Tworzenie prostego pliku config.json, który będzie używany później.
#####
echo "{" > config.json
echo '  "operatorApiKey":"'$EVRYTHNG_API_KEY'",' >> config.json


#####
##### Krok 1 - 1. Utworzenie projektu
#####
curl -X POST "$SERVER/projects" \
     -H "Authorization: $EVRYTHNG_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{ "name": "Ksiazka WWW rzeczy", "description": "Pierwszy projekt WoT" }' > payloads/project.json

# Przetworzenie odpowiedzi w celu pobrania identyfikatora projektu
PROJECT=`cat payloads/project.json`
PROJECT_ID=`parse_json "$PROJECT" id`

# Zapisanie identyfikatora projektu w pliku config.json 
echo "Identyfikator projektu: $PROJECT_ID"
echo "WYNIK: $PROJECT"
echo '  "projectId":"'$PROJECT_ID'",' >> config.json


#####
##### Krok 1 - 2. Utworzenie aplikacji w ramach projektu
#####
curl -X POST "$SERVER/projects/$PROJECT_ID/applications" \
     -H "Authorization: $EVRYTHNG_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{ "name": "Moja superaplikacja", "description": "Moja pierwsza aplikacja kliencka","tags":["WoT","device","plug","energy"], "socialNetworks": {} }' > payloads/app.json

# Przetworzenie odpowiedzi w celu pobrania identyfikatora aplikacji i klucza API aplikacji
APP=`cat payloads/app.json`
APP_ID=`parse_json "$APP" id`
APP_API_KEY=`parse_json "$APP" appApiKey`

# Zapisanie identyfikatora aplikacji oraz klucza API aplikacji w pliku config.json
echo "Identyfikator aplikacji: $APP_ID"
echo "WYNIK: $APP"
echo '  "appId":"'$APP_ID'",' >> config.json
echo '  "appApiKey":"'$APP_API_KEY'",' >> config.json




#####
##### Krok 2 - 1. Utworzenie produktu w ramach projektu
#####
curl -X POST "$SERVER/products?project=$PROJECT_ID" \
     -H "Authorization: $EVRYTHNG_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{ "fn": "Wytczka WoT", "description": "Iteligentna wtyczka WoT","tags":["WoT","device","energy"],"photos":["https://webofthings.github.io/files/plug.jpg"] }' > payloads/product.json

# Przetworzenie odpowiedzi w celu pobrania identyfikatora produktu
PRODUCT=`cat payloads/product.json`
PRODUCT_ID=`parse_json "$PRODUCT" id`

# Zapisanie identyfikatora produktu w pliku config.json
echo "Utworzony identyfikator produktu: $PRODUCT_ID"
echo "WYNIK: $PRODUCT"
echo '  "productId":"'$PRODUCT_ID'",' >> config.json


# Odszukanie tego produktu w projekcie - Tu powinien zostać wyświetlony produkt
curl -X GET "$SERVER/products/$PRODUCT_ID?project=$PROJECT_ID" \
     -H "Authorization: $EVRYTHNG_API_KEY" \
     -H "Accept: application/json" 




#####
##### Krok 2 - 2. Utworzenie urządzenia Thng (egzemplarza tego produktu) w ramach projektu
#####
curl -X POST "$SERVER/thngs?project=$PROJECT_ID" \
     -H "Authorization: $EVRYTHNG_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{ "name": "Moja wtyczka WoT", "product":"'$PRODUCT_ID'", "description": "Moja wlasna wtyczka WoT","tags":["WoT","device","plug","energy"] }' > payloads/thng.json


# Przetworzenie odpowiedzi w celu pobrania identyfikatora urządzenia Thng
THNG=`cat payloads/thng.json`
THNG_ID=`parse_json "$THNG" id`


# Zapisanie identyfikatora urządzenia Thng w plikuconfig.json 
echo "Utworzony identyfikator urządzenia Thng: $THNG_ID"
echo "WYNIK: $THNG"
echo '  "thngId":"'$THNG_ID'",' >> config.json



#####
##### Krok 3 - Utworzenie klucza API dla tego urządzenia
#####
curl -X POST "$SERVER/auth/evrythng/thngs" \
     -H "Authorization: $EVRYTHNG_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{ "thngId": "'$THNG_ID'" }' > payloads/deviceApiKey.json

# Przetworzenie odpowiedzi w celu pobrania klucza API urządzenia
THNG_API=`cat payloads/deviceApiKey.json`
THNG_API_KEY=`parse_json "$THNG_API" thngApiKey`


# Zapisanie klucza API urzązenia w pliku config.json
echo '  "thngApiKey":"'$THNG_API_KEY'"' >> config.json

# Zakończenie pliku
echo '}' >> config.json




#####
##### Krok 4 - Aktualizacja dwóch właściwości urządzenia Thng
#####
curl -X POST "$SERVER/thngs/$THNG_ID/properties" \
     -H "Authorization: $THNG_API_KEY" \
     -H "Content-Type: application/json" \
     -d '[
        	{
	          "key": "status",
	          "value": true
	        },
	        {
	          "key": "power",
	          "value": 71
	        }
	     ]'


# Wykonanie kilku aktualizacji przy wykorzystaniu wartości losowych
for i in {1..5} 
do 
	curl -X POST "$SERVER/thngs/$THNG_ID/properties" \
	     -H "Authorization: $THNG_API_KEY" \
	     -H "Content-Type: application/json" \
	     -d '[{"key": "voltage","value": '$(( $RANDOM%200 ))'},{"key": "current","value": '$(( $RANDOM%100 ))'},{"key": "power","value": '$(( $RANDOM%400 ))'}]'
	sleep 2     
done



#####
##### Punkt 7.4.3 - Zastosowanie akcji do kontroli wtyczki
#####

# W pierwszej kolejności zostaje utworzony nowy typ akcji
# UWAGA: ta operacja oczywiście się nie uda jeśli skrypt już został wykonany, a podany tu typ akcji już istnieje na koncie użytkownika
curl -X POST "$SERVER/actions?project=$PROJECT_ID" \
     -H "Authorization: $EVRYTHNG_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{ "name": "_setStatus", "description": "Zmiana statusu urzadzenia Thng","tags":["WoT","device"] }' > payloads/setStatus.json


# To polecenie tworzy nowy ezgemplarz tego typu akcji (co jest równoznaczne z wysłaniem polecenia do urządzenia)
curl -X POST "$SERVER/actions/_setStatus?project=$PROJECT_ID" \
     -H "Authorization: $EVRYTHNG_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{ "type": "_setStatus", "thng":"'$THNG_ID'", "customFields": {"status":false} }'

#####
##### Punkt 7.4.4 - Utworzenie przekierowania do tej aplikacji
#####
curl -X POST "https://tn.gg/redirections" \
     -H "Authorization: $EVRYTHNG_API_KEY" \
     -H "Content-Type: application/json" \
     -H "Accept: application/json" \
     -d '{ "type": "thng", "evrythngId":"'$THNG_ID'", "defaultRedirectUrl":"http://webofthings.github.io/wot-book/plug.html?thngId={evrythngId}&key='$EVRYTHNG_API_KEY'" }'

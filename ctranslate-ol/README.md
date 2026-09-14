# CTranslator Webservice (Backend) & tranSister (Frontend)

## Simultaneous launch of the two containers

`docker compose up`

## Test

tranSister:

with an UpperSorbian user interface: http://localhost:3000  
with a Lower Sorbian user interface: http://localhost:3000/dsb  
with a German user interface: http://localhost:3000/de  

CTranslator:

`curl http://localhost:5000/info`

Returns information on available models and translation directions.

`curl -X POST http://localhost:5000/translate -H "Content-Type: application/json" -d '{"text": "Dies ist ein Test. Test.\nTest2.\n\nTest3. Test4.\n" , "source_language":"de", "target_language":"hsb" }'`

In the translate call you can set an optional "model" parameter that sets which model will be used for the translation.

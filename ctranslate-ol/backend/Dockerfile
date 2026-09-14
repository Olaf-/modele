FROM python:3.9

WORKDIR /app

RUN pip config --user set global.progress_bar off
RUN pip install Cython
RUN pip install flask flask-cors waitress urlextract ctranslate2 sentence_splitter youtokentome sentencepiece ruamel.yaml

CMD ["python", "CTranslator.py"]
# CMD ["flask", "--app=ctranslator", "run", "--host=0.0.0.0", "--port=5000"]

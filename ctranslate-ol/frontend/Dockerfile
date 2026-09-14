FROM python:3.9

WORKDIR /app

RUN pip config --user set global.progress_bar off
RUN pip install requests flask cyhunspell python-docx

# CMD ["flask", "--app=tranSister", "run", "--host=0.0.0.0", "--port=3000"]
CMD ["python", "tranSister.py"]

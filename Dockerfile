FROM python:3.9

WORKDIR /app

RUN apt-get update && \
    apt-get install -y \
    build-essential \
    pkg-config \
    default-libmysqlclient-dev

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["python", "app.py"]

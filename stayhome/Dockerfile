FROM python:3-alpine

WORKDIR /code

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apk update && apk add mariadb-dev build-base bash gettext python3-gdal

RUN pip install --upgrade pip
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

RUN apk del build-base

COPY . .

CMD [ "./wait-for-it.sh" , "-h", "db", "-p", "3306" , "--strict" , "--timeout=300" , "--", "./start.sh" ]

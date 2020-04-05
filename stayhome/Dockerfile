FROM python:3

WORKDIR /code

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt update -y && apt install -y libmariadbclient-dev build-essential bash gettext python3-gdal

RUN pip install --upgrade pip
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

RUN apt remove build-essential

COPY . .

CMD [ "./wait-for-it.sh" , "-h", "db", "-p", "3306" , "--strict" , "--timeout=300" , "--", "./start.sh" ]

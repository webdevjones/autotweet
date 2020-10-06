FROM python:3.7-alpine

# RUN mkdir -p /server && chown -R python:python /server
# WORKDIR /server
WORKDIR /usr/src/app


COPY . .
RUN pip install pipenv && pipenv install
# RUN pipenv install && pipenv shell

EXPOSE 5000

CMD [ "pipenv", "run", "python3", "./twauth-web.py" ]
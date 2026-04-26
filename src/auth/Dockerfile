# Stage 1: Build
FROM python:3.12-alpine3.21 AS build

RUN apk add --no-cache \
    build-base \
    mariadb-connector-c-dev \
    pkgconfig

WORKDIR /app

ENV VIRTUAL_ENV=/app/venv
RUN python3 -m venv ${VIRTUAL_ENV}
ENV PATH="${VIRTUAL_ENV}/bin:$PATH"

RUN pip install --no-cache-dir --upgrade pip

COPY ./requirements.txt .
RUN pip install --no-cache-dir -r ./requirements.txt

# Stage 2: Run
FROM python:3.12-alpine3.21

RUN apk add --no-cache mariadb-connector-c-dev

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY --from=build /app/venv ./venv
ENV VIRTUAL_ENV=/app/venv
ENV PATH="${VIRTUAL_ENV}/bin:$PATH"

COPY . /app

# Change ownership of the application directory
RUN chown -R appuser:appgroup /app

# Don't produce .pyc files
ENV PYTHONDONTWRITEBYTECODE 1
# Don't buffer stdout and stderr
ENV PYTHONUNBUFFERED 1    

# Switch to the non-root user
USER appuser

CMD ["python3", "server.py"]

EXPOSE 5000
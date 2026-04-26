# Stage 1: Build
FROM python:3.12-slim-bookworm AS build

RUN apt-get update \
    && apt-get install -y --no-install-recommends --no-install-suggests build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV VIRTUAL_ENV=/app/venv
RUN python3 -m venv ${VIRTUAL_ENV}
ENV PATH="${VIRTUAL_ENV}/bin:$PATH"

RUN pip install --no-cache-dir --upgrade pip

COPY ./requirements.txt .
# Filter out dev dependencies like pylint and astroid if they exist in requirements.txt
RUN grep -vE "pylint|astroid|isort|mccabe" requirements.txt > req.txt && \
    pip install --no-cache-dir -r req.txt

# Stage 2: Run
FROM python:3.12-slim-bookworm

# Create a non-root user
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

WORKDIR /app

COPY --from=build /app/venv ./venv
ENV VIRTUAL_ENV=/app/venv
ENV PATH="${VIRTUAL_ENV}/bin:$PATH"

COPY server.py /app/server.py
COPY auth /app/auth
COPY auth_svc /app/auth_svc
COPY storage /app/storage

# Change ownership of the application directory
RUN chown -R appuser:appgroup /app

# Don't produce .pyc files
ENV PYTHONDONTWRITEBYTECODE 1
# Don't buffer stdout and stderr
ENV PYTHONUNBUFFERED 1

# Switch to the non-root user
USER appuser

CMD ["python3", "server.py"]

EXPOSE 8080
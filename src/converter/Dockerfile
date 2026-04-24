# Stage 1: Build

FROM python:3.12-slim-bookworm AS build

RUN apt-get update \
    && apt-get install -y --no-install-recommends --no-install-suggests \
    build-essential ffmpeg

RUN rm -rf /**var**/lib/apt/lists/*

WORKDIR /app

ENV VIRTUAL_ENV=/app/venv
RUN python3 -m venv ${VIRTUAL_ENV}
ENV PATH="${VIRTUAL_ENV}/bin:$PATH"

RUN pip install --no-cache-dir --upgrade pip

COPY ./requirements.txt .
RUN pip install --no-cache-dir -r ./requirements.txt

# Stage 2: Run

FROM python:3.12-slim-bookworm

# Install runtime dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends --no-install-suggests ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

WORKDIR /app

COPY --from=build /app/venv ./venv
ENV VIRTUAL_ENV=/app/venv
ENV PATH="${VIRTUAL_ENV}/bin:$PATH"

COPY . /app

# Change ownership of the application directory
RUN chown -R appuser:appgroup /app

# Don't produce .pyc files
ENV PYTHONUNBUFFERED 1    
# Don't buffer stdout and stderr
ENV PYTHONDONTWRITEBYTECODE 1

# Switch to the non-root user
USER appuser

CMD ["python3", "consumer.py"]
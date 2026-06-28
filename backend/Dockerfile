# Build Stage
FROM golang:1.25-alpine AS builder

WORKDIR /app

COPY go.mod .
COPY go.sum .

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build \
    -o server \
    ./cmd/server

# Runtime Stage
FROM alpine:latest

RUN apk add --no-cache ca-certificates

WORKDIR /app

COPY --from=builder /app/server .
COPY --from=builder /app/data ./data

EXPOSE 8080

CMD ["./server"]
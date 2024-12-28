# Snapx Assignment

Solution for the Blockchain NestJS Developer task given by Snapx.

## Features

- Saves ETH and POL prices every 5 minutes.
- Email notifications if the price change of ETH or POL in the last hour is more than 3 percent.
- Custom price alerts for ETH or POL.
- API for 24 hour price change.
- ETH to BTC Swap Price calculator.
- Swagger API Documentation.
- Docker support.
- Postgres Database storage.

## Requirements

- Node.js 20+
- Moralis API Key
- SMTP Server Credentials
- PostgreSQL (Optional if using Docker)
- Docker and Docker Compose (Optional)

## Installation

### Running without Docker

1. Clone the repository

```bash
git clone https://github.com/ayamdobhal/snapx-assignment
cd snapx-assignment
```

2. Create `.env` file

```
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=yourpassword
DATABASE_NAME=crypto_monitor

MORALIS_API_KEY=your_moralis_api_key

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

PORT=3000
NOTIFICATION_EMAIL=hyperhire_assignment@hyperhire.in
```

> Alternatively you can use the `.env.example` file and overwrite with your values.

3. Start the app (Make sure postgres is running)

```bash
pnpm run build
pnpm run start:prod
```

### Running with Docker

1. Clone the repository

```bash
git clone https://github.com/ayamdobhal/snapx-assignment
cd snapx-assignment
```

2. Create `.env` file

```
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=yourpassword
DATABASE_NAME=crypto_monitor

MORALIS_API_KEY=your_moralis_api_key

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

PORT=3000
NOTIFICATION_EMAIL=hyperhire_assignment@hyperhire.in
```

> Alternatively you can use the `.env.example` file and overwrite with your values.

3. Start the app

```bash
docker compose up --build
```

## API Endpoints

### Price History

```bash
GET /price/history?token=ethereum
```

Returns the price history for `token` over the last 24 hours. `token` can have a value of `ethereum` or `polygon`.

### Create Price Alert

```bash
POST /price/alert
```

Body

```json
{
  "token": "ethereum",
  "targetPrice": 1000,
  "email": "yourname@example.com"
}
```

Creates a price alert for the specified `token` (ethereum/polygon) which sends an email to the specified email if the price goes equal to or above the `targetPrice`.

### Swap Rate

```bash
GET /swap-rate?amount=1000
```

Calculated ETH to BTC swap rate for the specified ETH amount.

## API Documentation

Swagger Documentation is available at:

```
http://localhost:3000/api
```

## Environment Variables

| Variable           | Description                   | Default                           |
| ------------------ | ----------------------------- | --------------------------------- |
| DATABASE_HOST      | PostgreSQL host               | postgres                          |
| DATABASE_PORT      | PostgreSQL port               | 5432                              |
| DATABASE_USER      | PostgreSQL username           | postgres                          |
| DATABASE_PASSWORD  | PostgreSQL password           | yourpassword                      |
| DATABASE_NAME      | PostgreSQL database name      | crypto_monitor                    |
| MORALIS_API_KEY    | Moralis API key               | -                                 |
| SMTP_HOST          | SMTP server host              | smtp.gmail.com                    |
| SMTP_PORT          | SMTP server port              | 587                               |
| SMTP_USER          | SMTP username                 | -                                 |
| SMTP_PASSWORD      | SMTP password                 | -                                 |
| PORT               | Application port              | 3000                              |
| NOTIFICATION_EMAIL | Email for price change alerts | hyperhire_assignment@hyperhire.in |

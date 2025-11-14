# Resend Forward

An open source email forwarding server and UI built to work with [Resend.com's](https://resend.com) receiving API. This project allows you to receive emails via Resend and forward them to your preferred destinations.

> 💡 **Don't want to self-host?** Try the managed cloud offering at [resendforward.com](https://resendforward.com)

<img width="1708" height="948" alt="Screenshot 2025-11-14 at 1 59 27 AM" src="https://github.com/user-attachments/assets/b55cd107-6c77-4d9e-80da-7cee525a9d1a" />

## Tech Stack

- **Frontend**: React with TanStack Router
- **Backend**: [PocketBase](https://pocketbase.io/docs/) (Go-based backend)
- **Language**: Go

### Installation

1. Clone the repository

2. Install dependencies:

```bash
pnpm install
```

### Development

**Terminal 1** - Start PocketBase server:

```bash
make pb
```

**Terminal 2** - Start the development server:

```bash
make dev
```

## Deployment

### Build

Build the production executable:

```bash
make build
```

### Deploy to Server

1. Copy the executable to your server
2. Run the executable on your server

A **$4/month Digital Ocean droplet** should work just fine.

## Configuring Your Email Client

After setting up email forwarding, you can configure your email client to send emails through Resend:

- **Gmail**: Follow [these instructions](https://support.google.com/mail/answer/22370?hl=en&sjid=8542805608570237874-NA#null) to add Resend as a custom SMTP server for Gmail.

## Documentation

- [PocketBase Documentation](https://pocketbase.io/docs/)
- [Resend Documentation](https://resend.com/docs)

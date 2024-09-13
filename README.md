# Impact-Match

This README provides instructions for setting up and running the Impact-Match project.

## Prerequisites

- Bun (JavaScript runtime and toolkit)
- Node.js and npm (for running the server)

## Installation

### 1. Install Bun

To install Bun, run the following command:

```bash
curl -fsSL https://bun.sh/install | bash
```

After installation, update your shell configuration:

- For Bash users:
  ```bash
  source ~/.bashrc
  ```

Verify the installation:

```bash
bun --version
```

If you encounter any issues, check if the Bun binary is in your PATH:

```bash
ls ~/.bun/bin
```

If necessary, add Bun to your PATH by editing your `~/.bash_profile` (or equivalent) and adding:

```bash
export PATH="$HOME/.bun/bin:$PATH"
```

Then, reload your shell configuration:

```bash
source ~/.bashrc
```

### 2. Install Dependencies

Navigate to the backend directory and install the required Node modules:

```bash
cd backend && bun install
```

## Running the Server

To start the server, run:

```bash
node app.js
```

This will start the Express server for the Impact-Match application.

## Additional Information

For more details about the project structure, available scripts, and other information, please refer to the project documentation or contact the maintainers.

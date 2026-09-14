import argparse
import getpass

from werkzeug.security import generate_password_hash


def main():
    parser = argparse.ArgumentParser(description="Generate ADMIN_PASSWORD_HASH for .env")
    parser.add_argument("password", nargs="?", help="Admin password. Omit to enter securely.")
    args = parser.parse_args()

    password = args.password or getpass.getpass("Admin password: ")
    print(generate_password_hash(password))


if __name__ == "__main__":
    main()

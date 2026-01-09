from passlib.context import CryptContext
import secrets
import hashlib
import re

# Use a more compatible approach for password hashing
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__ident="2b",
    bcrypt__min_rounds=12
)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plaintext password against a hashed password."""
    # Check if the hash is a bcrypt hash (starts with $2b$, $2a$, $2y$)
    bcrypt_pattern = r'^\$2[abxy]\$'
    if re.match(bcrypt_pattern, hashed_password):
        try:
            # Truncate password to 72 bytes if needed to avoid bcrypt limitation
            truncated_password = plain_password[:72] if len(plain_password) > 72 else plain_password
            return pwd_context.verify(truncated_password, hashed_password)
        except Exception:
            return False
    else:
        # Assume it's a SHA256 hash (fallback for compatibility)
        return hashlib.sha256(plain_password.encode()).hexdigest() == hashed_password

def get_password_hash(password: str) -> str:
    """Generate a hash for a plaintext password."""
    try:
        # Truncate password to 72 bytes to avoid bcrypt limitation
        truncated_password = password[:72] if len(password) > 72 else password
        return pwd_context.hash(truncated_password)
    except Exception:
        # Fallback hashing in case of bcrypt issues
        return hashlib.sha256(password.encode()).hexdigest()

def generate_salt() -> str:
    """Generate a random salt."""
    return secrets.token_hex(32)
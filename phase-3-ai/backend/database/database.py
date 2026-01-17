from sqlmodel import create_engine, Session

# Create engine - this will be initialized later in main.py to avoid import issues
engine = None

def initialize_engine(settings):
    global engine
    engine = create_engine(settings.DATABASE_URL)

def get_session():
    if engine is None:
        raise RuntimeError("Engine not initialized. Call initialize_engine first.")
    with Session(engine) as session:
        yield session
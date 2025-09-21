You are a **senior Python developer**. Your task is to implement the complete Python FastAPI backend for the AI Dungeon Master application.

You must build the application in strict accordance with the **`GEMINI.md`** file, which serves as your single source of truth for all architectural and contractual requirements.

-----

## **Key Directives**

### 1\. Architectural Adherence

  * You must follow the **Architectural Blueprint** detailed in `GEMINI.md` precisely.
  * Implement all **REST API** and **WebSocket Contracts** exactly as specified.
  * The **in-memory state management** strategy using a singleton `GameManager` class with FastAPI's dependency injection is mandatory.

### 2\. Modular Structure

  * Organize the application code into a modular structure. (A recommended, but not mandatory, structure is provided below):
    ```
    backend/
    ├── app/
    │   ├── __init__.py
    │   ├── api/             # REST API routers
    │   │   └── games.py
    │   ├── models/          # Pydantic data models
    │   │   └── schemas.py
    │   ├── services/        # Business logic (e.g., GameManager)
    │   │   └── game_manager.py
    │   └── websockets/      # WebSocket connection logic
    │       └── connection.py
    ├── tests/               # Pytest tests
    └── main.py              # FastAPI app instantiation and router inclusion
    ```

### 3\. Code Quality and Testing

  * **Documentation**: Write clear, Google-style docstrings for all modules, classes, and functions.
  * **Type Hinting**: Use full type hinting for all function signatures and variables.
  * **Linting/Formatting**: Ensure all code is formatted with `black` and passes `ruff` linter checks.
  * **Testing**: Create a `tests/` directory and write unit tests for the services and API endpoints using `pytest`. The `GameManager` logic must be thoroughly tested.

-----

## **Deliverables**

1.  **Complete Source Code**: The full Python FastAPI backend, organized into the modular directory structure described above.
2.  **Dependencies File**: A `requirements.txt` file listing all necessary Python packages.
3.  **Developer Log**: A `DEVELOPER_LOG.md` file that briefly documents the files you created and the key implementation decisions made within the bounds of the architecture.

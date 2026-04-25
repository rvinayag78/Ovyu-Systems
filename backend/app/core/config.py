from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "ovyu"
    environment: str = "development"
    debug: bool = False

    aws_region: str = "us-west-2"

    cognito_user_pool_id: str = ""
    cognito_client_id: str = ""

    rds_host: str = "localhost"
    rds_port: int = 5432
    rds_database: str = "ovyu"
    rds_username: str = "ovyu"
    rds_password: str = ""

    ses_from_email: str = ""
    ses_from_name: str = "ovyu"

    sqs_queue_url: str = ""

    email_verification_secret: str = "dev-secret-change-in-production"

    frontend_url: str = "http://localhost:3000"
    backend_url: str = "http://localhost:8000"

    @property
    def database_url(self) -> str:
        return (
            f"postgresql+asyncpg://{self.rds_username}:{self.rds_password}"
            f"@{self.rds_host}:{self.rds_port}/{self.rds_database}"
        )

    @property
    def cognito_issuer(self) -> str:
        return f"https://cognito-idp.{self.aws_region}.amazonaws.com/{self.cognito_user_pool_id}"


settings = Settings()

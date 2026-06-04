import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

# Database settings from PycharmProjects/mrpfx-backend/.env
WP_DB_HOST = "localhost"
WP_DB_PORT = 3306
WP_DB_USER = "propfirmsol_samdav"
WP_DB_PASSWORD = "Encrypted103"
WP_DB_NAME = "propfirmsol_WP07W"

WP_DATABASE_URL = f"mysql+aiomysql://{WP_DB_USER}:{WP_DB_PASSWORD}@{WP_DB_HOST}:{WP_DB_PORT}/{WP_DB_NAME}?charset=utf8mb4"

async def fix():
    # Targeted fix for the reported error
    cmd = "ALTER TABLE `8jH_wc_orders` MODIFY `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT"

    engine = create_async_engine(WP_DATABASE_URL)
    async with engine.begin() as conn:
        try:
            print(f"Executing: {cmd}")
            await conn.execute(text(cmd))
            print("Successfully added AUTO_INCREMENT to 8jH_wc_orders.id")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(fix())

import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

# Database settings from PycharmProjects/mrpfx-backend/.env
WP_DB_HOST = "localhost"
WP_DB_PORT = 3306
WP_DB_USER = "propfirmsol_samdav"
WP_DB_PASSWORD = "Encrypted103"
WP_DB_NAME = "propfirmsol_WP07W"

WP_DATABASE_URL = f"mysql+aiomysql://{WP_DB_USER}:{WP_DB_PASSWORD}@{WP_DB_HOST}:{WP_DB_PORT}/{WP_DB_NAME}?charset=utf8mb4"

async def check():
    tables = [
        "8jH_wc_orders",
        "8jH_wc_order_addresses",
        "8jH_woocommerce_order_items",
        "8jH_woocommerce_order_itemmeta",
        "8jH_wc_order_stats",
        "8jH_wc_product_meta_lookup"
    ]
    engine = create_async_engine(WP_DATABASE_URL)
    async with engine.connect() as conn:
        for table in tables:
            try:
                res = await conn.execute(text(f"SHOW CREATE TABLE {table}"))
                row = res.fetchone()
                if row:
                    print(f"\n--- {table} ---")
                    print(row[1])
                else:
                    print(f"\n--- {table} (No row returned) ---")
            except Exception as e:
                print(f"\nError checking {table}: {e}")

if __name__ == "__main__":
    asyncio.run(check())

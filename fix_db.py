import asyncio
from sqlalchemy import text
from app.db.session import wp_engine

async def fix():
    # Tables to fix based on the models in app/model/wordpress/woocommerce.py
    # We add AUTO_INCREMENT to the primary keys
    commands = [
        "ALTER TABLE `8jH_wc_orders` MODIFY `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT",
        "ALTER TABLE `8jH_wc_orders_meta` MODIFY `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT",
        "ALTER TABLE `8jH_wc_order_addresses` MODIFY `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT",
        "ALTER TABLE `8jH_wc_order_operational_data` MODIFY `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT",
        "ALTER TABLE `8jH_woocommerce_order_items` MODIFY `order_item_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT",
        "ALTER TABLE `8jH_woocommerce_order_itemmeta` MODIFY `meta_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT",
        "ALTER TABLE `8jH_wc_order_stats` MODIFY `order_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT",
        "ALTER TABLE `8jH_wc_customer_lookup` MODIFY `customer_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT",
        "ALTER TABLE `8jH_wc_product_meta_lookup` MODIFY `product_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT",
        "ALTER TABLE `8jH_woocommerce_sessions` MODIFY `session_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT"
    ]

    async with wp_engine.begin() as conn:
        for cmd in commands:
            try:
                print(f"Executing: {cmd}")
                await conn.execute(text(cmd))
                print("Success")
            except Exception as e:
                print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(fix())
